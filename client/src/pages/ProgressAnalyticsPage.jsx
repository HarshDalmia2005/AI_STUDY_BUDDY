import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { analyticsAPI } from '../services/api';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  TrendingUp, Target, BarChart3, AlertTriangle
} from 'lucide-react';

export default function ProgressAnalyticsPage() {
  const { dark } = useTheme();
  const [progress, setProgress] = useState(null);
  const [weakTopics, setWeakTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsAPI.progress(),
      analyticsAPI.weakTopics()
    ]).then(([progressData, weakData]) => {
      setProgress(progressData);
      setWeakTopics(weakData.weakTopics || []);
    }).catch(() => {
      setProgress({ progressData: [], notesOverTime: [] });
      setWeakTopics([]);
    }).finally(() => setLoading(false));
  }, []);

  const chartColors = {
    stroke: dark ? '#818cf8' : '#6366f1',
    fill: dark ? '#818cf820' : '#6366f110',
    grid: dark ? '#1e293b' : '#f1f5f9',
    text: dark ? '#94a3b8' : '#64748b',
    accent: dark ? '#34d399' : '#10b981',
    warn: dark ? '#fb923c' : '#f97316',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slide-in">
      <div>
        <h1 className={`text-3xl font-bold ${dark ? 'text-white' : 'text-surface-900'}`}>
          Progress <span className="gradient-text">Analytics</span>
        </h1>
        <p className={`mt-1 ${dark ? 'text-surface-200/50' : 'text-surface-600'}`}>
          Track your learning journey with visual insights
        </p>
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {}
        <div className={`p-6 rounded-2xl border ${dark ? 'bg-surface-800/50 border-primary-800/20' : 'bg-white border-surface-200'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <h3 className={`font-semibold ${dark ? 'text-white' : 'text-surface-900'}`}>Quiz Scores</h3>
              <p className={`text-xs ${dark ? 'text-surface-200/40' : 'text-surface-500'}`}>Performance over time</p>
            </div>
          </div>
          {progress?.progressData?.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={progress.progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="quizNumber" tick={{ fill: chartColors.text, fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fill: chartColors.text, fontSize: 12 }} />
                <Tooltip contentStyle={{
                  backgroundColor: dark ? '#1e293b' : '#fff',
                  border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
                  borderRadius: '12px',
                  color: dark ? '#fff' : '#0f172a'
                }} />
                <Line type="monotone" dataKey="score" stroke={chartColors.stroke} strokeWidth={3}
                  dot={{ fill: chartColors.stroke, r: 5 }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className={`flex items-center justify-center h-[250px] text-sm ${dark ? 'text-surface-200/30' : 'text-surface-400'}`}>
              Complete quizzes to see your score trends
            </div>
          )}
        </div>

        {}
        <div className={`p-6 rounded-2xl border ${dark ? 'bg-surface-800/50 border-primary-800/20' : 'bg-white border-surface-200'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500/20 to-teal-500/20 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-accent-400" />
            </div>
            <div>
              <h3 className={`font-semibold ${dark ? 'text-white' : 'text-surface-900'}`}>Notes Activity</h3>
              <p className={`text-xs ${dark ? 'text-surface-200/40' : 'text-surface-500'}`}>Concepts per note</p>
            </div>
          </div>
          {progress?.notesOverTime?.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={progress.notesOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="noteNumber" tick={{ fill: chartColors.text, fontSize: 12 }} />
                <YAxis tick={{ fill: chartColors.text, fontSize: 12 }} />
                <Tooltip contentStyle={{
                  backgroundColor: dark ? '#1e293b' : '#fff',
                  border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
                  borderRadius: '12px',
                  color: dark ? '#fff' : '#0f172a'
                }} />
                <Area type="monotone" dataKey="conceptsCount" stroke={chartColors.accent}
                  fill={chartColors.accent + '20'} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className={`flex items-center justify-center h-[250px] text-sm ${dark ? 'text-surface-200/30' : 'text-surface-400'}`}>
              Upload notes to see activity trends
            </div>
          )}
        </div>
      </div>

      {}
      <div className={`p-6 rounded-2xl border ${dark ? 'bg-surface-800/50 border-primary-800/20' : 'bg-white border-surface-200'}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
            <Target className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h3 className={`font-semibold ${dark ? 'text-white' : 'text-surface-900'}`}>Topic Performance</h3>
            <p className={`text-xs ${dark ? 'text-surface-200/40' : 'text-surface-500'}`}>Your accuracy across different topics</p>
          </div>
        </div>

        {weakTopics.length > 0 ? (
          <>
            {}
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weakTopics} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: chartColors.text, fontSize: 12 }} />
                <YAxis type="category" dataKey="topic" tick={{ fill: chartColors.text, fontSize: 12 }} width={120} />
                <Tooltip contentStyle={{
                  backgroundColor: dark ? '#1e293b' : '#fff',
                  border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
                  borderRadius: '12px',
                  color: dark ? '#fff' : '#0f172a'
                }} />
                <Bar dataKey="accuracy" fill={chartColors.stroke} radius={[0, 6, 6, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>

            {}
            <div className="mt-6 space-y-3">
              {weakTopics.map(topic => (
                <div key={topic._id} className={`flex items-center gap-4 p-4 rounded-xl
                  ${dark ? 'bg-surface-900/30' : 'bg-surface-50'}`}>
                  {topic.accuracy < 60 && (
                    <AlertTriangle size={16} className="text-orange-400 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${dark ? 'text-white' : 'text-surface-900'}`}>{topic.topic}</p>
                    <p className={`text-xs mt-0.5 ${dark ? 'text-surface-200/40' : 'text-surface-500'}`}>
                      {topic.recommendedRevision}
                    </p>
                  </div>
                  <div className={`text-right`}>
                    <p className={`text-lg font-bold ${topic.accuracy >= 60 ? 'text-accent-500' : 'text-orange-400'}`}>
                      {topic.accuracy}%
                    </p>
                    <p className={`text-xs ${dark ? 'text-surface-200/30' : 'text-surface-500'}`}>
                      {topic.totalAttempts} attempt{topic.totalAttempts !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className={`flex items-center justify-center h-[200px] text-sm ${dark ? 'text-surface-200/30' : 'text-surface-400'}`}>
            Complete quizzes to see topic performance analysis
          </div>
        )}
      </div>
    </div>
  );
}
