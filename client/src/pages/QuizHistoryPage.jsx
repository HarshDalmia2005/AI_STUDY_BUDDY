import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { quizAPI } from '../services/api';
import { Brain, Clock, CheckCircle2, ChevronRight } from 'lucide-react';

export default function QuizHistoryPage() {
  const { dark } = useTheme();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    quizAPI.history()
      .then(data => setQuizzes(data.quizzes || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h1 className={`text-3xl font-bold ${dark ? 'text-white' : 'text-surface-900'}`}>
          Quiz <span className="gradient-text">History</span>
        </h1>
        <p className={`mt-1 ${dark ? 'text-surface-200/50' : 'text-surface-600'}`}>
          Review your past quiz attempts and scores
        </p>
      </div>

      {quizzes.length > 0 ? (
        <div className="space-y-3">
          {quizzes.map((quiz, i) => {
            const pct = quiz.completed ? Math.round((quiz.score / quiz.totalQuestions) * 100) : 0;
            return (
              <Link key={quiz._id} to={`/quiz/${quiz._id}`}
                className={`flex items-center gap-5 p-5 rounded-2xl border transition-all card-hover group animate-slide-in
                  ${dark ? 'bg-surface-800/50 border-primary-800/20 hover:border-primary-500/30' : 'bg-white border-surface-200 hover:border-primary-300'}`}
                style={{ animationDelay: `${i * 50}ms` }}>
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center
                  ${pct >= 60
                    ? 'bg-gradient-to-br from-accent-500/20 to-teal-500/20'
                    : 'bg-gradient-to-br from-orange-500/20 to-red-500/20'}`}>
                  <span className={`text-lg font-bold ${pct >= 60 ? 'text-accent-400' : 'text-orange-400'}`}>{pct}%</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate ${dark ? 'text-white' : 'text-surface-900'}`}>
                    {quiz.noteId?.title || 'Quiz'}
                  </p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className={`text-xs flex items-center gap-1 ${dark ? 'text-surface-200/40' : 'text-surface-500'}`}>
                      <CheckCircle2 size={12} /> {quiz.score}/{quiz.totalQuestions} correct
                    </span>
                    <span className={`text-xs flex items-center gap-1 ${dark ? 'text-surface-200/40' : 'text-surface-500'}`}>
                      <Clock size={12} /> {new Date(quiz.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 ${dark ? 'text-surface-200/20' : 'text-surface-400'} group-hover:text-primary-500 transition-colors`} />
              </Link>
            );
          })}
        </div>
      ) : (
        <div className={`text-center py-20 ${dark ? 'text-surface-200/30' : 'text-surface-400'}`}>
          <Brain className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No quizzes taken yet</p>
          <p className="text-sm mt-1">Upload a note and generate a quiz to get started</p>
        </div>
      )}
    </div>
  );
}
