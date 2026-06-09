import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectById, getModuleById } from '../services/api.js';
import CodeViewer from '../components/CodeViewer.jsx';
import SchemaTable from '../components/SchemaTable.jsx';
import { FileCode, ChevronLeft, Loader2, AlertCircle, Download } from 'lucide-react';

export default function ProjectPage() {
  const { id } = useParams();
  const [project, setProject]           = useState(null);
  const [modules, setModules]           = useState([]);
  const [activeModule, setActiveModule] = useState(null);
  const [fullModule, setFullModule]     = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [leftWidth, setLeftWidth]               = useState(60);
  const [isDragging, setIsDragging]             = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getProjectById(id);
        setProject(res.data.project);
        setModules(res.data.modules);
        if (res.data.modules.length > 0) setActiveModule(res.data.modules[0]);
      } catch { setError('Failed to load project'); }
      finally { setLoading(false); }
    })();
  }, [id]);

  useEffect(() => {
    if (!activeModule) return;
    (async () => {
      try {
        const res = await getModuleById(id, activeModule._id);
        setFullModule(res.data.module);
      } catch { setFullModule(activeModule); }
    })();
  }, [activeModule, id]);

  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e) => {
      const container = document.getElementById('workspace-container');
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const newLeftWidth = ((e.clientX - rect.left) / rect.width) * 100;
      if (newLeftWidth > 15 && newLeftWidth < 88) setLeftWidth(newLeftWidth);
    };
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const exportJSON = () => {
    if (!fullModule) return;
    const blob = new Blob(
      [JSON.stringify(fullModule.documentation || fullModule, null, 2)],
      { type: 'application/json' }
    );
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${fullModule.filename}.schema.json`;
    a.click();
  };

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', color: '#525252', gap: '8px',
      paddingTop: '52px', fontSize: '13px' }}>
      <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
      Loading…
    </div>
  );

  if (error) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', color: '#c0392b', gap: '8px',
      paddingTop: '52px', fontSize: '13px' }}>
      <AlertCircle size={15} /> {error}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column',
      height: '100vh', paddingTop: '52px', overflow: 'hidden' }}>

      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 16px', flexShrink: 0,
        borderBottom: '1px solid #1f1f1f',
        background: '#0d0d0d',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <Link to="/projects" style={{
            display: 'flex', alignItems: 'center', padding: '5px',
            borderRadius: '6px', color: '#525252',
            background: '#161616', border: '1px solid #222',
            transition: 'border-color 0.12s, color 0.12s', textDecoration: 'none',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#a0a0a0'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#222'; e.currentTarget.style.color = '#525252'; }}
          >
            <ChevronLeft size={14} />
          </Link>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              display: 'flex', alignItems: 'center', padding: '5px',
              borderRadius: '6px',
              color: sidebarCollapsed ? '#404040' : '#a0a0a0',
              background: '#161616', border: '1px solid #222',
              cursor: 'pointer', transition: 'all 0.12s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#333'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#222'}
            title={sidebarCollapsed ? 'Show files' : 'Hide files'}
          >
            <FileCode size={14} />
          </button>

          <div style={{ minWidth: 0 }}>
            <h1 style={{
              fontSize: '13px', fontWeight: 600, color: '#e8e8e8',
              margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {project?.name}
            </h1>
            <p style={{
              fontSize: '11px', color: '#525252', margin: 0, marginTop: '1px',
              fontFamily: 'var(--mono)',
            }}>
              {modules.length} file{modules.length !== 1 ? 's' : ''} ·{' '}
              {project?.languages?.join(', ') || 'Unknown'} ·{' '}
              {new Date(project?.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric',
              })}
            </p>
          </div>
        </div>

        <button
          onClick={exportJSON}
          className="btn-secondary"
          style={{ fontSize: '12px', flexShrink: 0 }}
        >
          <Download size={12} /> Export JSON
        </button>
      </div>

      {/* Workspace */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>

        {/* File sidebar */}
        <aside style={{
          width: sidebarCollapsed ? '0px' : '144px',
          padding: sidebarCollapsed ? '0' : '12px 8px',
          overflowY: sidebarCollapsed ? 'hidden' : 'auto',
          overflowX: 'hidden',
          flexShrink: 0,
          borderRight: sidebarCollapsed ? 'none' : '1px solid #1f1f1f',
          background: '#0d0d0d',
          transition: 'width 0.18s ease, padding 0.18s ease, opacity 0.15s',
          opacity: sidebarCollapsed ? 0 : 1,
        }}>
          <p style={{
            fontSize: '10px', fontWeight: 600, color: '#404040',
            letterSpacing: '0.1em', marginBottom: '8px', paddingLeft: '6px',
            textTransform: 'uppercase', fontFamily: 'var(--mono)',
          }}>
            Files
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {modules.map((mod) => {
              const active = activeModule?._id === mod._id;
              return (
                <button key={mod._id} onClick={() => setActiveModule(mod)} style={{
                  width: '100%', textAlign: 'left', padding: '6px 8px',
                  borderRadius: '6px',
                  border: '1px solid transparent',
                  background: active ? '#1e1e1e' : 'transparent',
                  borderColor: active ? '#2a2a2a' : 'transparent',
                  color: active ? '#e8e8e8' : '#525252',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                  transition: 'all 0.12s', fontSize: '11px',
                  fontFamily: 'var(--mono)', whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#a0a0a0'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#525252'; }}
                >
                  <FileCode size={11} style={{ flexShrink: 0 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {mod.filename}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Dual pane */}
        {fullModule ? (
          <div
            id="workspace-container"
            style={{
              flex: 1, display: 'flex', overflow: 'hidden', minWidth: 0,
              position: 'relative', userSelect: isDragging ? 'none' : 'auto',
            }}
          >
            {/* Code viewer */}
            <div style={{
              width: `${leftWidth}%`, minWidth: '200px',
              overflow: 'hidden', display: 'flex', flexDirection: 'column', flexShrink: 0,
            }}>
              <CodeViewer filename={fullModule.filename} content={fullModule.rawContent} />
            </div>

            {/* Divider */}
            <div
              onMouseDown={() => setIsDragging(true)}
              style={{
                width: '5px', cursor: 'col-resize', flexShrink: 0, zIndex: 10,
                background: isDragging ? '#333' : '#1a1a1a',
                borderLeft: '1px solid #1f1f1f',
                borderRight: '1px solid #1f1f1f',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (!isDragging) e.currentTarget.style.background = '#2a2a2a'; }}
              onMouseLeave={e => { if (!isDragging) e.currentTarget.style.background = '#1a1a1a'; }}
            />

            {/* Schema docs */}
            <div style={{
              flex: 1, minWidth: '200px', overflowY: 'auto',
              padding: '14px', background: '#0d0d0d',
            }}>
              <SchemaTable module={fullModule} />
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#525252', gap: '8px', fontSize: '13px' }}>
            <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
            Loading module…
          </div>
        )}
      </div>
    </div>
  );
}
