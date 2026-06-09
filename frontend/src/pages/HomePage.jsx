import { useNavigate } from 'react-router-dom';
import UploadZone from '../components/UploadZone.jsx';

export default function HomePage() {
  const navigate = useNavigate();
  const handleComplete = (projectId) => setTimeout(() => navigate(`/projects/${projectId}`), 600);

  return (
    <main style={{ minHeight: '100vh', paddingTop: '110px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>

        {/* Heading block */}
        <div className="animate-slide-up" style={{ marginBottom: '40px' }}>
          <h1 style={{
            fontSize: 'clamp(36px, 5vw, 52px)',
            fontWeight: 600,
            letterSpacing: '-0.04em',
            lineHeight: 1.1,
            color: '#e2e8f0',
            marginBottom: '16px',
          }}>
            Turn code into<br />
            <span style={{ color: '#94a3b8' }}>API documentation</span>
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#94a3b8',
            lineHeight: 1.65,
            maxWidth: '600px',
          }}>
            Drop a source file. Get structured documentation — endpoints,
            functions, classes, and imports — in seconds.
          </p>
        </div>

        {/* Upload */}
        <div className="animate-slide-up" style={{ animationDelay: '80ms' }}>
          <UploadZone onUploadComplete={handleComplete} />
        </div>

        {/* Footer hint */}
        <div
          className="animate-fade-in"
          style={{
            marginTop: '32px',
            display: 'flex', gap: '24px',
            animationDelay: '160ms',
          }}
        >
          {[
            { value: '< 5s', label: 'parse time' },
            { value: '10', label: 'languages' },
            { value: '24h', label: 'auto-delete' },
          ].map(({ value, label }) => (
            <div key={label}>
              <div style={{
                fontSize: '18px', fontWeight: 600,
                color: '#22d3ee', letterSpacing: '-0.03em',
                fontFamily: 'var(--mono)',
              }}>{value}</div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '3px' }}>
                {label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
