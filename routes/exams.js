const express = require('express');
const router = express.Router();
const {
  getExams,
  getExam,
  createExam,
  updateExam,
  deleteExam
} = require('../controllers/examsController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// @route   GET /api/exams
// @desc    Get all exams
// @access  Private
router.get('/', authMiddleware, getExams);

// @route   GET /api/exams/:id
// @desc    Get single exam
// @access  Private
router.get('/:id', authMiddleware, getExam);

// @route   POST /api/exams
// @desc    Create new exam
// @access  Private (Admin only)
router.post('/', authMiddleware, adminMiddleware, createExam);

// @route   PUT /api/exams/:id
// @desc    Update exam
// @access  Private (Admin only)
router.put('/:id', authMiddleware, adminMiddleware, updateExam);

// @route   DELETE /api/exams/:id
// @desc    Delete exam
// @access  Private (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, deleteExam);

module.exports = router;
