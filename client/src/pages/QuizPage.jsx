import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { quizAPI } from '../services/api';
import {
  Brain, CheckCircle2, XCircle, ArrowRight, Trophy,
  RotateCcw, Home, ChevronRight
} from 'lucide-react';

export default function QuizPage() {
  const { id } = useParams();
  const { dark } = useTheme();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    quizAPI.getById(id)
      .then(data => {
        setQuiz(data.quiz);
        if (data.quiz.completed) {
          setSubmitted(true);
          setResult({ score: data.quiz.score, total: data.quiz.totalQuestions });
          const existingAnswers = {};
          data.quiz.questions.forEach((q, i) => {
            existingAnswers[i] = q.userAnswer;
          });
          setAnswers(existingAnswers);
        }
      })
      .catch(() => navigate('/quiz-history'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAnswer = (questionIndex, answer) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [questionIndex]: answer }));
  };

  const handleSubmit = async () => {
    const answerArray = Object.entries(answers).map(([questionIndex, answer]) => ({
      questionIndex: parseInt(questionIndex),
      answer
    }));

    try {
      const data = await quizAPI.submit(quiz._id, answerArray);
      setQuiz(data.quiz);
      setResult({ score: data.score, total: data.total });
      setSubmitted(true);
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  if (loading || !quiz) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  const q = quiz.questions[currentQ];
  const totalQ = quiz.questions.length;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-slide-in">
      {}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-surface-900'}`}>
            <span className="gradient-text">Quiz</span>
          </h1>
          <p className={`text-sm mt-1 ${dark ? 'text-surface-200/40' : 'text-surface-500'}`}>
            {quiz.noteId?.title || 'Practice Quiz'}
          </p>
        </div>
        {!submitted && (
          <span className={`text-sm ${dark ? 'text-surface-200/40' : 'text-surface-500'}`}>
            {answeredCount}/{totalQ} answered
          </span>
        )}
      </div>

      {}
      <div className={`w-full h-2 rounded-full ${dark ? 'bg-surface-800' : 'bg-surface-200'}`}>
        <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-purple-500 transition-all duration-500"
          style={{ width: `${((currentQ + 1) / totalQ) * 100}%` }} />
      </div>

      {}
      {submitted && result && (
        <div className={`p-8 rounded-2xl border text-center ${dark ? 'bg-surface-800/50 border-primary-800/20' : 'bg-white border-surface-200'}`}>
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h2 className={`text-3xl font-bold mb-2 ${dark ? 'text-white' : 'text-surface-900'}`}>
            {result.score}/{result.total}
          </h2>
          <p className={`text-lg ${dark ? 'text-surface-200/60' : 'text-surface-600'}`}>
            {result.score === result.total ? '🎉 Perfect Score!' :
              result.score >= result.total * 0.6 ? '👍 Good Job!' : '📚 Keep Practicing!'}
          </p>
          <p className={`text-sm mt-1 ${dark ? 'text-surface-200/40' : 'text-surface-500'}`}>
            Accuracy: {Math.round((result.score / result.total) * 100)}%
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <button onClick={() => navigate('/dashboard')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all
                ${dark ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-surface-100 text-surface-700 hover:bg-surface-200'}`}>
              <Home size={16} /> Dashboard
            </button>
            <button onClick={() => navigate('/analytics')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-primary-500 to-purple-600 text-white hover:shadow-lg transition-all">
              View Progress <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {}
      <div className={`p-6 rounded-2xl border ${dark ? 'bg-surface-800/50 border-primary-800/20' : 'bg-white border-surface-200'}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
            <span className="text-white text-sm font-bold">{currentQ + 1}</span>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-lg font-medium
            ${q.type === 'mcq'
              ? dark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'
              : dark ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600'
            }`}>
            {q.type === 'mcq' ? 'Multiple Choice' : 'Short Answer'}
          </span>
        </div>

        <h3 className={`text-lg font-medium mb-5 ${dark ? 'text-white' : 'text-surface-900'}`}>{q.question}</h3>

        {q.type === 'mcq' ? (
          <div className="space-y-3">
            {q.options.map((opt, i) => {
              const selected = answers[currentQ] === opt;
              const isCorrectAnswer = submitted && opt === q.correctAnswer;
              const isWrong = submitted && selected && !q.isCorrect;

              return (
                <button key={i} onClick={() => handleAnswer(currentQ, opt)}
                  disabled={submitted}
                  className={`w-full text-left flex items-center gap-4 p-4 rounded-xl transition-all border text-sm
                    ${isCorrectAnswer
                      ? 'border-accent-500 bg-accent-500/10 text-accent-400'
                      : isWrong
                        ? 'border-red-500 bg-red-500/10 text-red-400'
                        : selected
                          ? dark ? 'border-primary-500 bg-primary-500/10 text-white' : 'border-primary-500 bg-primary-50 text-primary-700'
                          : dark ? 'border-surface-700 hover:border-primary-500/50 text-surface-200/60 hover:bg-white/5' : 'border-surface-200 hover:border-primary-300 text-surface-700 hover:bg-primary-50/50'
                    }`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border
                    ${selected || isCorrectAnswer
                      ? isCorrectAnswer ? 'border-accent-500 bg-accent-500' : isWrong ? 'border-red-500 bg-red-500' : 'border-primary-500 bg-primary-500'
                      : dark ? 'border-surface-600' : 'border-surface-300'
                    }`}>
                    {isCorrectAnswer ? <CheckCircle2 size={14} className="text-white" /> :
                      isWrong ? <XCircle size={14} className="text-white" /> :
                        <span className={`text-xs font-medium ${selected ? 'text-white' : dark ? 'text-surface-200/40' : 'text-surface-500'}`}>
                          {String.fromCharCode(65 + i)}
                        </span>
                    }
                  </div>
                  <span className="flex-1">{opt}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <textarea
            value={answers[currentQ] || ''}
            onChange={e => handleAnswer(currentQ, e.target.value)}
            disabled={submitted}
            rows={3}
            className={`w-full rounded-xl p-4 text-sm outline-none transition-all resize-none
              ${dark ? 'bg-white/5 border border-white/10 text-white placeholder-surface-200/30 focus:border-primary-500/50'
                : 'bg-surface-50 border border-surface-200 text-surface-900 placeholder-surface-400 focus:border-primary-500'}`}
            placeholder="Type your answer..."
          />
        )}

        {/* Explanation after submit */}
        {submitted && q.explanation && (
          <div className={`mt-4 p-4 rounded-xl ${dark ? 'bg-primary-500/5 border border-primary-500/10' : 'bg-primary-50 border border-primary-100'}`}>
            <p className={`text-xs font-semibold mb-1 ${dark ? 'text-primary-400' : 'text-primary-600'}`}>Explanation</p>
            <p className={`text-sm ${dark ? 'text-surface-200/60' : 'text-surface-600'}`}>{q.explanation}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
          disabled={currentQ === 0}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-30
            ${dark ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-surface-100 text-surface-700 hover:bg-surface-200'}`}>
          Previous
        </button>

        <div className="flex gap-2">
          {quiz.questions.map((_, i) => (
            <button key={i} onClick={() => setCurrentQ(i)}
              className={`w-8 h-8 rounded-lg text-xs font-medium transition-all
                ${i === currentQ
                  ? 'bg-primary-500 text-white'
                  : answers[i] !== undefined
                    ? dark ? 'bg-primary-500/20 text-primary-400' : 'bg-primary-50 text-primary-600'
                    : dark ? 'bg-white/5 text-surface-200/40' : 'bg-surface-100 text-surface-500'
                }`}>
              {i + 1}
            </button>
          ))}
        </div>

        {currentQ < totalQ - 1 ? (
          <button onClick={() => setCurrentQ(currentQ + 1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-primary-500 to-purple-600 text-white hover:shadow-lg transition-all">
            Next <ChevronRight size={16} />
          </button>
        ) : !submitted ? (
          <button onClick={handleSubmit} disabled={answeredCount < totalQ}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-accent-500 to-teal-500 text-white hover:shadow-lg transition-all disabled:opacity-50">
            Submit Quiz
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
