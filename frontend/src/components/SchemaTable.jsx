import Badge from './Badge.jsx';
import { ChevronDown, ChevronRight, Code2, Cpu, Layers, BookOpen, Package, Hash } from 'lucide-react';
import { useState } from 'react';

// ─── Section ──────────────────────────────────────────────────────────────────
const Section = ({ icon: Icon, title, count, children }) => {
  const [open, setOpen] = useState(true);
  if (!count) return null;
  return (
    <div style={{
      border: '1px solid #1e293b',
      borderRadius: '8px',
      overflow: 'hidden',
      marginBottom: '12px',
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '11px 15px',
          background: '#0f172a', border: 'none',
          cursor: 'pointer', transition: 'background 0.12s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(34,211,238,0.06)'}
        onMouseLeave={e => e.currentTarget.style.background = '#0f172a'}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px',
          fontSize: '14px', fontWeight: 600, color: '#94a3b8' }}>
          <Icon size={14} style={{ color: '#22d3ee' }} />
          {title}
          <span style={{
            fontSize: '11px', fontFamily: 'var(--mono)',
            padding: '2px 6px', borderRadius: '4px',
            background: 'rgba(34,211,238,0.08)', color: '#22d3ee',
            border: '1px solid rgba(34,211,238,0.2)',
          }}>{count}</span>
        </div>
        {open
          ? <ChevronDown size={14} style={{ color: '#64748b' }} />
          : <ChevronRight size={14} style={{ color: '#64748b' }} />}
      </button>
      {open && (
        <div style={{ borderTop: '1px solid #1e293b' }}>
          {children}
        </div>
      )}
    </div>
  );
};

