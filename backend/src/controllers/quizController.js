const Quiz = require('../models/quizModel');
const Enrollment = require('../models/enrollmentModel');

exports.getCourseQuizzes = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;
    
    // Kiểm tra student đã đăng ký khóa học này chưa
    const isEnrolled = await Enrollment.isEnrolled(studentId, courseId);
    if (!isEnrolled) {
      return res.status(403).json({ message: 'Bạn chưa đăng ký khóa học này' });
    }
    
    // Lấy tất cả quiz của khóa học
    const quizzes = await Quiz.getQuizzesByCourse(courseId);
    
    res.status(200).json({
      quizzes
    });
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.startQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const studentId = req.user.id;
    
    // Lấy thông tin quiz
    const quiz = await Quiz.getQuizById(quizId, true);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Không tìm thấy bài kiểm tra' });
    }
    
    // Kiểm tra student đã đăng ký khóa học chứa quiz này chưa
    const isEnrolled = await Enrollment.isEnrolled(studentId, quiz.course_id);
    if (!isEnrolled) {
      return res.status(403).json({ message: 'Bạn chưa đăng ký khóa học chứa bài kiểm tra này' });
    }
    
    // Bắt đầu lần thử quiz
    const attempt = await Quiz.startQuizAttempt(studentId, quizId);
    
    // Loại bỏ đáp án đúng trước khi gửi về client
    if (quiz.questions) {
      for (const question of quiz.questions) {
        if (question.question_type === 'multiple_choice' && question.options) {
          question.options = question.options.map(option => ({
            option_id: option.option_id,
            option_text: option.option_text
          }));
        }
      }
    }
    
    res.status(200).json({
      message: 'Bắt đầu làm bài kiểm tra',
      quiz,
      attempt
    });
  } catch (error) {
    console.error('Start quiz error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body;
    const studentId = req.user.id;
    
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Cần cung cấp câu trả lời' });
    }
    
    // Lấy thông tin quiz và câu hỏi
    const quiz = await Quiz.getQuizById(quizId, true);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Không tìm thấy bài kiểm tra' });
    }
    
    // Chấm điểm
    let totalPoints = 0;
    let earnedPoints = 0;
    
    for (const question of quiz.questions) {
      totalPoints += question.points || 1;
      
      // Tìm câu trả lời của học sinh
      const answer = answers.find(a => a.questionId == question.question_id);
      
      if (!answer) continue;
      
      // Chấm điểm dựa vào loại câu hỏi
      if (question.question_type === 'multiple_choice' && question.options) {
        const correctOption = question.options.find(o => o.is_correct);
        if (correctOption && answer.optionId == correctOption.option_id) {
          earnedPoints += question.points || 1;
        }
      } else if (question.question_type === 'true_false') {
        if (answer.answer.toString().toLowerCase() === question.correct_answer.toString().toLowerCase()) {
          earnedPoints += question.points || 1;
        }
      }
      // Loại câu hỏi coding sẽ được chấm điểm riêng
    }
    
    // Tính điểm theo thang 100
    const score = Math.round((earnedPoints / totalPoints) * 100);
    
    // Lưu kết quả
    const attempt = await Quiz.completeQuizAttempt(studentId, quizId, score);
    
    res.status(200).json({
      message: 'Nộp bài kiểm tra thành công',
      score,
      totalPoints,
      earnedPoints,
      attempt
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.getMyQuizAttempts = async (req, res) => {
  try {
    const studentId = req.user.id;
    const attempts = await Quiz.getQuizAttemptsByStudent(studentId);
    
    res.status(200).json({
      attempts
    });
  } catch (error) {
    console.error('Get attempts error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
