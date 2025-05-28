const { Op } = require('sequelize');
const User = require('../models/User');
const Student = require('../models/Student');
let LearningResource, StudentSubmission, Quiz, Ticket;

// Safely import models that might not exist yet
try {
  LearningResource = require('../models/LearningResource');
  StudentSubmission = require('../models/StudentSubmission');
  Quiz = require('../models/Quiz');
  Ticket = require('../models/Ticket');
} catch (error) {
  console.warn('Some models are missing, but we will continue with reduced functionality');
}

// Simple dashboard controller
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Lấy thông tin student
    const student = await Student.findByPk(userId, {
      include: [{ model: User, attributes: ['name', 'email'] }]
    });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }
    
    // Lấy dashboard data từ JSON field
    const dashboardData = student.dashboard_data || {};
    
    res.json({
      success: true,
      data: {
        student: {
          id: student.user_id,
          name: student.User ? student.User.name : 'Student',
          email: student.User ? student.User.email : 'student@example.com'
        },
        dashboardData: {
          points: dashboardData.points || 0,
          level: dashboardData.level || 1,
          completed_resources: dashboardData.completed_resources || 0,
          badges: dashboardData.badges || []
        }
      }
    });
  } catch (error) {
    console.error(`Error fetching student dashboard: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
};

// Other controller functions will follow the same pattern
exports.getProfile = async (req, res) => {
  res.json({
    success: true,
    data: {
      message: "Profile endpoint is working"
    }
  });
};

exports.updateProfile = async (req, res) => {
  res.json({
    success: true,
    data: {
      message: "Update profile endpoint is working"
    }
  });
};

exports.getLearningResources = async (req, res) => {
  res.json({
    success: true,
    data: {
      message: "Learning resources endpoint is working"
    }
  });
};

// Add other stub methods
exports.getLearningResourceDetail = async (req, res) => {
  res.json({ success: true, message: "Get resource detail endpoint is working" });
};

exports.submitCode = async (req, res) => {
  res.json({ success: true, message: "Submit code endpoint is working" });
};

exports.getSubmissions = async (req, res) => {
  res.json({ success: true, message: "Get submissions endpoint is working" });
};

exports.getSubmissionDetail = async (req, res) => {
  res.json({ success: true, message: "Get submission detail endpoint is working" });
};

exports.getQuizzes = async (req, res) => {
  res.json({ success: true, message: "Get quizzes endpoint is working" });
};

exports.getQuizDetail = async (req, res) => {
  res.json({ success: true, message: "Get quiz detail endpoint is working" });
};

exports.updatePreferences = async (req, res) => {
  res.json({ success: true, message: "Update preferences endpoint is working" });
};

exports.createSupportTicket = async (req, res) => {
  res.json({ success: true, message: "Create support ticket endpoint is working" });
};

exports.getSupportTickets = async (req, res) => {
  res.json({ success: true, message: "Get support tickets endpoint is working" });
};
