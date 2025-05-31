const jwt = require('jsonwebtoken');

// This is a simplified auth middleware for our demo
const auth = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('x-auth-token');
    
    // Check if no token
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    // For the demo, we'll accept any token and set a mock user
    // In a real app, you would verify the token with jwt.verify()
    req.user = {
      id: 'user-123',
      role: req.header('x-user-role') || 'student' // Allow role override for testing
    };
    
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;
