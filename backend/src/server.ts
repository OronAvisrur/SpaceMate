// src/app.ts - Make sure this loads environment variables FIRST

import dotenv from 'dotenv';

// CRITICAL: Load environment variables BEFORE importing other modules
dotenv.config();

// Now import other modules
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import connectDB from './utils/database';
import authRoutes from './routes/auth.route';
import { errorHandler } from './middleware/errorHandler.middleware';

const app = express();
const PORT = process.env.PORT || 5005;

// Verify environment variables are loaded
console.log('🔧 Environment check:');
console.log('PORT:', process.env.PORT || 'default 5005');
console.log('NODE_ENV:', process.env.NODE_ENV || 'default development');
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('JWT_REFRESH_SECRET exists:', !!process.env.JWT_REFRESH_SECRET);
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);

// Connect to database
connectDB();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Main health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SpaceMate API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

// API routes
app.use('/api/auth', authRoutes);

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /health',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/profile',
      'POST /api/auth/refresh-token',
      'POST /api/auth/logout'
    ]
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`🏥 Health check available at: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth API available at: http://localhost:${PORT}/api/auth`);
});

export default app;