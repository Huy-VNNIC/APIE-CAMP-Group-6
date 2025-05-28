const express = require('express');
const router = express.Router();

// Get dashboard
router.get('/dashboard', (req, res) => {
  res.json({
    success: true,
    data: {
      student: {
        id: 1,
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com'
      },
      dashboardData: {
        progress: 75,
        current_course: "Advanced Java",
        completed_courses: ["Intro to Python", "Algorithms"],
        points: 1250,
        level: 5,
        completed_resources: 12,
        badges: ["Fast Learner", "Code Ninja", "Algorithm Master"]
      }
    }
  });
});

// Get profile
router.get('/profile', (req, res) => {
  res.json({
    success: true,
    data: {
      user_id: 1,
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      verified: true,
      dashboard_data: {
        progress: 75,
        current_course: "Advanced Java",
        completed_courses: ["Intro to Python", "Algorithms"],
        points: 1250,
        level: 5,
        completed_resources: 12,
        badges: ["Fast Learner", "Code Ninja", "Algorithm Master"],
        preferences: {
          theme: 'dark',
          editor_font_size: 14,
          editor_tab_size: 2
        }
      }
    }
  });
});

module.exports = router;