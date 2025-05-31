const express = require('express');
const enrollmentController = require('../controllers/enrollmentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Yêu cầu đăng nhập và phải là student
router.use(authMiddleware.protect, authMiddleware.restrictTo('student'));

// Lấy danh sách khóa học đã đăng ký
router.get('/my-courses', enrollmentController.getMyCoursesWithDetails);

// Lấy danh sách khóa học chưa đăng ký
router.get('/available-courses', enrollmentController.getAvailableCourses);

// Đăng ký khóa học
router.post('/courses/:courseId/enroll', enrollmentController.enrollCourse);

// Cập nhật trạng thái hoàn thành
router.patch('/enrollments/:enrollmentId', enrollmentController.updateEnrollmentStatus);

// Hủy đăng ký khóa học
router.delete('/courses/:courseId/unenroll', enrollmentController.unenrollCourse);

module.exports = router;
