// HTTP method badges — neutral monochrome palette
const METHOD_STYLES = {
  GET:    { color: '#60a5fa', bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.18)' }, // Blue
  POST:   { color: '#34d399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.18)' }, // Emerald
  PUT:    { color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.18)' },  // Amber
  PATCH:  { color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.18)' }, // Violet
  DELETE: { color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.18)' }, // Red
};

export default function Badge({ method, label }) {
  const s = METHOD_STYLES[method?.toUpperCase()] || { color: '#94a3b8', bg: '#1e293b', border: '#334155' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontFamily: 'var(--mono)', fontSize: '11px', fontWeight: 600,
      letterSpacing: '0.05em',
      padding: '3px 7px', borderRadius: '4px',
      color: s.color, background: s.bg,
      border: `1px solid ${s.border}`,
    }}>
      {label || method}
    </span>
  );
}
