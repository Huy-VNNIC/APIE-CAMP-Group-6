const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth');

// Register route
router.post('/register', [
  check('username', 'Username is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  check('fullName', 'Full name is required').not().isEmpty()
], authController.register);

// Login route
router.post('/login', [
  check('username', 'Username is required').not().isEmpty(),
  check('password', 'Password is required').exists()
], authController.login);

// Get current user route (protected)
router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;
