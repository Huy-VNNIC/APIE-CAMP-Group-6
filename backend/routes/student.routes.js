const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const studentController = require('../controllers/student.controller');
const authMiddleware = require('../middleware/auth');

// Authentication middleware - ensure user is logged in
router.use(authMiddleware);

// Student routes - many of these will be available to the student themselves
// Routes for instructors to view student data
router.get('/all', studentController.getAllStudents);
router.get('/details/:studentId', studentController.getStudentDetails);
router.get('/progress/:studentId/:courseId', studentController.getStudentCourseProgress);
router.get('/report/:studentId', studentController.generateProgressReport);

// Student dashboard and analytics
router.get('/dashboard', studentController.getStudentDashboard);
router.get('/analytics', studentController.getStudentAnalytics);

// Activity tracking
router.post('/track/course', studentController.trackCourseAccess);
router.post('/track/lesson-time', studentController.trackLessonTime);
router.post('/track/complete-lesson', studentController.completeLessonProgress);

// Learning path and recommendations
router.get('/recommendations', studentController.getLearningPathRecommendations);

// Peer collaboration
router.get('/collaborators/:courseId', studentController.findPeerCollaborators);
router.post('/collaboration', [
  check('peerId', 'Peer ID is required').not().isEmpty(),
  check('courseId', 'Course ID is required').not().isEmpty(),
  check('topic', 'Topic is required').not().isEmpty(),
  check('scheduledTime', 'Valid scheduled time is required').isISO8601()
], studentController.requestCollaboration);
router.get('/collaboration/requests', studentController.getCollaborationRequests);
router.put('/collaboration/:requestId/respond', [
  check('response').isIn(['accepted', 'rejected'])
], studentController.respondToCollaborationRequest);

// Feedback system
router.post('/feedback', [
  check('courseId', 'Course ID is required').not().isEmpty(),
  check('content', 'Feedback content is required').not().isEmpty(),
  check('rating', 'Rating is required').isNumeric().isInt({ min: 1, max: 5 }),
  check('type', 'Feedback type is required').isIn(['course', 'instructor', 'platform'])
], studentController.submitFeedback);

// Notification system
router.get('/notifications', studentController.getNotifications);
router.put('/notifications/:notificationId/read', studentController.markNotificationAsRead);

module.exports = router;
