const Whiteboard = require('../models/Whiteboard');

exports.getAllWhiteboards = async (req, res) => {
  try {
    const whiteboards = await Whiteboard.find({ user: req.user.id });
    res.json(whiteboards);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching whiteboards' });
  }
};

exports.getWhiteboard = async (req, res) => {
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