import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import menuRoutes from './src/routes/menuRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';
import kitchenRoutes from './src/routes/kitchenRoutes.js';
import riderRoutes from './src/routes/riderRoutes.js';
import assistantRoutes from './src/routes/assistantRoutes.js';
import tableRoutes from './src/routes/tableRoutes.js';
import { runMigrations } from './src/migrations/migrate.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Seafudz ng Bayan Full API Backend',
    uptime: process.uptime(),
    features: [
      'Menu Items (100 items)',
      'POS & Orders Management',
      'Kitchen Order Mode',
      'Rider Delivery System',
      'Assistant / Table Service',
      'Sales Reports & Analytics',
      'User Accounts & Authentication'
    ]
  });
});

// Mount All Feature REST API Routes
app.use('/api', menuRoutes);
app.use('/api', orderRoutes);
app.use('/api', kitchenRoutes);
app.use('/api', riderRoutes);
app.use('/api', assistantRoutes);
app.use('/api', salesRoutes);
app.use('/api', authRoutes);
app.use('/api', tableRoutes);

// Fallback for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route '${req.originalUrl}' not found. Check GET /api/health for endpoints.`,
  });
});

// Start Express Server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`=================================================`);
  console.log(`🚀 Seafudz ng Bayan Complete Backend API Server`);
  console.log(`📡 Server Address: http://0.0.0.0:${PORT}`);
  console.log(`-------------------------------------------------`);
  console.log(`📜 Menu & Catalog:   GET   http://0.0.0.0:${PORT}/api/menu`);
  console.log(`🛒 POS & Orders:    GET/POST http://0.0.0.0:${PORT}/api/orders`);
  console.log(`👨‍🍳 Kitchen Queue:   GET   http://0.0.0.0:${PORT}/api/kitchen/orders`);
  console.log(`🚀 Rider Deliveries: GET   http://0.0.0.0:${PORT}/api/rider/deliveries`);
  console.log(`🛎️  Assistant Calls:  GET/POST http://0.0.0.0:${PORT}/api/assistant/calls`);
  console.log(`📊 Sales Analytics: GET   http://0.0.0.0:${PORT}/api/sales/summary`);
  console.log(`👤 Users & Auth:    POST  http://0.0.0.0:${PORT}/api/auth/login`);
  console.log(`💚 Health Status:   GET   http://0.0.0.0:${PORT}/api/health`);
  console.log(`=================================================`);
  runMigrations().catch((mErr) => console.warn('Auto-migration note:', mErr.message));
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Error: Port ${PORT} is already in use by another process.`);
    console.error(`👉 You can kill the process using port ${PORT} with: fuser -k ${PORT}/tcp`);
    console.error(`👉 Or set a different PORT in your .env file (e.g. PORT=5001).\n`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});

