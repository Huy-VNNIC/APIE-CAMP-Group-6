const db = require('../config/db');

module.exports = {
  // Tạo submission mới
  createSubmission: async (req, res) => {
    try {
      const { resourceId, code, language } = req.body;
      
      if (!resourceId || !code) {
        return res.status(400).json({
          success: false,
          message: 'Resource ID and code are required'
        });
      }
      
      // Kiểm tra resource có tồn tại không
      const resources = await db.query(
        'SELECT id, type FROM learning_resources WHERE id = ?',
        [resourceId]
      );
      
      if (resources.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
      }
      
      // Mô phỏng thực thi code
      const result = {
        output: 'Code executed successfully.',
        duration: '0.05s'
      };
      
      // Lưu submission
      const submissionResult = await db.query(
        `INSERT INTO student_submissions 
         (student_id, resource_id, code, result, status) 
         VALUES (?, ?, ?, ?, 'success')`,
        [req.user.id, resourceId, code, JSON.stringify(result)]
      );
      
      // Cập nhật trạng thái resource thành in_progress hoặc completed
      const submissionCount = await db.query(
        `SELECT COUNT(*) as count 
         FROM student_submissions 
         WHERE student_id = ? AND resource_id = ?`,
        [req.user.id, resourceId]
      );
      
      // Nếu có 3+ submission, đánh dấu là completed
      const newStatus = submissionCount[0].count >= 3 ? 'completed' : 'in_progress';
      
      await db.query(
        `INSERT INTO student_resources 
         (student_id, resource_id, status, last_accessed) 
         VALUES (?, ?, ?, NOW()) 
         ON DUPLICATE KEY UPDATE 
         status = IF(status = 'completed', 'completed', ?), 
         last_accessed = NOW()`,
        [req.user.id, resourceId, newStatus, newStatus]
      );
      
      // Cập nhật dashboard_data nếu status thay đổi
      if (newStatus === 'completed') {
        // Đếm số lượng resource đã hoàn thành
        const completedCount = await db.query(
          `SELECT COUNT(*) as count 
           FROM student_resources 
           WHERE student_id = ? AND status = 'completed'`,
          [req.user.id]
        );
        
        const totalResources = await db.query(
          `SELECT COUNT(*) as count FROM learning_resources`
        );
        
        // Lấy dashboard_data
        const students = await db.query(
          'SELECT dashboard_data FROM students WHERE user_id = ?',
          [req.user.id]
        );
        
        if (students.length > 0) {
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
          
          // Cập nhật dashboard_data
          const completed = completedCount[0].count;
          const total = totalResources[0].count || 1;
          
          dashboardData.completed_resources = completed;
          dashboardData.progress = Math.min(Math.round((completed / total) * 100), 100);
          dashboardData.points = dashboardData.points + 50; // Thêm 50 điểm cho mỗi resource hoàn thành
          dashboardData.level = Math.floor(dashboardData.points / 250) + 1;
          
          await db.query(
            'UPDATE students SET dashboard_data = ? WHERE user_id = ?',
            [JSON.stringify(dashboardData), req.user.id]
          );
        }
      }
      
      // Trả về kết quả
      return res.json({
        success: true,
        message: 'Submission created successfully',
        data: {
          id: submissionResult.insertId,
          resourceId,
          code,
          result,
          status: 'success',
          submitted_at: new Date()
        }
      });
    } catch (err) {
      console.error('Create submission error:', err);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while creating submission',
        error: err.message
      });
    }
  },
  
  // Lấy lịch sử submission cho một resource
  getSubmissionHistory: async (req, res) => {
    try {
      const resourceId = req.params.resourceId;
      
      // Lấy lịch sử submission
      const submissions = await db.query(
        `SELECT id, code, result, status, submitted_at
         FROM student_submissions
         WHERE student_id = ? AND resource_id = ?
         ORDER BY submitted_at DESC`,
        [req.user.id, resourceId]
      );
      
      // Trả về kết quả
      return res.json({
        success: true,
        data: submissions
      });
    } catch (err) {
      console.error('Get submission history error:', err);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while fetching submission history',
        error: err.message
      });
    }
  },
  
  // Lấy chi tiết submission
  getSubmissionDetail: async (req, res) => {
    try {
      const submissionId = req.params.id;
      
      // Lấy chi tiết submission
      const submissions = await db.query(
        `SELECT ss.*, lr.title as resource_title
         FROM student_submissions ss
         JOIN learning_resources lr ON ss.resource_id = lr.id
         WHERE ss.id = ? AND ss.student_id = ?`,
        [submissionId, req.user.id]
      );
      
      if (submissions.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Submission not found'
        });
      }
      
      // Trả về kết quả
      return res.json({
        success: true,
        data: submissions[0]
      });
    } catch (err) {
      console.error('Get submission detail error:', err);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while fetching submission detail',
        error: err.message
      });
    }
  }
};