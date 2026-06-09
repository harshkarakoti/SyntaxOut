// HTTP method badges — neutral monochrome palette
const METHOD_STYLES = {
  GET:    { color: '#a0a0a0', bg: '#1e1e1e', border: '#2a2a2a' },
  POST:   { color: '#e8e8e8', bg: '#1e1e1e', border: '#2a2a2a' },
  PUT:    { color: '#a0a0a0', bg: '#1e1e1e', border: '#2a2a2a' },
  PATCH:  { color: '#a0a0a0', bg: '#1e1e1e', border: '#2a2a2a' },
  DELETE: { color: '#c0392b', bg: '#1c1212', border: '#2a1a1a' },
};

export default function Badge({ method, label }) {
  const s = METHOD_STYLES[method?.toUpperCase()] || { color: '#606060', bg: '#161616', border: '#222' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontFamily: 'var(--mono)', fontSize: '10px', fontWeight: 600,
      letterSpacing: '0.05em',
      padding: '2px 6px', borderRadius: '4px',
      color: s.color, background: s.bg,
      border: `1px solid ${s.border}`,
    }}>
      {label || method}
    </span>
  );
}
