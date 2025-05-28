const db = require('../config/db');

module.exports = {
  // Lấy dashboard data trực tiếp từ database với JOIN
  getDashboard: async (req, res) => {
    try {
      // Lấy dữ liệu từ bảng students
      const students = await db.query(
        'SELECT s.dashboard_data, u.name, u.email, u.role FROM students s JOIN users u ON s.user_id = u.id WHERE s.user_id = ?',
        [req.user.id]
      );
      
      if (students.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Student data not found' 
        });
      }
      
      // Parse dashboard_data
      let dashboardData = {};
      try {
        if (typeof students[0].dashboard_data === 'string') {
          dashboardData = JSON.parse(students[0].dashboard_data);
        } else {
          dashboardData = students[0].dashboard_data || {};
        }
      } catch (err) {
        console.error('Error parsing dashboard_data:', err);
        dashboardData = { progress: 0, level: 1, points: 0, completed_resources: 0 };
      }
      
      // Lấy danh sách các khóa học đã đăng ký từ table learning_resources
      // Ví dụ: Các resource có type 'video' hoặc 'code' mà sinh viên đã nộp bài
      const submissions = await db.query(
        `SELECT lr.id, lr.title, lr.type, lr.language, MAX(ss.submitted_at) AS last_accessed,
         COUNT(DISTINCT ss.id) as submission_count 
         FROM learning_resources lr 
         JOIN student_submissions ss ON lr.id = ss.resource_id 
         WHERE ss.student_id = ? 
         GROUP BY lr.id
         ORDER BY last_accessed DESC
         LIMIT 3`,
        [req.user.id]
      );
      
      // Biến đổi dữ liệu submissions thành enrolledCourses
      const enrolledCourses = submissions.map(item => {
        // Tính progress dựa trên số lượng bài nộp
        // Giả định: Mỗi resource có tối đa 5 bài nộp để hoàn thành = 100%
        const progress = Math.min(Math.round((item.submission_count / 5) * 100), 100);
        
        return {
          id: item.id,
          title: item.title,
          description: `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} content in ${item.language}`,
          progress: progress,
          last_accessed: item.last_accessed
        };
      });
      
      // Lấy hoạt động gần đây từ bảng student_submissions
      const activities = await db.query(
        `SELECT ss.id, ss.status, ss.submitted_at as timestamp, 
         lr.title as resource_title, lr.type as resource_type
         FROM student_submissions ss
         JOIN learning_resources lr ON ss.resource_id = lr.id
         WHERE ss.student_id = ?
         ORDER BY ss.submitted_at DESC
         LIMIT 3`,
        [req.user.id]
      );
      
      // Biến đổi dữ liệu activities thành recentActivities
      const recentActivities = activities.map(item => {
        let activityType = 'course_progress';
        let description = '';
        
        if (item.status === 'success') {
          description = `Completed "${item.resource_title}" successfully`;
        } else if (item.status === 'failed') {
          activityType = 'assignment_submission';
          description = `Submitted "${item.resource_title}" but encountered issues`;
        } else {
          description = `Started working on "${item.resource_title}"`;
        }
        
        return {
          id: item.id,
          type: activityType,
          description: description,
          timestamp: item.timestamp
        };
      });
      
      // Trả về dữ liệu dashboard
      return res.json({
        success: true,
        data: {
          dashboardData,
          enrolledCourses,
          recentActivities
        }
      });
    } catch (err) {
      console.error('Dashboard error:', err);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while fetching dashboard data',
        error: err.message
      });
    }
  }
};