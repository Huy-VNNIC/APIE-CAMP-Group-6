const Quiz = require('../models/quiz.model');
const Course = require('../models/course.model');
const QuizAttempt = require('../models/quizAttempt.model');
const { validationResult } = require('express-validator');
const OpenAI = require('openai');

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Get all quizzes by course or all if instructor
exports.getQuizzes = async (req, res) => {
  try {
    const { courseId } = req.query;
    const query = {};
    
    // If a courseId is provided, filter by course
    if (courseId) {
      query.course = courseId;
    }
    
    // If user is student, only show published quizzes
    if (req.user.role === 'student') {
      query.isPublished = true;
    }
    
    const quizzes = await Quiz.find(query)
      .populate('course', 'title')
      .populate('createdBy', 'fullName')
      .sort({ createdAt: -1 });
    
    res.json(quizzes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a quiz by ID
exports.getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id)
      .populate('course', 'title')
      .populate('createdBy', 'fullName');
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // If student is accessing and quiz is not published
    if (req.user.role === 'student' && !quiz.isPublished) {
      return res.status(403).json({ message: 'This quiz is not available yet' });
    }
    
    // If student is accessing, don't send correct answers
    if (req.user.role === 'student') {
      // Create a copy without correct answers
      const safeQuiz = quiz.toObject();
      
      safeQuiz.questions = safeQuiz.questions.map(q => {
        return {
          ...q,
          options: q.options.map(o => ({
            _id: o._id,
            text: o.text
            // Remove isCorrect field
          }))
        };
      });
      
      return res.json(safeQuiz);
    }
    
    // For instructors, send the full quiz
    res.json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new quiz
exports.createQuiz = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { 
      title, 
      course: courseId, 
      description, 
      timeLimit, 
      passingScore,
      questions,
      isPublished 
    } = req.body;
    
    // Verify the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Create the new quiz
    const newQuiz = new Quiz({
      title,
      course: courseId,
      courseName: course.title,
      description,
      timeLimit,
      passingScore,
      questions: questions || [],
      createdBy: req.user.id,
      isPublished: isPublished || false
    });
    
    const quiz = await newQuiz.save();
    res.status(201).json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a quiz
exports.updateQuiz = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { id } = req.params;
    const { 
      title, 
      description, 
      timeLimit, 
      passingScore,
      questions,
      isPublished 
    } = req.body;
    
    // Find the quiz
    let quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // Check if user is authorized (creator or admin)
    if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this quiz' });
    }
    
    // Update fields
    quiz.title = title || quiz.title;
    quiz.description = description || quiz.description;
    quiz.timeLimit = timeLimit || quiz.timeLimit;
    quiz.passingScore = passingScore || quiz.passingScore;
    if (questions) quiz.questions = questions;
    if (isPublished !== undefined) quiz.isPublished = isPublished;
    
    const updatedQuiz = await quiz.save();
    res.json(updatedQuiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a quiz
exports.deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the quiz
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // Check if user is authorized (creator or admin)
    if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this quiz' });
    }
    
    await quiz.deleteOne();
    
    // Delete all attempts for this quiz
    await QuizAttempt.deleteMany({ quiz: id });
    
    res.json({ message: 'Quiz deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Generate quiz questions with OpenAI
exports.generateQuestions = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { courseId, numQuestions, difficulty } = req.body;
    
    // Verify the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Create a prompt for OpenAI based on course content
    const prompt = `Generate ${numQuestions} multiple-choice questions for a quiz on ${course.title} at ${difficulty} level. 
    For each question, provide 4 options with exactly one correct answer.
    
    Course description: ${course.description}
    
    Key topics covered in this course:
    ${course.lessons.map(lesson => `- ${lesson.title}`).join('\n')}
    
    Format your response as JSON with the following structure:
    [
      {
        "question": "Question text here",
        "options": [
          {"text": "Option 1 text", "isCorrect": false},
          {"text": "Option 2 text", "isCorrect": true},
          {"text": "Option 3 text", "isCorrect": false},
          {"text": "Option 4 text", "isCorrect": false}
        ],
        "difficulty": "${difficulty}",
        "explanation": "Brief explanation of the correct answer (optional)"
      }
    ]
    `;
    
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system", 
          content: "You are an expert quiz creator for programming and technology courses. Create challenging, accurate questions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2500,
      response_format: { type: "json_object" }
    });
    
    // Parse the response
    let generatedQuestions;
    try {
      const content = response.choices[0].message.content;
      const jsonContent = JSON.parse(content);
      generatedQuestions = jsonContent.questions || [];
      
      // Ensure we have questions
      if (!Array.isArray(generatedQuestions) || generatedQuestions.length === 0) {
        throw new Error('Invalid or empty questions array returned from AI');
      }
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      return res.status(500).json({ 
        message: 'Error generating questions', 
        error: parseError.message 
      });
    }
    
    res.json({
      questions: generatedQuestions,
      message: `Successfully generated ${generatedQuestions.length} questions`
    });
  } catch (err) {
    console.error('OpenAI API error:', err);
    res.status(500).json({ message: 'Error generating questions with AI' });
  }
};

// Submit a quiz attempt (for students)
exports.submitQuizAttempt = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { quizId } = req.params;
    const { answers, timeSpent } = req.body;
    
    // Find the quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // Verify quiz is published
    if (!quiz.isPublished) {
      return res.status(403).json({ message: 'This quiz is not available for submission' });
    }
    
    // Calculate the score
    let correctAnswers = 0;
    
    const processedAnswers = answers.map(answer => {
      // Find the question
      const question = quiz.questions.find(
        q => q._id.toString() === answer.questionId
      );
      
      if (!question) {
        return { ...answer, isCorrect: false };
      }
      
      // Find if the selected option is correct
      const option = question.options.find(
        o => o._id.toString() === answer.selectedOption
      );
      
      const isCorrect = option && option.isCorrect;
      if (isCorrect) {
        correctAnswers++;
      }
      
      return { ...answer, isCorrect };
    });
    
    // Calculate score as percentage
    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;
    
    // Create a new attempt
    const newAttempt = new QuizAttempt({
      quiz: quizId,
      quizTitle: quiz.title,
      student: req.user.id,
      course: quiz.course,
      startTime: new Date(Date.now() - (timeSpent * 1000)), // Calculate start time
      endTime: new Date(),
      timeSpent, // in seconds
      answers: processedAnswers,
      totalQuestions: quiz.questions.length,
      correctAnswers,
      score,
      passed,
      status: 'completed'
    });
    
    const attempt = await newAttempt.save();
    
    // Update quiz stats
    quiz.timesCompleted = (quiz.timesCompleted || 0) + 1;
    
    // Recalculate average score
    if (quiz.averageScore === 0) {
      quiz.averageScore = score;
    } else {
      // Weighted average
      quiz.averageScore = Math.round(
        (quiz.averageScore * (quiz.timesCompleted - 1) + score) / quiz.timesCompleted
      );
    }
    
    await quiz.save();
    
    res.json({
      attemptId: attempt._id,
      totalQuestions: attempt.totalQuestions,
      correctAnswers: attempt.correctAnswers,
      score: attempt.score,
      passed: attempt.passed,
      timeSpent: attempt.timeSpent
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
