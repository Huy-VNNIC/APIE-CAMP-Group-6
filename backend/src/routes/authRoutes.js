const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Đăng ký
router.post('/register', authController.register);

// Đăng nhập
router.post('/login', authController.login);

// Lấy thông tin user (yêu cầu xác thực)
router.get('/user', auth, authController.getUser);

// Thêm route /me để tương thích với frontend
router.get('/me', auth, authController.getUser);

// Thêm route để kiểm tra token
router.get('/verify-token', auth, (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    user: {
      id: req.user.id
    }
  });
});

// Đăng xuất (xóa token ở phía client)
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router;