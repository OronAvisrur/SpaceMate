import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { sendError } from '../utils/response';
import User from '../models/User';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * Authentication middleware - verifies JWT access token
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      sendError(res, 'Authorization header missing', [], 401);
      return;
    }

    if (!authHeader.startsWith('Bearer ')) {
      sendError(res, 'Invalid authorization header format. Use: Bearer <token>', [], 401);
      return;
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      sendError(res, 'Access token missing', [], 401);
      return;
    }

    // Verify token signature and claims
    const decoded = verifyAccessToken(token);
    
    // Check if user still exists in database
    const user = await User.findById(decoded.userId);
    if (!user) {
      sendError(res, 'User no longer exists', [], 401);
      return;
    }

    // Attach user to request object
    req.user = user;
    
    console.log(`🔓 Authenticated user: ${user.email}`);
    next();
    
  } catch (error: any) {
    console.log(`❌ Authentication failed: ${error.message}`);
    
    // Provide specific error messages
    let message = 'Authentication failed';
    let statusCode = 401;
    
    if (error.message.includes('expired')) {
      message = 'Access token has expired';
    } else if (error.message.includes('invalid')) {
      message = 'Invalid access token';
    } else if (error.message.includes('malformed')) {
      message = 'Malformed access token';
    }
    
    sendError(res, message, [], statusCode);
  }
};