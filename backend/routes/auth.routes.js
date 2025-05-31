const express = require('express');
const router = express.Router();

// Mock auth endpoints
router.post('/register', (req, res) => {
  res.json({ message: 'Register new user' });
});

router.post('/login', (req, res) => {
  res.json({ message: 'User login' });
});

module.exports = router;
