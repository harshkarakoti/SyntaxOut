import Badge from './Badge.jsx';
import { ChevronDown, ChevronRight, Code2, Cpu, Layers, BookOpen, Package, Hash } from 'lucide-react';
import { useState } from 'react';

// ─── Section ──────────────────────────────────────────────────────────────────
const Section = ({ icon: Icon, title, count, children }) => {
  const [open, setOpen] = useState(true);
  if (!count) return null;
  return (
    <div style={{
      border: '1px solid #1f1f1f',
      borderRadius: '8px',
      overflow: 'hidden',
      marginBottom: '8px',
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '9px 12px',
          background: '#111', border: 'none',
          cursor: 'pointer', transition: 'background 0.12s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#161616'}
        onMouseLeave={e => e.currentTarget.style.background = '#111'}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px',
          fontSize: '12px', fontWeight: 500, color: '#a0a0a0' }}>
          <Icon size={12} style={{ color: '#525252' }} />
          {title}
          <span style={{
            fontSize: '10px', fontFamily: 'var(--mono)',
            padding: '1px 5px', borderRadius: '4px',
            background: '#1e1e1e', color: '#525252',
            border: '1px solid #2a2a2a',
          }}>{count}</span>
        </div>
        {open
          ? <ChevronDown size={12} style={{ color: '#404040' }} />
          : <ChevronRight size={12} style={{ color: '#404040' }} />}
      </button>
      {open && (
        <div style={{ borderTop: '1px solid #1a1a1a' }}>
          {children}
        </div>
      )}
    </div>
  );
};

