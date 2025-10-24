const Classroom = require('../models/Classroom');
const Floor = require('../models/Floor');

// @desc    Get all classrooms
// @route   GET /api/classrooms
// @access  Private
const getClassrooms = async (req, res) => {
  try {
    const classrooms = await Classroom.find()
      .populate('floor', 'number block')
      .populate({
        path: 'floor',
        populate: {
          path: 'block',
          select: 'name'
        }
      })
      .sort({ 'floor.block.name': 1, 'floor.number': 1, name: 1 });

    res.json({
      success: true,
      count: classrooms.length,
      data: classrooms
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single classroom
// @route   GET /api/classrooms/:id
// @access  Private
const getClassroom = async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id)
      .populate('floor', 'number block')
      .populate({
        path: 'floor',
        populate: {
          path: 'block',
          select: 'name'
        }
      });

    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    res.json({
      success: true,
      data: classroom
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new classroom
// @route   POST /api/classrooms
// @access  Private (Admin only)
const createClassroom = async (req, res) => {
  try {
    const { floor, name, capacity, layoutType, status } = req.body;

    // Check if floor exists
    const floorDoc = await Floor.findById(floor);
    if (!floorDoc) {
      return res.status(404).json({ message: 'Floor not found' });
    }

    const classroom = await Classroom.create({
      floor,
      name,
      capacity,
      layoutType,
      status
    });

    res.status(201).json({
      success: true,
      data: classroom
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update classroom
// @route   PUT /api/classrooms/:id
// @access  Private (Admin only)
const updateClassroom = async (req, res) => {
  try {
    const classroom = await Classroom.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    res.json({
      success: true,
      data: classroom
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete classroom
// @route   DELETE /api/classrooms/:id
// @access  Private (Admin only)
const deleteClassroom = async (req, res) => {
  try {
    const classroom = await Classroom.findByIdAndDelete(req.params.id);

    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    res.json({
      success: true,
      message: 'Classroom deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getClassrooms,
  getClassroom,
  createClassroom,
  updateClassroom,
  deleteClassroom
};
