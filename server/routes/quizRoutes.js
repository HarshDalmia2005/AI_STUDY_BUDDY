const express = require('express');
const router = express.Router();
const { generateQuiz, submitQuiz, getQuizHistory, getQuizById } = require('../controllers/quizController');

router.post('/generate/:noteId', generateQuiz);
router.post('/submit/:quizId', submitQuiz);
router.get('/history', getQuizHistory);
router.get('/:id', getQuizById);

module.exports = router;
