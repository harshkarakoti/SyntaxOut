import { Router } from 'express';
import {
  getAllProjects,
  getProjectById,
  getModuleById,
  deleteProject,
  cleanupSession,
} from '../controllers/projectController.js';

const router = Router();

// GET    /api/v1/projects                          → all projects (filtered by clientId)
// POST   /api/v1/projects/session/cleanup          → delete all projects for a session
// GET    /api/v1/projects/:id                      → single project + modules
// GET    /api/v1/projects/:id/modules/:moduleId    → single module with rawContent
// DELETE /api/v1/projects/:id                      → delete project + all its modules

router.get('/', getAllProjects);
router.post('/session/cleanup', cleanupSession); // MUST be before /:id
router.get('/:id', getProjectById);
router.get('/:id/modules/:moduleId', getModuleById);
router.delete('/:id', deleteProject);

export default router;
