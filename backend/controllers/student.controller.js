const User = require('../models/user.model');
const StudentProgress = require('../models/studentProgress.model');
const QuizAttempt = require('../models/quizAttempt.model');
const { validationResult } = require('express-validator');

// Get all students (for instructors)
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('-password')
      .lean();
    
    // For each student, get summary of their progress
    const studentsWithProgress = await Promise.all(students.map(async (student) => {
      // Get all progresses for this student
      const progresses = await StudentProgress.find({ student: student._id });
      
      // Calculate overall progress
      let overallProgress = 0;
      if (progresses.length > 0) {
        const totalProgress = progresses.reduce((acc, curr) => acc + curr.progress, 0);
        overallProgress = Math.round(totalProgress / progresses.length);
      }
      
      // Count completed courses
      const completedCourses = progresses.filter(p => p.completed).length;
      
      // Get last active date
      const lastActive = student.lastActive || new Date();
      
      return {
        ...student,
        enrolledCourses: progresses.length,
        completedCourses,
        overallProgress,
        lastActive
      };
    }));
    
    res.json(studentsWithProgress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get student details with full progress
exports.getStudentDetails = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Get student info
    const student = await User.findById(studentId)
      .select('-password')
      .lean();
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Get course progress
    const courseProgress = await StudentProgress.find({ student: studentId })
      .populate('course', 'title')
      .lean();
    
    // Get quiz attempts
    const quizAttempts = await QuizAttempt.find({ student: studentId })
      .populate('quiz', 'title')
      .populate('course', 'title')
      .lean();
    
    // Format the student data for frontend display
    const formattedStudent = {
      ...student,
      courses: courseProgress.map(progress => ({
        id: progress.course._id,
        title: progress.course.title || progress.courseName,
        progress: progress.progress,
        enrollDate: progress.enrollDate,
        lastAccessed: progress.lastAccessed,
        completed: progress.completed,
        completionDate: progress.completionDate
      })),
      quizzes: quizAttempts.map(attempt => ({
        id: attempt.quiz._id,
        title: attempt.quiz.title || attempt.quizTitle,
        course: attempt.course.title,
        completedDate: attempt.endTime,
        score: attempt.score,
        timeSpent: `${Math.floor(attempt.timeSpent / 60)} minutes`,
        totalQuestions: attempt.totalQuestions,
        correctAnswers: attempt.correctAnswers,
        status: attempt.status
      })),
      // Add assignments and notes in a real system
      assignments: [],
      notes: []
    };
    
    // Calculate overall progress
    const overallProgress = courseProgress.length > 0
      ? Math.round(courseProgress.reduce((acc, curr) => acc + curr.progress, 0) / courseProgress.length)
      : 0;
    
    formattedStudent.overallProgress = overallProgress;
    
    res.json(formattedStudent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get course progress for a specific student
exports.getStudentCourseProgress = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;
    
    const progress = await StudentProgress.findOne({
      student: studentId,
      course: courseId
    }).populate('course', 'title lessons');
    
    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }
    
    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Generate student progress report
exports.generateProgressReport = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate, courseId } = req.query;
    
    const student = await User.findById(studentId).select('-password');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Set up query for progress
    const query = { student: studentId };
    
    // Add course filter if provided
    if (courseId) {
      query.course = courseId;
    }
    
    // Get progress data
    const progress = await StudentProgress.find(query).populate('course', 'title');
    
    // Get quiz attempts
    const quizQuery = { student: studentId };
    if (courseId) {
      quizQuery.course = courseId;
    }
    
    // Add date filters if provided
    if (startDate || endDate) {
      quizQuery.createdAt = {};
      if (startDate) {
        quizQuery.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        quizQuery.createdAt.$lte = new Date(endDate);
      }
    }
    
    const quizAttempts = await QuizAttempt.find(quizQuery)
      .populate('quiz', 'title')
      .populate('course', 'title');
    
    // Generate report data
    const report = {
      student: {
        id: student._id,
        name: student.fullName,
        email: student.email,
        username: student.username
      },
      enrolledCourses: progress.length,
      completedCourses: progress.filter(p => p.completed).length,
      averageProgress: progress.length > 0
        ? Math.round(progress.reduce((acc, curr) => acc + curr.progress, 0) / progress.length)
        : 0,
      courseDetails: progress.map(p => ({
        courseId: p.course._id,
        title: p.course.title || p.courseName,
        progress: p.progress,
        completed: p.completed,
        enrollDate: p.enrollDate,
        lastAccessed: p.lastAccessed,
        completedLessons: p.completedLessons,
        totalLessons: p.totalLessons
      })),
      quizPerformance: {
        totalAttempts: quizAttempts.length,
        averageScore: quizAttempts.length > 0
          ? Math.round(quizAttempts.reduce((acc, curr) => acc + curr.score, 0) / quizAttempts.length)
          : 0,
        detailedScores: quizAttempts.map(q => ({
          quizId: q.quiz._id,
          title: q.quiz.title || q.quizTitle,
          course: q.course.title,
          score: q.score,
          date: q.endTime,
          passed: q.passed
        }))
      },
      generatedAt: new Date()
    };
    
    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
