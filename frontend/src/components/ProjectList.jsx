import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllProjects, deleteProject } from '../services/api.js';
import { FolderOpen, Trash2, Clock, FileCode, ChevronRight, Loader2, AlertCircle } from 'lucide-react';

const STATUS_COLOR = {
  ready:      '#22d3ee',
  processing: '#94a3b8',
  failed:     '#f87171',
};

const STATUS_BG = {
  ready:      'rgba(34,211,238,0.08)',
  processing: 'rgba(148,163,184,0.08)',
  failed:     'rgba(248,113,113,0.08)',
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
      gap: '10px', padding: '80px 0', color: '#64748b', fontSize: '15px' }}>
      <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
      Loading…
    </div>
  );

  if (error) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: '10px', padding: '80px 0', color: '#f87171', fontSize: '15px' }}>
      <AlertCircle size={18} /> {error}
    </div>
  );

  if (!projects.length) return (
    <div style={{ textAlign: 'center', padding: '100px 0', color: '#94a3b8' }}>
      <FolderOpen size={36} style={{ margin: '0 auto 16px', color: '#64748b', opacity: 0.7 }} />
      <p style={{ fontSize: '15px', fontWeight: 500, color: '#cbd5e1' }}>No projects yet.</p>
      <p style={{ fontSize: '13px', marginTop: '6px', color: '#64748b' }}>
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
            background: '#131720', border: '1px solid #222a38',
            borderRadius: '10px', padding: '16px 20px',
            transition: 'border-color 0.15s, background-color 0.15s',
            animationDelay: `${i * 40}ms`,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#2e3a50'; e.currentTarget.style.backgroundColor = '#181e2b'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#222a38'; e.currentTarget.style.backgroundColor = '#131720'; }}
          className="animate-slide-up"
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '8px',
                background: '#1a2030', border: '1px solid #2e3a50',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <FolderOpen size={15} color="#22d3ee" />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{
                  fontSize: '15px', fontWeight: 600, color: '#e2e8f0',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {project.name}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '12px',
                    color: STATUS_COLOR[project.status] || '#94a3b8',
                    background: STATUS_BG[project.status] || '#1a2030',
                    padding: '2px 7px', borderRadius: '4px',
                    fontFamily: 'var(--mono)',
                    border: '1px solid rgba(255,255,255,0.03)',
                  }}>
                    {project.status}
                  </span>
                  <span style={{ fontSize: '12.5px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FileCode size={12} color="#64748b" />
                    {project.fileCount} file{project.fileCount !== 1 ? 's' : ''}
                  </span>
                  {project.languages?.length > 0 && (
                    <span style={{ fontSize: '12px', color: '#64748b', fontFamily: 'var(--mono)' }}>
                      {project.languages.join(', ')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
              <button
                onClick={(e) => handleDelete(e, project._id)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#475569', padding: '6px', display: 'flex',
                  transition: 'color 0.12s, transform 0.1s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <Trash2 size={15} />
              </button>
              <ChevronRight size={16} color="#475569" />
            </div>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            marginTop: '12px', fontSize: '12px', color: '#64748b',
          }}>
            <Clock size={12} />
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
