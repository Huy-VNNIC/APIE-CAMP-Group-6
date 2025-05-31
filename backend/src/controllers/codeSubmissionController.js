const CodeSubmission = require('../models/codeSubmissionModel');
const LearningResource = require('../models/learningResourceModel');
const Enrollment = require('../models/enrollmentModel');
const axios = require('axios');

exports.submitCode = async (req, res) => {
  try {
    const { resourceId, courseId, codeText, language } = req.body;
    const studentId = req.user.id;
    
    // Kiểm tra các trường bắt buộc
    if (!resourceId || !courseId || !codeText || !language) {
      return res.status(400).json({ message: 'Thiếu thông tin bài nộp' });
    }
    
    // Kiểm tra student đã đăng ký khóa học này chưa
    const isEnrolled = await Enrollment.isEnrolled(studentId, courseId);
    if (!isEnrolled) {
      return res.status(403).json({ message: 'Bạn chưa đăng ký khóa học này' });
    }
    
    // Kiểm tra resource có tồn tại không và có thuộc khóa học này không
    const resource = await LearningResource.getResourceById(resourceId);
    if (!resource) {
      return res.status(404).json({ message: 'Không tìm thấy tài nguyên học tập' });
    }
    if (resource.course_id.toString() !== courseId.toString()) {
      return res.status(400).json({ message: 'Tài nguyên không thuộc khóa học này' });
    }
    
    // Tạo bài nộp
    const submission = await CodeSubmission.createSubmission({
      studentId,
      courseId,
      resourceId,
      codeText,
      language
    });
    
    // TODO: Thực hiện đánh giá code (có thể sử dụng API OpenAI)
    // Giả lập kết quả kiểm tra code
    setTimeout(async () => {
      try {
        const result = {
          status: 'success',
          output: 'Hello, World!',
          feedback: 'Code đã được thực thi thành công.'
        };
        await CodeSubmission.updateSubmissionResult(
          submission.submission_id, 
          JSON.stringify(result), 
          'graded'
        );
      } catch (error) {
        console.error('Error updating submission result:', error);
      }
    }, 2000);
    
    res.status(201).json({
      message: 'Nộp bài thành công, đang xử lý code...',
      submission
    });
  } catch (error) {
    console.error('Code submission error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.getMySubmissions = async (req, res) => {
  try {
    const studentId = req.user.id;
    const submissions = await CodeSubmission.getSubmissionsByStudent(studentId);
    
    res.status(200).json({
      submissions
    });
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.getSubmissionDetail = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const studentId = req.user.id;
    
    const submission = await CodeSubmission.getSubmissionById(submissionId, studentId);
    
    if (!submission) {
      return res.status(404).json({ message: 'Không tìm thấy bài nộp' });
    }
    
    res.status(200).json({
      submission
    });
  } catch (error) {
    console.error('Get submission error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
