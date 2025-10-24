const SeatPlan = require('../models/SeatPlan');
const Exam = require('../models/Exam');
const Student = require('../models/Student');
const Classroom = require('../models/Classroom');
const generateSeatPlan = require('../utils/seatGenerator');

// @desc    Generate seat plan for exam
// @route   POST /api/exams/:examId/generate-seatplan
// @access  Private (Admin only)
const generateSeatPlanForExam = async (req, res) => {
  try {
    const examId = req.params.examId;

    // Check if exam exists
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Check if seat plan already exists
    const existingSeatPlan = await SeatPlan.findOne({ exam: examId });
    if (existingSeatPlan) {
      return res.status(400).json({ 
        message: 'Seat plan already exists for this exam',
        data: existingSeatPlan
      });
    }

    // Get students for the exam
    const students = await Student.find({ 
      branch: exam.branch, 
      year: exam.year 
    }).sort({ branch: 1, regNumber: 1 });

    if (students.length === 0) {
      return res.status(400).json({ message: 'No students found for this exam' });
    }

    // Get available classrooms
    const classrooms = await Classroom.find({ 
      status: 'available' 
    }).populate('floor', 'number block').populate({
      path: 'floor',
      populate: {
        path: 'block',
        select: 'name'
      }
    });

    if (classrooms.length === 0) {
      return res.status(400).json({ message: 'No available classrooms found' });
    }

    // Generate seat plan
    const assignments = generateSeatPlan(exam, students, classrooms);

    // Create seat plan document
    const seatPlan = await SeatPlan.create({
      exam: examId,
      assignments
    });

    res.status(201).json({
      success: true,
      message: 'Seat plan generated successfully',
      data: seatPlan
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get seat plan for exam
// @route   GET /api/exams/:examId/seatplan
// @access  Private
const getSeatPlan = async (req, res) => {
  try {
    const examId = req.params.examId;

    const seatPlan = await SeatPlan.findOne({ exam: examId })
      .populate('exam', 'name date subject branch year')
      .populate('assignments.student', 'name regNumber branch year section')
      .populate('assignments.block', 'name location')
      .populate('assignments.floor', 'number')
      .populate('assignments.classroom', 'name capacity layoutType');

    if (!seatPlan) {
      return res.status(404).json({ message: 'Seat plan not found for this exam' });
    }

    res.json({
      success: true,
      data: seatPlan
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete seat plan
// @route   DELETE /api/exams/:examId/seatplan
// @access  Private (Admin only)
const deleteSeatPlan = async (req, res) => {
  try {
    const examId = req.params.examId;

    const seatPlan = await SeatPlan.findOneAndDelete({ exam: examId });

    if (!seatPlan) {
      return res.status(404).json({ message: 'Seat plan not found' });
    }

    res.json({
      success: true,
      message: 'Seat plan deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  generateSeatPlanForExam,
  getSeatPlan,
  deleteSeatPlan
};
