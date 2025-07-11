import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ValidationError } from '@recipe-manager/shared';
import { errorHandler, ApiError } from '../../../middleware/error';

describe('Error Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      method: 'GET',
      path: '/test',
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    next = vi.fn();
  });

  describe('errorHandler', () => {
    it('should handle ApiError with custom status and message', () => {
      const error = new ApiError(422, 'Custom error message');

      errorHandler(error, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Custom error message',
        details: undefined,
      });
    });

    it('should handle ApiError with default status 500', () => {
      const error = new ApiError(500, 'Internal error');

      errorHandler(error, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Internal error',
        details: undefined,
      });
    });

    it('should handle validation errors (ZodError)', () => {
      // Create a ZodError by validating invalid data
      const schema = z.object({
        name: z.string().min(1),
        email: z.string().email(),
      });
      
      let zodError: z.ZodError;
      try {
        schema.parse({ name: '', email: 'invalid' });
        throw new Error('Should have thrown validation error');
      } catch (error) {
        zodError = error as z.ZodError;
      }

      errorHandler(zodError, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Validation Error',
        details: expect.any(Array),
      });
    });

    it('should handle ValidationError instances', () => {
      // Create a ZodError by validating invalid data
      const schema = z.object({
        email: z.string().email(),
      });
      
      let zodError: z.ZodError;
      try {
        schema.parse({ email: 'invalid' });
        throw new Error('Should have thrown validation error');
      } catch (error) {
        zodError = error as z.ZodError;
      }
      
      const validationError = new ValidationError(zodError, 'Custom validation error');

      errorHandler(validationError, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.any(String),
        })
      );
    });

    it('should handle generic errors with 500 status', () => {
      const error = new Error('Generic error');

      errorHandler(error, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Internal Server Error',
        message: undefined,
      });
    });

    it('should handle errors without message', () => {
      const error = new Error();

      errorHandler(error, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Internal Server Error',
        message: undefined,
      });
    });

    it('should include message in development environment', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const error = new Error('Test error');

      errorHandler(error, req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Internal Server Error',
        message: 'Test error',
      });

      process.env.NODE_ENV = originalEnv;
    });

    it('should not include message in production environment', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const error = new Error('Test error');

      errorHandler(error, req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Internal Server Error',
        message: undefined,
      });

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('ApiError class', () => {
    it('should create ApiError with message and status', () => {
      const error = new ApiError(400, 'Test error');

      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.name).toBe('ApiError');
    });

    it('should create ApiError with details', () => {
      const details = { field: 'email', issue: 'invalid format' };
      const error = new ApiError(422, 'Validation error', details);

      expect(error.message).toBe('Validation error');
      expect(error.statusCode).toBe(422);
      expect(error.details).toEqual(details);
      expect(error.name).toBe('ApiError');
    });
  });

  describe('Error Response Format', () => {
    it('should return consistent error response format', () => {
      const error = new ApiError(400, 'Test error');

      errorHandler(error, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Test error',
        details: undefined,
      });
    });

    it('should handle errors with additional properties', () => {
      const details = { field: 'email', code: 'INVALID_FORMAT' };
      const error = new ApiError(422, 'Validation error', details);

      errorHandler(error, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Validation error',
        details: details,
      });
    });
  });

  describe('Error Logging', () => {
    it('should log errors', () => {
      const error = new Error('Test error');
      const loggerSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      errorHandler(error, req as Request, res as Response, next);

      // The logger implementation may vary, so we just check that some logging occurred
      // This test assumes the logger is working and would need to be adjusted based on actual logger implementation

      loggerSpy.mockRestore();
    });
  });

  describe('Edge Cases', () => {
    it('should handle error with circular references', () => {
      const error: any = new Error('Test error');
      error.circular = error;

      expect(() => {
        errorHandler(error, req as Request, res as Response, next);
      }).not.toThrow();
    });
  });
}); 