import { useNavigate } from 'react-router-dom';
import UploadZone from '../components/UploadZone.jsx';
import { Clock, Shield, Terminal } from 'lucide-react';

const STATS = [
  { icon: Clock,    value: '< 5s', label: 'Time to Docs',        color: '#00d4ff' },
  { icon: Shield,   value: '$0',   label: 'Infra Cost',          color: '#00ff88' },
  { icon: Terminal, value: '11',   label: 'Languages',           color: '#ff0080' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const handleComplete = (projectId) => setTimeout(() => navigate(`/projects/${projectId}`), 800);

  return (
    <main style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>

        {/* Badge */}
        <div className="animate-fade-in" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '6px 16px', borderRadius: '99px', marginBottom: '28px',
          background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.2)',
          fontSize: '11px', fontWeight: 700, color: '#00d4ff', letterSpacing: '0.08em',
          fontFamily: 'JetBrains Mono',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%',
            background: '#00d4ff', boxShadow: '0 0 6px #00d4ff' }} />
          POWERED BY GEMINI 2.5 FLASH
        </div>

        {/* Headline */}
        <h1 className="animate-slide-up" style={{
          fontSize: 'clamp(38px, 7vw, 68px)', fontWeight: 900, lineHeight: 1.05,
          letterSpacing: '-0.03em', marginBottom: '16px', color: '#e2e8f0',
          animationDelay: '50ms',
        }}>
          Turn code into<br />
          <span className="text-glow-cyan">API documentation</span>
        </h1>

        {/* One-liner */}
        <p className="animate-slide-up" style={{
          fontSize: '16px', color: 'rgba(226,232,240,0.4)',
          marginBottom: '40px', animationDelay: '100ms',
        }}>
          Drop a file. Get structured docs. Under 5 seconds.
        </p>

        {/* Stats */}
        <div className="animate-slide-up" style={{
          display: 'flex', justifyContent: 'center', gap: '10px',
          marginBottom: '48px', flexWrap: 'wrap', animationDelay: '150ms',
        }}>
          {STATS.map(({ icon: Icon, value, label, color }) => (
            <div key={label} className="card" style={{ padding: '12px 20px',
              display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Icon size={14} style={{ color }} />
              <span style={{ fontSize: '16px', fontWeight: 800, color,
                fontFamily: 'JetBrains Mono' }}>{value}</span>
              <span style={{ fontSize: '12px', color: 'rgba(226,232,240,0.35)',
                fontWeight: 500 }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Upload Zone */}
        <div className="animate-slide-up" style={{ animationDelay: '200ms', textAlign: 'left' }}>
          <UploadZone onUploadComplete={handleComplete} />
        </div>

      </div>
    </main>
  );
}


