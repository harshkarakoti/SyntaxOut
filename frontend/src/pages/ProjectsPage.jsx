import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProjectList from '../components/ProjectList.jsx';
import { FolderOpen, Plus } from 'lucide-react';

export default function ProjectsPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Projects</h1>
            <p className="text-slate-500 text-sm mt-1">Your parsed documentation history</p>
          </div>
          <Link to="/" className="btn-primary flex items-center gap-2 text-sm py-2.5 px-4">
            <Plus size={15} /> New Project
          </Link>
        </div>
        <ProjectList />
      </div>
    </main>
  );
}
