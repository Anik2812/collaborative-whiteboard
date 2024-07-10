const Whiteboard = require('../models/Whiteboard');

exports.getAllWhiteboards = async (userId) => {
  try {
    const whiteboards = await Whiteboard.find({ user: userId });
    return whiteboards;
  } catch (error) {
    console.error('Error in getAllWhiteboards controller:', error);
    throw error;
  }
};

exports.getWhiteboard = async (req, res) => {
  console.log('Request received at /api/whiteboard/:id:', req.params.id, req.user);  // Log request params and user
  try {
    const whiteboard = await Whiteboard.findById(req.params.id);
    if (!whiteboard) {
      return res.status(404).json({ message: 'Whiteboard not found' });
    }
    res.json(whiteboard);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching whiteboard' });
  }
};

exports.createWhiteboard = async (req, res) => {
  console.log('Request received at /api/whiteboard [POST]:', req.body, req.user);  // Log request body and user
  try {
    const { name } = req.body;
    const whiteboard = new Whiteboard({
      name,
      user: req.user.id,
      data: []
    });
    await whiteboard.save();
    res.status(201).json(whiteboard);
  } catch (error) {
    res.status(500).json({ message: 'Error creating whiteboard' });
  }
};

exports.saveWhiteboardData = async (roomId, data) => {
  try {
    await Whiteboard.findByIdAndUpdate(roomId, {
      $push: { data: data }
    });
  } catch (error) {
    console.error('Error saving whiteboard data:', error);
  }
};
