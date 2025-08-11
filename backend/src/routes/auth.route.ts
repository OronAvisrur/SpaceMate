// src/routes/auth.ts - Auth routes with health check

import { Router } from 'express';
import {
  healthCheck,
  register,
  login,
  getProfile,
  refreshToken,
  logout
} from '../controllers/auth.controller';
import { validate, registerSchema, loginSchema } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// 🏥 Health check route (public)
router.get('/health', healthCheck);

// Public routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh-token', refreshToken);

// Protected routes (require authentication)
router.get('/profile', authenticate, getProfile);
router.post('/logout', authenticate, logout);

export default router;