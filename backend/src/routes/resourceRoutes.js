const express = require('express');
const router = express.Router();

// Get all resources
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      resources: [
        {
          id: 1,
          title: "Introduction to JavaScript",
          type: "video",
          language: "javascript",
          description: "Learn the basics of JavaScript programming language",
          thumbnail: "https://example.com/thumbs/js-intro.jpg"
        },
        {
          id: 2,
          title: "React Fundamentals",
          type: "slide",
          language: "javascript",
          description: "Master the fundamentals of React library",
          thumbnail: "https://example.com/thumbs/react-basics.jpg"
        },
        {
          id: 3,
          title: "Python Algorithms",
          type: "code",
          language: "python",
          description: "Learn algorithms implementation in Python",
          thumbnail: "https://example.com/thumbs/py-algo.jpg"
        }
      ]
    }
  });
});

// Get resource by ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  if (id === 1) {
    return res.json({
      success: true,
      data: {
        resource: {
          id: 1,
          title: "Introduction to JavaScript",
          type: "video",
          language: "javascript",
          description: "Learn the basics of JavaScript programming language",
          content: "https://example.com/videos/js-intro.mp4",
          thumbnail: "https://example.com/thumbs/js-intro.jpg",
          created_at: "2025-04-15T10:30:00Z"
        }
      }
    });
  }
  
  res.status(404).json({
    success: false,
    message: 'Resource not found'
  });
});

module.exports = router;