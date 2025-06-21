/**
 * Student Activity Service
 * 
 * This service tracks and analyzes student activity within the platform
 * including time spent, interactions, and learning behaviors.
 */

const StudentProgress = require('../models/studentProgress.model');
const QuizAttempt = require('../models/quizAttempt.model');
const User = require('../models/user.model');
const Notification = require('../models/notification.model');
const Collaboration = require('../models/collaboration.model');
const Feedback = require('../models/feedback.model');
const Course = require('../models/course.model');
const Quiz = require('../models/quiz.model');

/**
 * Track when a student accesses course material
 * @param {string} studentId - The student's ID
 * @param {string} courseId - The course ID 
 * @param {string} lessonId - The lesson ID (optional)
 */
exports.trackCourseAccess = async (studentId, courseId, lessonId = null) => {
  try {
    // Update the student progress record
    const progressRecord = await StudentProgress.findOne({ 
      student: studentId,
      course: courseId
    });
    
    if (progressRecord) {
      progressRecord.lastAccessed = new Date();
      
      // If a specific lesson was accessed, update that as well
      if (lessonId) {
        const lessonProgress = progressRecord.lessonsProgress.find(
          lesson => lesson.lessonId === lessonId
        );
        
        if (lessonProgress) {
          lessonProgress.lastAccessed = new Date();
        } else {
          // Add new lesson progress if not exists
          progressRecord.lessonsProgress.push({
            lessonId,
            completed: false,
            timeSpent: 0,
            lastAccessed: new Date()
          });
        }
      }
      
      await progressRecord.save();
    }
    
    // Also update the user's lastActive timestamp
    await User.findByIdAndUpdate(studentId, { 
      lastActive: new Date() 
    });
    
    return true;
  } catch (error) {
    console.error('Error tracking course access:', error);
    return false;
  }
};

/**
 * Track time spent on a specific lesson
 * @param {string} studentId - The student's ID
 * @param {string} courseId - The course ID 
 * @param {string} lessonId - The lesson ID
 * @param {number} timeSpentSeconds - Time spent in seconds
 */
exports.trackLessonTime = async (studentId, courseId, lessonId, timeSpentSeconds) => {
  try {
    const progressRecord = await StudentProgress.findOne({ 
      student: studentId,
      course: courseId
    });
    
    if (!progressRecord) return false;
    
    // Find the specific lesson
    const lessonProgress = progressRecord.lessonsProgress.find(
      lesson => lesson.lessonId === lessonId
    );
    
    if (lessonProgress) {
      // Add to existing time spent
      lessonProgress.timeSpent += timeSpentSeconds;
      lessonProgress.lastAccessed = new Date();
    } else {
      // Create new lesson progress entry
      progressRecord.lessonsProgress.push({
        lessonId,
        completed: false,
        timeSpent: timeSpentSeconds,
        lastAccessed: new Date()
      });
    }
    
    await progressRecord.save();
    return true;
  } catch (error) {
    console.error('Error tracking lesson time:', error);
    return false;
  }
};

/**
 * Mark a lesson as completed
 * @param {string} studentId - The student's ID
 * @param {string} courseId - The course ID 
 * @param {string} lessonId - The lesson ID
 */
exports.completeLessonProgress = async (studentId, courseId, lessonId) => {
  try {
    const progressRecord = await StudentProgress.findOne({ 
      student: studentId,
      course: courseId
    });
    
    if (!progressRecord) return false;
    
    // Find or create lesson progress
    let lessonProgress = progressRecord.lessonsProgress.find(
      lesson => lesson.lessonId === lessonId
    );
    
    if (lessonProgress) {
      lessonProgress.completed = true;
      lessonProgress.lastAccessed = new Date();
    } else {
      progressRecord.lessonsProgress.push({
        lessonId,
        completed: true,
        timeSpent: 0,
        lastAccessed: new Date()
      });
    }
    
    // Update completed lessons count
    progressRecord.completedLessons = progressRecord.lessonsProgress.filter(
      lesson => lesson.completed
    ).length;
    
    // Calculate overall progress percentage
    progressRecord.progress = Math.round(
      (progressRecord.completedLessons / progressRecord.totalLessons) * 100
    );
    
    // Check if course is now complete
    if (progressRecord.progress >= 100) {
      progressRecord.completed = true;
      progressRecord.completionDate = new Date();
    }
    
    await progressRecord.save();
    return true;
  } catch (error) {
    console.error('Error completing lesson:', error);
    return false;
  }
};

