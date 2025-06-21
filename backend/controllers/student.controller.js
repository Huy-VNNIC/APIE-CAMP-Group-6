const User = require('../models/user.model');
const StudentProgress = require('../models/studentProgress.model');
const QuizAttempt = require('../models/quizAttempt.model');
const Feedback = require('../models/feedback.model');
const Notification = require('../models/notification.model');
const Collaboration = require('../models/collaboration.model');
const StudentActivityService = require('../services/studentActivityService');
const { validationResult } = require('express-validator');

// Get all students (for instructors)
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('-password')
      .lean();
    
    // For each student, get summary of their progress
    const studentsWithProgress = await Promise.all(students.map(async (student) => {
      // Get all progresses for this student
      const progresses = await StudentProgress.find({ student: student._id });
      
      // Calculate overall progress
      let overallProgress = 0;
      if (progresses.length > 0) {
        const totalProgress = progresses.reduce((acc, curr) => acc + curr.progress, 0);
        overallProgress = Math.round(totalProgress / progresses.length);
      }
      
      // Count completed courses
      const completedCourses = progresses.filter(p => p.completed).length;
      
      // Get last active date
      const lastActive = student.lastActive || new Date();
      
      return {
        ...student,
        enrolledCourses: progresses.length,
        completedCourses,
        overallProgress,
        lastActive
      };
    }));
    
    res.json(studentsWithProgress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get student details with full progress
exports.getStudentDetails = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Get student info
    const student = await User.findById(studentId)
      .select('-password')
      .lean();
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Get course progress
    const courseProgress = await StudentProgress.find({ student: studentId })
      .populate('course', 'title')
      .lean();
    
    // Get quiz attempts
    const quizAttempts = await QuizAttempt.find({ student: studentId })
      .populate('quiz', 'title')
      .populate('course', 'title')
      .lean();
    
    // Format the student data for frontend display
    const formattedStudent = {
      ...student,
      courses: courseProgress.map(progress => ({
        id: progress.course._id,
        title: progress.course.title || progress.courseName,
        progress: progress.progress,
        enrollDate: progress.enrollDate,
        lastAccessed: progress.lastAccessed,
        completed: progress.completed,
        completionDate: progress.completionDate
      })),
      quizzes: quizAttempts.map(attempt => ({
        id: attempt.quiz._id,
        title: attempt.quiz.title || attempt.quizTitle,
        course: attempt.course.title,
        completedDate: attempt.endTime,
        score: attempt.score,
        timeSpent: `${Math.floor(attempt.timeSpent / 60)} minutes`,
        totalQuestions: attempt.totalQuestions,
        correctAnswers: attempt.correctAnswers,
        status: attempt.status
      })),
      // Add assignments and notes in a real system
      assignments: [],
      notes: []
    };
    
    // Calculate overall progress
    const overallProgress = courseProgress.length > 0
      ? Math.round(courseProgress.reduce((acc, curr) => acc + curr.progress, 0) / courseProgress.length)
      : 0;
    
    formattedStudent.overallProgress = overallProgress;
    
    res.json(formattedStudent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get course progress for a specific student
exports.getStudentCourseProgress = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;
    
    const progress = await StudentProgress.findOne({
      student: studentId,
      course: courseId
    }).populate('course', 'title lessons');
    
    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }
    
    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Generate student progress report
exports.generateProgressReport = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate, courseId } = req.query;
    
    const student = await User.findById(studentId).select('-password');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Set up query for progress
    const query = { student: studentId };
    
    // Add course filter if provided
    if (courseId) {
      query.course = courseId;
    }
    
    // Get progress data
    const progress = await StudentProgress.find(query).populate('course', 'title');
    
    // Get quiz attempts
    const quizQuery = { student: studentId };
    if (courseId) {
      quizQuery.course = courseId;
    }
    
    // Add date filters if provided
    if (startDate || endDate) {
      quizQuery.createdAt = {};
      if (startDate) {
        quizQuery.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        quizQuery.createdAt.$lte = new Date(endDate);
      }
    }
    
    const quizAttempts = await QuizAttempt.find(quizQuery)
      .populate('quiz', 'title')
      .populate('course', 'title');
    
    // Generate report data
    const report = {
      student: {
        id: student._id,
        name: student.fullName,
        email: student.email,
        username: student.username
      },
      enrolledCourses: progress.length,
      completedCourses: progress.filter(p => p.completed).length,
      averageProgress: progress.length > 0
        ? Math.round(progress.reduce((acc, curr) => acc + curr.progress, 0) / progress.length)
        : 0,
      courseDetails: progress.map(p => ({
        courseId: p.course._id,
        title: p.course.title || p.courseName,
        progress: p.progress,
        completed: p.completed,
        enrollDate: p.enrollDate,
        lastAccessed: p.lastAccessed,
        completedLessons: p.completedLessons,
        totalLessons: p.totalLessons
      })),
      quizPerformance: {
        totalAttempts: quizAttempts.length,
        averageScore: quizAttempts.length > 0
          ? Math.round(quizAttempts.reduce((acc, curr) => acc + curr.score, 0) / quizAttempts.length)
          : 0,
        detailedScores: quizAttempts.map(q => ({
          quizId: q.quiz._id,
          title: q.quiz.title || q.quizTitle,
          course: q.course.title,
          score: q.score,
          date: q.endTime,
          passed: q.passed
        }))
      },
      generatedAt: new Date()
    };
    
    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get student dashboard analytics
