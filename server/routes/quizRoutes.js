const express = require('express');
const router = express.Router();
const { generateQuiz, submitQuiz, getQuizHistory, getQuizById } = require('../controllers/quizController');
const auth = require('../middleware/auth');

router.post('/generate/:noteId', auth, generateQuiz);
router.post('/submit/:quizId', auth, submitQuiz);
router.get('/history', auth, getQuizHistory);
router.get('/:id', auth, getQuizById);

module.exports = router;