/**
 * Get student learning analytics
 * @param {string} studentId - The student's ID
 * @param {string} courseId - Optional course ID to filter by
 */
exports.getStudentAnalytics = async (studentId, courseId = null) => {
  try {
    const query = { student: studentId };
    if (courseId) query.course = courseId;
    
    // Get student progress data
    const progress = await StudentProgress.find(query)
      .populate('course', 'title category level')
      .lean();
    
    // Get quiz attempt data
    const quizAttempts = await QuizAttempt.find(query)
      .populate('quiz', 'title')
      .populate('course', 'title')
      .lean();
    
    // Calculate overall analytics
    const totalTimeSpentSeconds = progress.reduce((total, course) => {
      const courseTimeSpent = course.lessonsProgress.reduce(
        (sum, lesson) => sum + (lesson.timeSpent || 0), 0
      );
      return total + courseTimeSpent;
    }, 0);
    
    // Format for hours, minutes
    const totalHours = Math.floor(totalTimeSpentSeconds / 3600);
    const totalMinutes = Math.floor((totalTimeSpentSeconds % 3600) / 60);
    
    // Calculate quiz performance
    const quizPerformance = quizAttempts.length > 0 ? 
      Math.round(quizAttempts.reduce((sum, quiz) => sum + quiz.score, 0) / quizAttempts.length) : 0;
    
    // Calculate daily activity (simplified version)
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0]; // YYYY-MM-DD format
    });
    
    // Calculate progress trend over time (for charts)
    const progressHistory = progress.map(p => ({
      courseId: p.course._id,
      courseTitle: p.course.title,
      progress: p.progress,
      timestamps: p.lessonsProgress
        .filter(l => l.lastAccessed)
        .sort((a, b) => new Date(a.lastAccessed) - new Date(b.lastAccessed))
        .map(l => ({
          date: new Date(l.lastAccessed).toISOString().split('T')[0],
          progress: l.completed ? 1 : 0
        }))
    }));

    // Analyze quiz performance by category
    const quizzesByCategory = {};
    quizAttempts.forEach(attempt => {
      if (!attempt.quiz || !attempt.quiz.category) return;
      
      if (!quizzesByCategory[attempt.quiz.category]) {
        quizzesByCategory[attempt.quiz.category] = {
          totalScore: 0,
          count: 0,
          passed: 0,
          failed: 0
        };
      }
      
      const category = quizzesByCategory[attempt.quiz.category];
      category.totalScore += attempt.score;
      category.count += 1;
      
      if (attempt.passed) {
        category.passed += 1;
      } else {
        category.failed += 1;
      }
    });
    
    // Convert to array format for frontend charts
    const quizPerformanceByCategory = Object.keys(quizzesByCategory).map(category => ({
      category,
      averageScore: Math.round(quizzesByCategory[category].totalScore / quizzesByCategory[category].count),
      passed: quizzesByCategory[category].passed,
      failed: quizzesByCategory[category].failed,
      total: quizzesByCategory[category].count
    }));
    
    // Determine strengths and improvement areas based on quiz performance
    const strengths = quizPerformanceByCategory
      .filter(cat => cat.averageScore >= 80)
      .map(cat => cat.category);
    
    const improvementAreas = quizPerformanceByCategory
      .filter(cat => cat.averageScore < 60)
      .map(cat => cat.category);
    
    // Generate recent activity log
    const recentActivityLog = progress
      .flatMap(p => p.lessonsProgress
        .filter(l => l.lastAccessed)
        .map(l => ({
          type: l.completed ? 'completion' : 'access',
          courseId: p.course._id,
          courseTitle: p.course.title,
          lessonId: l.lessonId,
          timestamp: new Date(l.lastAccessed)
        }))
      )
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);
    
    // Return analytics data
    return {
      overallProgress: progress.length > 0 ? 
        Math.round(progress.reduce((sum, p) => sum + p.progress, 0) / progress.length) : 0,
      totalTimeSpent: {
        hours: totalHours,
        minutes: totalMinutes,
        formatted: `${totalHours}h ${totalMinutes}m`
      },
      coursesEnrolled: progress.length,
      coursesCompleted: progress.filter(p => p.completed).length,
      quizPerformance,
      quizzesTaken: quizAttempts.length,
      quizzesPassed: quizAttempts.filter(q => q.passed).length,
      strengths,
      improvementAreas,
      dailyActivity: last7Days.map(date => ({
        date,
        minutesActive: 0 // Placeholder - would need actual tracking data
      })),
      // New fields for enhanced frontend support
      progressHistory,
      quizPerformanceByCategory,
      recentActivityLog,
      coursesList: progress.map(p => ({
        _id: p.course._id,
        title: p.course.title,
        category: p.course.category,
        level: p.course.level,
        progress: p.progress,
        completed: p.completed,
        lastAccessed: p.lastAccessed
      }))
    };
  } catch (error) {
    console.error('Error getting student analytics:', error);
    throw error;
  }
};

