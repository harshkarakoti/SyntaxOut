import ProjectList from '../components/ProjectList.jsx';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

export default function ProjectsPage() {
  return (
    <main style={{ minHeight: '100vh', paddingTop: '92px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px' }}>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#e8e8e8', letterSpacing: '-0.03em' }}>
              History
            </h1>
            <p style={{ fontSize: '13px', color: '#525252', marginTop: '4px' }}>
              Your parsed documentation sessions
            </p>
          </div>
          <Link to="/" className="btn-secondary" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <Plus size={13} /> New
          </Link>
        </div>

        <ProjectList />
      </div>
    </main>
  );
}
