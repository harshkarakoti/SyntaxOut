import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllProjects, deleteProject } from '../services/api.js';
import { FolderOpen, Trash2, Clock, FileCode, ChevronRight, Loader2, AlertCircle } from 'lucide-react';

const STATUS_COLOR = {
  ready:      '#e8e8e8',
  processing: '#a0a0a0',
  failed:     '#c0392b',
};

const STATUS_BG = {
  ready:      '#1e1e1e',
  processing: '#1a1a1a',
  failed:     '#1c1212',
};

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await getAllProjects();
      setProjects(res.data.projects);
    } catch {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    if (!window.confirm('Delete this project and all its documentation?')) return;
    await deleteProject(id);
    setProjects((prev) => prev.filter((p) => p._id !== id));
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: '8px', padding: '60px 0', color: '#525252', fontSize: '13px' }}>
      <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
      Loading…
    </div>
  );

  if (error) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: '8px', padding: '60px 0', color: '#c0392b', fontSize: '13px' }}>
      <AlertCircle size={14} /> {error}
    </div>
  );

  if (!projects.length) return (
    <div style={{ textAlign: 'center', padding: '80px 0', color: '#525252' }}>
      <FolderOpen size={28} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
      <p style={{ fontSize: '13px' }}>No projects yet.</p>
      <p style={{ fontSize: '12px', marginTop: '4px', color: '#404040' }}>
        Upload some files from the home page to get started.
      </p>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
      className="animate-fade-in">
      {projects.map((project, i) => (
        <Link
          key={project._id}
          to={`/projects/${project._id}`}
          style={{
            display: 'block', textDecoration: 'none',
            background: '#161616', border: '1px solid #222',
            borderRadius: '8px', padding: '12px 14px',
            transition: 'border-color 0.15s',
            animationDelay: `${i * 40}ms`,
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#333'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#222'}
          className="animate-slide-up"
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '7px',
                background: '#1e1e1e', border: '1px solid #2a2a2a',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <FolderOpen size={13} color="#606060" />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{
                  fontSize: '13px', fontWeight: 500, color: '#e8e8e8',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {project.name}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '3px' }}>
                  <span style={{
                    fontSize: '11px',
                    color: STATUS_COLOR[project.status] || '#a0a0a0',
                    background: STATUS_BG[project.status] || '#1e1e1e',
                    padding: '1px 6px', borderRadius: '4px',
                    fontFamily: 'var(--mono)',
                  }}>
                    {project.status}
                  </span>
                  <span style={{ fontSize: '11px', color: '#525252', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FileCode size={10} />
                    {project.fileCount} file{project.fileCount !== 1 ? 's' : ''}
                  </span>
                  {project.languages?.length > 0 && (
                    <span style={{ fontSize: '11px', color: '#404040', fontFamily: 'var(--mono)' }}>
                      {project.languages.join(', ')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
              <button
                onClick={(e) => handleDelete(e, project._id)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#333', padding: '4px', display: 'flex',
                  transition: 'color 0.12s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#c0392b'}
                onMouseLeave={e => e.currentTarget.style.color = '#333'}
              >
                <Trash2 size={13} />
              </button>
              <ChevronRight size={14} color="#404040" />
            </div>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            marginTop: '10px', fontSize: '11px', color: '#404040',
          }}>
            <Clock size={10} />
            {new Date(project.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })}
          </div>
        </Link>
      ))}
    </div>
  );
}
