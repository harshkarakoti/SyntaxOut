import { useCallback, useState } from 'react';
import { UploadCloud, FileCode, X, CheckCircle, AlertCircle, Loader2, Terminal } from 'lucide-react';

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
      setProgress('Uploading files to memory buffer...');
      const formData = new FormData();
      files.forEach((f) => formData.append('files', f));
      const { default: api, parseFiles } = await import('../services/api.js');
      const uploadRes = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

      setProgress('Sending to Gemini 2.5 Flash AI...');
      const parseRes = await parseFiles({
        files: uploadRes.data.files,
        projectName: files.map((f) => f.name).join(', ').slice(0, 80),
      });

      setProgress('Saving to database...');
      setStatus('success');
      onUploadComplete(parseRes.data.meta.projectId);
    } catch (err) {
      setStatus('error');
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '680px', margin: '0 auto' }}>

      {/* Terminal-style header bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '10px 16px',
        background: 'rgba(0,212,255,0.04)',
        border: '1px solid rgba(0,212,255,0.12)',
        borderBottom: 'none',
        borderRadius: '16px 16px 0 0',
      }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['#ff5f57','#ffbd2e','#28ca41'].map(c => (
            <div key={c} style={{ width: '11px', height: '11px', borderRadius: '50%', background: c, opacity: 0.8 }} />
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px',
          marginLeft: '8px', color: 'rgba(0,212,255,0.5)', fontSize: '12px', fontFamily: 'JetBrains Mono' }}>
          <Terminal size={12} />
          syntaxout — file ingestion pipeline
        </div>
      </div>

      {/* Drop Zone */}
      <div
        onDrop={onDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => !status || status === 'error' ? document.getElementById('so-file-input').click() : null}
        className={`drop-zone ${isDragging ? 'active' : ''}`}
        style={{ padding: '48px 32px', textAlign: 'center', borderRadius: '0 0 16px 16px',
          borderTop: 'none' }}>

        <input id="so-file-input" type="file" multiple accept={ALLOWED_EXT.join(',')}
          style={{ display: 'none' }}
          onChange={(e) => { setError(''); validateAndAdd(e.target.files); }} />

        {/* Icon */}
        <div style={{
          width: '72px', height: '72px', borderRadius: '18px', margin: '0 auto 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: isDragging ? 'rgba(0,212,255,0.15)' : 'rgba(0,212,255,0.06)',
          border: `1px solid ${isDragging ? 'rgba(0,212,255,0.5)' : 'rgba(0,212,255,0.15)'}`,
          boxShadow: isDragging ? '0 0 30px rgba(0,212,255,0.2)' : 'none',
          transition: 'all 0.3s',
        }}>
          <UploadCloud size={30} color={isDragging ? '#00d4ff' : 'rgba(0,212,255,0.6)'}
            style={{ filter: isDragging ? 'drop-shadow(0 0 8px #00d4ff)' : 'none', transition: 'all 0.3s' }} />
        </div>

        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#e2e8f0', marginBottom: '8px' }}>
          {isDragging ? '⚡ Release to ingest files' : 'Drop your source files here'}
        </h3>
        <p style={{ fontSize: '13px', color: 'rgba(226,232,240,0.4)', marginBottom: '20px' }}>
          or click to browse · up to 10 files · 2MB each
        </p>

        {/* Supported extensions */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px' }}>
          {ALLOWED_EXT.map((ext) => (
            <span key={ext} style={{
              fontSize: '11px', fontFamily: 'JetBrains Mono', padding: '3px 8px', borderRadius: '6px',
              background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.1)',
              color: 'rgba(0,212,255,0.5)',
            }}>{ext}</span>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px',
          color: '#ff4da6', fontSize: '13px' }}>
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}
          className="animate-fade-in">
          {files.map((file) => (
            <div key={file.name} className="card-plain" style={{
              padding: '10px 14px', display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', gap: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                  background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileCode size={14} color="#00d4ff" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {file.name}
                  </p>
                  <p style={{ fontSize: '11px', color: 'rgba(226,232,240,0.35)', fontFamily: 'JetBrains Mono' }}>
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); setFiles(p => p.filter(f => f.name !== file.name)); }}
                className="btn-ghost" style={{ padding: '4px', flexShrink: 0, color: 'rgba(255,0,128,0.5)' }}>
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Submit */}
      {files.length > 0 && status !== 'success' && (
        <button onClick={handleSubmit} disabled={status === 'uploading'}
          className="btn-primary" style={{ width: '100%', marginTop: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          {status === 'uploading' ? (
            <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> {progress}</>
          ) : (
            <><CheckCircle size={16} /> Generate Documentation ({files.length} file{files.length !== 1 ? 's' : ''})</>
          )}
        </button>
      )}

      {/* Success */}
      {status === 'success' && (
        <div className="animate-fade-in" style={{
          marginTop: '16px', padding: '14px 18px', borderRadius: '12px',
          background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.2)',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <CheckCircle size={16} color="#00ff88" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: '13px', color: '#00ff88', fontWeight: 600 }}>
            Documentation generated! Redirecting to dashboard...
          </p>
        </div>
      )}
    </div>
  );
}
