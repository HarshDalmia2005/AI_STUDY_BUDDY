import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { GraduationCap, Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const { dark } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 gradient-bg`}>
      {}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl float"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className={`w-full max-w-md relative z-10 animate-slide-in`}>
        {}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center glow-pulse">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">MentorMate</span>
          </Link>
        </div>

        {}
        <div className={`glass rounded-2xl p-8 ${dark ? '' : 'bg-white/90 border-surface-200'}`}>
          <h2 className={`text-2xl font-bold mb-2 ${dark ? 'text-white' : 'text-surface-900'}`}>Welcome back</h2>
          <p className={`text-sm mb-6 ${dark ? 'text-surface-200/50' : 'text-surface-600'}`}>Sign in to continue your learning journey</p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${dark ? 'text-surface-200/70' : 'text-surface-700'}`}>Email</label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${dark ? 'text-surface-200/30' : 'text-surface-400'}`} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm transition-all outline-none
                    ${dark ? 'bg-white/5 border border-white/10 text-white placeholder-surface-200/30 focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20'
                      : 'bg-surface-50 border border-surface-200 text-surface-900 placeholder-surface-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'}`}
                  placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${dark ? 'text-surface-200/70' : 'text-surface-700'}`}>Password</label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${dark ? 'text-surface-200/30' : 'text-surface-400'}`} />
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  className={`w-full pl-11 pr-12 py-3 rounded-xl text-sm transition-all outline-none
                    ${dark ? 'bg-white/5 border border-white/10 text-white placeholder-surface-200/30 focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20'
                      : 'bg-surface-50 border border-surface-200 text-surface-900 placeholder-surface-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'}`}
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${dark ? 'text-surface-200/30 hover:text-white' : 'text-surface-400 hover:text-surface-600'}`}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-primary-500 to-purple-600 text-white hover:shadow-lg hover:shadow-primary-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <p className={`text-center text-sm mt-6 ${dark ? 'text-surface-200/40' : 'text-surface-500'}`}>
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
