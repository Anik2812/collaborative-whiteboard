const express = require('express');
const { register, login } = require('../controllers/authController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify', auth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;