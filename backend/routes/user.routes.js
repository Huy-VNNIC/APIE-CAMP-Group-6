const express = require('express');
const router = express.Router();

// Mock user endpoints
router.get('/', (req, res) => {
  res.json({ message: 'Get all users endpoint' });
});

router.get('/:id', (req, res) => {
  res.json({ message: 'Get user by ID endpoint' });
});

module.exports = router;
