const CodeSubmission = require('../models/codeSubmissionModel');
const LearningResource = require('../models/learningResourceModel');
const Enrollment = require('../models/enrollmentModel');
const containerService = require('../services/containerService');

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
    
    // Xử lý code trong Docker container
    try {
      const containerInfo = await containerService.processCode(codeText, language);
      
      // Cập nhật submission với URL kết quả
      const result = {
        status: 'success',
        message: 'Code đã được xử lý thành công',
        url: containerInfo.url,
        containerId: containerInfo.id,
        expiresAt: new Date(containerInfo.expiresAt).toISOString()
      };
      
      await CodeSubmission.updateSubmissionResult(
        submission.submission_id,
        JSON.stringify(result),
        'graded'
      );
      
      res.status(201).json({
        message: 'Nộp và chạy code thành công',
        submission: {
          ...submission,
          result: result
        }
      });
    } catch (error) {
      // Xử lý lỗi khi chạy container
      const errorResult = {
        status: 'error',
        message: `Lỗi khi chạy code: ${error.message}`,
      };
      
      await CodeSubmission.updateSubmissionResult(
        submission.submission_id,
        JSON.stringify(errorResult),
        'error'
      );
      
      res.status(201).json({
        message: 'Nộp bài thành công nhưng có lỗi khi chạy code',
        submission: {
          ...submission,
          result: errorResult
        }
      });
    }
    
  } catch (error) {
    console.error('Code submission error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Lấy danh sách bài nộp của student
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

// Lấy chi tiết một bài nộp
exports.getSubmissionDetail = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const studentId = req.user.id;
    
    const submission = await CodeSubmission.getSubmissionById(submissionId, studentId);
    
    if (!submission) {
      return res.status(404).json({ message: 'Không tìm thấy bài nộp' });
    }
    
    // Kiểm tra nếu submission có URL container và container vẫn hoạt động
    if (submission.result) {
      try {
        const result = JSON.parse(submission.result);
        if (result.containerId) {
          const containerInfo = containerService.getContainerInfo(result.containerId);
          if (containerInfo) {
            result.url = containerInfo.url;
            result.expiresAt = new Date(containerInfo.expiresAt).toISOString();
            submission.result = JSON.stringify(result);
          }
        }
      } catch (e) {
        console.error('Error parsing submission result:', e);
      }
    }
    
    res.status(200).json({
      submission
    });
  } catch (error) {
    console.error('Get submission error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Kéo dài thời gian sống của container
exports.extendContainerLifetime = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const studentId = req.user.id;
    
    // Lấy thông tin submission
    const submission = await CodeSubmission.getSubmissionById(submissionId, studentId);
    
    if (!submission) {
      return res.status(404).json({ message: 'Không tìm thấy bài nộp' });
    }
    
    // Kiểm tra xem submission có container id không
    let containerId = null;
    try {
      const result = JSON.parse(submission.result);
      containerId = result.containerId;
    } catch (e) {
      return res.status(400).json({ message: 'Không thể kéo dài thời gian cho bài nộp này' });
    }
    
    if (!containerId) {
      return res.status(400).json({ message: 'Bài nộp này không có container đang chạy' });
    }
    
    // Kéo dài thời gian sống
    const updatedContainerInfo = containerService.extendContainerLifetime(containerId);
    
    if (!updatedContainerInfo) {
      return res.status(404).json({ message: 'Container đã hết hạn hoặc không còn tồn tại' });
    }
    
    // Cập nhật thông tin submission
    const updatedResult = {
      status: 'success',
      message: 'Code đã được xử lý thành công',
      url: updatedContainerInfo.url,
      containerId: updatedContainerInfo.id,
      expiresAt: new Date(updatedContainerInfo.expiresAt).toISOString()
    };
    
    await CodeSubmission.updateSubmissionResult(
      submission.submission_id,
      JSON.stringify(updatedResult),
      'graded'
    );
    
    res.status(200).json({
      message: 'Đã kéo dài thời gian container thành công',
      expiresAt: new Date(updatedContainerInfo.expiresAt).toISOString()
    });
    
  } catch (error) {
    console.error('Extend container lifetime error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Chạy lại code
exports.rerunCode = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const studentId = req.user.id;
    
    // Lấy thông tin submission
    const submission = await CodeSubmission.getSubmissionById(submissionId, studentId);
    
    if (!submission) {
      return res.status(404).json({ message: 'Không tìm thấy bài nộp' });
    }
    
    // Kiểm tra nếu submission có containerId, dọn dẹp container cũ
    try {
      const result = JSON.parse(submission.result);
      if (result.containerId) {
        await containerService.cleanupContainer(result.containerId);
      }
    } catch (e) {
      console.error('Error cleaning up old container:', e);
    }
    
    // Chạy lại code trong container mới
    try {
      const containerInfo = await containerService.processCode(
        submission.code_text, 
        submission.language
      );
      
      // Cập nhật submission với URL kết quả mới
      const result = {
        status: 'success',
        message: 'Code đã được chạy lại thành công',
        url: containerInfo.url,
        containerId: containerInfo.id,
        expiresAt: new Date(containerInfo.expiresAt).toISOString()
      };
      
      await CodeSubmission.updateSubmissionResult(
        submission.submission_id,
        JSON.stringify(result),
        'graded'
      );
      
      res.status(200).json({
        message: 'Chạy lại code thành công',
        result
      });
    } catch (error) {
      const errorResult = {
        status: 'error',
        message: `Lỗi khi chạy lại code: ${error.message}`,
      };
      
      await CodeSubmission.updateSubmissionResult(
        submission.submission_id,
        JSON.stringify(errorResult),
        'error'
      );
      
      res.status(400).json({
        message: 'Có lỗi khi chạy lại code',
        error: error.message
      });
    }
    
  } catch (error) {
    console.error('Rerun code error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Trực tiếp chạy code mà không cần tạo submission (đặc biệt hữu ích cho việc thử nghiệm)
exports.runCode = async (req, res) => {
  try {
    const { codeText, language } = req.body;
    
    if (!codeText || !language) {
      return res.status(400).json({ message: 'Vui lòng cung cấp cả mã và ngôn ngữ' });
    }
    
    const containerInfo = await containerService.processCode(codeText, language);
    
    res.status(200).json({
      message: 'Code đã được chạy thành công',
      url: containerInfo.url,
      containerId: containerInfo.id,
      expiresAt: new Date(containerInfo.expiresAt).toISOString()
    });
    
  } catch (error) {
    console.error('Run code error:', error);
    res.status(500).json({ message: 'Lỗi server khi chạy code', error: error.message });
  }
};