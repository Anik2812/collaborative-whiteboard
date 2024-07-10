const express = require('express');
const { getWhiteboard, createWhiteboard, getAllWhiteboards } = require('../controllers/whiteboardController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    console.log('User in whiteboard route:', req.user);
    const whiteboards = await getAllWhiteboards(req.user.id);
    res.json(whiteboards);
  } catch (error) {
    console.error('Error in getAllWhiteboards:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', auth, getWhiteboard);
router.post('/', auth, createWhiteboard);

module.exports = router;