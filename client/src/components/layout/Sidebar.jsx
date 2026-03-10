import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard, Upload, FileText, Brain, BarChart3,
  LogOut, Moon, Sun, GraduationCap, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/upload', icon: Upload, label: 'Upload Notes' },
  { to: '/notes', icon: FileText, label: 'My Notes' },
  { to: '/quiz-history', icon: Brain, label: 'Quizzes' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-64'} h-screen fixed left-0 top-0 z-40 flex flex-col transition-all duration-300 
      ${dark ? 'bg-surface-900/95 border-r border-primary-800/30' : 'bg-white border-r border-surface-200'} backdrop-blur-xl`}>
      
      {}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-primary-500/10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center flex-shrink-0">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        {!collapsed && (
          <span className="text-xl font-bold gradient-text tracking-tight">MentorMate</span>
        )}
      </div>

      {}
      <button onClick={() => setCollapsed(!collapsed)}
        className={`absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center 
          ${dark ? 'bg-primary-600 text-white' : 'bg-primary-500 text-white'} shadow-lg hover:scale-110 transition-transform`}>
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
              ${isActive
                ? `${dark
                    ? 'bg-primary-600/20 text-primary-400 shadow-lg shadow-primary-500/10'
                    : 'bg-primary-50 text-primary-700 shadow-md shadow-primary-200/50'}`
                : `${dark
                    ? 'text-surface-200/70 hover:text-white hover:bg-white/5'
                    : 'text-surface-700 hover:text-primary-600 hover:bg-primary-50/50'}`
              }`
            }>
            <Icon size={20} className="flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {}
      <div className={`px-3 py-4 border-t ${dark ? 'border-primary-800/30' : 'border-surface-200'} space-y-2`}>
        {}
        <button onClick={toggleTheme}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-sm font-medium transition-all
            ${dark ? 'text-surface-200/70 hover:text-yellow-400 hover:bg-yellow-400/5'
              : 'text-surface-700 hover:text-primary-600 hover:bg-primary-50/50'}`}>
          {dark ? <Sun size={20} /> : <Moon size={20} />}
          {!collapsed && <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {}
        {user && (
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl
            ${dark ? 'bg-white/5' : 'bg-surface-50'}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">{user.name?.charAt(0).toUpperCase()}</span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${dark ? 'text-white' : 'text-surface-900'}`}>{user.name}</p>
              </div>
            )}
            {!collapsed && (
              <button onClick={handleLogout}
                className="text-red-400 hover:text-red-300 transition-colors" title="Logout">
                <LogOut size={18} />
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
