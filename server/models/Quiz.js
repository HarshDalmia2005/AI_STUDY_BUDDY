const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  type: { type: String, enum: ['mcq', 'short'], default: 'mcq' },
  question: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: String, required: true },
  userAnswer: { type: String, default: '' },
  explanation: { type: String, default: '' },
  isCorrect: { type: Boolean, default: false }
});

const quizSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  noteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', required: true },
  questions: [questionSchema],
  score: { type: Number, default: 0 },
  totalQuestions: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', quizSchema);
