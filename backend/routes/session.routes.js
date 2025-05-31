const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Mock session history (in a real app, this would come from a database)
const sessionHistory = [
  {
    id: "1",
    title: "JavaScript Event Loop Deep Dive",
    instructorId: "instructor-123",
    instructorName: "John Smith",
    courseId: "1",
    courseName: "JavaScript Fundamentals",
    startTime: "2023-05-15T14:00:00Z",
    endTime: "2023-05-15T15:30:00Z",
    participantCount: 24,
    duration: 90, // minutes
    recordingUrl: "https://example.com/recordings/js-event-loop"
  },
  {
    id: "2",
    title: "Building React Hooks from Scratch",
    instructorId: "instructor-123",
    instructorName: "John Smith",
    courseId: "3",
    courseName: "Advanced React",
    startTime: "2023-05-18T13:00:00Z",
    endTime: "2023-05-18T14:15:00Z",
    participantCount: 18,
    duration: 75,
    recordingUrl: "https://example.com/recordings/react-hooks"
  }
];

// Get all past sessions (history)
router.get('/history', auth, (req, res) => {
  // In a real app, filter by user's courses, etc.
  res.json({ sessions: sessionHistory });
});

// Get a specific session by ID
router.get('/history/:id', auth, (req, res) => {
  const session = sessionHistory.find(s => s.id === req.params.id);
  
  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }
  
  res.json({ session });
});

// Get session statistics (for instructors)
router.get('/stats', auth, (req, res) => {
  // Check if user is an instructor (in a real app)
  
  // Mock statistics
  const stats = {
    totalSessions: sessionHistory.length,
    totalParticipants: sessionHistory.reduce((sum, session) => sum + session.participantCount, 0),
    averageParticipants: sessionHistory.reduce((sum, session) => sum + session.participantCount, 0) / sessionHistory.length,
    totalDuration: sessionHistory.reduce((sum, session) => sum + session.duration, 0),
    popular: {
      course: "JavaScript Fundamentals",
      session: "JavaScript Event Loop Deep Dive"
    }
  };
  
  res.json(stats);
});

module.exports = router;
