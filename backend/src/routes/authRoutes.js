const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Import auth middleware
const { protect } = require('../middleware/authMiddleware');

// Mock database cho user
const users = [
  {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123', // Trong thực tế cần hash password
    fullName: 'Test User',
    role: 'student'
  },
  {
    id: '2',
    username: 'instructor',
    email: 'instructor@example.com',
    password: 'password123', // Trong thực tế cần hash password
    fullName: 'Instructor User',
    role: 'instructor'
  }
];

// @desc    Đăng ký người dùng
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    console.log('Register request received:', req.body);
    
    const { username, email, password, fullName, role } = req.body;
    
    // Kiểm tra user đã tồn tại chưa
    const userExists = users.find(u => u.username === username || u.email === email);
    
    if (userExists) {
      console.log('User already exists:', username);
      return res.status(400).json({
        success: false,
        message: 'User đã tồn tại'
      });
    }
    
    // Tạo user mới
    const newUser = {
      id: String(users.length + 1),
      username,
      email,
      password, // Trong thực tế cần hash password
      fullName,
      role: role || 'student'
    };
    
    // Thêm vào danh sách users
    users.push(newUser);
    
    console.log('New user created:', newUser.username);
    
    // Tạo token
    const token = jwt.sign(
      { id: newUser.id },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );
    
    // Trả về thông tin user và token
    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Đăng nhập
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    
    const { username, password } = req.body;
    
    if (!username || !password) {
      console.log('Missing username or password');
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp username và password'
      });
    }
    
    // Kiểm tra username
    const user = users.find(u => u.username === username);
    
    if (!user) {
      console.log('User not found:', username);
      return res.status(401).json({
        success: false,
        message: 'Username hoặc password không đúng'
      });
    }
    
    // Kiểm tra password
    if (user.password !== password) {
      console.log('Invalid password for user:', username);
      return res.status(401).json({
        success: false,
        message: 'Username hoặc password không đúng'
      });
    }
    
    console.log('User authenticated successfully:', username);
    
    // Tạo token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );
    
    console.log('Token generated for user:', username);
    
    // Trả về token và thông tin user
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Lấy thông tin user hiện tại
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', protect, (req, res) => {
  console.log('Profile request received, user:', req.user);
  res.json({
    success: true,
    user: req.user
  });
});

module.exports = router;
