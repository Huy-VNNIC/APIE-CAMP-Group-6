const db = require('../config/db');

module.exports = {
  // Lấy dashboard data trực tiếp từ database
  getDashboard: async (req, res) => {
    try {
      // Lấy thông tin user
      const users = await db.query(
        'SELECT id, name, email, role, verified FROM users WHERE id = ?',
        [req.user.id]
      );
      
      if (users.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }
      
      // Lấy thông tin student và dashboard_data
      const students = await db.query(
        'SELECT * FROM students WHERE user_id = ?',
        [req.user.id]
      );
      
      if (students.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Student not found' 
        });
      }
      
      // Parse dashboard_data từ JSON
      let dashboardData = {};
      try {
        if (typeof students[0].dashboard_data === 'string') {
          dashboardData = JSON.parse(students[0].dashboard_data);
        } else {
          dashboardData = students[0].dashboard_data || {};
        }
      } catch (err) {
        console.error('Error parsing dashboard_data:', err);
        dashboardData = {
          progress: 0,
          level: 1,
          points: 0,
          completed_resources: 0
        };
      }
      
      // Lấy khóa học đã đăng ký từ database (giả lập cho demo)
      const enrolledCourses = [
        {
          id: 1,
          title: 'JavaScript Fundamentals',
          description: 'Learn the basics of JavaScript programming',
          progress: 80,
          last_accessed: '2023-05-25 10:30:00'
        },
        {
          id: 2,
          title: 'React for Beginners',
          description: 'Introduction to React library and its concepts',
          progress: 45,
          last_accessed: '2023-05-26 14:15:00'
        }
      ];
      
      // Lấy hoạt động gần đây từ database (giả lập cho demo)
      const recentActivities = [
        {
          id: 1,
          type: 'course_progress',
          description: 'Completed lesson in JavaScript Fundamentals',
          timestamp: '2023-05-27 14:30:00'
        }
      ];
      
      // Trả về dữ liệu dashboard
      return res.json({
        success: true,
        data: {
          dashboardData,
          enrolledCourses,
          recentActivities,
          user: {
            name: users[0].name
          }
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
  
  // Phần còn lại của controller...
};