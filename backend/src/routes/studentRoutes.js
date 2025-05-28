const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

// Tất cả routes đều yêu cầu xác thực và role student
router.use(auth);
router.use(checkRole(['student']));

// Lấy dashboard data
router.get('/dashboard', studentController.getDashboard);

// Cập nhật profile
router.put('/profile', studentController.updateProfile);

// Thêm route lấy profile
router.get('/profile', studentController.getProfile);

// Cập nhật preferences
router.put('/preferences', studentController.updatePreferences);

// Lấy tiến độ tổng quan
router.get('/progress', studentController.getProgress);

// Cập nhật tiến độ cho resource
router.post('/progress/resource', studentController.updateResourceProgress);

// Lấy hoạt động gần đây
router.get('/activities', studentController.getRecentActivities);

// Lấy bài tập sắp đến hạn
router.get('/assignments/upcoming', studentController.getUpcomingAssignments);

module.exports = router;