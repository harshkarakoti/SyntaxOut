import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

// ─── Syntax Highlighter ───────────────────────────────────────────────────────
// Uses only inline styles — Tailwind purges dynamic class strings at build time.
const highlight = (raw) => {
  if (!raw) return '';

  // Step 1: HTML-escape the raw line so code like <div> shows safely
  let s = raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Step 2: Apply highlighting in safe order (comments first to avoid conflicts)
  const c = (color, text) => `<span style="color:${color}">${text}</span>`;
  const italic = (color, text) => `<span style="color:${color};font-style:italic">${text}</span>`;

  // Comments
  s = s.replace(/(\/\/[^\n]*|#[^\n]*)/g, (m) => italic('#4b5563', m));

  // Strings
  s = s.replace(/(&quot;|&#039;|`)[^&]*?\1|"[^"]*"|'[^']*'|`[^`]*`/g, (m) =>
    c('#fcd34d', m));

  // Keywords
  s = s.replace(
    /\b(const|let|var|function|async|await|return|export|import|from|class|extends|new|if|else|try|catch|throw|for|of|in|while|switch|case|break|default|typeof|instanceof|null|undefined|true|false|this|super|require|module|def|elif|except|with|as|pass|None|True|False|and|or|not|lambda|yield|global|del|assert|raise)\b/g,
    (m) => c('#a78bfa', m)
  );

  // Built-in types
  s = s.replace(
    /\b(string|number|boolean|void|any|Array|Promise|Object|int|float|str|bool|list|dict|tuple)\b/g,
    (m) => c('#67e8f9', m)
  );

  // Numeric literals
  s = s.replace(/\b(\d+\.?\d*)\b/g, (m) => c('#34d399', m));

  // Function/method calls
  s = s.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\s*\()/g, (m) => c('#7dd3fc', m));

  return s;
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function CodeViewer({ filename, content }) {
  const [copied, setCopied] = useState(false);

  const lines = (content || '// No content available').split('\n');

  const copy = () => {
    navigator.clipboard.writeText(content || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column',
      background: '#020810', borderRadius: '0', overflow: 'hidden',
      borderRight: '1px solid rgba(0,212,255,0.06)' }}>

      {/* ── Header bar ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px', borderBottom: '1px solid rgba(0,212,255,0.08)',
        background: 'rgba(0,212,255,0.03)', flexShrink: 0 }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Traffic lights */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {['#ff5f57', '#ffbd2e', '#28ca41'].map((c) => (
              <div key={c} style={{ width: '11px', height: '11px', borderRadius: '50%',
                background: c, opacity: 0.75 }} />
            ))}
          </div>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px',
            color: 'rgba(0,212,255,0.5)' }}>
            {filename || 'source.js'}
          </span>
        </div>

        <button onClick={copy} style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          padding: '5px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer',
          background: 'transparent', color: copied ? '#34d399' : 'rgba(226,232,240,0.4)',
          fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', transition: 'all 0.15s',
        }}>
          {copied
            ? <><Check size={12} /> Copied</>
            : <><Copy size={12} /> Copy</>}
        </button>
      </div>

      {/* ── Code lines ─────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'auto' }}>
        <table style={{ minWidth: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {lines.map((line, i) => (
              <tr key={i} style={{ transition: 'background 0.1s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,255,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                {/* Line number */}
                <td style={{
                  width: '50px', minWidth: '50px', maxWidth: '50px',
                  paddingLeft: '12px', paddingRight: '12px',
                  textAlign: 'right', userSelect: 'none', verticalAlign: 'top',
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '12px',
                  lineHeight: '22px', color: 'rgba(0,212,255,0.15)',
                  borderRight: '1px solid rgba(0,212,255,0.06)',
                }}>
                  {i + 1}
                </td>

                {/* Code content */}
                <td style={{
                  paddingLeft: '16px', paddingRight: '24px',
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '12.5px',
                  lineHeight: '22px', color: '#94a3b8',
                  whiteSpace: 'pre', verticalAlign: 'top',
                }}>
                  <span dangerouslySetInnerHTML={{ __html: highlight(line) || '&nbsp;' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
