const db = require('../config/db');
const generateCertificate = require('../utils/certificateGenerator');
const notificationController = require('./notificationController');

module.exports = {
  // Lấy danh sách chứng chỉ của người dùng
  getCertificates: async (req, res) => {
    try {
      const certificates = await db.query(
        'SELECT * FROM certificates WHERE student_id = ?',
        [req.user.id]
      );
      
      return res.json({
        success: true,
        data: certificates
      });
    } catch (err) {
      console.error('Get certificates error:', err);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while fetching certificates',
        error: err.message
      });
    }
  },
  
  // Tạo chứng chỉ mới
  createCertificate: async (req, res) => {
    try {
      const { title, description } = req.body;
      
      if (!title) {
        return res.status(400).json({
          success: false,
          message: 'Certificate title is required'
        });
      }
      
      // Lấy thông tin người dùng
      const users = await db.query(
        'SELECT name FROM users WHERE id = ?',
        [req.user.id]
      );
      
      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Tạo certificate ID
      const certificateId = `CERT-${req.user.id}-${Date.now()}`;
      
      // Tạo URL để xác minh certificate
      const verifyUrl = `https://yourdomain.com/verify-certificate/${certificateId}`;
      
      // Tạo chứng chỉ
      const certificateFileName = await generateCertificate({
        studentName: users[0].name,
        courseName: title,
        date: new Date().toLocaleDateString(),
        certificateId,
        verifyUrl
      });
      
      // Lưu thông tin chứng chỉ vào database
      const result = await db.query(
        'INSERT INTO certificates (student_id, title, description, certificate_url) VALUES (?, ?, ?, ?)',
        [req.user.id, title, description, `/certificates/${certificateFileName}`]
      );
      
      // Tạo thông báo cho người dùng
      await notificationController.createNotification(
        req.user.id,
        'Chứng chỉ mới',
        `Bạn đã nhận được chứng chỉ "${title}"`,
        'success'
      );
      
      return res.json({
        success: true,
        message: 'Certificate created successfully',
        data: {
          id: result.insertId,
          title,
          description,
          certificate_url: `/certificates/${certificateFileName}`
        }
      });
    } catch (err) {
      console.error('Create certificate error:', err);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while creating certificate',
        error: err.message
      });
    }
  }
};