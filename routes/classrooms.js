const express = require('express');
const router = express.Router();
const {
  getClassrooms,
  getClassroom,
  createClassroom,
  updateClassroom,
  deleteClassroom
} = require('../controllers/classroomsController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// @route   GET /api/classrooms
// @desc    Get all classrooms
// @access  Private
router.get('/', authMiddleware, getClassrooms);

// @route   GET /api/classrooms/:id
// @desc    Get single classroom
// @access  Private
router.get('/:id', authMiddleware, getClassroom);

// @route   POST /api/classrooms
// @desc    Create new classroom
// @access  Private (Admin only)
router.post('/', authMiddleware, adminMiddleware, createClassroom);

// @route   PUT /api/classrooms/:id
// @desc    Update classroom
// @access  Private (Admin only)
router.put('/:id', authMiddleware, adminMiddleware, updateClassroom);

// @route   DELETE /api/classrooms/:id
// @desc    Delete classroom
// @access  Private (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, deleteClassroom);

module.exports = router;
