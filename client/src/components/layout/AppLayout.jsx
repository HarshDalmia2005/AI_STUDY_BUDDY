import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useTheme } from '../../context/ThemeContext';

export default function AppLayout() {
  const { dark } = useTheme();

  return (
    <div className={`min-h-screen ${dark ? 'bg-surface-950 text-white' : 'bg-surface-50 text-surface-900'}`}>
      <Sidebar />
      <main className="ml-64 min-h-screen p-8 transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
}
