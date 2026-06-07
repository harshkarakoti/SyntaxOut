import multer from 'multer';
import { Router } from 'express';
import { uploadFiles } from '../controllers/uploadController.js';

const router = Router();

// ─── Allowed File Extensions ──────────────────────────────────────────────────
const ALLOWED_EXTENSIONS = new Set([
  '.js', '.jsx', '.ts', '.tsx',
  '.py', '.go', '.java', '.cpp',
  '.cs', '.rb', '.php',
]);

// ─── Multer Configuration ─────────────────────────────────────────────────────
const storage = multer.memoryStorage(); // Zero-disk I/O — files live in RAM only

const fileFilter = (req, file, cb) => {
  const ext = '.' + file.originalname.split('.').pop().toLowerCase();
  if (ALLOWED_EXTENSIONS.has(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `File type not supported: "${ext}". Allowed: ${[...ALLOWED_EXTENSIONS].join(', ')}`
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB per file
    files: 10,                  // Max 10 files per request
  },
});

// ─── Routes ───────────────────────────────────────────────────────────────────

// POST /api/v1/upload
// Field name: 'files' | Max: 10 files | Max size: 2MB each
router.post('/', upload.array('files', 10), uploadFiles);

export default router;
