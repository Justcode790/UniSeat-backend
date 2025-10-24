const express = require('express');
const router = express.Router();
const {
  generateSeatPlanForExam,
  getSeatPlan,
  deleteSeatPlan
} = require('../controllers/seatPlansController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// @route   POST /api/exams/:examId/generate-seatplan
// @desc    Generate seat plan for exam
// @access  Private (Admin only)
router.post('/:examId/generate-seatplan', authMiddleware, adminMiddleware, generateSeatPlanForExam);

// @route   GET /api/exams/:examId/seatplan
// @desc    Get seat plan for exam
// @access  Private
router.get('/:examId/seatplan', authMiddleware, getSeatPlan);

// @route   DELETE /api/exams/:examId/seatplan
// @desc    Delete seat plan
// @access  Private (Admin only)
router.delete('/:examId/seatplan', authMiddleware, adminMiddleware, deleteSeatPlan);

module.exports = router;
