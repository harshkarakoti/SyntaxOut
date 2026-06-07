import { Router } from 'express';
import { parseFiles } from '../controllers/parseController.js';

const router = Router();

// POST /api/v1/parse
// Body: { files: [{ filename, extension, sizeKB, content }] }
// Runs each file through Gemini 2.5 Flash → returns structured JSON docs
router.post('/', parseFiles);

export default router;
