import Badge from './Badge.jsx';
import { ChevronDown, ChevronRight, Code2, Cpu, Layers, BookOpen, Package, Hash } from 'lucide-react';
import { useState } from 'react';

const Section = ({ icon: Icon, title, count, children }) => {
  const [open, setOpen] = useState(true);
  if (!count) return null;
  return (
    <div className="border border-slate-700/50 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-800/60 hover:bg-slate-700/40 transition-colors"
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <Icon size={14} className="text-violet-400" />
          {title}
          <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20">
            {count}
          </span>
        </div>
        {open ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-500" />}
      </button>
      {open && <div className="divide-y divide-slate-700/30">{children}</div>}
    </div>
  );
};

const ParamRow = ({ param }) => (
  <div className="flex items-start gap-2 text-xs py-1">
    <code className="text-violet-300 font-mono">{param.name}</code>
    <span className="text-slate-600">·</span>
    <span className="text-amber-400 font-mono">{param.type}</span>
    {param.required && <span className="text-rose-400 text-[10px] font-semibold">required</span>}
    {param.description && <span className="text-slate-500 flex-1">{param.description}</span>}
  </div>
);

export default function SchemaTable({ module }) {
  if (!module) return null;
  const doc = module.documentation || module;

  return (
    <div className="space-y-3 animate-fade-in">

      {/* Summary */}
      {doc.summary && (
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
            <BookOpen size={12} /> Summary
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{doc.summary}</p>
          {doc.language && (
            <span className="mt-2 inline-block text-xs font-mono px-2 py-0.5 rounded bg-slate-700 text-slate-400 border border-slate-600">
              {doc.language}
            </span>
          )}
        </div>
      )}

      {/* Endpoints */}
      <Section icon={Code2} title="Endpoints" count={doc.endpoints?.length}>
        {doc.endpoints?.map((ep, i) => (
          <div key={i} className="px-4 py-3 hover:bg-slate-700/20 transition-colors animate-slide-up"
               style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge method={ep.method} />
              <code className="text-sm text-slate-200 font-mono">{ep.path}</code>
            </div>
            {ep.description && <p className="text-xs text-slate-500 mb-2">{ep.description}</p>}

            {ep.params?.length > 0 && (
              <div className="mt-2">
                <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider mb-1">Params</p>
                {ep.params.map((p, j) => <ParamRow key={j} param={p} />)}
              </div>
            )}
            {ep.requestBody?.fields?.length > 0 && (
              <div className="mt-2">
                <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider mb-1">Request Body</p>
                {ep.requestBody.fields.map((p, j) => <ParamRow key={j} param={p} />)}
              </div>
            )}
          </div>
        ))}
      </Section>

      {/* Functions */}
      <Section icon={Cpu} title="Functions" count={doc.functions?.length}>
        {doc.functions?.map((fn, i) => (
          <div key={i} className="px-4 py-3 hover:bg-slate-700/20 transition-colors">
            <div className="flex items-center gap-2 mb-1">
              <code className="text-sm font-mono text-sky-400">{fn.name}()</code>
              {fn.isAsync && <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20 font-mono">async</span>}
            </div>
            {fn.description && <p className="text-xs text-slate-500 mb-1.5">{fn.description}</p>}
            {fn.params?.length > 0 && fn.params.map((p, j) => <ParamRow key={j} param={p} />)}
            {fn.returns && (
              <p className="text-xs mt-1.5 text-slate-500">
                <span className="text-slate-600">returns</span>{' '}
                <span className="text-amber-400 font-mono">{fn.returns}</span>
              </p>
            )}
          </div>
        ))}
      </Section>

      {/* Classes */}
      <Section icon={Layers} title="Classes" count={doc.classes?.length}>
        {doc.classes?.map((cls, i) => (
          <div key={i} className="px-4 py-3 hover:bg-slate-700/20 transition-colors">
            <code className="text-sm font-mono text-emerald-400 font-semibold">{cls.name}</code>
            {cls.description && <p className="text-xs text-slate-500 mt-1 mb-2">{cls.description}</p>}
            {cls.methods?.map((m, j) => (
              <div key={j} className="text-xs flex items-center gap-2 py-0.5">
                <span className={`font-mono text-[10px] px-1 rounded ${m.access === 'private' ? 'text-slate-600' : 'text-emerald-500'}`}>
                  {m.access || 'public'}
                </span>
                <code className="text-slate-300">{m.name}()</code>
                {m.description && <span className="text-slate-600">{m.description}</span>}
              </div>
            ))}
          </div>
        ))}
      </Section>

      {/* Imports */}
      <Section icon={Package} title="Imports" count={doc.imports?.length}>
        {doc.imports?.map((imp, i) => (
          <div key={i} className="px-4 py-2 hover:bg-slate-700/20 transition-colors flex items-center gap-3">
            <code className="text-xs font-mono text-violet-300">{imp.module}</code>
            {imp.purpose && <span className="text-xs text-slate-600">{imp.purpose}</span>}
          </div>
        ))}
      </Section>

      {/* Constants */}
      <Section icon={Hash} title="Constants" count={doc.constants?.length}>
        {doc.constants?.map((c, i) => (
          <div key={i} className="px-4 py-2 hover:bg-slate-700/20 transition-colors">
            <div className="flex items-center gap-2">
              <code className="text-xs font-mono text-amber-400">{c.name}</code>
              {c.value && <code className="text-xs font-mono text-slate-500">= {c.value}</code>}
            </div>
            {c.description && <p className="text-xs text-slate-600 mt-0.5">{c.description}</p>}
          </div>
        ))}
      </Section>
    </div>
  );
}