// ─── Param row ────────────────────────────────────────────────────────────────
const ParamRow = ({ param }) => (
  <div style={{
    display: 'flex', alignItems: 'flex-start', gap: '8px',
    fontSize: '13.5px', padding: '5px 0', flexWrap: 'wrap',
  }}>
    <code style={{ color: '#e2e8f0', fontFamily: 'var(--mono)', fontWeight: 500 }}>{param.name}</code>
    <span style={{ color: '#475569' }}>·</span>
    <span style={{ color: '#94a3b8', fontFamily: 'var(--mono)' }}>{param.type}</span>
    {param.required && (
      <span style={{ color: '#f87171', fontSize: '11px', fontWeight: 600 }}>required</span>
    )}
    {param.description && (
      <span style={{ color: '#64748b', flex: 1 }}>{param.description}</span>
    )}
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function SchemaTable({ module }) {
  if (!module) return null;
  const doc = module.documentation || module;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>

      {/* Summary */}
      {doc.summary && (
        <div style={{
          background: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: '8px', padding: '16px 18px',
          marginBottom: '12px',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '12px', fontWeight: 600, color: '#22d3ee',
            letterSpacing: '0.1em', marginBottom: '10px', textTransform: 'uppercase',
          }}>
            <BookOpen size={12} /> Summary
          </div>
          <p style={{ fontSize: '14.5px', color: '#cbd5e1', lineHeight: 1.65, margin: 0 }}>
            {doc.summary}
          </p>
          {doc.language && (
            <span style={{
              marginTop: '12px', display: 'inline-block',
              fontSize: '12px', fontFamily: 'var(--mono)',
              padding: '3px 8px', borderRadius: '4px',
              background: '#1e293b', border: '1px solid #334155', color: '#94a3b8',
            }}>{doc.language}</span>
          )}
        </div>
      )}

      {/* Endpoints */}
      <Section icon={Code2} title="Endpoints" count={doc.endpoints?.length}>
        {doc.endpoints?.map((ep, i) => (
          <div key={i} style={{
            padding: '12px 14px',
            borderBottom: i < doc.endpoints.length - 1 ? '1px solid #1e293b' : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Badge method={ep.method} />
              <code style={{ fontSize: '13.5px', color: '#e2e8f0', fontFamily: 'var(--mono)', fontWeight: 500 }}>
                {ep.path}
              </code>
            </div>
            {ep.description && (
              <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: '0 0 8px', lineHeight: 1.5 }}>
                {ep.description}
              </p>
            )}
            {ep.params?.length > 0 && (
              <div style={{ marginTop: '10px' }}>
                <p style={{ fontSize: '11px', fontWeight: 600, color: '#64748b',
                  letterSpacing: '0.08em', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Params
                </p>
                {ep.params.map((p, j) => <ParamRow key={j} param={p} />)}
              </div>
            )}
            {ep.requestBody?.fields?.length > 0 && (
              <div style={{ marginTop: '10px' }}>
                <p style={{ fontSize: '11px', fontWeight: 600, color: '#64748b',
                  letterSpacing: '0.08em', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Body
                </p>
                {ep.requestBody.fields.map((p, j) => <ParamRow key={j} param={p} />)}
              </div>
            )}
          </div>
        ))}
      </Section>

      {/* Functions */}
      <Section icon={Cpu} title="Functions" count={doc.functions?.length}>
        {doc.functions?.map((fn, i) => (
          <div key={i} style={{
            padding: '12px 14px',
            borderBottom: i < doc.functions.length - 1 ? '1px solid #1e293b' : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <code style={{ fontSize: '13.5px', fontFamily: 'var(--mono)', color: '#e2e8f0', fontWeight: 500 }}>
                {fn.name}()
              </code>
              {fn.isAsync && (
                <span style={{
                  fontSize: '11px', padding: '2px 6px', borderRadius: '4px',
                  background: '#1e293b', color: '#94a3b8',
                  border: '1px solid #334155', fontFamily: 'var(--mono)',
                }}>async</span>
              )}
            </div>
            {fn.description && (
              <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: '0 0 6px', lineHeight: 1.5 }}>
                {fn.description}
              </p>
            )}
            {fn.params?.length > 0 && fn.params.map((p, j) => <ParamRow key={j} param={p} />)}
            {fn.returns && (
              <p style={{ fontSize: '13.5px', marginTop: '6px', color: '#64748b' }}>
                <span style={{ color: '#475569' }}>returns </span>
                <span style={{ color: '#94a3b8', fontFamily: 'var(--mono)' }}>{fn.returns}</span>
              </p>
            )}
          </div>
        ))}
      </Section>

      {/* Classes */}
      <Section icon={Layers} title="Classes" count={doc.classes?.length}>
        {doc.classes?.map((cls, i) => (
          <div key={i} style={{
            padding: '12px 14px',
            borderBottom: i < doc.classes.length - 1 ? '1px solid #1e293b' : 'none',
          }}>
            <code style={{ fontSize: '13.5px', fontFamily: 'var(--mono)', color: '#e2e8f0', fontWeight: 600 }}>
              {cls.name}
            </code>
            {cls.description && (
              <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: '6px 0 8px', lineHeight: 1.5 }}>
                {cls.description}
              </p>
            )}
            {cls.methods?.map((m, j) => (
              <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px',
                fontSize: '13.5px', padding: '4px 0' }}>
                <span style={{
                  fontFamily: 'var(--mono)', fontSize: '11px', padding: '2px 5px',
                  borderRadius: '4px',
                  color: m.access === 'private' ? '#f87171' : '#94a3b8',
                  background: '#1e293b',
                }}>{m.access || 'pub'}</span>
                <code style={{ color: '#cbd5e1', fontFamily: 'var(--mono)' }}>{m.name}()</code>
                {m.description && (
                  <span style={{ color: '#64748b', marginLeft: '4px' }}>{m.description}</span>
                )}
              </div>
            ))}
          </div>
        ))}
      </Section>

      {/* Imports */}
      <Section icon={Package} title="Imports" count={doc.imports?.length}>
        {doc.imports?.map((imp, i) => (
          <div key={i} style={{
            padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '12px',
            borderBottom: i < doc.imports.length - 1 ? '1px solid #1e293b' : 'none',
          }}>
            <code style={{ fontSize: '13px', fontFamily: 'var(--mono)', color: '#cbd5e1' }}>
              {imp.module}
            </code>
            {imp.purpose && (
              <span style={{ fontSize: '13.5px', color: '#64748b' }}>{imp.purpose}</span>
            )}
          </div>
        ))}
      </Section>

      {/* Constants */}
      <Section icon={Hash} title="Constants" count={doc.constants?.length}>
        {doc.constants?.map((c, i) => (
          <div key={i} style={{
            padding: '10px 14px',
            borderBottom: i < doc.constants.length - 1 ? '1px solid #1e293b' : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <code style={{ fontSize: '13px', fontFamily: 'var(--mono)', color: '#e2e8f0' }}>
                {c.name}
              </code>
              {c.value && (
                <code style={{ fontSize: '13px', fontFamily: 'var(--mono)', color: '#64748b' }}>
                  = {c.value}
                </code>
              )}
            </div>
            {c.description && (
              <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: '4px 0 0', lineHeight: 1.5 }}>
                {c.description}
              </p>
            )}
          </div>
        ))}
      </Section>
    </div>
  );
}
