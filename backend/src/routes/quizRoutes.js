const express = require('express');
const quizController = require('../controllers/quizController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Yêu cầu đăng nhập và phải là student
router.use(authMiddleware.protect, authMiddleware.restrictTo('student'));

// Lấy danh sách quiz của một khóa học
router.get('/courses/:courseId/quizzes', quizController.getCourseQuizzes);

// Bắt đầu làm quiz
router.get('/quizzes/:quizId/start', quizController.startQuiz);

// Nộp bài quiz
router.post('/quizzes/:quizId/submit', quizController.submitQuiz);

// Lấy danh sách các lần làm quiz
router.get('/my-attempts', quizController.getMyQuizAttempts);

module.exports = router;
