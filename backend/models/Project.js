import mongoose from 'mongoose';

// ─── Project Schema ───────────────────────────────────────────────────────────
// Parent document. Groups all parsed Module documents under one project.
// One upload session = one Project.

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      maxlength: [100, 'Project name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: 'Auto-generated API documentation',
    },
    fileCount: {
      type: Number,
      required: true,
      min: 1,
    },
    successCount: {
      type: Number,
      default: 0,
    },
    failCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['processing', 'ready', 'failed'],
      default: 'processing',
    },
    languages: {
      type: [String], // e.g. ['JavaScript', 'Python']
      default: [],
    },
    totalSizeKB: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // createdAt + updatedAt auto-managed by Mongoose
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Virtual: populate modules on demand ─────────────────────────────────────
projectSchema.virtual('modules', {
  ref: 'Module',
  localField: '_id',
  foreignField: 'projectId',
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
