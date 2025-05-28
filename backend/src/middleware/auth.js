const jwt = require('jsonwebtoken');
const { pool } = require('../config/database-mysql');

// Lấy JWT secret từ env hoặc sử dụng mặc định
const JWT_SECRET = process.env.JWT_SECRET || 'your-secure-jwt-secret-key';

/**
 * Xác thực token JWT
 */
const authenticateToken = async (req, res, next) => {
  try {
    // Lấy token từ header hoặc cookie
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    // Xác thực token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Kiểm tra người dùng có tồn tại không
    const [users] = await pool.execute(
      'SELECT id, name, email, role, verified FROM users WHERE id = ?',
      [decoded.id]
    );
    
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Thêm thông tin user vào request
    req.user = {
      ...decoded,
      verified: users[0].verified === 1
    };
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    
    return res.status(403).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

/**
 * Phân quyền người dùng
 */
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this resource'
      });
    }
    
    next();
  };
};

/**
 * Kiểm tra xác thực email
 */
const requireVerified = (req, res, next) => {
  if (!req.user.verified) {
    return res.status(403).json({
      success: false, 
      message: 'Email verification required'
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  authorize,
  requireVerified
};