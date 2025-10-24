const mongoose = require('mongoose');

const floorSchema = new mongoose.Schema({
  block: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Block',
    required: true
  },
  number: {
    type: Number,
    required: true,
    min: 0
  },
  totalClassrooms: {
    type: Number,
    required: true,
    min: 1
  }
}, {
  timestamps: true
});

// Ensure unique floor number per block
floorSchema.index({ block: 1, number: 1 }, { unique: true });

module.exports = mongoose.model('Floor', floorSchema);
