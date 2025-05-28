const express = require('express');
const router = express.Router();

// Instructor dashboard
router.get('/dashboard', (req, res) => {
  res.json({
    success: true,
    data: {
      instructor: {
        id: 2,
        name: 'Bob Smith',
        email: 'bob.smith@example.com'
      },
      stats: {
        total_courses: 3,
        total_students: 125,
        average_rating: 4.8
      }
    }
  });
});

// Get courses
router.get('/courses', (req, res) => {
  res.json({
    success: true,
    data: {
      courses: [
        {
          id: 1,
          title: "JavaScript Fundamentals",
          student_count: 45,
          average_rating: 4.7
        },
        {
          id: 2,
          title: "Advanced React",
          student_count: 38,
          average_rating: 4.9
        },
        {
          id: 3,
          title: "Node.js Backend Development",
          student_count: 42,
          average_rating: 4.6
        }
      ]
    }
  });
});

module.exports = router;