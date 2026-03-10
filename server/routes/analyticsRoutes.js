const express = require('express');
const router = express.Router();
const { getDashboardStats, getWeakTopics, getProgress } = require('../controllers/analyticsController');

router.get('/dashboard', getDashboardStats);
router.get('/weak-topics', getWeakTopics);
router.get('/progress', getProgress);

module.exports = router;
