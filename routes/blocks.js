const express = require('express');
const router = express.Router();
const {
  getBlocks,
  getBlock,
  createBlock,
  updateBlock,
  deleteBlock
} = require('../controllers/blocksController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// @route   GET /api/blocks
// @desc    Get all blocks
// @access  Private
router.get('/', authMiddleware, getBlocks);

// @route   GET /api/blocks/:id
// @desc    Get single block
// @access  Private
router.get('/:id', authMiddleware, getBlock);

// @route   POST /api/blocks
// @desc    Create new block
// @access  Private (Admin only)
router.post('/', authMiddleware, adminMiddleware, createBlock);

// @route   PUT /api/blocks/:id
// @desc    Update block
// @access  Private (Admin only)
router.put('/:id', authMiddleware, adminMiddleware, updateBlock);

// @route   DELETE /api/blocks/:id
// @desc    Delete block
// @access  Private (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, deleteBlock);

module.exports = router;
