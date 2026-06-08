import Badge from './Badge.jsx';
import { ChevronDown, ChevronRight, Code2, Cpu, Layers, BookOpen, Package, Hash } from 'lucide-react';
import { useState } from 'react';

// ─── Section Component ────────────────────────────────────────────────────────
const Section = ({ icon: Icon, title, count, children }) => {
  const [open, setOpen] = useState(true);
  if (!count) return null;
  return (
    <div style={{
      border: '1px solid rgba(0,212,255,0.08)',
      borderRadius: '12px',
      overflow: 'hidden',
      marginBottom: '10px',
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '10px 14px',
          background: 'rgba(0,212,255,0.04)', border: 'none',
          cursor: 'pointer', transition: 'background 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,255,0.08)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,212,255,0.04)'}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px',
          fontSize: '12px', fontWeight: 700, color: '#e2e8f0' }}>
          <Icon size={13} style={{ color: '#a78bfa' }} />
          {title}
          <span style={{
            fontSize: '11px', fontFamily: 'JetBrains Mono, monospace',
            padding: '2px 7px', borderRadius: '6px',
            background: 'rgba(167,139,250,0.1)', color: '#a78bfa',
            border: '1px solid rgba(167,139,250,0.2)',
          }}>{count}</span>
        </div>
        {open
          ? <ChevronDown size={13} style={{ color: 'rgba(226,232,240,0.4)' }} />
          : <ChevronRight size={13} style={{ color: 'rgba(226,232,240,0.4)' }} />}
      </button>
      {open && (
        <div style={{ borderTop: '1px solid rgba(0,212,255,0.05)' }}>
          {children}
        </div>
      )}
    </div>
  );
};

