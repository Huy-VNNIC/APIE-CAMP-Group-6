const express = require('express');
const router = express.Router();

// Mock course endpoints
router.get('/', (req, res) => {
  res.json({ message: 'Get all courses' });
});

router.get('/:id', (req, res) => {
  res.json({ message: 'Get course by ID' });
});

module.exports = router;
