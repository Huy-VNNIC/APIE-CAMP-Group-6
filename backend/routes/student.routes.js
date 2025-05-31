const express = require('express');
const router = express.Router();

// Mock student endpoints
router.get('/', (req, res) => {
  res.json({ message: 'Get all students' });
});

router.get('/:id', (req, res) => {
  res.json({ message: 'Get student by ID' });
});

module.exports = router;
