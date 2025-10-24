const express = require('express');
const router = express.Router();
const {
  login,
  register,
  getMe
} = require('../controllers/authController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', login);

// @route   POST /api/auth/register
// @desc    Register user
// @access  Private (Admin only)
router.post('/register', authMiddleware, adminMiddleware, register);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authMiddleware, getMe);

module.exports = router;
