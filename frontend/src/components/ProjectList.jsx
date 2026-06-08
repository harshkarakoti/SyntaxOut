import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllProjects, deleteProject } from '../services/api.js';
import { FolderOpen, Trash2, Clock, FileCode, ChevronRight, Loader2, AlertCircle } from 'lucide-react';

const STATUS_STYLES = {
  ready:      'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  processing: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  failed:     'bg-rose-500/15 text-rose-400 border-rose-500/30',
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
    <div className="flex items-center justify-center py-20 text-slate-500">
      <Loader2 size={20} className="animate-spin mr-2" /> Loading projects...
    </div>
  );

  if (error) return (
    <div className="flex items-center gap-2 text-rose-400 py-10 justify-center">
      <AlertCircle size={16} /> {error}
    </div>
  );

  if (!projects.length) return (
    <div className="text-center py-20 text-slate-500">
      <FolderOpen size={36} className="mx-auto mb-3 opacity-40" />
      <p className="text-sm">No projects yet. Upload some files to get started.</p>
    </div>
  );

  return (
    <div className="space-y-3 animate-fade-in">
      {projects.map((project, i) => (
        <Link
          key={project._id}
          to={`/projects/${project._id}`}
          style={{ animationDelay: `${i * 60}ms` }}
          className="block glass rounded-xl p-4 hover:border-violet-500/30 hover:bg-slate-700/30
                     transition-all duration-200 group animate-slide-up"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/20
                              flex items-center justify-center flex-shrink-0
                              group-hover:bg-violet-500/20 transition-colors">
                <FolderOpen size={15} className="text-violet-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-200 truncate group-hover:text-white">
                  {project.name}
                </p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className={`badge border ${STATUS_STYLES[project.status] || STATUS_STYLES.ready}`}>
                    {project.status}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <FileCode size={11} /> {project.fileCount} file{project.fileCount !== 1 ? 's' : ''}
                  </span>
                  {project.languages?.length > 0 && (
                    <span className="text-xs text-slate-500">{project.languages.join(', ')}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={(e) => handleDelete(e, project._id)}
                className="btn-ghost p-1.5 opacity-0 group-hover:opacity-100 text-slate-600 hover:text-rose-400"
              >
                <Trash2 size={13} />
              </button>
              <ChevronRight size={15} className="text-slate-600 group-hover:text-violet-400 transition-colors" />
            </div>
          </div>

          <div className="flex items-center gap-1 mt-3 text-xs text-slate-600">
            <Clock size={11} />
            {new Date(project.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </div>
        </Link>
      ))}
    </div>
  );
}
