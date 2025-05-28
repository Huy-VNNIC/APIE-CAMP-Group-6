const db = require('../config/db');

module.exports = {
  // Lấy danh sách tài liệu học tập
  getResources: async (req, res) => {
    try {
      // Lấy tất cả resources và trạng thái học tập của học sinh
      const resources = await db.query(
        `SELECT lr.id, lr.title, lr.type, lr.language, lr.url, lr.created_at,
         sr.status, sr.last_accessed
         FROM learning_resources lr
         LEFT JOIN student_resources sr ON lr.id = sr.resource_id AND sr.student_id = ?
         ORDER BY lr.created_at DESC`,
        [req.user.id]
      );
      
      // Trả về kết quả
      return res.json({
        success: true,
        data: resources
      });
    } catch (err) {
      console.error('Get resources error:', err);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while fetching resources',
        error: err.message
      });
    }
  },
  
  // Lấy chi tiết tài liệu học tập
  getResourceDetail: async (req, res) => {
    try {
      const resourceId = req.params.id;
      
      // Lấy thông tin chi tiết của resource
      const resources = await db.query(
        `SELECT lr.*, u.name as created_by_name
         FROM learning_resources lr
         LEFT JOIN users u ON lr.created_by = u.id
         WHERE lr.id = ?`,
        [resourceId]
      );
      
      if (resources.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
      }
      
      const resource = resources[0];
      
      // Lấy trạng thái học tập của học sinh
      const studyStatus = await db.query(
        `SELECT sr.status, sr.last_accessed
         FROM student_resources sr
         WHERE sr.student_id = ? AND sr.resource_id = ?`,
        [req.user.id, resourceId]
      );
      
      // Cập nhật trạng thái viewed nếu chưa có bản ghi nào
      if (studyStatus.length === 0) {
        await db.query(
          `INSERT INTO student_resources (student_id, resource_id, status, last_accessed)
           VALUES (?, ?, 'viewed', NOW())`,
          [req.user.id, resourceId]
        );
      } else {
        // Cập nhật thời gian truy cập
        await db.query(
          `UPDATE student_resources
           SET last_accessed = NOW()
           WHERE student_id = ? AND resource_id = ?`,
          [req.user.id, resourceId]
        );
      }
      
      // Thêm trạng thái học tập vào kết quả
      resource.study_status = studyStatus.length > 0 ? studyStatus[0].status : 'viewed';
      resource.last_accessed = studyStatus.length > 0 ? studyStatus[0].last_accessed : new Date();
      
      // Trả về kết quả
      return res.json({
        success: true,
        data: resource
      });
    } catch (err) {
      console.error('Get resource detail error:', err);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while fetching resource detail',
        error: err.message
      });
    }
  }
};