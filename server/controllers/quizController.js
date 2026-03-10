const Quiz = require('../models/Quiz');
const Note = require('../models/Note');
const WeakTopic = require('../models/WeakTopic');
const { generateQuiz: generateQuizService } = require('../services/quizService');

exports.generateQuiz = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.noteId, userId: req.userId });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const questions = await generateQuizService(note.extractedText, 5);

    const quiz = await Quiz.create({
      userId: req.userId,
      noteId: note._id,
      questions: questions.map(q => ({
        type: q.type,
        question: q.question,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || '',
        userAnswer: '',
        isCorrect: false
      })),
      totalQuestions: questions.length,
      completed: false
    });

    res.status(201).json({ quiz });
  } catch (error) {
    res.status(500).json({ message: 'Error generating quiz', error: error.message });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.quizId, userId: req.userId });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const { answers } = req.body; 
    let score = 0;

    answers.forEach(({ questionIndex, answer }) => {
      if (quiz.questions[questionIndex]) {
        quiz.questions[questionIndex].userAnswer = answer;
        const isCorrect = answer.toLowerCase().trim() === quiz.questions[questionIndex].correctAnswer.toLowerCase().trim();
        quiz.questions[questionIndex].isCorrect = isCorrect;
        if (isCorrect) score++;
      }
    });

    quiz.score = score;
    quiz.completed = true;
    await quiz.save();

    
    const note = await Note.findById(quiz.noteId);
    if (note && note.keyConcepts.length > 0) {
      const accuracy = (score / quiz.totalQuestions) * 100;
      for (const topic of note.keyConcepts) {
        await WeakTopic.findOneAndUpdate(
          { userId: req.userId, topic },
          {
            $inc: { totalAttempts: 1, correctAttempts: accuracy >= 60 ? 1 : 0 },
            $set: {
              lastAttempted: new Date(),
              recommendedRevision: accuracy < 60
                ? `Review ${topic} — your quiz score was ${accuracy.toFixed(0)}%`
                : `Good progress on ${topic}! Keep practicing.`
            }
          },
          { upsert: true, new: true }
        );
      }

      
      const weakTopics = await WeakTopic.find({ userId: req.userId });
      for (const wt of weakTopics) {
        wt.accuracy = wt.totalAttempts > 0
          ? Math.round((wt.correctAttempts / wt.totalAttempts) * 100)
          : 0;
        await wt.save();
      }
    }

    res.json({ quiz, score, total: quiz.totalQuestions });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting quiz', error: error.message });
  }
};

exports.getQuizHistory = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ userId: req.userId })
      .populate('noteId', 'title')
      .sort({ createdAt: -1 });

    res.json({ quizzes });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.id, userId: req.userId })
      .populate('noteId', 'title extractedText');

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json({ quiz });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
