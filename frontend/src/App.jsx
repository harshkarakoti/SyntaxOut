import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import ProjectPage from './pages/ProjectPage.jsx';
import { getClientId } from './services/clientId.js';

export default function App() {
  // ── Session cleanup: delete all projects when the tab/window is closed ────────
  useEffect(() => {
    const handleUnload = () => {
      const clientId = getClientId();
      const url = `${import.meta.env.VITE_API_URL}/api/v1/projects/session/cleanup`;
      // sendBeacon is the only reliable way to fire a request on tab close
      navigator.sendBeacon(url, new Blob(
        [JSON.stringify({ clientId })],
        { type: 'application/json' }
      ));
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  return (
    <BrowserRouter>
      {/* Ambient Glow Orbs — fixed, behind everything */}
      <div className="orb orb-cyan animate-float" />
      <div className="orb orb-pink animate-float-delay" />
      <div className="orb orb-purple animate-float-slow" />

      {/* Dot grid background */}
      <div className="fixed inset-0 bg-dots pointer-events-none z-0" />

      {/* App content */}
      <div className="relative z-10">
        <Navbar />
        <Routes>
          <Route path="/"             element={<HomePage />} />
          <Route path="/projects"     element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
