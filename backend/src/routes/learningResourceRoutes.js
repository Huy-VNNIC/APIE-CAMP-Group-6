const express = require('express');
const resourceController = require('../controllers/learningResourceController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Yêu cầu đăng nhập và phải là student
router.use(authMiddleware.protect, authMiddleware.restrictTo('student'));

// Lấy danh sách tài liệu học tập của một khóa học
router.get('/courses/:courseId/resources', resourceController.getCourseResources);

// Lấy chi tiết một tài liệu học tập
router.get('/resources/:resourceId', resourceController.getResourceDetail);

module.exports = router;
