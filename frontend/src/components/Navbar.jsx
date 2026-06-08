import { Link, useLocation } from 'react-router-dom';
import { Braces, FolderOpen, ExternalLink } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      borderBottom: '1px solid rgba(0,212,255,0.08)',
      background: 'rgba(5,10,20,0.85)',
      backdropFilter: 'blur(20px)',
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #00d4ff, #0080a0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 15px rgba(0,212,255,0.4)',
          }}>
            <Braces size={16} color="#050a14" strokeWidth={2.5} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '-0.02em', color: '#e2e8f0' }}>
            Syntax<span style={{ color: '#00d4ff' }}>Out</span>
          </span>
        </Link>

        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {[
            { to: '/', icon: Braces, label: 'New Project' },
            { to: '/projects', icon: FolderOpen, label: 'Projects' },
          ].map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
            return (
              <Link key={to} to={to} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '7px 14px', borderRadius: '8px', textDecoration: 'none',
                fontSize: '13px', fontWeight: 500,
                color: active ? '#00d4ff' : 'rgba(226,232,240,0.6)',
                background: active ? 'rgba(0,212,255,0.08)' : 'transparent',
                border: active ? '1px solid rgba(0,212,255,0.15)' : '1px solid transparent',
                transition: 'all 0.15s',
              }}>
                <Icon size={14} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* GitHub */}
        <a href="https://github.com" target="_blank" rel="noreferrer" className="btn-ghost"
           style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', textDecoration: 'none' }}>
          <ExternalLink size={14} />
          <span>GitHub</span>
        </a>
      </div>
    </header>
  );
}
