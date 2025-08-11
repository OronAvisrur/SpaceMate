// src/utils/jwt.ts - Fixed version with proper error handling

import jwt from 'jsonwebtoken';
import { IJWTPayload, IAuthTokens } from '../types/auth.type';

// Get JWT secrets from environment with validation
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// Validate that secrets exist
if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET is missing from environment variables!');
  console.error('Please add JWT_SECRET to your .env file');
  process.exit(1);
}

if (!JWT_REFRESH_SECRET) {
  console.error('❌ JWT_REFRESH_SECRET is missing from environment variables!');
  console.error('Please add JWT_REFRESH_SECRET to your .env file');
  process.exit(1);
}

// Log that secrets are loaded (without showing the actual values)
console.log('✅ JWT secrets loaded successfully');

/**
 * Generate tokens that NEVER expire
 */
export const generateTokens = (payload: IJWTPayload): IAuthTokens => {
  try {
    // Access token with NO expiration
    const accessToken = jwt.sign(payload, JWT_SECRET, {
      issuer: 'spacemate-app',
      audience: 'spacemate-users',
      algorithm: 'HS256'
    });

    // Refresh token with NO expiration  
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
      issuer: 'spacemate-app',
      audience: 'spacemate-users',
      algorithm: 'HS256'
    });

    console.log('🔑 Tokens generated successfully for user:', payload.email);
    
    return { accessToken, refreshToken };
  } catch (error: any) {
    console.error('❌ Token generation failed:', error.message);
    throw new Error(`Token generation failed: ${error.message}`);
  }
};

/**
 * Verify access token (no expiration check)
 */
export const verifyAccessToken = (token: string): IJWTPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'spacemate-app',
      audience: 'spacemate-users',
      algorithms: ['HS256']
    }) as IJWTPayload;
    
    return decoded;
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid access token');
    }
    if (error.name === 'NotBeforeError') {
      throw new Error('Access token not active yet');
    }
    throw new Error('Access token verification failed');
  }
};

/**
 * Verify refresh token (no expiration check)
 */
export const verifyRefreshToken = (token: string): IJWTPayload => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: 'spacemate-app',
      audience: 'spacemate-users',
      algorithms: ['HS256']
    }) as IJWTPayload;
    
    return decoded;
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid refresh token');
    }
    if (error.name === 'NotBeforeError') {
      throw new Error('Refresh token not active yet');
    }
    throw new Error('Refresh token verification failed');
  }
};

/**
 * Decode token without verification (for debugging)
 */
export const decodeToken = (token: string): any => {
  try {
    return jwt.decode(token);
  } catch (error) {
    console.log('❌ Token decode failed:', error);
    return null;
  }
};

/**
 * Get token expiration time (even though tokens don't expire, for debugging)
 */
export const getTokenInfo = (token: string): any => {
  try {
    const decoded = jwt.decode(token) as any;
    if (decoded) {
      return {
        userId: decoded.userId,
        email: decoded.email,
        issuer: decoded.iss,
        audience: decoded.aud,
        issuedAt: decoded.iat ? new Date(decoded.iat * 1000) : null,
        expiresAt: decoded.exp ? new Date(decoded.exp * 1000) : 'Never (no expiration)',
      };
    }
    return null;
  } catch (error) {
    return null;
  }
};