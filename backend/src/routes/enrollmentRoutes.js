const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const authMiddleware = require('../middleware/authMiddleware');

// Áp dụng middleware xác thực cho tất cả các routes
router.use(authMiddleware.protect);
// Bỏ dòng gây lỗi: router.use(authMiddleware.restrictTo('student'));

// Các routes cho enrollment
router.post('/', enrollmentController.createEnrollment);
router.get('/', enrollmentController.getEnrollments);
router.get('/:id', enrollmentController.getEnrollment);
router.put('/:id', enrollmentController.updateEnrollment);
router.delete('/:id', enrollmentController.deleteEnrollment);

module.exports = router;