/**
 * Generate personalized learning recommendations for a student
 * @param {string} studentId - The student's ID
 * @returns {Array} - Array of course/resource recommendations
 */
exports.getLearningRecommendations = async (studentId) => {
  try {
    // Get student's courses and progress
    const studentProgress = await StudentProgress.find({ student: studentId })
      .populate('course', 'title category level description')
      .lean();
    
    // Get student's quiz attempts for skills assessment
    const quizAttempts = await QuizAttempt.find({ student: studentId })
      .populate('quiz', 'title category tags')
      .lean();
    
    // Extract student's strengths and weaknesses based on quiz performance
    const categoryPerformance = {};
    
    quizAttempts.forEach(attempt => {
      if (!attempt.quiz || !attempt.quiz.category) return;
      
      if (!categoryPerformance[attempt.quiz.category]) {
        categoryPerformance[attempt.quiz.category] = {
          totalScore: 0,
          count: 0
        };
      }
      
      categoryPerformance[attempt.quiz.category].totalScore += attempt.score;
      categoryPerformance[attempt.quiz.category].count += 1;
    });
    
    // Calculate average performance by category
    const strengths = [];
    const weaknesses = [];
    
    Object.keys(categoryPerformance).forEach(category => {
      const average = categoryPerformance[category].totalScore / categoryPerformance[category].count;
      
      if (average >= 80) {
        strengths.push(category);
      } else if (average < 60) {
        weaknesses.push(category);
      }
    });
    
    // Get all available courses for recommendations
    const allCourses = await Course.find({
      _id: { $nin: studentProgress.map(p => p.course._id) } // Exclude enrolled courses
    }).lean();
    
    const recommendations = [];
    
    // Recommend courses based on weaknesses to improve
    if (weaknesses.length > 0) {
      const improvementCourses = allCourses.filter(course => 
        weaknesses.includes(course.category)
      );
      
      improvementCourses.forEach(course => {
        recommendations.push({
          type: 'improvement',
          course,
          reason: `Improve your skills in ${course.category}`
        });
      });
    }
    
    // Recommend advanced courses in strength areas
    if (strengths.length > 0) {
      const advancedCourses = allCourses.filter(course => 
        strengths.includes(course.category) && course.level === 'advanced'
      );
      
      advancedCourses.forEach(course => {
        recommendations.push({
          type: 'advancement',
          course,
          reason: `Advance your ${course.category} knowledge`
        });
      });
    }
    
    // Add some general popular courses
    const popularCourses = allCourses
      .filter(course => !recommendations.find(r => r.course._id.equals(course._id)))
      .sort(() => 0.5 - Math.random()) // Simple randomization
      .slice(0, 3);
    
    popularCourses.forEach(course => {
      recommendations.push({
        type: 'popular',
        course,
        reason: 'Popular among students'
      });
    });
    
    return recommendations.slice(0, 6); // Limit to 6 recommendations
  } catch (error) {
    console.error('Error generating learning recommendations:', error);
    throw error;
  }
};

/**
 * Find potential collaborators for a student in a course
 * @param {string} studentId - The student's ID
 * @param {string} courseId - The course ID
 * @returns {Array} - Array of potential collaborators
 */
exports.getCoursePeers = async (studentId, courseId) => {
  try {
    // Find all students enrolled in the same course
    const courseProgress = await StudentProgress.find({ 
      course: courseId,
      student: { $ne: studentId } // Exclude the current student
    }).populate('student', 'name email profileImage lastActive');
    
    // Get collaboration history for the student
    const collaborationHistory = await Collaboration.find({
      $or: [
        { requestedBy: studentId },
        { requestedTo: studentId }
      ]
    });
    
    // Format the peers with some additional info
    const peers = courseProgress.map(progress => {
      const student = progress.student;
      
      // Check if they've collaborated before
      const hasCollaborated = collaborationHistory.some(collab =>
        (collab.requestedBy.equals(studentId) && collab.requestedTo.equals(student._id)) ||
        (collab.requestedBy.equals(student._id) && collab.requestedTo.equals(studentId))
      );
      
      return {
        _id: student._id,
        name: student.name,
        email: student.email,
        profileImage: student.profileImage,
        progress: progress.progress, // Course progress percentage
        lastActive: student.lastActive,
        hasCollaboratedBefore: hasCollaborated
      };
    });
    
    return peers;
  } catch (error) {
    console.error('Error finding course peers:', error);
    throw error;
  }
};

