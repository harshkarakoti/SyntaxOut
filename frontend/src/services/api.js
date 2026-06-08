import axios from 'axios';
import { getClientId } from './clientId.js';

// Reads from VITE_API_URL env var:
//   Local dev  → http://localhost:5000  (set in frontend/.env)
//   Production → https://your-backend.onrender.com  (set in Vercel dashboard)
const BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Upload ───────────────────────────────────────────────────────────────────
export const uploadFiles = (formData) =>
  api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// ─── Parse ────────────────────────────────────────────────────────────────────
// Automatically injects the browser's persistent clientId into every parse call
export const parseFiles = (payload) =>
  api.post('/parse', { ...payload, clientId: getClientId() });

// ─── Projects ─────────────────────────────────────────────────────────────────
// Filters projects by clientId so each browser only sees its own history
export const getAllProjects = () =>
  api.get('/projects', { params: { clientId: getClientId() } });

export const getProjectById = (id) => api.get(`/projects/${id}`);
export const getModuleById = (projectId, moduleId) =>
  api.get(`/projects/${projectId}/modules/${moduleId}`);
export const deleteProject = (id) => api.delete(`/projects/${id}`);

export default api;
