// src/controllers/authController.ts - Fixed Health Check

import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import mongoose from 'mongoose'; // Add this import
import { generateTokens, verifyRefreshToken } from '../utils/jwt';
import { sendSuccess, sendError } from '../utils/response';

// Define interfaces directly here to avoid import issues
interface IUserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  createdAt: Date;
}

// 🏥 HEALTH CHECK ENDPOINT - FIXED VERSION
export const healthCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Check database connection using mongoose
    let dbStatus = 'disconnected';
    
    try {
      // Simple way to check if mongoose is connected
      if (mongoose.connection.readyState === 1) {
        // Try a simple database operation
        await User.findOne().limit(1);
        dbStatus = 'connected';
      }
    } catch (dbError) {
      console.log('Database check failed:', dbError);
      dbStatus = 'disconnected';
    }
    
    const healthData = {
      status: dbStatus === 'connected' ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      uptime: Math.round(process.uptime()),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
      },
      database: dbStatus,
      version: '1.0.0',
      mongooseState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    };

    console.log('🏥 Health check requested - Database:', dbStatus);

    if (dbStatus === 'connected') {
      sendSuccess(res, 'Server is running healthy!', healthData);
    } else {
      sendError(res, 'Server health check failed - Database disconnected', [], 503);
    }
  } catch (error) {
    console.error('❌ Health check failed:', error);
    
    const healthData = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      uptime: Math.round(process.uptime()),
      database: 'error',
      error: 'Health check failed',
      mongooseState: 'unknown'
    };

    sendError(res, 'Server health check failed', [healthData], 500);
  }
};


export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, firstName, lastName, dateOfBirth } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      sendError(res, 'User already exists with this email', [], 409);
      return;
    }

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
      dateOfBirth: new Date(dateOfBirth),
    });

    await user.save();

    // Generate tokens - Fix: Use (user as any) to avoid TypeScript issues
    const tokens = generateTokens({
      userId: (user as any)._id.toString(),
      email: user.email,
    });

    // Prepare user response - Fix: Use (user as any) for _id and type assertion
    const userResponse: IUserResponse = {
      id: (user as any)._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isVerified: user.isVerified || false,
      createdAt: (user as any).createdAt,
    };

    console.log(`✅ User registered: ${user.email}`);

    sendSuccess(
      res,
      'User registered successfully',
      {
        user: userResponse,
        tokens,
      },
      201
    );
  } catch (error) {
    console.error('❌ Registration error:', error);
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user and include password field (important: +password to override select: false)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      console.log(`❌ Login failed - user not found: ${email}`);
      sendError(res, 'Invalid email or password', [], 401);
      return;
    }

    // Check if password exists (TypeScript safety)
    if (!user.password) {
      console.log(`❌ Login failed - no password for user: ${email}`);
      sendError(res, 'Invalid email or password', [], 401);
      return;
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log(`❌ Login failed - invalid password for: ${email}`);
      sendError(res, 'Invalid email or password', [], 401);
      return;
    }

    // Generate tokens - Fix: Use (user as any) to avoid TypeScript issues
    const tokens = generateTokens({
      userId: (user as any)._id.toString(),
      email: user.email,
    });

    // Prepare user response - Fix: Use (user as any) for _id and type assertion
    const userResponse: IUserResponse = {
      id: (user as any)._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isVerified: user.isVerified || false,
      createdAt: (user as any).createdAt,
    };

    console.log(`✅ User logged in: ${user.email}`);

    sendSuccess(res, 'Login successful', {
      user: userResponse,
      tokens,
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    next(error);
  }
};

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user; // Set by auth middleware

    if (!user) {
      sendError(res, 'User not found in request', [], 401);
      return;
    }

    // Fix: Use (user as any) to avoid TypeScript issues
    const userResponse: IUserResponse = {
      id: (user as any)._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isVerified: user.isVerified || false,
      createdAt: (user as any).createdAt,
    };

    sendSuccess(res, 'Profile retrieved successfully', { user: userResponse });
  } catch (error) {
    console.error('❌ Get profile error:', error);
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      sendError(res, 'Refresh token required', [], 400);
      return;
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Check if user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      sendError(res, 'User no longer exists', [], 401);
      return;
    }

    // Generate new tokens - Fix: Use (user as any) to avoid TypeScript issues
    const tokens = generateTokens({
      userId: (user as any)._id.toString(),
      email: user.email,
    });

    console.log(`✅ Tokens refreshed for: ${user.email}`);

    sendSuccess(res, 'Tokens refreshed successfully', { tokens });
  } catch (error: any) {
    console.error('❌ Token refresh error:', error);
    sendError(res, error.message || 'Invalid refresh token', [], 401);
  }
};

// Optional: Add logout function (for token blacklisting if you implement it later)
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;
    
    // Since tokens don't expire, we just acknowledge the logout
    // In the future, you could implement token blacklisting here
    
    console.log(`✅ User logged out: ${user?.email || 'unknown'}`);
    
    sendSuccess(res, 'Logout successful', {
      message: 'Please remove tokens from client storage'
    });
  } catch (error) {
    console.error('❌ Logout error:', error);
    next(error);
  }
};