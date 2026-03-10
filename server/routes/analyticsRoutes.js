const express = require('express');
const router = express.Router();
const { getDashboardStats, getWeakTopics, getProgress } = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

router.get('/dashboard', auth, getDashboardStats);
router.get('/weak-topics', auth, getWeakTopics);
router.get('/progress', auth, getProgress);

module.exports = router;
