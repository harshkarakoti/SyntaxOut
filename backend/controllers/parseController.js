import { parseMultipleFiles } from '../services/parserService.js';
import Project from '../models/Project.js';
import Module from '../models/Module.js';

// ─── Parse Controller ─────────────────────────────────────────────────────────

/**
 * @desc    Run uploaded files through AI, then persist results to MongoDB
 * @route   POST /api/v1/parse
 * @access  Public
 *
 * Expects: JSON body with { files: [{ filename, extension, sizeKB, content }] }
 * Returns: projectId + structured AI documentation for each file
 */
export const parseFiles = async (req, res, next) => {
  try {
    const { files, projectName, clientId } = req.body;

    // ── Input Validation ───────────────────────────────────────────────────────
    if (!clientId || typeof clientId !== 'string' || clientId.trim().length < 8) {
      return res.status(400).json({
        success: false,
        message: 'A valid clientId is required. Generate one in the browser and send it with every request.',
      });
    }
    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No file content provided. Send a JSON body with a "files" array from the upload step.',
      });
    }

    if (files.length > 10) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 10 files can be parsed per request.',
      });
    }

    for (const file of files) {
      if (!file.filename || !file.content) {
        return res.status(400).json({
          success: false,
          message: 'Each file object must have "filename" and "content" fields.',
        });
      }
    }

    // ── Step 1: Create Project document (status: processing) ──────────────────
    const project = await Project.create({
      name: projectName || `Project ${new Date().toLocaleDateString('en-IN')} — ${files.length} file(s)`,
      clientId: clientId.trim(),
      fileCount: files.length,
      status: 'processing',
    });

    console.log(`\n[PARSE] Project created: ${project._id}`);
    console.log(`[PARSE] Starting AI parse for ${files.length} file(s)...`);

    const startTime = Date.now();

    // ── Step 2: Run AI parsing pipeline ───────────────────────────────────────
    const results = await parseMultipleFiles(files);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    const successCount = results.filter((r) => r.success).length;
    const failCount = results.length - successCount;

    // ── Step 3: Persist each result as a Module document ──────────────────────
    const moduleInserts = results.map((result, index) => {
      const originalFile = files[index];

      if (result.success) {
        const doc = result.documentation;
        return {
          projectId: project._id,
          filename: result.filename,
          extension: result.extension,
          sizeKB: result.sizeKB,
          parseSuccess: true,
          language: doc.language || 'Unknown',
          summary: doc.summary || '',
          endpoints: doc.endpoints || [],
          functions: doc.functions || [],
          classes: doc.classes || [],
          imports: doc.imports || [],
          constants: doc.constants || [],
          rawContent: originalFile.content, // stored for frontend code viewer
          model: result.model,
          parsedAt: result.parsedAt,
        };
      } else {
        return {
          projectId: project._id,
          filename: result.filename,
          parseSuccess: false,
          parseError: result.error,
          rawContent: originalFile?.content || '',
        };
      }
    });

    const insertedModules = await Module.insertMany(moduleInserts);

    // ── Step 4: Update Project with final status + detected languages ──────────
    const languages = [
      ...new Set(
        results
          .filter((r) => r.success && r.documentation?.language)
          .map((r) => r.documentation.language)
      ),
    ];

    const totalSizeKB = files.reduce((sum, f) => sum + (f.sizeKB || 0), 0);

    await Project.findByIdAndUpdate(project._id, {
      status: failCount === files.length ? 'failed' : 'ready',
      successCount,
      failCount,
      languages,
      totalSizeKB: parseFloat(totalSizeKB.toFixed(2)),
    });

    console.log(`[PARSE] Done in ${duration}s — ${successCount} success, ${failCount} failed`);
    console.log(`[PARSE] ${insertedModules.length} module(s) saved to MongoDB\n`);

    // ── Step 5: Return response ────────────────────────────────────────────────
    return res.status(200).json({
      success: true,
      message: `Parsed ${successCount}/${files.length} file(s) in ${duration}s`,
      meta: {
        projectId: project._id,
        totalFiles: files.length,
        successCount,
        failCount,
        durationSeconds: parseFloat(duration),
        languages,
      },
      results,
    });
  } catch (error) {
    next(error);
  }
};
