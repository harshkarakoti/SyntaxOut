import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import ProjectPage from './pages/ProjectPage.jsx';
import { getClientId } from './services/clientId.js';

export default function App() {
  useEffect(() => {
    const handleUnload = () => {
      const clientId = getClientId();
      const url = `${import.meta.env.VITE_API_URL}/api/v1/projects/session/cleanup`;
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
      <Navbar />
      <Routes>
        <Route path="/"             element={<HomePage />} />
        <Route path="/projects"     element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectPage />} />
      </Routes>
    </BrowserRouter>
  );
}