// ─── Param Row ────────────────────────────────────────────────────────────────
const ParamRow = ({ param }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px',
    fontSize: '12px', padding: '3px 0' }}>
    <code style={{ color: '#c4b5fd', fontFamily: 'JetBrains Mono, monospace' }}>{param.name}</code>
    <span style={{ color: 'rgba(226,232,240,0.2)' }}>·</span>
    <span style={{ color: '#fcd34d', fontFamily: 'JetBrains Mono, monospace' }}>{param.type}</span>
    {param.required && (
      <span style={{ color: '#fb7185', fontSize: '10px', fontWeight: 700 }}>required</span>
    )}
    {param.description && (
      <span style={{ color: 'rgba(226,232,240,0.35)', flex: 1 }}>{param.description}</span>
    )}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SchemaTable({ module }) {
  if (!module) return null;
  const doc = module.documentation || module;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

      {/* Summary */}
      {doc.summary && (
        <div style={{
          background: 'rgba(0,212,255,0.03)',
          border: '1px solid rgba(0,212,255,0.08)',
          borderRadius: '12px', padding: '14px 16px',
          marginBottom: '10px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '10px', fontWeight: 700, color: 'rgba(226,232,240,0.4)',
            letterSpacing: '0.1em', marginBottom: '8px' }}>
            <BookOpen size={11} /> SUMMARY
          </div>
          <p style={{ fontSize: '13px', color: 'rgba(226,232,240,0.75)',
            lineHeight: 1.65, margin: 0 }}>{doc.summary}</p>
          {doc.language && (
            <span style={{
              marginTop: '10px', display: 'inline-block',
              fontSize: '11px', fontFamily: 'JetBrains Mono, monospace',
              padding: '2px 8px', borderRadius: '6px',
              background: 'rgba(226,232,240,0.05)',
              border: '1px solid rgba(226,232,240,0.1)',
              color: 'rgba(226,232,240,0.4)',
            }}>{doc.language}</span>
          )}
        </div>
      )}

      {/* Endpoints */}
      <Section icon={Code2} title="Endpoints" count={doc.endpoints?.length}>
        {doc.endpoints?.map((ep, i) => (
          <div key={i} style={{
            padding: '12px 14px',
            borderBottom: i < doc.endpoints.length - 1 ? '1px solid rgba(0,212,255,0.05)' : 'none',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,255,0.02)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Badge method={ep.method} />
              <code style={{ fontSize: '13px', color: '#e2e8f0',
                fontFamily: 'JetBrains Mono, monospace' }}>{ep.path}</code>
            </div>
            {ep.description && (
              <p style={{ fontSize: '12px', color: 'rgba(226,232,240,0.4)',
                margin: '0 0 8px 0' }}>{ep.description}</p>
            )}
            {ep.params?.length > 0 && (
              <div style={{ marginTop: '8px' }}>
                <p style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(226,232,240,0.25)',
                  letterSpacing: '0.1em', marginBottom: '4px' }}>PARAMS</p>
                {ep.params.map((p, j) => <ParamRow key={j} param={p} />)}
              </div>
            )}
            {ep.requestBody?.fields?.length > 0 && (
              <div style={{ marginTop: '8px' }}>
                <p style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(226,232,240,0.25)',
                  letterSpacing: '0.1em', marginBottom: '4px' }}>REQUEST BODY</p>
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
            borderBottom: i < doc.functions.length - 1 ? '1px solid rgba(0,212,255,0.05)' : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <code style={{ fontSize: '13px', fontFamily: 'JetBrains Mono, monospace',
                color: '#7dd3fc' }}>{fn.name}()</code>
              {fn.isAsync && (
                <span style={{
                  fontSize: '10px', padding: '2px 6px', borderRadius: '4px',
                  background: 'rgba(167,139,250,0.1)', color: '#a78bfa',
                  border: '1px solid rgba(167,139,250,0.2)',
                  fontFamily: 'JetBrains Mono, monospace',
                }}>async</span>
              )}
            </div>
            {fn.description && (
              <p style={{ fontSize: '12px', color: 'rgba(226,232,240,0.4)', margin: '0 0 6px' }}>
                {fn.description}
              </p>
            )}
            {fn.params?.length > 0 && fn.params.map((p, j) => <ParamRow key={j} param={p} />)}
            {fn.returns && (
              <p style={{ fontSize: '12px', marginTop: '6px', color: 'rgba(226,232,240,0.35)' }}>
                <span style={{ color: 'rgba(226,232,240,0.2)' }}>returns </span>
                <span style={{ color: '#fcd34d', fontFamily: 'JetBrains Mono, monospace' }}>
                  {fn.returns}
                </span>
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
            borderBottom: i < doc.classes.length - 1 ? '1px solid rgba(0,212,255,0.05)' : 'none',
          }}>
            <code style={{ fontSize: '13px', fontFamily: 'JetBrains Mono, monospace',
              color: '#34d399', fontWeight: 700 }}>{cls.name}</code>
            {cls.description && (
              <p style={{ fontSize: '12px', color: 'rgba(226,232,240,0.4)',
                margin: '4px 0 8px' }}>{cls.description}</p>
            )}
            {cls.methods?.map((m, j) => (
              <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px',
                fontSize: '12px', padding: '3px 0' }}>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', padding: '1px 5px',
                  borderRadius: '4px',
                  color: m.access === 'private' ? 'rgba(226,232,240,0.2)' : '#34d399',
                  background: m.access === 'private' ? 'transparent' : 'rgba(52,211,153,0.08)',
                }}>{m.access || 'public'}</span>
                <code style={{ color: '#e2e8f0', fontFamily: 'JetBrains Mono, monospace' }}>
                  {m.name}()
                </code>
                {m.description && (
                  <span style={{ color: 'rgba(226,232,240,0.3)' }}>{m.description}</span>
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
            borderBottom: i < doc.imports.length - 1 ? '1px solid rgba(0,212,255,0.05)' : 'none',
          }}>
            <code style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace',
              color: '#c4b5fd' }}>{imp.module}</code>
            {imp.purpose && (
              <span style={{ fontSize: '12px', color: 'rgba(226,232,240,0.35)' }}>{imp.purpose}</span>
            )}
          </div>
        ))}
      </Section>

      {/* Constants */}
      <Section icon={Hash} title="Constants" count={doc.constants?.length}>
        {doc.constants?.map((c, i) => (
          <div key={i} style={{
            padding: '10px 14px',
            borderBottom: i < doc.constants.length - 1 ? '1px solid rgba(0,212,255,0.05)' : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <code style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace',
                color: '#fcd34d' }}>{c.name}</code>
              {c.value && (
                <code style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace',
                  color: 'rgba(226,232,240,0.3)' }}>= {c.value}</code>
              )}
            </div>
            {c.description && (
              <p style={{ fontSize: '12px', color: 'rgba(226,232,240,0.35)',
                margin: '3px 0 0' }}>{c.description}</p>
            )}
          </div>
        ))}
      </Section>
    </div>
  );
}
