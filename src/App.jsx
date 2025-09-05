// src/App.jsx
import { Routes, Route, Navigate, Link, NavLink } from 'react-router-dom';
import Quiz from './pages/Quiz.jsx';
import Results from './pages/Results.jsx';

export default function App() {
  return (
    <div className="app">
      <header className="app-header" role="banner">
        <Link to="/quiz" className="brand" aria-label="Quiz App Home">
          <span className="logo">❓</span> Quiz App
        </Link>
        <nav aria-label="Main navigation">
          <NavLink
            to="/quiz"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Quiz
          </NavLink>
          <NavLink
            to="/results"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Results
          </NavLink>
        </nav>
      </header>

      <main className="app-main" role="main">
        <Routes>
          <Route path="/" element={<Navigate to="/quiz" replace />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/results" element={<Results />} />
          <Route path="*" element={<Navigate to="/quiz" replace />} />
        </Routes>
      </main>

      <footer className="app-footer">Built with React + Vite</footer>
    </div>
  );
}
