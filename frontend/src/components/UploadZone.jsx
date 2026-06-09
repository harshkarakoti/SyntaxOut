import { useCallback, useState } from 'react';
import { UploadCloud, FileCode, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const ALLOWED_EXT = ['.js','.jsx','.ts','.tsx','.py','.go','.java','.cpp','.cs','.rb','.php'];

export default function UploadZone({ onUploadComplete }) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles]           = useState([]);
  const [status, setStatus]         = useState('idle');
  const [error, setError]           = useState('');
  const [progress, setProgress]     = useState('');

  const validateAndAdd = (incoming) => {
    const valid = Array.from(incoming).filter((f) => {
      const ext = '.' + f.name.split('.').pop().toLowerCase();
      return ALLOWED_EXT.includes(ext);
    });
    const skipped = Array.from(incoming).length - valid.length;
    if (skipped > 0) setError(`${skipped} unsupported file(s) skipped.`);
    setFiles((prev) => {
      const names = new Set(prev.map((f) => f.name));
      return [...prev, ...valid.filter((f) => !names.has(f.name))].slice(0, 10);
    });
  };

  const onDrop = useCallback((e) => {
    e.preventDefault(); setIsDragging(false); setError('');
    validateAndAdd(e.dataTransfer.files);
  }, []);

  const handleSubmit = async () => {
    if (!files.length) return;
    setStatus('uploading'); setError('');
    try {
      setProgress('Uploading...');
      const formData = new FormData();
      files.forEach((f) => formData.append('files', f));
      const { default: api, parseFiles } = await import('../services/api.js');
      const uploadRes = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

      setProgress('Analysing with Gemini...');
      const parseRes = await parseFiles({
        files: uploadRes.data.files,
        projectName: files.map((f) => f.name).join(', ').slice(0, 80),
      });

      setProgress('Done');
      setStatus('success');
      onUploadComplete(parseRes.data.meta.projectId);
    } catch (err) {
      setStatus('error');
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div style={{ width: '100%' }}>

      {/* Drop Zone */}
      <div
        onDrop={onDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => (!status || status === 'error') && document.getElementById('so-file-input').click()}
        className={`drop-zone ${isDragging ? 'active' : ''}`}
        style={{ padding: '40px 24px', textAlign: 'center' }}
      >
        <input
          id="so-file-input" type="file" multiple
          accept={ALLOWED_EXT.join(',')}
          style={{ display: 'none' }}
          onChange={(e) => { setError(''); validateAndAdd(e.target.files); }}
        />

        <div style={{
          width: '40px', height: '40px', borderRadius: '8px',
          background: isDragging ? 'rgba(34,211,238,0.1)' : '#131720',
          border: `1px solid ${isDragging ? 'rgba(34,211,238,0.3)' : '#222a38'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 14px',
          transition: 'all 0.2s',
        }}>
          <UploadCloud size={18} color={isDragging ? '#22d3ee' : '#475569'} />
        </div>

        <p style={{ fontSize: '15px', fontWeight: 500, color: '#e8e8e8', marginBottom: '4px' }}>
          {isDragging ? 'Release to add files' : 'Drop files here, or click to browse'}
        </p>
        <p style={{ fontSize: '13px', color: '#525252' }}>
          Up to 10 files · 2 MB each
        </p>

        {/* Supported extensions */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
          gap: '5px', marginTop: '16px',
        }}>
          {ALLOWED_EXT.map((ext) => (
            <span key={ext} style={{
              fontSize: '11px', fontFamily: 'var(--mono)',
              padding: '2px 7px', borderRadius: '4px',
              background: '#161616', border: '1px solid #252525',
              color: '#525252',
            }}>{ext}</span>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px',
          color: '#c0392b', fontSize: '12px',
        }}>
          <AlertCircle size={13} /> {error}
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}
          className="animate-fade-in">
          {files.map((file) => (
            <div key={file.name} style={{
              padding: '9px 12px',
              background: '#161616',
              border: '1px solid #222',
              borderRadius: '7px',
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', gap: '10px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                <FileCode size={13} color="#22d3ee" style={{ flexShrink: 0 }} />
                <span style={{
                  fontSize: '14px', fontWeight: 500, color: '#e8e8e8',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  fontFamily: 'var(--mono)',
                }}>{file.name}</span>
                <span style={{ fontSize: '12px', color: '#525252', flexShrink: 0 }}>
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setFiles(p => p.filter(f => f.name !== file.name)); }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#404040', padding: '2px', display: 'flex',
                  flexShrink: 0, transition: 'color 0.12s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#e8e8e8'}
                onMouseLeave={e => e.currentTarget.style.color = '#404040'}
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Submit */}
      {files.length > 0 && status !== 'success' && (
        <button
          onClick={handleSubmit}
          disabled={status === 'uploading'}
          className="btn-primary"
          style={{ width: '100%', marginTop: '10px' }}
        >
          {status === 'uploading' ? (
            <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> {progress}</>
          ) : (
            <>Generate docs · {files.length} file{files.length !== 1 ? 's' : ''}</>
          )}
        </button>
      )}

      {/* Success */}
      {status === 'success' && (
        <div className="animate-fade-in" style={{
          marginTop: '10px', padding: '10px 14px', borderRadius: '7px',
          background: '#161616', border: '1px solid #2a2a2a',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <CheckCircle size={14} color="#e8e8e8" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: '13px', color: '#a0a0a0' }}>
            Done — redirecting to your documentation…
          </p>
        </div>
      )}
    </div>
  );
}