// ─── Param row ────────────────────────────────────────────────────────────────
const ParamRow = ({ param }) => (
  <div style={{
    display: 'flex', alignItems: 'flex-start', gap: '6px',
    fontSize: '12px', padding: '3px 0', flexWrap: 'wrap',
  }}>
    <code style={{ color: '#e8e8e8', fontFamily: 'var(--mono)' }}>{param.name}</code>
    <span style={{ color: '#333' }}>·</span>
    <span style={{ color: '#606060', fontFamily: 'var(--mono)' }}>{param.type}</span>
    {param.required && (
      <span style={{ color: '#c0392b', fontSize: '10px', fontWeight: 600 }}>required</span>
    )}
    {param.description && (
      <span style={{ color: '#525252', flex: 1 }}>{param.description}</span>
    )}
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function SchemaTable({ module }) {
  if (!module) return null;
  const doc = module.documentation || module;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>

      {/* Summary */}
      {doc.summary && (
        <div style={{
          background: '#111',
          border: '1px solid #1f1f1f',
          borderRadius: '8px', padding: '12px 14px',
          marginBottom: '8px',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            fontSize: '10px', fontWeight: 600, color: '#404040',
            letterSpacing: '0.1em', marginBottom: '8px', textTransform: 'uppercase',
          }}>
            <BookOpen size={10} /> Summary
          </div>
          <p style={{ fontSize: '13px', color: '#a0a0a0', lineHeight: 1.65, margin: 0 }}>
            {doc.summary}
          </p>
          {doc.language && (
            <span style={{
              marginTop: '10px', display: 'inline-block',
              fontSize: '11px', fontFamily: 'var(--mono)',
              padding: '2px 7px', borderRadius: '4px',
              background: '#161616', border: '1px solid #222', color: '#525252',
            }}>{doc.language}</span>
          )}
        </div>
      )}

      {/* Endpoints */}
      <Section icon={Code2} title="Endpoints" count={doc.endpoints?.length}>
        {doc.endpoints?.map((ep, i) => (
          <div key={i} style={{
            padding: '10px 12px',
            borderBottom: i < doc.endpoints.length - 1 ? '1px solid #1a1a1a' : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
              <Badge method={ep.method} />
              <code style={{ fontSize: '12px', color: '#e8e8e8', fontFamily: 'var(--mono)' }}>
                {ep.path}
              </code>
            </div>
            {ep.description && (
              <p style={{ fontSize: '12px', color: '#525252', margin: '0 0 6px' }}>
                {ep.description}
              </p>
            )}
            {ep.params?.length > 0 && (
              <div style={{ marginTop: '6px' }}>
                <p style={{ fontSize: '10px', fontWeight: 600, color: '#404040',
                  letterSpacing: '0.08em', marginBottom: '4px', textTransform: 'uppercase' }}>
                  Params
                </p>
                {ep.params.map((p, j) => <ParamRow key={j} param={p} />)}
              </div>
            )}
            {ep.requestBody?.fields?.length > 0 && (
              <div style={{ marginTop: '6px' }}>
                <p style={{ fontSize: '10px', fontWeight: 600, color: '#404040',
                  letterSpacing: '0.08em', marginBottom: '4px', textTransform: 'uppercase' }}>
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
            padding: '10px 12px',
            borderBottom: i < doc.functions.length - 1 ? '1px solid #1a1a1a' : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <code style={{ fontSize: '12px', fontFamily: 'var(--mono)', color: '#e8e8e8' }}>
                {fn.name}()
              </code>
              {fn.isAsync && (
                <span style={{
                  fontSize: '10px', padding: '1px 5px', borderRadius: '4px',
                  background: '#1e1e1e', color: '#525252',
                  border: '1px solid #2a2a2a', fontFamily: 'var(--mono)',
                }}>async</span>
              )}
            </div>
            {fn.description && (
              <p style={{ fontSize: '12px', color: '#525252', margin: '0 0 4px' }}>
                {fn.description}
              </p>
            )}
            {fn.params?.length > 0 && fn.params.map((p, j) => <ParamRow key={j} param={p} />)}
            {fn.returns && (
              <p style={{ fontSize: '12px', marginTop: '4px', color: '#404040' }}>
                <span style={{ color: '#333' }}>returns </span>
                <span style={{ color: '#606060', fontFamily: 'var(--mono)' }}>{fn.returns}</span>
              </p>
            )}
          </div>
        ))}
      </Section>

      {/* Classes */}
      <Section icon={Layers} title="Classes" count={doc.classes?.length}>
        {doc.classes?.map((cls, i) => (
          <div key={i} style={{
            padding: '10px 12px',
            borderBottom: i < doc.classes.length - 1 ? '1px solid #1a1a1a' : 'none',
          }}>
            <code style={{ fontSize: '12px', fontFamily: 'var(--mono)', color: '#e8e8e8', fontWeight: 600 }}>
              {cls.name}
            </code>
            {cls.description && (
              <p style={{ fontSize: '12px', color: '#525252', margin: '4px 0 6px' }}>
                {cls.description}
              </p>
            )}
            {cls.methods?.map((m, j) => (
              <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: '12px', padding: '2px 0' }}>
                <span style={{
                  fontFamily: 'var(--mono)', fontSize: '10px', padding: '1px 4px',
                  borderRadius: '4px',
                  color: m.access === 'private' ? '#404040' : '#606060',
                  background: '#161616',
                }}>{m.access || 'pub'}</span>
                <code style={{ color: '#a0a0a0', fontFamily: 'var(--mono)' }}>{m.name}()</code>
                {m.description && (
                  <span style={{ color: '#404040' }}>{m.description}</span>
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
            padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '10px',
            borderBottom: i < doc.imports.length - 1 ? '1px solid #1a1a1a' : 'none',
          }}>
            <code style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: '#a0a0a0' }}>
              {imp.module}
            </code>
            {imp.purpose && (
              <span style={{ fontSize: '12px', color: '#404040' }}>{imp.purpose}</span>
            )}
          </div>
        ))}
      </Section>

      {/* Constants */}
      <Section icon={Hash} title="Constants" count={doc.constants?.length}>
        {doc.constants?.map((c, i) => (
          <div key={i} style={{
            padding: '8px 12px',
            borderBottom: i < doc.constants.length - 1 ? '1px solid #1a1a1a' : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <code style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: '#e8e8e8' }}>
                {c.name}
              </code>
              {c.value && (
                <code style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: '#404040' }}>
                  = {c.value}
                </code>
              )}
            </div>
            {c.description && (
              <p style={{ fontSize: '12px', color: '#525252', margin: '3px 0 0' }}>
                {c.description}
              </p>
            )}
          </div>
        ))}
      </Section>
    </div>
  );
}
