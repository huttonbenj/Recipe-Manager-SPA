import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { 
  UserRegistrationSchema, 
  UserCredentialsSchema 
} from '@recipe-manager/shared';

/**
 * Zod-based validation middleware for server routes
 * 
 * This middleware uses shared Zod schemas for consistent validation across the app.
 */

// Shared function to handle validation errors consistently
const handleValidationError = (error: z.ZodError, res: Response) => {
  return res.status(400).json({
    success: false,
    error: 'Validation failed',
    details: error.issues.map((err: z.ZodIssue) => ({
      field: err.path.join('.'),
      message: err.message
    }))
  });
};

// Generic validation middleware factory
export const validateBody = <T>(schema: z.ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        handleValidationError(error, res);
        return;
      }
      next(error);
    }
  };
};

// Validation middleware for query parameters
export const validateQuery = <T>(schema: z.ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validated = schema.parse(req.query);
      req.query = validated as typeof req.query;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        handleValidationError(error, res);
        return;
      }
      next(error);
    }
  };
};

// Validation middleware for route parameters
export const validateParams = <T>(schema: z.ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validated = schema.parse(req.params);
      req.params = validated as typeof req.params;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        handleValidationError(error, res);
        return;
      }
      next(error);
    }
  };
};

// Common schemas for server use
export const IdParamsSchema = z.object({
  id: z.string().min(1)
});

// Query parameter schemas with proper coercion for URL params
export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10)
});

// Pre-built validation middleware using shared schemas
export const validateUserRegistration = validateBody(UserRegistrationSchema);
export const validateUserCredentials = validateBody(UserCredentialsSchema);
export const validatePagination = validateQuery(PaginationQuerySchema);
export const validateIdParams = validateParams(IdParamsSchema); 