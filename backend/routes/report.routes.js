const express = require('express');
const router = express.Router();

// Mock report endpoints
router.get('/courses', (req, res) => {
  res.json({ message: 'Get course reports' });
});

router.get('/students', (req, res) => {
  res.json({ message: 'Get student reports' });
});

module.exports = router;
