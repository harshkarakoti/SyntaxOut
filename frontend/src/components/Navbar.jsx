import { Link, useLocation } from 'react-router-dom';
import { Braces, FolderOpen } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { to: '/',         label: 'New' },
    { to: '/projects', label: 'History' },
  ];

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      borderBottom: '1px solid #1f1f1f',
      background: 'rgba(13,13,13,0.92)',
      backdropFilter: 'blur(16px)',
    }}>
      <div style={{
        maxWidth: '1320px', margin: '0 auto',
        padding: '0 20px', height: '52px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '7px',
            background: '#0e2a2e',
            border: '1px solid rgba(34,211,238,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Braces size={14} color="#22d3ee" strokeWidth={2.5} />
          </div>
          <span style={{
            fontWeight: 600, fontSize: '15px',
            letterSpacing: '-0.03em', color: '#e8e8e8',
          }}>
            SyntaxOut
          </span>
        </Link>

        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          {navItems.map(({ to, label }) => {
            const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
            return (
              <Link key={to} to={to} style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '5px 12px', borderRadius: '6px', textDecoration: 'none',
                fontSize: '13px', fontWeight: active ? 600 : 500,
                color: active ? '#22d3ee' : '#475569',
                background: active ? 'rgba(34,211,238,0.08)' : 'transparent',
                transition: 'color 0.15s, background 0.15s',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#a0a0a0'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#606060'; }}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right slot */}
        <a
          href="https://github.com/harshkarakoti/SyntaxOut"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            fontSize: '13px', fontWeight: 500, color: '#525252',
            textDecoration: 'none', transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#a0a0a0'}
          onMouseLeave={e => e.currentTarget.style.color = '#525252'}
        >
          GitHub
        </a>
      </div>
    </header>
  );
}
