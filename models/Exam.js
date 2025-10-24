const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  branch: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  },
  config: {
    seatingRules: {
      avoidAdjacentSameBranch: {
        type: Boolean,
        default: true
      },
      maxStudentsPerClassroom: {
        type: Number,
        default: 50
      }
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Exam', examSchema);
