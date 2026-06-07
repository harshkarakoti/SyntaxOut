// ─── Upload Controller ────────────────────────────────────────────────────────
// Processes raw file buffers from Multer memoryStorage.
// Reads binary buffer → clean UTF-8 string, returns structured JSON response.
// No file system writes occur at any point in this pipeline.

/**
 * @desc    Process uploaded source code files from memory buffers
 * @route   POST /api/v1/upload
 * @access  Public
 */
export const uploadFiles = (req, res, next) => {
  try {
    // Guard: ensure at least one file was uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded. Please attach at least one source code file using the field name "files".',
      });
    }

    // Map each Multer file object into a clean, structured payload
    const parsedFiles = req.files.map((file) => {
      const content = file.buffer.toString('utf8'); // Binary buffer → UTF-8 string
      const sizeKB = parseFloat((file.size / 1024).toFixed(2));
      const extension = '.' + file.originalname.split('.').pop().toLowerCase();

      return {
        filename: file.originalname,
        extension,
        sizeKB,
        mimeType: file.mimetype,
        encoding: file.encoding,
        content, // Raw source code as a clean string, ready for AI ingestion
      };
    });

    return res.status(200).json({
      success: true,
      message: `${parsedFiles.length} file(s) ingested successfully. Ready for AI parsing.`,
      count: parsedFiles.length,
      files: parsedFiles,
    });
  } catch (error) {
    next(error); // Forward to global error handler in server.js
  }
};
