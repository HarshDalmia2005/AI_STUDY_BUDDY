const Note = require('../models/Note');
const Quiz = require('../models/Quiz');
const WeakTopic = require('../models/WeakTopic');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalNotes = await Note.countDocuments({});
    const quizzes = await Quiz.find({ completed: true });
    const totalQuizzes = quizzes.length;
    const avgScore = totalQuizzes > 0
      ? Math.round(quizzes.reduce((acc, q) => acc + (q.score / q.totalQuestions) * 100, 0) / totalQuizzes)
      : 0;
    const weakTopics = await WeakTopic.find({ accuracy: { $lt: 60 } });

    const recentNotes = await Note.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title createdAt keyConcepts');

    res.json({
      totalNotes,
      totalQuizzes,
      avgScore,
      weakTopicsCount: weakTopics.length,
      recentNotes
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getWeakTopics = async (req, res) => {
  try {
    const weakTopics = await WeakTopic.find({}).sort({ accuracy: 1 });
    res.json({ weakTopics });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getProgress = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ completed: true })
      .populate('noteId', 'title')
      .sort({ createdAt: 1 });

    const progressData = quizzes.map((q, i) => ({
      quizNumber: i + 1,
      noteTitle: q.noteId?.title || 'Unknown',
      score: Math.round((q.score / q.totalQuestions) * 100),
      date: q.createdAt
    }));

    const notes = await Note.find({}).sort({ createdAt: 1 });
    const notesOverTime = notes.map((n, i) => ({
      noteNumber: i + 1,
      title: n.title,
      date: n.createdAt,
      conceptsCount: n.keyConcepts.length
    }));

    res.json({ progressData, notesOverTime });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
