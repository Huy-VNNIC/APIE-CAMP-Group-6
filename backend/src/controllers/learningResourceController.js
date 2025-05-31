const LearningResource = require('../models/learningResourceModel');
const Enrollment = require('../models/enrollmentModel');

exports.getCourseResources = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;
    
    // Kiểm tra student đã đăng ký khóa học này chưa
    const isEnrolled = await Enrollment.isEnrolled(studentId, courseId);
    if (!isEnrolled) {
      return res.status(403).json({ message: 'Bạn chưa đăng ký khóa học này' });
    }
    
    // Lấy tất cả tài liệu học tập của khóa học
    const resources = await LearningResource.getResourcesByCourse(courseId);
    
    res.status(200).json({
      resources
    });
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.getResourceDetail = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const studentId = req.user.id;
    
    // Lấy chi tiết tài liệu
    const resource = await LearningResource.getResourceById(resourceId);
    
    if (!resource) {
      return res.status(404).json({ message: 'Không tìm thấy tài liệu học tập' });
    }
    
    // Kiểm tra student đã đăng ký khóa học chứa tài liệu này chưa
    const isEnrolled = await Enrollment.isEnrolled(studentId, resource.course_id);
    if (!isEnrolled) {
      return res.status(403).json({ message: 'Bạn chưa đăng ký khóa học chứa tài liệu này' });
    }
    
    res.status(200).json({
      resource
    });
  } catch (error) {
    console.error('Get resource error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
