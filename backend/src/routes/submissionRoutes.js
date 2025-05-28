const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

// Tất cả routes đều yêu cầu xác thực và role student
router.use(auth);
router.use(checkRole(['student']));

// Tạo submission mới
router.post('/', submissionController.createSubmission);

// Lấy lịch sử submissions
router.get('/', submissionController.getSubmissions);

// Lấy chi tiết một submission
router.get('/:id', submissionController.getSubmissionById);

module.exports = router;