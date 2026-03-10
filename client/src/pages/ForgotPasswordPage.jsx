import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { GraduationCap, Mail, ArrowLeft, Send } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { dark } = useTheme();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      setSent(true);
    } catch {
      setSent(true); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 gradient-bg">
      <div className="w-full max-w-md relative z-10 animate-slide-in">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">MentorMate</span>
          </Link>
        </div>

        <div className={`glass rounded-2xl p-8 ${dark ? '' : 'bg-white/90 border-surface-200'}`}>
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-500/20 flex items-center justify-center">
                <Send className="w-8 h-8 text-accent-400" />
              </div>
              <h2 className={`text-2xl font-bold mb-2 ${dark ? 'text-white' : 'text-surface-900'}`}>Check your email</h2>
              <p className={`text-sm mb-6 ${dark ? 'text-surface-200/50' : 'text-surface-600'}`}>
                If an account exists with that email, we've sent a password reset link.
              </p>
              <Link to="/login" className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm font-medium">
                <ArrowLeft size={16} /> Back to login
              </Link>
            </div>
          ) : (
            <>
              <h2 className={`text-2xl font-bold mb-2 ${dark ? 'text-white' : 'text-surface-900'}`}>Reset Password</h2>
              <p className={`text-sm mb-6 ${dark ? 'text-surface-200/50' : 'text-surface-600'}`}>
                Enter your email and we'll send you a reset link
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${dark ? 'text-surface-200/30' : 'text-surface-400'}`} />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm transition-all outline-none
                      ${dark ? 'bg-white/5 border border-white/10 text-white placeholder-surface-200/30 focus:border-primary-500/50'
                        : 'bg-surface-50 border border-surface-200 text-surface-900 placeholder-surface-400 focus:border-primary-500'}`}
                    placeholder="you@example.com" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-primary-500 to-purple-600 text-white hover:shadow-lg transition-all disabled:opacity-50">
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
              <div className="text-center mt-4">
                <Link to="/login" className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm">
                  <ArrowLeft size={16} /> Back to login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
