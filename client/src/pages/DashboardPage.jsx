import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useTheme } from '../context/ThemeContext';
import { analyticsAPI } from '../services/api';
import {
  FileText, Brain, Target, TrendingUp, Upload,
  ArrowRight, Sparkles, Clock
} from 'lucide-react';

export default function DashboardPage() {
  const { dark } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsAPI.dashboard()
      .then(data => setStats(data))
      .catch(() => setStats({
        totalNotes: 0, totalQuizzes: 0, avgScore: 0, weakTopicsCount: 0, recentNotes: []
      }))
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { icon: FileText, label: 'Notes Uploaded', value: stats.totalNotes, color: 'from-primary-500 to-blue-500', bgColor: 'primary' },
    { icon: Brain, label: 'Quizzes Taken', value: stats.totalQuizzes, color: 'from-purple-500 to-pink-500', bgColor: 'purple' },
    { icon: TrendingUp, label: 'Avg Quiz Score', value: `${stats.avgScore}%`, color: 'from-accent-500 to-teal-500', bgColor: 'accent' },
    { icon: Target, label: 'Weak Topics', value: stats.weakTopicsCount, color: 'from-orange-500 to-red-500', bgColor: 'orange' },
  ] : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slide-in">
      {}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${dark ? 'text-white' : 'text-surface-900'}`}>
            Welcome back, <span className="gradient-text">Student</span> 👋
          </h1>
          <p className={`mt-1 ${dark ? 'text-surface-200/50' : 'text-surface-600'}`}>
            Here's your learning progress at a glance
          </p>
        </div>
        <Link to="/upload"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-purple-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-primary-500/25 transition-all hover:-translate-y-0.5">
          <Upload size={18} />
          Upload Notes
        </Link>
      </div>

      {}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map(({ icon: Icon, label, value, color }, i) => (
          <div key={label}
            className={`card-hover p-6 rounded-2xl border animate-slide-in
              ${dark ? 'bg-surface-800/50 border-primary-800/20' : 'bg-white border-surface-200'}`}
            style={{ animationDelay: `${i * 100}ms` }}>
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} bg-opacity-20 flex items-center justify-center mb-4`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <p className={`text-3xl font-bold ${dark ? 'text-white' : 'text-surface-900'}`}>{value}</p>
            <p className={`text-sm mt-1 ${dark ? 'text-surface-200/50' : 'text-surface-600'}`}>{label}</p>
          </div>
        ))}
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {}
        <div className={`col-span-1 p-6 rounded-2xl border ${dark ? 'bg-surface-800/50 border-primary-800/20' : 'bg-white border-surface-200'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${dark ? 'text-white' : 'text-surface-900'}`}>Quick Actions</h3>
          <div className="space-y-3">
            {[
              { to: '/upload', icon: Upload, label: 'Upload New Notes', desc: 'Scan and analyze handwritten notes' },
              { to: '/notes', icon: FileText, label: 'Browse Notes', desc: 'View all your processed notes' },
              { to: '/analytics', icon: TrendingUp, label: 'View Analytics', desc: 'Track your learning progress' },
            ].map(({ to, icon: Icon, label, desc }) => (
              <Link key={to} to={to}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all group
                  ${dark ? 'hover:bg-white/5' : 'hover:bg-surface-50'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                  ${dark ? 'bg-primary-500/10' : 'bg-primary-50'}`}>
                  <Icon className="w-5 h-5 text-primary-500" />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${dark ? 'text-white' : 'text-surface-900'}`}>{label}</p>
                  <p className={`text-xs ${dark ? 'text-surface-200/40' : 'text-surface-500'}`}>{desc}</p>
                </div>
                <ArrowRight className={`w-4 h-4 ${dark ? 'text-surface-200/20' : 'text-surface-400'} group-hover:text-primary-500 transition-colors`} />
              </Link>
            ))}
          </div>
        </div>

        {}
        <div className={`col-span-2 p-6 rounded-2xl border ${dark ? 'bg-surface-800/50 border-primary-800/20' : 'bg-white border-surface-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${dark ? 'text-white' : 'text-surface-900'}`}>Recent Notes</h3>
            <Link to="/notes" className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {stats.recentNotes?.length > 0 ? (
            <div className="space-y-3">
              {stats.recentNotes.map(note => (
                <Link key={note._id} to={`/notes/${note._id}`}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all
                    ${dark ? 'hover:bg-white/5' : 'hover:bg-surface-50'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                    ${dark ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
                    <Sparkles className="w-5 h-5 text-purple-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${dark ? 'text-white' : 'text-surface-900'}`}>{note.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock size={12} className={dark ? 'text-surface-200/30' : 'text-surface-400'} />
                      <p className={`text-xs ${dark ? 'text-surface-200/40' : 'text-surface-500'}`}>
                        {new Date(note.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {note.keyConcepts?.slice(0, 2).map(c => (
                      <span key={c} className={`text-xs px-2 py-1 rounded-lg
                        ${dark ? 'bg-primary-500/10 text-primary-400' : 'bg-primary-50 text-primary-700'}`}>
                        {c}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className={`text-center py-12 ${dark ? 'text-surface-200/30' : 'text-surface-400'}`}>
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No notes yet. Upload your first note to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
