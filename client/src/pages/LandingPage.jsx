import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  GraduationCap, Upload, Brain, BarChart3, Mic, Sparkles,
  ArrowRight, BookOpen, Zap
} from 'lucide-react';

const features = [
  { icon: Upload, title: 'Smart OCR', desc: 'Upload handwritten notes and extract text instantly using AI-powered recognition.' },
  { icon: Brain, title: 'AI Explanations', desc: 'Get simple, step-by-step explanations of complex concepts in multiple languages.' },
  { icon: Mic, title: 'Audio Tutor', desc: 'Listen to AI-generated voice explanations in English, Hindi, Bengali, and Tamil.' },
  { icon: Sparkles, title: 'Auto Quizzes', desc: 'Automatically generated MCQ and short-answer quizzes to test your understanding.' },
  { icon: BarChart3, title: 'Progress Tracking', desc: 'Track weak topics, quiz scores, and learning progress with visual analytics.' },
  { icon: BookOpen, title: 'Study History', desc: 'Access all your processed notes, summaries, and past quiz results anytime.' },
];

export default function LandingPage() {
  const { dark } = useTheme();

  return (
    <div className={`min-h-screen ${dark ? 'bg-surface-950' : 'bg-white'}`}>
      {}
      <nav className={`fixed top-0 left-0 right-0 z-50 ${dark ? 'bg-surface-950/80' : 'bg-white/80'} backdrop-blur-xl border-b ${dark ? 'border-primary-800/20' : 'border-surface-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">MentorMate</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="px-5 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-primary-500 to-purple-600 text-white hover:shadow-lg hover:shadow-primary-500/25 transition-all hover:-translate-y-0.5">
              Go to App
            </Link>
          </div>
        </div>
      </nav>

      {}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl float"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl float" style={{ animationDelay: '3s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-8">
            <Zap className="w-4 h-4 text-primary-400" />
            <span className={`text-sm font-medium ${dark ? 'text-primary-300' : 'text-primary-600'}`}>AI-Powered Study Assistant</span>
          </div>

          <h1 className={`text-5xl md:text-7xl font-bold mb-6 leading-tight ${dark ? 'text-white' : 'text-surface-900'}`}>
            Turn Messy Notes Into
            <br />
            <span className="gradient-text">Structured Learning</span>
          </h1>

          <p className={`text-lg md:text-xl max-w-2xl mx-auto mb-10 ${dark ? 'text-surface-200/60' : 'text-surface-700'}`}>
            Upload handwritten notes, get AI explanations, listen to audio lessons in your language, 
            take auto-generated quizzes, and track your progress — all in one platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/dashboard" className="group px-8 py-4 rounded-2xl text-base font-semibold bg-gradient-to-r from-primary-500 to-purple-600 text-white hover:shadow-xl hover:shadow-primary-500/30 transition-all hover:-translate-y-1 flex items-center gap-2">
              Start Learning Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {}
      <section className={`py-24 ${dark ? 'bg-surface-900/30' : 'bg-surface-50'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${dark ? 'text-white' : 'text-surface-900'}`}>
              Everything You Need to <span className="gradient-text">Study Smarter</span>
            </h2>
            <p className={`text-lg max-w-xl mx-auto ${dark ? 'text-surface-200/50' : 'text-surface-600'}`}>
              Powerful AI tools that transform how you learn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <div key={title}
                className={`card-hover p-6 rounded-2xl animate-slide-in border
                  ${dark ? 'bg-surface-800/50 border-primary-800/20 hover:border-primary-500/30' : 'bg-white border-surface-200 hover:border-primary-300'}`}
                style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${dark ? 'text-white' : 'text-surface-900'}`}>{title}</h3>
                <p className={`text-sm leading-relaxed ${dark ? 'text-surface-200/50' : 'text-surface-600'}`}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className={`p-12 rounded-3xl ${dark ? 'bg-gradient-to-br from-primary-900/50 to-purple-900/30 border border-primary-700/30' : 'bg-gradient-to-br from-primary-50 to-purple-50 border border-primary-200'}`}>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${dark ? 'text-white' : 'text-surface-900'}`}>
              Ready to Study Smarter?
            </h2>
            <p className={`text-lg mb-8 ${dark ? 'text-surface-200/60' : 'text-surface-600'}`}>
              Join MentorMate and turn your notes into a personalized learning experience
            </p>
            <Link to="/dashboard" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold bg-gradient-to-r from-primary-500 to-purple-600 text-white hover:shadow-xl hover:shadow-primary-500/30 transition-all hover:-translate-y-1">
              Go to Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {}
      <footer className={`py-8 border-t ${dark ? 'border-surface-800 text-surface-200/40' : 'border-surface-200 text-surface-500'}`}>
        <div className="max-w-7xl mx-auto px-6 text-center text-sm">
          © 2026 MentorMate. Built with ❤️ for students.
        </div>
      </footer>
    </div>
  );
}
