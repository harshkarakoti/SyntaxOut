import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

// ─── Syntax highlighter ───────────────────────────────────────────────────────
const highlight = (raw) => {
  if (!raw) return '';
  let s = raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const c  = (color, text) => `<span style="color:${color}">${text}</span>`;
  const ci = (color, text) => `<span style="color:${color};font-style:italic">${text}</span>`;

  // Comments
  s = s.replace(/(\/\/[^\n]*|#[^\n]*)/g, (m) => ci('#444', m));
  // Strings
  s = s.replace(/(&quot;|&#039;|`)[^&]*?\1|"[^"]*"|'[^']*'|`[^`]*`/g, (m) => c('#a0a0a0', m));
  // Keywords
  s = s.replace(
    /\b(const|let|var|function|async|await|return|export|import|from|class|extends|new|if|else|try|catch|throw|for|of|in|while|switch|case|break|default|typeof|instanceof|null|undefined|true|false|this|super|require|module|def|elif|except|with|as|pass|None|True|False|and|or|not|lambda|yield|global|del|assert|raise)\b/g,
    (m) => c('#606060', m)
  );
  // Built-in types
  s = s.replace(
    /\b(string|number|boolean|void|any|Array|Promise|Object|int|float|str|bool|list|dict|tuple)\b/g,
    (m) => c('#707070', m)
  );
  // Numbers
  s = s.replace(/\b(\d+\.?\d*)\b/g, (m) => c('#808080', m));
  // Function calls
  s = s.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\s*\()/g, (m) => c('#c8c8c8', m));
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
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: '#0a0a0a', overflow: 'hidden',
      borderRight: '1px solid #1a1a1a',
    }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 14px', borderBottom: '1px solid #1a1a1a',
        background: '#0d0d0d', flexShrink: 0,
      }}>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: '12px', color: '#525252',
        }}>
          {filename || 'source.js'}
        </span>
        <button onClick={copy} style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          padding: '4px 8px', borderRadius: '5px', border: 'none',
          cursor: 'pointer', background: 'transparent',
          color: copied ? '#a0a0a0' : '#404040',
          fontSize: '11px', fontFamily: 'var(--mono)',
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#808080'}
        onMouseLeave={e => e.currentTarget.style.color = copied ? '#a0a0a0' : '#404040'}
        >
          {copied
            ? <><Check size={11} /> Copied</>
            : <><Copy size={11} /> Copy</>}
        </button>
      </div>

      {/* Code */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'auto' }}>
        <table style={{ minWidth: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {lines.map((line, i) => (
              <tr key={i}
                onMouseEnter={e => e.currentTarget.style.background = '#111'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Line number */}
                <td style={{
                  width: '44px', minWidth: '44px', maxWidth: '44px',
                  paddingLeft: '10px', paddingRight: '10px',
                  textAlign: 'right', userSelect: 'none', verticalAlign: 'top',
                  fontFamily: 'var(--mono)', fontSize: '12px',
                  lineHeight: '20px', color: '#2e2e2e',
                  borderRight: '1px solid #1a1a1a',
                }}>
                  {i + 1}
                </td>
                {/* Code */}
                <td style={{
                  paddingLeft: '14px', paddingRight: '20px',
                  fontFamily: 'var(--mono)', fontSize: '12.5px',
                  lineHeight: '20px', color: '#606060',
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
