const mongoose = require('mongoose');

const whiteboardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  data: [{ type: Object }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Whiteboard', whiteboardSchema);