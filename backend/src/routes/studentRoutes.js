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

module.exports = router;