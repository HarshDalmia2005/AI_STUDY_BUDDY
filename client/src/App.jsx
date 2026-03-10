import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import UploadNotesPage from './pages/UploadNotesPage';
import NoteAnalysisPage from './pages/NoteAnalysisPage';
import NotesListPage from './pages/NotesListPage';
import QuizPage from './pages/QuizPage';
import QuizHistoryPage from './pages/QuizHistoryPage';
import ProgressAnalyticsPage from './pages/ProgressAnalyticsPage';

function ProtectedRoute({ children }) {
  return children;
}

function PublicRoute({ children }) {
  return children;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {}
            <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {}
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/upload" element={<UploadNotesPage />} />
              <Route path="/notes" element={<NotesListPage />} />
              <Route path="/notes/:id" element={<NoteAnalysisPage />} />
              <Route path="/quiz/:id" element={<QuizPage />} />
              <Route path="/quiz-history" element={<QuizHistoryPage />} />
              <Route path="/analytics" element={<ProgressAnalyticsPage />} />
            </Route>

            {}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
