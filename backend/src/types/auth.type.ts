// src/types/auth.ts
import { Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  isVerified: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface IUserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  createdAt: Date;
}

export interface IJWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}