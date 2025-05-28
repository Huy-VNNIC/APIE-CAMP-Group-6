const studentModel = require('../models/studentModel');
const userModel = require('../models/userModel');
const submissionModel = require('../models/submissionModel');

const studentController = {
  // Lấy thông tin dashboard
  async getDashboard(req, res) {
    try {
      const userId = req.user.id;
      
      // Kiểm tra xem user có phải là student không
      const user = await userModel.findById(userId);
      if (user.role !== 'student') {
        return res.status(403).json({ msg: 'Not authorized as student' });
      }
      
      // Lấy dashboard data
      const dashboardData = await studentModel.getDashboardData(userId);
      
      // Lấy danh sách khóa học đã đăng ký
      const enrolledCourses = await studentModel.getEnrolledCourses(userId);
      
      // Lấy các hoạt động gần đây
      const recentActivities = await studentModel.getRecentActivities(userId);
      
      // Lấy các bài nộp gần đây
      const recentSubmissions = await submissionModel.getSubmissionsByStudent(userId);
      
      res.json({
        success: true,
        data: {
          dashboardData,
          enrolledCourses,
          recentActivities,
          recentSubmissions: recentSubmissions.slice(0, 5)
        }
      });
    } catch (err) {
      console.error('Get dashboard error:', err);
      res.status(500).json({ 
        success: false,
        msg: 'Server error'
      });
    }
  },
  
  // Cập nhật profile
  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { name, email } = req.body;
      
      // Logic cập nhật profile
      // ...
      
      res.json({
        success: true,
        msg: 'Profile updated successfully'
      });
    } catch (err) {
      console.error('Update profile error:', err);
      res.status(500).json({
        success: false,
        msg: 'Server error'
      });
    }
  }
};

module.exports = studentController;