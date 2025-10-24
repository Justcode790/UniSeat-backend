const Floor = require('../models/Floor');
const Block = require('../models/Block');

// @desc    Get floors for a block
// @route   GET /api/blocks/:blockId/floors
// @access  Private
const getFloorsByBlock = async (req, res) => {
  try {
    const floors = await Floor.find({ block: req.params.blockId }).sort({ number: 1 });
    res.json({
      success: true,
      count: floors.length,
      data: floors
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create floor in block
// @route   POST /api/blocks/:blockId/floors
// @access  Private (Admin only)
const createFloor = async (req, res) => {
  try {
    const { number, totalClassrooms } = req.body;
    const blockId = req.params.blockId;
    console.log("create floor is working from backend");
    // Check if block exists
    const block = await Block.findById(blockId);
    if (!block) {
      return res.status(404).json({ message: 'Block not found' });
    }

    // Check if floor number exceeds block's total floors
    if (number > block.totalFloors) {
      return res.status(400).json({ 
        message: `Floor number cannot exceed block's total floors (${block.totalFloors})` 
      });
    }

    const floor = await Floor.create({
      block: blockId,
      number,
      totalClassrooms
    });

    res.status(201).json({
      success: true,
      data: floor
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update floor
// @route   PUT /api/floors/:id
// @access  Private (Admin only)
const updateFloor = async (req, res) => {
  try {
    const floor = await Floor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!floor) {
      return res.status(404).json({ message: 'Floor not found' });
    }

    res.json({
      success: true,
      data: floor
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete floor
// @route   DELETE /api/floors/:id
// @access  Private (Admin only)
const deleteFloor = async (req, res) => {
  try {
    const floor = await Floor.findByIdAndDelete(req.params.id);

    if (!floor) {
      return res.status(404).json({ message: 'Floor not found' });
    }

    res.json({
      success: true,
      message: 'Floor deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getFloorsByBlock,
  createFloor,
  updateFloor,
  deleteFloor
};
