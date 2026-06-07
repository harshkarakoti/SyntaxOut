import Project from '../models/Project.js';
import Module from '../models/Module.js';

// ─── GET /api/v1/projects ─────────────────────────────────────────────────────
// Returns all projects, newest first, with module count
export const getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find()
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
// Cascade delete: removes project + all its modules
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
