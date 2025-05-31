const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Kiểm tra header có authorization không
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Lấy token từ header
      token = req.headers.authorization.split(' ')[1];
      
      // Log token để debug
      console.log("Received token:", token);
    }
    
    // Nếu không có token
    if (!token) {
      // Cho phép truy cập /api/test/run-code mà không cần token
      if (req.path.includes('/api/test/run-code') || req.path === '/api/code/run') {
        console.log("Allowing access without token");
        return next();
      }
      
      return res.status(401).json({
        success: false,
        message: 'Token không tồn tại, vui lòng đăng nhập'
      });
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
      
      // Nếu không sử dụng MongoDB, comment dòng dưới và thiết lập req.user theo cách khác
      // req.user = await User.findById(decoded.id);
      
      // Thiết lập giá trị mặc định cho req.user để tránh lỗi
      req.user = {
        id: decoded.id || 'default_id',
        username: 'default_user',
        role: 'student'
      };
      
      next();
    } catch (error) {
      console.error("Auth middleware error:", error);
      
      // Cho phép truy cập /api/test/run-code mà không cần token
      if (req.path.includes('/api/test/run-code') || req.path === '/api/code/run') {
        console.log("Allowing access despite token error");
        return next();
      }
      
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ'
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// Thêm hàm restrictTo để hạn chế quyền truy cập dựa trên vai trò
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // Nếu vai trò của user không nằm trong danh sách roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền thực hiện hành động này'
      });
    }
    
    next();
  };
};
