const Block = require('../models/Block');

// @desc    Get all blocks
// @route   GET /api/blocks
// @access  Private
const getBlocks = async (req, res) => {
  try {
    const blocks = await Block.find().sort({ name: 1 });
    res.json({
      success: true,
      count: blocks.length,
      data: blocks
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single block
// @route   GET /api/blocks/:id
// @access  Private
const getBlock = async (req, res) => {
  try {
    const block = await Block.findById(req.params.id);
    console.log(block);
    
    if (!block) {
      return res.status(404).json({ message: 'Block not found' });
    }

    res.json({
      success: true,
      data: block
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new block
// @route   POST /api/blocks
// @access  Private (Admin only)
const createBlock = async (req, res) => {
  try {
    const { name, location, totalFloors } = req.body;

    const block = await Block.create({
      name,
      location,
      totalFloors
    });

    res.status(201).json({
      success: true,
      data: block
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update block
// @route   PUT /api/blocks/:id
// @access  Private (Admin only)
const updateBlock = async (req, res) => {
  try {
    const block = await Block.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!block) {
      return res.status(404).json({ message: 'Block not found' });
    }

    res.json({
      success: true,
      data: block
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete block
// @route   DELETE /api/blocks/:id
// @access  Private (Admin only)
const deleteBlock = async (req, res) => {
  try {
    const block = await Block.findByIdAndDelete(req.params.id);

    if (!block) {
      return res.status(404).json({ message: 'Block not found' });
    }

    res.json({
      success: true,
      message: 'Block deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getBlocks,
  getBlock,
  createBlock,
  updateBlock,
  deleteBlock
};
