const express = require('express');
const router = express.Router();
const {
  getFloorsByBlock,
  createFloor,
  updateFloor,
  deleteFloor
} = require('../controllers/floorsController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// @route   GET /api/blocks/:blockId/floors
// @desc    Get floors for a block
// @access  Private
router.get('/:blockId/floors', authMiddleware, getFloorsByBlock);

// @route   POST /api/blocks/:blockId/floors
// @desc    Create floor in block
// @access  Private (Admin only)
router.post('/:blockId/floors', authMiddleware, adminMiddleware, createFloor);

// @route   PUT /api/floors/:id
// @desc    Update floor
// @access  Private (Admin only)
router.put('/floors/:id', authMiddleware, adminMiddleware, updateFloor);

// @route   DELETE /api/floors/:id
// @desc    Delete floor
// @access  Private (Admin only)
router.delete('/floors/:id', authMiddleware, adminMiddleware, deleteFloor);

module.exports = router;
