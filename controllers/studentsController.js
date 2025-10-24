const Student = require('../models/Student');
const csv = require('csv-parser');
const fs = require('fs');

// @desc    Get all students
// @route   GET /api/students
// @access  Private
const getStudents = async (req, res) => {
  try {
    const { branch, year, section } = req.query;
    let query = {};

    if (branch) query.branch = branch;
    if (year) query.year = parseInt(year);
    if (section) query.section = section;

    const students = await Student.find(query).sort({ branch: 1, year: 1, regNumber: 1 });
    
    res.json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private
const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new student or upload CSV
// @route   POST /api/students
// @access  Private (Admin only)
const createStudent = async (req, res) => {
  try {
    // If CSV file is uploaded
    if (req.file) {
      const students = [];
      const errors = [];

      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (row) => {
          students.push({
            name: row.name || row.Name,
            regNumber: row.regNumber || row.RegNumber || row.reg_number,
            branch: row.branch || row.Branch,
            year: parseInt(row.year || row.Year),
            section: row.section || row.Section,
            email: row.email || row.Email
          });
        })
        .on('end', async () => {
          try {
            const createdStudents = [];
            for (const studentData of students) {
              try {
                const student = await Student.create(studentData);
                createdStudents.push(student);
              } catch (error) {
                errors.push({
                  data: studentData,
                  error: error.message
                });
              }
            }

            // Clean up uploaded file
            fs.unlinkSync(req.file.path);

            res.status(201).json({
              success: true,
              count: createdStudents.length,
              data: createdStudents,
              errors: errors.length > 0 ? errors : undefined
            });
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error processing CSV data' });
          }
        })
        .on('error', (error) => {
          console.error(error);
          res.status(500).json({ message: 'Error reading CSV file' });
        });
    } else {
      // Single student creation
      const student = await Student.create(req.body);
      res.status(201).json({
        success: true,
        data: student
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private (Admin only)
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private (Admin only)
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent
};
