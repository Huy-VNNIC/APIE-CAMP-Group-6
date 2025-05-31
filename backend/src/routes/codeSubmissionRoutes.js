const express = require('express');
const submissionController = require('../controllers/codeSubmissionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Yêu cầu đăng nhập và phải là student
router.use(authMiddleware.protect, authMiddleware.restrictTo('student'));

// Nộp bài code và tạo container để chạy
router.post('/submit', submissionController.submitCode);

// Lấy danh sách bài nộp của mình
router.get('/my-submissions', submissionController.getMySubmissions);

// Lấy chi tiết một bài nộp
router.get('/submissions/:submissionId', submissionController.getSubmissionDetail);

// Kéo dài thời gian sống của container
router.post('/submissions/:submissionId/extend', submissionController.extendContainerLifetime);

// Chạy lại code của một bài nộp
router.post('/submissions/:submissionId/rerun', submissionController.rerunCode);

// Trực tiếp chạy code (không cần tạo submission)
router.post('/run', submissionController.runCode);

module.exports = router;