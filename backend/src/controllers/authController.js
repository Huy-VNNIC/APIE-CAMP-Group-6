const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

module.exports = {
  // Login - Sửa để xác thực với password_hash từ database
  login: async (req, res) => {
    const { email, password } = req.body;
    
    try {
      if (!email || !password) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email và mật khẩu là bắt buộc' 
        });
      }
      
      // Lấy user từ database
      const users = await db.query(
        'SELECT id, name, email, password_hash, role, verified FROM users WHERE email = ?',
        [email]
      );
      
      if (users.length === 0) {
        return res.status(401).json({ 
          success: false, 
          message: 'Thông tin đăng nhập không chính xác' 
        });
      }
      
      const user = users[0];
      
      // Cho phép đăng nhập với password123 cho mục đích demo
      let isMatch = false;
      
      if (password === 'password123') {
        isMatch = true;
      } else if (user.password_hash.startsWith('hashed_')) {
        // Xử lý password_hash đặc biệt cho demo
        isMatch = user.password_hash === `hashed_password_${user.id}` && password === 'password123';
      } else {
        // Xác thực bcrypt thông thường
        try {
          isMatch = await bcrypt.compare(password, user.password_hash);
        } catch (e) {
          console.log("Bcrypt error:", e);
          isMatch = false;
        }
      }
      
      if (!isMatch) {
        return res.status(401).json({ 
          success: false, 
          message: 'Thông tin đăng nhập không chính xác' 
        });
      }
      
      // Tạo JWT token
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
      
      return res.json({
        success: true,
        message: 'Đăng nhập thành công',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          verified: user.verified === 1,
          login: 'Huy-VNNIC' // Giữ lại để tương thích với frontend
        }
      });
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({
        success: false,
        message: 'Đã xảy ra lỗi khi đăng nhập',
        error: err.message
      });
    }
  },
  
  // Lấy thông tin user
  getUser: async (req, res) => {
    try {
      const users = await db.query(
        'SELECT id, name, email, role, verified FROM users WHERE id = ?',
        [req.user.id]
      );
      
      if (users.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }
      
      const user = users[0];
      
      // Trả về thông tin user
      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        verified: user.verified === 1,
        login: 'Huy-VNNIC' // Giữ lại để tương thích với frontend
      });
    } catch (err) {
      console.error('Get user error:', err);
      return res.status(500).json({
        success: false,
        message: 'Đã xảy ra lỗi khi lấy thông tin người dùng',
        error: err.message
      });
    }
  }
  
  // Phần còn lại của controller...
};