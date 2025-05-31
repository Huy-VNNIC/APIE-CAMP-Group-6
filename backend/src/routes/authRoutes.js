const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Đăng ký
router.post('/register', authController.register);

// Đăng nhập
router.post('/login', authController.login);

// Lấy thông tin cá nhân (cần xác thực)
router.get('/profile', authMiddleware.protect, authController.getProfile);

// Danh sách người dùng (chỉ admin và developer)
router.get('/users', 
  authMiddleware.protect, 
  authMiddleware.restrictTo('developer'), 
  authController.getAllUsers
);

module.exports = router;

