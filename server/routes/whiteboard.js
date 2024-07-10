const express = require('express');
const { getWhiteboard, createWhiteboard, getAllWhiteboards } = require('../controllers/whiteboardController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/', auth, getAllWhiteboards);
router.get('/:id', auth, getWhiteboard);
router.post('/', auth, createWhiteboard);

module.exports = router;