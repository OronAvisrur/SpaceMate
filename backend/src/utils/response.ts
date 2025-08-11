import { Response } from 'express';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

/**
 * Send successful response
 */
export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
  };

  if (data !== undefined) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send error response
 */
export const sendError = (
  res: Response,
  message: string,
  errors: any[] = [],
  statusCode: number = 400
): Response => {
  const response: ApiResponse = {
    success: false,
    message,
  };

  if (errors.length > 0) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};