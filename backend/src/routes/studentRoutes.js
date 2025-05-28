const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const resourceController = require('../controllers/resourceController');
const submissionController = require('../controllers/submissionController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

// Áp dụng middleware xác thực và kiểm tra vai trò cho tất cả route
router.use(auth);
router.use(checkRole(['student']));

// Dashboard
router.get('/dashboard', studentController.getDashboard);

// Quản lý profile
router.get('/profile', studentController.getProfile);
router.put('/profile', studentController.updateProfile);
router.put('/preferences', studentController.updatePreferences);

// Tài nguyên học tập
router.get('/resources', resourceController.getResources);
router.get('/resources/:id', resourceController.getResourceDetail);
router.post('/resources/progress', studentController.updateResourceProgress);

// Submissions - Làm bài tập và bài kiểm tra
router.post('/submissions', submissionController.createSubmission);
router.get('/submissions/history/:resourceId', submissionController.getSubmissionHistory);
router.get('/submissions/:id', submissionController.getSubmissionDetail);

// Tiến độ học tập
router.get('/progress', studentController.getProgress);
router.get('/activities', studentController.getRecentActivities);
router.get('/completed-resources', studentController.getCompletedResources);

module.exports = router;