import ProjectList from '../components/ProjectList.jsx';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

export default function ProjectsPage() {
  return (
    <main style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 600, color: '#e2e8f0', letterSpacing: '-0.03em' }}>
              History
            </h1>
            <p style={{ fontSize: '15px', color: '#475569', marginTop: '4px' }}>
              Your parsed documentation sessions
            </p>
          </div>
          <Link to="/" className="btn-secondary" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <Plus size={15} /> New
          </Link>
        </div>

        <ProjectList />
      </div>
    </main>
  );
}
