const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/studentsController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Configure multer for CSV upload
const upload = multer({ dest: 'uploads/' });

// @route   GET /api/students
// @desc    Get all students
// @access  Private
router.get('/', authMiddleware, getStudents);

// @route   GET /api/students/:id
// @desc    Get single student
// @access  Private
router.get('/:id', authMiddleware, getStudent);

// @route   POST /api/students
// @desc    Create new student or upload CSV
// @access  Private (Admin only)
router.post('/', authMiddleware, adminMiddleware, upload.single('file'), createStudent);

// @route   PUT /api/students/:id
// @desc    Update student
// @access  Private (Admin only)
router.put('/:id', authMiddleware, adminMiddleware, updateStudent);

// @route   DELETE /api/students/:id
// @desc    Delete student
// @access  Private (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, deleteStudent);

module.exports = router;
