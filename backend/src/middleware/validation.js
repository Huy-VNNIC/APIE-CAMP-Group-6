const { check, validationResult } = require('express-validator');

// Kiểm tra kết quả validation
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Validate đăng nhập
exports.validateLogin = [
  check('email')
    .not().isEmpty().withMessage('Email là bắt buộc')
    .isEmail().withMessage('Email không hợp lệ'),
  check('password')
    .not().isEmpty().withMessage('Mật khẩu là bắt buộc'),
  validate
];

// Validate đăng ký
exports.validateRegistration = [
  check('name')
    .not().isEmpty().withMessage('Tên là bắt buộc')
    .isLength({ min: 3 }).withMessage('Tên phải có ít nhất 3 ký tự'),
  check('email')
    .not().isEmpty().withMessage('Email là bắt buộc')
    .isEmail().withMessage('Email không hợp lệ'),
  check('password')
    .not().isEmpty().withMessage('Mật khẩu là bắt buộc')
    .isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  check('role')
    .optional()
    .isIn(['student', 'instructor']).withMessage('Role không hợp lệ'),
  validate
];