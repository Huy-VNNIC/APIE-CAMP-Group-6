const express = require('express');
const router = express.Router();

// Login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simple validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }
  
  // Để đơn giản, chúng ta sẽ giả định người dùng "alice.johnson@example.com" là hợp lệ
  if (email === 'alice.johnson@example.com' && password === 'password123') {
    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: 1,
          name: 'Alice Johnson',
          email: 'alice.johnson@example.com',
          role: 'student',
          verified: true
        },
        token: 'mock-token-123456'
      }
    });
  }
  
  return res.status(401).json({
    success: false,
    message: 'Invalid credentials'
  });
});

// Register route
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  
  // Simple validation
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Name, email and password are required'
    });
  }
  
  res.status(201).json({
    success: true,
    message: 'Registration successful (mock)',
    data: {
      user: {
        id: 999,
        name,
        email,
        role: 'student',
        verified: false
      },
      token: 'mock-registration-token'
    }
  });
});

// Get current user
router.get('/me', (req, res) => {
  // Normally we would extract user from token
  // For now, just return a mock user
  res.json({
    success: true,
    data: {
      user: {
        id: 1,
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com',
        role: 'student',
        verified: true
      }
    }
  });
});

module.exports = router;