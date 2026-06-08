import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import ProjectPage from './pages/ProjectPage.jsx';

export default function App() {
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
