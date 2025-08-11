import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

interface CustomError extends Error {
  statusCode?: number;
  code?: number;
  keyValue?: any;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { name: 'CastError', message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { name: 'DuplicateError', message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err).map((val: any) => val.message).join(', ');
    error = { name: 'ValidationError', message, statusCode: 400 };
  }

  sendError(
    res,
    error.message || 'Server Error',
    [],
    error.statusCode || 500
  );
};

// Handle unhandled promise rejections
export const handleUnhandledRejection = () => {
  process.on('unhandledRejection', (err: Error) => {
    console.log('UNHANDLED REJECTION! Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
  });
};