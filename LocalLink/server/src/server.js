/* ──────────────────────────────────────────────
   LocalLink — Express Server Entry Point
   ────────────────────────────────────────────── */
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

/* ── Middleware ─────────────────────────────── */
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

/* ── Static uploads folder ─────────────────── */
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

/* ── Routes ────────────────────────────────── */
const authRoutes     = require('./routes/auth.routes');
const serviceRoutes  = require('./routes/service.routes');
const providerRoutes = require('./routes/provider.routes');
const reviewRoutes   = require('./routes/review.routes');
const reportRoutes   = require('./routes/report.routes');
const adminRoutes    = require('./routes/admin.routes');
const categoryRoutes = require('./routes/category.routes');

app.use('/api/auth',       authRoutes);
app.use('/api/services',   serviceRoutes);
app.use('/api/providers',  providerRoutes);
app.use('/api/reviews',    reviewRoutes);
app.use('/api/reports',    reportRoutes);
app.use('/api/admin',      adminRoutes);
app.use('/api/categories', categoryRoutes);

/* ── Health check ──────────────────────────── */
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/* ── Global error handler ──────────────────── */
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

/* ── 404 ───────────────────────────────────── */
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

/* ── Start ─────────────────────────────────── */
app.listen(PORT, () => {
  console.log(`✓ LocalLink server running on port ${PORT}`);
});
