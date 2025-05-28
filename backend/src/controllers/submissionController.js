const submissionModel = require('../models/submissionModel');
const codeRunner = require('../utils/codeRunner');

const submissionController = {
  // Tạo submission mới
  async createSubmission(req, res) {
    try {
      const { resourceId, code } = req.body;
      const studentId = req.user.id;
      
      // Tạo submission với trạng thái pending
      const submission = await submissionModel.create(studentId, resourceId, code);
      
      // Chạy code và lấy kết quả
      const result = await codeRunner.runCode(code);
      
      // Cập nhật kết quả submission
      const status = result.success ? 'success' : 'failed';
      await submissionModel.updateResult(submission.id, JSON.stringify(result), status);
      
      res.status(201).json({
        success: true,
        data: {
          id: submission.id,
          result,
          status
        }
      });
    } catch (err) {
      console.error('Create submission error:', err);
      res.status(500).json({
        success: false,
        msg: 'Server error'
      });
    }
  },
  
  // Lấy lịch sử submissions
  async getSubmissions(req, res) {
    try {
      const studentId = req.user.id;
      const submissions = await submissionModel.getSubmissionsByStudent(studentId);
      
      res.json({
        success: true,
        data: submissions
      });
    } catch (err) {
      console.error('Get submissions error:', err);
      res.status(500).json({
        success: false,
        msg: 'Server error'
      });
    }
  },
  
  // Lấy chi tiết một submission
  async getSubmissionById(req, res) {
    try {
      const submissionId = req.params.id;
      const submission = await submissionModel.getSubmissionById(submissionId);
      
      if (!submission) {
        return res.status(404).json({
          success: false,
          msg: 'Submission not found'
        });
      }
      
      // Kiểm tra xem submission có phải của student này không
      if (submission.student_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          msg: 'Not authorized to view this submission'
        });
      }
      
      res.json({
        success: true,
        data: submission
      });
    } catch (err) {
      console.error('Get submission error:', err);
      res.status(500).json({
        success: false,
        msg: 'Server error'
      });
    }
  }
};

module.exports = submissionController;