/**
 * Get all student notifications with pagination
 * @param {string} studentId - The student's ID
 * @param {Object} options - Pagination and filtering options
 * @returns {Object} - Notifications with pagination info
 */
exports.getStudentNotifications = async (studentId, options = {}) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      onlyUnread = false,
      type = null
    } = options;
    
    // Build query
    const query = { recipient: studentId };
    if (onlyUnread) query.isRead = false;
    if (type) query.type = type;
    
    // Count total documents for pagination
    const total = await Notification.countDocuments(query);
    
    // Get notifications with pagination
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 }) // Most recent first
      .limit(limit)
      .skip((page - 1) * limit)
      .populate('relatedCourse', 'title')
      .populate('relatedQuiz', 'title')
      .lean();
    
    // Count unread for badge
    const unreadCount = await Notification.countDocuments({ 
      recipient: studentId, 
      isRead: false 
    });
    
    return {
      notifications,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      },
      unreadCount
    };
  } catch (error) {
    console.error('Error getting student notifications:', error);
    throw error;
  }
};

/**
 * Mark a notification as read
 * @param {string} notificationId - The notification ID
 * @param {string} studentId - The student's ID for verification
 */
exports.markNotificationAsRead = async (notificationId, studentId) => {
  try {
    const notification = await Notification.findOne({
      _id: notificationId,
      recipient: studentId
    });
    
    if (!notification) {
      throw new Error('Notification not found');
    }
    
    notification.isRead = true;
    await notification.save();
    
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

/**
 * Submit student feedback
 * @param {string} studentId - The student's ID
 * @param {string} courseId - The course ID
 * @param {string} content - Feedback content
 * @param {number} rating - Numerical rating (1-5)
 * @param {string} type - Feedback type (course, platform, instructor)
 */
exports.submitFeedback = async (studentId, courseId, content, rating, type) => {
  try {
    const feedback = new Feedback({
      student: studentId,
      course: courseId,
      content,
      rating,
      type
    });
    
    await feedback.save();
    
    return feedback;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
};

/**
 * Get student dashboard data
 * @param {string} studentId - The student's ID
 */
exports.getStudentDashboard = async (studentId) => {
  try {
    // Get basic analytics
    const analytics = await this.getStudentAnalytics(studentId);
    
    // Get recent courses (last accessed)
    const recentCourses = await StudentProgress.find({ student: studentId })
      .sort({ lastAccessed: -1 })
      .limit(4)
      .populate('course', 'title description category level imageUrl')
      .lean();

    // Get upcoming deadlines (quizzes, assignments)
    const currentDate = new Date();
    const twoWeeksLater = new Date();
    twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);
    
    // Get courses the student is enrolled in
    const enrolledCourseIds = (await StudentProgress.find({ 
      student: studentId 
    })).map(p => p.course);

    // Get upcoming quizzes
    const upcomingQuizzes = await Quiz.find({
      course: { $in: enrolledCourseIds },
      dueDate: { $gt: currentDate, $lt: twoWeeksLater }
    })
    .populate('course', 'title')
    .sort({ dueDate: 1 })
    .limit(5)
    .lean();

    // Get recent notifications
    const { notifications, unreadCount } = await this.getStudentNotifications(
      studentId, 
      { limit: 5, onlyUnread: false }
    );

    // Get learning recommendations
    const recommendations = await this.getLearningRecommendations(studentId);

    // Get active collaboration requests
    const activeCollaborations = await Collaboration.find({
      $or: [
        { requestedBy: studentId },
        { requestedTo: studentId }
      ],
      status: { $in: ['pending', 'accepted'] }
    })
    .populate('requestedBy', 'name email profileImage')
    .populate('requestedTo', 'name email profileImage')
    .populate('course', 'title')
    .sort({ createdAt: -1 })
    .lean();

    // Return comprehensive dashboard data
    return {
      analytics: {
        overallProgress: analytics.overallProgress,
        totalTimeSpent: analytics.totalTimeSpent,
        coursesEnrolled: analytics.coursesEnrolled,
        coursesCompleted: analytics.coursesCompleted,
        quizzesTaken: analytics.quizzesTaken,
        quizzesPassed: analytics.quizzesPassed,
        strengths: analytics.strengths,
        improvementAreas: analytics.improvementAreas
      },
      recentCourses: recentCourses.map(progress => ({
        _id: progress.course._id,
        title: progress.course.title,
        description: progress.course.description,
        category: progress.course.category,
        level: progress.course.level,
        progress: progress.progress,
        imageUrl: progress.course.imageUrl,
        lastAccessed: progress.lastAccessed
      })),
      upcomingDeadlines: upcomingQuizzes.map(quiz => ({
        _id: quiz._id,
        title: quiz.title,
        type: 'quiz',
        course: quiz.course,
        dueDate: quiz.dueDate
      })),
      notifications,
      notificationsCount: unreadCount,
      recommendations: recommendations.slice(0, 3), // Limit to 3
      collaborations: activeCollaborations.map(collab => ({
        _id: collab._id,
        course: collab.course,
        topic: collab.topic,
        scheduledTime: collab.scheduledTime,
        status: collab.status,
        isRequester: collab.requestedBy._id.toString() === studentId,
        peer: collab.requestedBy._id.toString() === studentId ? collab.requestedTo : collab.requestedBy
      }))
    };
  } catch (error) {
    console.error('Error getting student dashboard:', error);
    throw error;
  }
};

/**
 * Request collaboration with another student
 * @param {string} studentId - The requesting student's ID
 * @param {string} peerId - The peer student's ID
 * @param {string} courseId - The course ID
 * @param {string} topic - Collaboration topic
 * @param {string} description - Detailed description
 * @param {Date} scheduledTime - Proposed collaboration time
 */
exports.requestCollaboration = async (studentId, peerId, courseId, topic, description, scheduledTime) => {
  try {
    // Create collaboration request
    const collaboration = new Collaboration({
      requestedBy: studentId,
      requestedTo: peerId,
      course: courseId,
      topic,
      description,
      scheduledTime,
      status: 'pending'
    });
    
    await collaboration.save();
    
    // Create notification for the peer
    const requester = await User.findById(studentId);
    const course = await Course.findById(courseId);
    
    await Notification.create({
      recipient: peerId,
      type: 'message',
      title: 'New Collaboration Request',
      message: `${requester.name} has requested to collaborate with you on ${course.title}`,
      relatedCourse: courseId,
      isRead: false
    });
    
    return collaboration;
  } catch (error) {
    console.error('Error requesting collaboration:', error);
    throw error;
  }
};

/**
 * Get all collaboration requests for a student
 * @param {string} studentId - The student's ID
 */
exports.getCollaborationRequests = async (studentId) => {
  try {
    // Get both received and sent requests
    const collaborations = await Collaboration.find({
      $or: [
        { requestedBy: studentId },
        { requestedTo: studentId }
      ]
    })
    .populate('requestedBy', 'name email profileImage')
    .populate('requestedTo', 'name email profileImage')
    .populate('course', 'title imageUrl')
    .sort({ createdAt: -1 })
    .lean();
    
    return {
      sent: collaborations.filter(c => c.requestedBy._id.toString() === studentId),
      received: collaborations.filter(c => c.requestedTo._id.toString() === studentId)
    };
  } catch (error) {
    console.error('Error getting collaboration requests:', error);
    throw error;
  }
};

/**
 * Respond to a collaboration request
 * @param {string} studentId - The student's ID (for verification)
 * @param {string} requestId - The collaboration request ID
 * @param {string} response - Accept or decline
 */
exports.respondToCollaborationRequest = async (studentId, requestId, response) => {
  try {
    const collaboration = await Collaboration.findOne({
      _id: requestId,
      requestedTo: studentId,
      status: 'pending'
    });
    
    if (!collaboration) {
      throw new Error('Collaboration request not found or already processed');
    }
    
    // Update status based on response
    collaboration.status = response === 'accept' ? 'accepted' : 'declined';
    await collaboration.save();
    
    // Create notification for the requester
    const responder = await User.findById(studentId);
    const course = await Course.findById(collaboration.course);
    
    await Notification.create({
      recipient: collaboration.requestedBy,
      type: 'message',
      title: `Collaboration ${response === 'accept' ? 'Accepted' : 'Declined'}`,
      message: `${responder.name} has ${response === 'accept' ? 'accepted' : 'declined'} your collaboration request for ${course.title}`,
      relatedCourse: collaboration.course,
      isRead: false
    });
    
    return collaboration;
  } catch (error) {
    console.error('Error responding to collaboration request:', error);
    throw error;
  }
};
