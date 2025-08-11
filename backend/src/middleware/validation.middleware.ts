import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

// User registration schema
export const registerSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email('Invalid email format')
      .min(1, 'Email is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain uppercase, lowercase, number and special character'
      ),
    firstName: z
      .string()
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name cannot exceed 50 characters')
      .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters'),
    lastName: z
      .string()
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name cannot exceed 50 characters')
      .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters'),
    dateOfBirth: z
      .string()
      .refine((date) => {
        const birthDate = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        return age >= 18 && age <= 100;
      }, 'Must be between 18 and 100 years old')
  })
});

// User login schema
export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email('Invalid email format')
      .min(1, 'Email is required'),
    password: z
      .string()
      .min(1, 'Password is required')
  })
});

// Validation middleware 
export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Use synchronous parsing instead of async
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));
        
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errorMessages,
        });
        return; // ← Add return to prevent calling next()
      }
      next(error);
    }
  };
};