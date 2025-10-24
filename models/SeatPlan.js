const mongoose = require('mongoose');

const seatPlanSchema = new mongoose.Schema({
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  assignments: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    block: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Block',
      required: true
    },
    floor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Floor',
      required: true
    },
    classroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Classroom',
      required: true
    },
    seatNumber: {
      type: Number,
      required: true
    },
    row: {
      type: Number,
      required: true
    },
    col: {
      type: Number,
      required: true
    }
  }]
}, {
  timestamps: true
});

// Ensure one seat plan per exam
seatPlanSchema.index({ exam: 1 }, { unique: true });

module.exports = mongoose.model('SeatPlan', seatPlanSchema);
