const jwt = require('jsonwebtoken');

// Thay thế bằng secret key thực tế của bạn
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';  

module.exports = (req, res, next) => {
  // Lấy token từ header
  const token = req.header('x-auth-token');
  
  // Kiểm tra token
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token, authorization denied' });
  }
  
  try {
    // Xác thực token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};