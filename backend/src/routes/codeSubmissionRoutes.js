const express = require('express');
const submissionController = require('../controllers/codeSubmissionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Yêu cầu đăng nhập và phải là student
router.use(authMiddleware.protect, authMiddleware.restrictTo('student'));

// Nộp bài code
router.post('/submit', submissionController.submitCode);

// Lấy danh sách bài nộp của mình
router.get('/my-submissions', submissionController.getMySubmissions);

// Lấy chi tiết một bài nộp
router.get('/submissions/:submissionId', submissionController.getSubmissionDetail);

module.exports = router;
