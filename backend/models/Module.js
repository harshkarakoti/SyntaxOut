import mongoose from 'mongoose';

// ─── Module Schema ────────────────────────────────────────────────────────────
// Child document. Stores the AI-parsed documentation for a single source file.
// Always linked to a parent Project via projectId.

const moduleSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true, // ← High-read optimization per charter: fast lookup by project
    },
    filename: {
      type: String,
      required: true,
      trim: true,
    },
    extension: {
      type: String,
      trim: true,
    },
    sizeKB: {
      type: Number,
      default: 0,
    },
    parseSuccess: {
      type: Boolean,
      default: true,
    },
    parseError: {
      type: String,
      default: null,
    },
    // ── AI-Generated Documentation Fields ──────────────────────────────────────
    language: {
      type: String,
      default: 'Unknown',
    },
    summary: {
      type: String,
      default: '',
    },
    endpoints: {
      type: mongoose.Schema.Types.Mixed, // Flexible — structure validated at service layer
      default: [],
    },
    functions: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
    classes: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
    imports: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
    constants: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
    // ── Raw Content (stored for the frontend code viewer) ─────────────────────
    rawContent: {
      type: String,
      default: '',
    },
    model: {
      type: String,
      default: 'gemini-2.5-flash',
    },
    parsedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Compound Index ───────────────────────────────────────────────────────────
// Optimizes the most common query: "get all modules for project X"
moduleSchema.index({ projectId: 1, filename: 1 });

const Module = mongoose.model('Module', moduleSchema);
export default Module;
