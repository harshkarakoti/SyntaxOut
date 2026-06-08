import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// ─── Upload ───────────────────────────────────────────────────────────────────
export const uploadFiles = (formData) =>
  api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// ─── Parse ────────────────────────────────────────────────────────────────────
export const parseFiles = (payload) => api.post('/parse', payload);

// ─── Projects ─────────────────────────────────────────────────────────────────
export const getAllProjects = () => api.get('/projects');
export const getProjectById = (id) => api.get(`/projects/${id}`);
export const getModuleById = (projectId, moduleId) =>
  api.get(`/projects/${projectId}/modules/${moduleId}`);
export const deleteProject = (id) => api.delete(`/projects/${id}`);

export default api;
