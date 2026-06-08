// HTTP method color badges
const METHOD_STYLES = {
  GET:    'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  POST:   'bg-sky-500/15 text-sky-400 border border-sky-500/30',
  PUT:    'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  PATCH:  'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  DELETE: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
};

export default function Badge({ method, label }) {
  const styles = METHOD_STYLES[method?.toUpperCase()] || 'bg-slate-700 text-slate-300 border border-slate-600';
  return (
    <span className={`badge ${styles}`}>
      {label || method}
    </span>
  );
}
