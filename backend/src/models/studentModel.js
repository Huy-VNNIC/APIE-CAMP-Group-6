const { query } = require('../config/db');

const studentModel = {
  // Lấy dashboard data của student
  async getDashboardData(userId) {
    const sql = `
      SELECT s.dashboard_data 
      FROM students s
      WHERE s.user_id = ?
    `;
    
    const results = await query(sql, [userId]);
    return results.length ? JSON.parse(results[0].dashboard_data) : null;
  },
  
  // Cập nhật dashboard data
  async updateDashboardData(userId, dashboardData) {
    const sql = `
      UPDATE students
      SET dashboard_data = ?
      WHERE user_id = ?
    `;
    
    await query(sql, [JSON.stringify(dashboardData), userId]);
    return { success: true };
  },
  
  // Lấy danh sách khóa học đã đăng ký (có thể mở rộng để bao gồm khóa học)
  async getEnrolledCourses(userId) {
    // Giả sử bạn có bảng enrollments hoặc thông tin này được lưu trong dashboard_data
    const dashboardData = await this.getDashboardData(userId);
    
    // Lấy danh sách khóa học từ dashboard_data hoặc bảng enrollments
    // Đây là ví dụ cho trường hợp nếu bạn có bảng enrollments
    /*
    const sql = `
      SELECT c.* 
      FROM courses c
      JOIN enrollments e ON c.id = e.course_id
      WHERE e.student_id = ?
    `;
    return await query(sql, [userId]);
    */
    
    // Trả về danh sách khóa học từ dashboard_data (dummy data)
    return [
      {
        id: 1,
        title: 'JavaScript Fundamentals',
        description: 'Learn the basics of JavaScript programming',
        progress: 80,
        last_accessed: '2023-10-25 10:30:00'
      },
      {
        id: 2,
        title: 'React for Beginners',
        description: 'Introduction to React library and its concepts',
        progress: 45,
        last_accessed: '2023-10-26 14:15:00'
      }
    ];
  },
  
  // Lấy các hoạt động gần đây của student
  async getRecentActivities(userId) {
    // Ví dụ code lấy từ student_submissions và đưa vào cấu trúc activity
    const sql = `
      SELECT 
        'submission' as type,
        CONCAT('Submitted code for resource ', lr.title) as description,
        ss.submitted_at as timestamp
      FROM student_submissions ss
      JOIN learning_resources lr ON ss.resource_id = lr.id
      WHERE ss.student_id = ?
      ORDER BY ss.submitted_at DESC
      LIMIT 5
    `;
    
    return await query(sql, [userId]);
  }
};

module.exports = studentModel;