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

  // Layout states
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [leftWidth, setLeftWidth]               = useState(60); // default to 60% for code viewer
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

  // Handle split pane resizing
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const container = document.getElementById('workspace-container');
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const newLeftWidth = ((e.clientX - rect.left) / rect.width) * 100;
      
      // Keep width constraints between 15% and 88%
      if (newLeftWidth > 15 && newLeftWidth < 88) {
        setLeftWidth(newLeftWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

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

  // ── Loading / Error states ────────────────────────────────────────────────
  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', color: 'rgba(0,212,255,0.5)', gap: '10px', paddingTop: '64px' }}>
      <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
      Loading documentation...
    </div>
  );

  if (error) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', color: '#fb7185', gap: '10px', paddingTop: '64px' }}>
      <AlertCircle size={18} /> {error}
    </div>
  );

  // ── Main Layout ───────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column',
      height: '100vh', paddingTop: '64px', overflow: 'hidden' }}>

      {/* ── Top Bar ──────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 20px', flexShrink: 0,
        borderBottom: '1px solid rgba(0,212,255,0.08)',
        background: 'rgba(5,10,20,0.9)', backdropFilter: 'blur(12px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
          <Link to="/projects" style={{
            display: 'flex', alignItems: 'center', padding: '6px',
            borderRadius: '8px', color: 'rgba(0,212,255,0.5)',
            background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.1)',
            transition: 'all 0.15s', textDecoration: 'none',
          }}>
            <ChevronLeft size={15} />
          </Link>

          {/* Toggle Sidebar Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              display: 'flex', alignItems: 'center', padding: '6px',
              borderRadius: '8px',
              color: sidebarCollapsed ? 'rgba(0,212,255,0.4)' : '#00d4ff',
              background: sidebarCollapsed ? 'rgba(0,212,255,0.02)' : 'rgba(0,212,255,0.08)',
              border: sidebarCollapsed ? '1px solid rgba(0,212,255,0.1)' : '1px solid rgba(0,212,255,0.25)',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            title={sidebarCollapsed ? "Show Files Sidebar" : "Hide Files Sidebar"}
          >
            <FileCode size={15} />
          </button>

          <div style={{ minWidth: 0 }}>
            <h1 style={{ fontSize: '13px', fontWeight: 700, color: '#e2e8f0',
              margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {project?.name}
            </h1>
            <p style={{ fontSize: '11px', color: 'rgba(0,212,255,0.4)', margin: 0, marginTop: '2px',
              fontFamily: 'JetBrains Mono, monospace' }}>
              {modules.length} file{modules.length !== 1 ? 's' : ''} ·{' '}
              {project?.languages?.join(', ') || 'Unknown'} ·{' '}
              {new Date(project?.createdAt).toLocaleDateString('en-IN',
                { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        <button onClick={exportJSON} className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', flexShrink: 0 }}>
          <Download size={13} /> Export JSON
        </button>
      </div>

      {/* ── Workspace Row ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>

        {/* File Sidebar */}
        <aside style={{
          width: sidebarCollapsed ? '0px' : '150px',
          padding: sidebarCollapsed ? '0px' : '16px 10px',
          overflowY: sidebarCollapsed ? 'hidden' : 'auto',
          overflowX: 'hidden',
          flexShrink: 0,
          borderRight: sidebarCollapsed ? 'none' : '1px solid rgba(0,212,255,0.06)',
          background: 'rgba(2,8,16,0.6)',
          transition: 'all 0.2s ease-in-out',
          opacity: sidebarCollapsed ? 0 : 1,
        }}>
          <p style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(0,212,255,0.3)',
            letterSpacing: '0.12em', marginBottom: '10px', paddingLeft: '8px' }}>
            FILES
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', width: '130px' }}>
            {modules.map((mod) => {
              const active = activeModule?._id === mod._id;
              return (
                <button key={mod._id} onClick={() => setActiveModule(mod)} style={{
                  width: '100%', textAlign: 'left', padding: '8px 10px',
                  borderRadius: '8px', border: active ? '1px solid rgba(0,212,255,0.2)' : '1px solid transparent',
                  background: active ? 'rgba(0,212,255,0.08)' : 'transparent',
                  color: active ? '#00d4ff' : 'rgba(226,232,240,0.45)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                  transition: 'all 0.15s', fontSize: '12px',
                  fontFamily: 'JetBrains Mono, monospace',
                }}>
                  <FileCode size={12} style={{ flexShrink: 0 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {mod.filename}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Dual Pane */}
        {fullModule ? (
          <div
            id="workspace-container"
            style={{
              flex: 1,
              display: 'flex',
              overflow: 'hidden',
              minWidth: 0,
              position: 'relative',
              userSelect: isDragging ? 'none' : 'auto',
            }}
          >
            {/* Left — Code Viewer */}
            <div style={{
              width: `${leftWidth}%`,
              minWidth: '250px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              flexShrink: 0,
            }}>
              <CodeViewer filename={fullModule.filename} content={fullModule.rawContent} />
            </div>

            {/* Draggable Divider */}
            <div
              onMouseDown={() => setIsDragging(true)}
              style={{
                width: '6px',
                cursor: 'col-resize',
                background: isDragging ? 'rgba(0, 212, 255, 0.4)' : 'rgba(0,212,255,0.06)',
                borderLeft: '1px solid rgba(0,212,255,0.08)',
                borderRight: '1px solid rgba(0,212,255,0.08)',
                transition: 'background 0.2s',
                zIndex: 10,
                flexShrink: 0,
              }}
              onMouseEnter={(e) => { if (!isDragging) e.currentTarget.style.background = 'rgba(0, 212, 255, 0.2)'; }}
              onMouseLeave={(e) => { if (!isDragging) e.currentTarget.style.background = 'rgba(0,212,255,0.06)'; }}
            />

            {/* Right — Schema Docs */}
            <div style={{
              flex: 1,
              minWidth: '250px',
              overflowY: 'auto',
              padding: '16px',
              background: 'rgba(2,8,16,0.4)',
            }}>
              <SchemaTable module={fullModule} />
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: 'rgba(0,212,255,0.3)', gap: '8px' }}>
            <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
            Loading module...
          </div>
        )}
      </div>
    </div>
  );
}
