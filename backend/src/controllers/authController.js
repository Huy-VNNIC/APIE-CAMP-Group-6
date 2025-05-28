const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const authController = {
  // Đăng ký user mới
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      
      // Kiểm tra nếu email đã tồn tại
      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ msg: 'User already exists' });
      }
      
      // Tạo user mới với role là student
      const user = await userModel.create({ name, email, password, role: 'student' });
      
      // Tạo JWT token
      const payload = {
        id: user.id,
        role: 'student'
      };
      
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
      
      res.status(201).json({
        token,
        user: {
          id: user.id,
          name,
          email,
          role: 'student'
        }
      });
    } catch (err) {
      console.error('Register error:', err);
      res.status(500).json({ msg: 'Server error' });
    }
  },
  
  // Đăng nhập
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Xác thực user
      const user = await userModel.authenticate(email, password);
      
      if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
      
      // Tạo JWT token
      const payload = {
        id: user.id,
        role: user.role
      };
      
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
      
      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ msg: 'Server error' });
    }
  },
  
  // Lấy thông tin user
  async getUser(req, res) {
    try {
      const user = await userModel.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
      
      res.json(user);
    } catch (err) {
      console.error('Get user error:', err);
      res.status(500).json({ msg: 'Server error' });
    }
  }
};

module.exports = authController;