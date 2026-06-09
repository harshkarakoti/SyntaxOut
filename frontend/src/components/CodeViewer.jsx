import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

// ─── Syntax Highlighter ───────────────────────────────────────────────────────
// Single-pass tokenizer — uses one regex with alternation so that once a
// comment or string is matched, keywords/numbers can never nest inside it.
const COLORS = {
  comment:  '#4a5568',
  string:   '#a0a0a0',
  keyword:  '#6b7280',
  type:     '#718096',
  number:   '#718096',
  fn:       '#cbd5e0',
  plain:    '#6b7280',
};

const KW = 'const|let|var|function|async|await|return|export|import|from|class|extends|new|if|else|try|catch|throw|for|of|in|while|switch|case|break|default|typeof|instanceof|null|undefined|true|false|this|super|require|module|def|elif|except|with|as|pass|None|True|False|and|or|not|lambda|yield|global|del|assert|raise';
const TY = 'string|number|boolean|void|any|Array|Promise|Object|int|float|str|bool|list|dict|tuple';

// Token regex — order matters: comment > string > keyword > type > number > fn-call > plain
const TOKEN_RE = new RegExp(
  [
    '(\\/\\/[^\\n]*|#[^\\n]*)',                // 1: line comment
    '(`[^`]*`|"(?:[^"\\\\]|\\\\.)*"|\'(?:[^\'\\\\]|\\\\.)*\')', // 2: string
    `\\b(${KW})\\b`,                           // 3: keyword
    `\\b(${TY})\\b`,                           // 4: type
    '\\b(\\d+\\.?\\d*)\\b',                    // 5: number
    '\\b([A-Za-z_$][\\w$]*)(?=\\s*\\()',       // 6: function call
    '([<>&])',                                  // 7: HTML-unsafe chars
  ].join('|'),
  'g'
);

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const span = (color, text) => `<span style="color:${color}">${text}</span>`;

const highlight = (raw) => {
  if (!raw) return '';
  let result = '';
  let lastIndex = 0;
  let m;
  TOKEN_RE.lastIndex = 0;

  while ((m = TOKEN_RE.exec(raw)) !== null) {
    // Append any plain text between last match and this one (escaped)
    if (m.index > lastIndex) {
      result += span(COLORS.plain, escape(raw.slice(lastIndex, m.index)));
    }

    if (m[1] !== undefined) result += span(COLORS.comment, escape(m[1]));        // comment
    else if (m[2] !== undefined) result += span(COLORS.string, escape(m[2]));    // string
    else if (m[3] !== undefined) result += span(COLORS.keyword, escape(m[3]));   // keyword
    else if (m[4] !== undefined) result += span(COLORS.type, escape(m[4]));      // type
    else if (m[5] !== undefined) result += span(COLORS.number, escape(m[5]));    // number
    else if (m[6] !== undefined) result += span(COLORS.fn, escape(m[6]));        // fn call
    else if (m[7] !== undefined) result += escape(m[7]);                          // <>&

    lastIndex = m.index + m[0].length;
  }

  // Remaining plain text
  if (lastIndex < raw.length) {
    result += span(COLORS.plain, escape(raw.slice(lastIndex)));
  }

  return result;
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
      background: '#0a0d12', overflow: 'hidden',
      borderRight: '1px solid #1a2030',
    }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 14px', borderBottom: '1px solid #1a2030',
        background: '#0c0f14', flexShrink: 0,
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
                  lineHeight: '20px', color: 'rgba(34,211,238,0.18)',
                  borderRight: '1px solid #1a2030',
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
