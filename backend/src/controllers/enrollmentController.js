const Enrollment = require('../models/enrollmentModel');
const Course = require('../models/courseModel');

exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;
    
    // Kiểm tra khóa học tồn tại
    const course = await Course.getCourseById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Không tìm thấy khóa học' });
    }
    
    // Kiểm tra student đã đăng ký khóa học này chưa
    const isAlreadyEnrolled = await Enrollment.isEnrolled(studentId, courseId);
    if (isAlreadyEnrolled) {
      return res.status(400).json({ message: 'Bạn đã đăng ký khóa học này rồi' });
    }
    
    // Đăng ký khóa học
    const enrollment = await Enrollment.enroll(studentId, courseId);
    
    res.status(201).json({
      message: 'Đăng ký khóa học thành công',
      enrollment
    });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({ message: 'Lỗi server khi đăng ký khóa học', error: error.message });
  }
};

exports.getMyEnrollments = async (req, res) => {
  try {
    const studentId = req.user.id;
    const enrollments = await Enrollment.getEnrollmentsByStudent(studentId);
    
    res.status(200).json({
      enrollments
    });
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.getMyCoursesWithDetails = async (req, res) => {
  try {
    const studentId = req.user.id;
    const courses = await Course.getCoursesForStudent(studentId);
    
    res.status(200).json({
      courses
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.getAvailableCourses = async (req, res) => {
  try {
    const studentId = req.user.id;
    const availableCourses = await Course.getAvailableCoursesForStudent(studentId);
    
    res.status(200).json({
      availableCourses
    });
  } catch (error) {
    console.error('Get available courses error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.updateEnrollmentStatus = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { completed } = req.body;
    const studentId = req.user.id;
    
    if (completed === undefined) {
      return res.status(400).json({ message: 'Cần cung cấp trạng thái completed' });
    }
    
    const enrollment = await Enrollment.updateCompletionStatus(enrollmentId, studentId, completed);
    
    if (!enrollment) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin đăng ký' });
    }
    
    res.status(200).json({
      message: 'Cập nhật trạng thái thành công',
      enrollment
    });
  } catch (error) {
    console.error('Update enrollment error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.unenrollCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;
    
    const enrollment = await Enrollment.unenroll(studentId, courseId);
    
    if (!enrollment) {
      return res.status(404).json({ message: 'Bạn chưa đăng ký khóa học này' });
    }
    
    res.status(200).json({
      message: 'Hủy đăng ký khóa học thành công'
    });
  } catch (error) {
    console.error('Unenroll error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
