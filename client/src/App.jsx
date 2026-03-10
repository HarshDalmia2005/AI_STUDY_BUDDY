import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import UploadNotesPage from './pages/UploadNotesPage';
import NoteAnalysisPage from './pages/NoteAnalysisPage';
import NotesListPage from './pages/NotesListPage';
import QuizPage from './pages/QuizPage';
import QuizHistoryPage from './pages/QuizHistoryPage';
import ProgressAnalyticsPage from './pages/ProgressAnalyticsPage';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/upload" element={<UploadNotesPage />} />
            <Route path="/notes" element={<NotesListPage />} />
            <Route path="/notes/:id" element={<NoteAnalysisPage />} />
            <Route path="/quiz/:id" element={<QuizPage />} />
            <Route path="/quiz-history" element={<QuizHistoryPage />} />
            <Route path="/analytics" element={<ProgressAnalyticsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
