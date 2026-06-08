import Project from '../models/Project.js';
import Module from '../models/Module.js';

// ─── GET /api/v1/projects ─────────────────────────────────────────────────────
// Returns all projects for this session's clientId, newest first
export const getAllProjects = async (req, res, next) => {
  try {
    const { clientId } = req.query;

    // Only return projects belonging to this browser client
    const filter = clientId ? { clientId } : {};

    const projects = await Project.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/v1/projects/:id ─────────────────────────────────────────────────
// Returns single project + all its parsed modules
export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).lean();

    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Project with ID "${req.params.id}" not found`,
      });
    }

    // Fetch all modules linked to this project (indexed query — fast)
    const modules = await Module.find({ projectId: req.params.id })
      .select('-rawContent') // Exclude rawContent from list view (large field)
      .lean();

    return res.status(200).json({
      success: true,
      project,
      modules,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/v1/projects/:id/modules/:moduleId ───────────────────────────────
// Returns a single module WITH rawContent (for the code viewer panel)
export const getModuleById = async (req, res, next) => {
  try {
    const module = await Module.findOne({
      _id: req.params.moduleId,
      projectId: req.params.id,
    }).lean();

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found',
      });
    }

    return res.status(200).json({
      success: true,
      module,
    });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/v1/projects/:id ─────────────────────────────────────────────
// Cascade delete: removes a single project + all its modules
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Project with ID "${req.params.id}" not found`,
      });
    }

    // Cascade delete all child modules first
    const deletedModules = await Module.deleteMany({ projectId: req.params.id });
    await project.deleteOne();

    return res.status(200).json({
      success: true,
      message: `Project and ${deletedModules.deletedCount} module(s) deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/v1/projects/session/cleanup ────────────────────────────────────
// Called by navigator.sendBeacon() when the browser tab/window is closed.
// Deletes ALL projects + their modules for the given clientId in one shot.
export const cleanupSession = async (req, res, next) => {
  try {
    // sendBeacon may send body as text/plain — handle both parsed object and raw string
    let clientId;
    if (req.body && typeof req.body === 'object' && req.body.clientId) {
      clientId = req.body.clientId;
    } else if (typeof req.body === 'string') {
      try { clientId = JSON.parse(req.body).clientId; } catch { /* ignore */ }
    }

    if (!clientId) {
      return res.status(400).json({ success: false, message: 'clientId is required' });
    }

    // Find all projects for this session
    const projects = await Project.find({ clientId }).select('_id').lean();
    const projectIds = projects.map((p) => p._id);

    // Cascade delete modules first, then projects
    if (projectIds.length > 0) {
      await Module.deleteMany({ projectId: { $in: projectIds } });
      await Project.deleteMany({ clientId });
      console.log(`[SESSION] Cleaned up ${projectIds.length} project(s) for clientId: ${clientId}`);
    }

    return res.status(200).json({ success: true, deleted: projectIds.length });
  } catch (error) {
    next(error);
  }
};
