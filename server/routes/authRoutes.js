const express = require('express');
const router = express.Router();
const { signup, login, getProfile, forgotPassword } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', auth, getProfile);
router.post('/forgot-password', forgotPassword);

module.exports = router;