exports.getStudentDashboard = async (req, res) => {
  try {
    // Get student ID from authenticated user
    const studentId = req.user.id;
    
    // Get student info
    const student = await User.findById(studentId).select('-password').lean();
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Get course progress
    const courseProgress = await StudentProgress.find({ student: studentId })
      .populate('course', 'title')
      .lean();
    
    // Get recent quiz attempts
    const recentQuizAttempts = await QuizAttempt.find({ student: studentId })
      .sort({ endTime: -1 })
      .limit(5)
      .populate('quiz', 'title')
      .populate('course', 'title')
      .lean();
    
    // Calculate streak (consecutive days of activity)
    // This would require additional tracking in a real application
    const streak = 3; // Placeholder value
    
    // Calculate upcoming deadlines (would come from assignments model)
    const upcomingDeadlines = []; // Placeholder for assignment deadlines
    
    // Calculate time spent learning this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const timeSpentData = {
      totalMinutes: 0,
      dailyBreakdown: [] 
    };
    
    // Dashboard analytics data
    const dashboardData = {
      studentInfo: {
        id: student._id,
        name: student.fullName || student.username,
        email: student.email
      },
      overallProgress: courseProgress.length > 0
        ? Math.round(courseProgress.reduce((acc, curr) => acc + curr.progress, 0) / courseProgress.length)
        : 0,
      enrolledCourses: courseProgress.length,
      completedCourses: courseProgress.filter(p => p.completed).length,
      streak,
      recentQuizAttempts: recentQuizAttempts.map(q => ({
        quizId: q.quiz._id,
        title: q.quiz.title || q.quizTitle,
        course: q.course.title,
        score: q.score,
        date: q.endTime,
        passed: q.passed
      })),
      timeSpentData,
      upcomingDeadlines,
      activeCourses: courseProgress
        .filter(p => p.progress > 0 && p.progress < 100)
        .sort((a, b) => new Date(b.lastAccessed) - new Date(a.lastAccessed))
        .slice(0, 3)
        .map(p => ({
          courseId: p.course._id,
          title: p.course.title || p.courseName,
          progress: p.progress,
          lastAccessed: p.lastAccessed
        }))
    };
    
    res.json(dashboardData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get personalized learning path
exports.getLearningPathRecommendations = async (req, res) => {
  try {
    const studentId = req.user.id;
    
    // Get student's completed courses and performance
    const progress = await StudentProgress.find({ student: studentId }).populate('course', 'title category level tags');
    
    // Get student's quiz performances to identify strengths and weaknesses
    const quizAttempts = await QuizAttempt.find({ student: studentId }).populate('quiz', 'tags skills');
    
    // Logic to determine recommended next steps would go here
    // This is a simplified placeholder implementation
    
    const completedCourseIds = progress.filter(p => p.completed).map(p => p.course._id.toString());
    
    // Mock recommendations based on completed courses and skills
    const recommendations = {
      nextCourses: [
        {
          id: "course123", // This would be a real course ID in production
          title: "Advanced Machine Learning",
          description: "Take your ML skills to the next level",
          difficulty: "Advanced",
          estimatedTime: "8 weeks",
          matchScore: 95 // How well it matches the student's profile
        },
        {
          id: "course456", 
          title: "Cloud Architecture Patterns",
          description: "Learn about designing scalable cloud systems",
          difficulty: "Intermediate",
          estimatedTime: "6 weeks",
          matchScore: 87
        }
      ],
      skillsToImprove: ["Data Structures", "Algorithm Complexity", "System Design"],
      suggestedResources: [
        {
          title: "Interactive Data Structures Tutorial",
          type: "interactive",
          url: "/resources/data-structures"
        },
        {
          title: "Algorithm Complexity: A Visual Guide",
          type: "video",
          url: "/resources/algorithm-complexity"
        }
      ]
    };
    
    res.json(recommendations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Student peer collaboration system
exports.findPeerCollaborators = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId } = req.params;
    
    // Get students enrolled in the same course
    const enrolledStudents = await StudentProgress.find({ 
      course: courseId,
      student: { $ne: studentId } // Exclude the requesting student
    }).populate('student', 'fullName username avatar lastActive');
    
    // Format the response with only relevant student information
    const peers = enrolledStudents.map(enrollment => ({
      id: enrollment.student._id,
      name: enrollment.student.fullName || enrollment.student.username,
      avatar: enrollment.student.avatar,
      progress: enrollment.progress,
      lastActive: enrollment.student.lastActive,
      isOnline: new Date() - new Date(enrollment.student.lastActive) < 5 * 60 * 1000 // 5 minutes
    }));
    
    res.json(peers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Request peer collaboration
exports.requestCollaboration = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const studentId = req.user.id;
    const { peerId, courseId, topic, description, scheduledTime } = req.body;
    
    // Check if student is enrolled in this course
    const studentEnrolled = await StudentProgress.findOne({
      student: studentId,
      course: courseId
    });
    
    if (!studentEnrolled) {
      return res.status(400).json({ 
        message: 'You must be enrolled in this course to request collaboration' 
      });
    }
    
    // Check if peer is also enrolled
    const peerEnrolled = await StudentProgress.findOne({
      student: peerId,
      course: courseId
    });
    
    if (!peerEnrolled) {
      return res.status(400).json({ 
        message: 'Selected peer is not enrolled in this course' 
      });
    }
    
    // Create the collaboration request
    const collaborationRequest = new Collaboration({
      initiator: studentId,
      invitedPeer: peerId,
      course: courseId,
      topic,
      description,
      scheduledTime: new Date(scheduledTime),
      status: 'pending'
    });
    
    const savedRequest = await collaborationRequest.save();
    
    // Create a notification for the peer
    const notification = new Notification({
      recipient: peerId,
      type: 'message',
      title: 'New Collaboration Request',
      message: `A fellow student has requested to collaborate on ${topic}`,
      relatedCourse: courseId,
      isRead: false
    });
    
    await notification.save();
    
    res.status(201).json({
      message: 'Collaboration request sent successfully',
      request: savedRequest
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get student's collaboration requests
exports.getCollaborationRequests = async (req, res) => {
  try {
    const studentId = req.user.id;
    
    // Get collaboration requests sent by this student
    const sentRequests = await Collaboration.find({ initiator: studentId })
      .populate('invitedPeer', 'fullName username avatar')
      .populate('course', 'title')
      .sort({ createdAt: -1 })
      .lean();
    
    // Get collaboration requests received by this student
    const receivedRequests = await Collaboration.find({ invitedPeer: studentId })
      .populate('initiator', 'fullName username avatar')
      .populate('course', 'title')
      .sort({ createdAt: -1 })
      .lean();
    
    res.json({
      sent: sentRequests,
      received: receivedRequests
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Respond to collaboration request
exports.respondToCollaborationRequest = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { requestId } = req.params;
    const { response } = req.body; // 'accepted' or 'rejected'
    
    // Find the collaboration request and verify this student is the invitee
    const request = await Collaboration.findOne({
      _id: requestId,
      invitedPeer: studentId
    });
    
    if (!request) {
      return res.status(404).json({ message: 'Collaboration request not found' });
    }
    
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'This request has already been processed' });
    }
    
    // Update the request status
    request.status = response;
    if (response === 'accepted') {
      // Generate a mock meeting link - in a real app, this would integrate with a video service
      request.meetingLink = `https://meet.example.com/${requestId}`;
    }
    
    await request.save();
    
    // Create a notification for the initiator
    const notification = new Notification({
      recipient: request.initiator,
      type: 'message',
      title: `Collaboration Request ${response === 'accepted' ? 'Accepted' : 'Declined'}`,
      message: `Your collaboration request on "${request.topic}" has been ${response}`,
      relatedCourse: request.course,
      isRead: false
    });
    
    await notification.save();
    
    res.json({
      message: `Collaboration request ${response}`,
      request
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Submit student feedback
exports.submitFeedback = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const studentId = req.user.id;
    const { courseId, content, rating, type } = req.body;
    
    // Create and save feedback using the Feedback model
    const feedback = new Feedback({
      student: studentId,
      course: courseId,
      content,
      rating,
      type // 'course', 'instructor', 'platform'
    });
    
    const savedFeedback = await feedback.save();
    
    res.status(201).json({ 
      message: 'Feedback submitted successfully', 
      feedback: savedFeedback 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get student notifications
exports.getNotifications = async (req, res) => {
  try {
    const studentId = req.user.id;
    
    // Fetch notifications for this student
    const notifications = await Notification.find({ recipient: studentId })
      .sort({ createdAt: -1 })
      .populate('relatedCourse', 'title')
      .limit(20)
      .lean();
    
    // If no notifications found in the database yet, return some sample notifications
    if (notifications.length === 0) {
      // Sample notifications for demonstration
      const sampleNotifications = [
        {
          id: 'notif1',
          type: 'deadline',
          title: 'Assignment Due Soon',
          message: 'Your Python programming assignment is due in 2 days',
          courseName: 'Python Programming',
          courseId: 'course789',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          isRead: false
        },
        {
          id: 'notif2',
          type: 'announcement',
          title: 'New Learning Resource Added',
          message: 'A new tutorial on database design has been added to your course',
          courseName: 'Database Systems',
          courseId: 'course456',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          isRead: true
        },
        {
          id: 'notif3',
          type: 'grade',
          title: 'Quiz Graded',
          message: 'Your recent quiz on JavaScript Fundamentals has been graded',
          courseName: 'Web Development',
          courseId: 'course123',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          isRead: false
        }
      ];
      
      return res.json(sampleNotifications);
    }
    
    // Format the notifications for the frontend
    const formattedNotifications = notifications.map(notification => ({
      id: notification._id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      courseName: notification.relatedCourse?.title || '',
      courseId: notification.relatedCourse?._id || '',
      createdAt: notification.createdAt,
      isRead: notification.isRead
    }));
    
    res.json(formattedNotifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark notification as read
exports.markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const studentId = req.user.id;
    
    // Find the notification and verify it belongs to this student
    const notification = await Notification.findOne({ 
      _id: notificationId,
      recipient: studentId
    });
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    // Update the notification to mark as read
    notification.isRead = true;
    await notification.save();
    
    res.json({ message: 'Notification marked as read', notificationId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get student learning analytics
exports.getStudentAnalytics = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId } = req.query;
    
    const analytics = await StudentActivityService.getStudentAnalytics(
      studentId, 
      courseId || null
    );
    
    res.json(analytics);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Track course access 
exports.trackCourseAccess = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId, lessonId } = req.body;
    
    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required' });
    }
    
    const tracked = await StudentActivityService.trackCourseAccess(
      studentId,
      courseId,
      lessonId || null
    );
    
    if (tracked) {
      res.json({ message: 'Activity tracked successfully' });
    } else {
      res.status(400).json({ message: 'Failed to track activity' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Track lesson time spent
exports.trackLessonTime = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId, lessonId, timeSpentSeconds } = req.body;
    
    if (!courseId || !lessonId || !timeSpentSeconds) {
      return res.status(400).json({ 
        message: 'Course ID, lesson ID, and time spent are required' 
      });
    }
    
    const tracked = await StudentActivityService.trackLessonTime(
      studentId,
      courseId,
      lessonId,
      timeSpentSeconds
    );
    
    if (tracked) {
      res.json({ message: 'Lesson time tracked successfully' });
    } else {
      res.status(400).json({ message: 'Failed to track lesson time' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark lesson as complete
exports.completeLessonProgress = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId, lessonId } = req.body;
    
    if (!courseId || !lessonId) {
      return res.status(400).json({ 
        message: 'Course ID and lesson ID are required' 
      });
    }
    
    const completed = await StudentActivityService.completeLessonProgress(
      studentId,
      courseId,
      lessonId
    );
    
    if (completed) {
      res.json({ message: 'Lesson marked as complete' });
    } else {
      res.status(400).json({ message: 'Failed to complete lesson' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
