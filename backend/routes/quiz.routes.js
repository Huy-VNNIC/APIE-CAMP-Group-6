const express = require('express');
const router = express.Router();

// Mock quiz endpoints
router.get('/', (req, res) => {
  res.json({ message: 'Get all quizzes' });
});

router.get('/:id', (req, res) => {
  res.json({ message: 'Get quiz by ID' });
});

module.exports = router;
