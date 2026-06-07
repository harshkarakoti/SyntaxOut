import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

// Route imports
import uploadRoutes from './routes/uploadRoutes.js';
import parseRoutes from './routes/parseRoutes.js';
import projectRoutes from './routes/projectRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Global Middleware ────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Allow large parsed content in body
app.use(express.urlencoded({ extended: true }));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/parse', parseRoutes);
app.use('/api/v1/projects', projectRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SyntaxOut API is live',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 SyntaxOut server running in ${process.env.NODE_ENV} mode`);
  console.log(`   → Local:    http://localhost:${PORT}`);
  console.log(`   → Health:   http://localhost:${PORT}/api/v1/health`);
  console.log(`   → Upload:   POST http://localhost:${PORT}/api/v1/upload`);
  console.log(`   → Parse:    POST http://localhost:${PORT}/api/v1/parse`);
  console.log(`   → Projects: GET  http://localhost:${PORT}/api/v1/projects\n`);
});

export default app;
