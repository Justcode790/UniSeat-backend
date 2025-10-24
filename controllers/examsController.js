const Exam = require('../models/Exam');

// @desc    Get all exams
// @route   GET /api/exams
// @access  Private
const getExams = async (req, res) => {
  try {
    const { branch, year } = req.query;
    let query = {};

    if (branch) query.branch = branch;
    if (year) query.year = parseInt(year);

    const exams = await Exam.find(query).sort({ date: -1 });
    
    res.json({
      success: true,
      count: exams.length,
      data: exams
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single exam
// @route   GET /api/exams/:id
// @access  Private
const getExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    res.json({
      success: true,
      data: exam
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new exam
// @route   POST /api/exams
// @access  Private (Admin only)
const createExam = async (req, res) => {
  try {
    const exam = await Exam.create(req.body);

    res.status(201).json({
      success: true,
      data: exam
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update exam
// @route   PUT /api/exams/:id
// @access  Private (Admin only)
const updateExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    res.json({
      success: true,
      data: exam
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete exam
// @route   DELETE /api/exams/:id
// @access  Private (Admin only)
const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    res.json({
      success: true,
      message: 'Exam deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getExams,
  getExam,
  createExam,
  updateExam,
  deleteExam
};
