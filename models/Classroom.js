const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
  floor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Floor',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  layoutType: {
    type: String,
    enum: ['standard', 'theater', 'lab', 'seminar'],
    default: 'standard'
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance'],
    default: 'available'
  }
}, {
  timestamps: true
});

// Ensure unique classroom name per floor
classroomSchema.index({ floor: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Classroom', classroomSchema);
