import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validateBody, validateParams, validateQuery } from '../../../middleware/validation';

// Mock express objects
const mockRequest = (overrides: Partial<Request> = {}): Request => ({
  body: {},
  params: {},
  query: {},
  ...overrides,
} as Request);

const mockResponse = (): Response => {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

const mockNext = (): NextFunction => vi.fn();

describe('Validation Middleware', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    next = mockNext();
  });

  describe('validateBody', () => {
    const schema = z.object({
      name: z.string().min(1),
      email: z.string().email(),
      age: z.number().min(0),
    });

    it('should call next() when body is valid', () => {
      req.body = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      };

      const middleware = validateBody(schema);
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 400 when body is invalid', () => {
      req.body = {
        name: '',
        email: 'invalid-email',
        age: -5,
      };

      const middleware = validateBody(schema);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Validation failed',
          details: expect.any(Array),
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 when required fields are missing', () => {
      req.body = {};

      const middleware = validateBody(schema);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Validation failed',
        details: expect.any(Array),
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle nested object validation', () => {
      const nestedSchema = z.object({
        user: z.object({
          name: z.string(),
          profile: z.object({
            age: z.number(),
          }),
        }),
      });

      req.body = {
        user: {
          name: 'John',
          profile: {
            age: 25,
          },
        },
      };

      const middleware = validateBody(nestedSchema);
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should handle array validation', () => {
      const arraySchema = z.object({
        items: z.array(z.string()),
      });

      req.body = {
        items: ['item1', 'item2', 'item3'],
      };

      const middleware = validateBody(arraySchema);
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('validateParams', () => {
    const schema = z.object({
      id: z.string().uuid(),
      slug: z.string().min(1),
    });

    it('should call next() when params are valid', () => {
      req.params = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        slug: 'test-slug',
      };

      const middleware = validateParams(schema);
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 400 when params are invalid', () => {
      req.params = {
        id: 'invalid-uuid',
        slug: '',
      };

      const middleware = validateParams(schema);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Validation failed',
        details: expect.any(Array),
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle missing params', () => {
      req.params = {};

      const middleware = validateParams(schema);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('validateQuery', () => {
    const schema = z.object({
      page: z.string().transform(Number).pipe(z.number().min(1)),
      limit: z.string().transform(Number).pipe(z.number().min(1).max(100)),
      search: z.string().optional(),
    });

    it('should call next() when query is valid', () => {
      req.query = {
        page: '1',
        limit: '10',
        search: 'test',
      };

      const middleware = validateQuery(schema);
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 400 when query is invalid', () => {
      req.query = {
        page: '0',
        limit: '200',
      };

      const middleware = validateQuery(schema);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Validation failed',
        details: expect.any(Array),
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle optional query parameters', () => {
      req.query = {
        page: '1',
        limit: '10',
      };

      const middleware = validateQuery(schema);
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should handle query parameter transformation', () => {
      const transformSchema = z.object({
        active: z.string().transform((val) => val === 'true'),
        tags: z.string().transform((val) => val.split(',')),
      });

      req.query = {
        active: 'true',
        tags: 'tag1,tag2,tag3',
      };

      const middleware = validateQuery(transformSchema);
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('Error Handling', () => {
    it('should handle schema parsing errors gracefully', () => {
      // Simulate a schema that throws an error
      const faultySchema = {
        parse: vi.fn().mockImplementation(() => {
          throw new Error('Schema parsing error');
        }),
      };

      req.body = { data: 'test' };

      const middleware = validateBody(faultySchema as any);
      middleware(req, res, next);

      // The middleware should forward non-Zod errors to next()
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should provide detailed error messages', () => {
      const schema = z.object({
        email: z.string().email(),
        password: z.string().min(8),
      });

      req.body = {
        email: 'invalid',
        password: '123',
      };

      const middleware = validateBody(schema);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Validation failed',
        details: expect.arrayContaining([
          expect.objectContaining({
            field: expect.any(String),
            message: expect.any(String),
          }),
        ]),
      });
    });
  });

  describe('Complex Validation Scenarios', () => {
    it('should handle recipe creation validation', () => {
      const recipeSchema = z.object({
        title: z.string().min(1).max(100),
        description: z.string().min(10).max(1000),
        ingredients: z.array(z.string()).min(1),
        instructions: z.array(z.string()).min(1),
        cookTime: z.number().min(1),
        servings: z.number().min(1),
        difficulty: z.enum(['easy', 'medium', 'hard']),
        tags: z.array(z.string()).optional(),
      });

      req.body = {
        title: 'Test Recipe',
        description: 'A delicious test recipe that everyone will love',
        ingredients: ['ingredient 1', 'ingredient 2'],
        instructions: ['step 1', 'step 2'],
        cookTime: 30,
        servings: 4,
        difficulty: 'medium',
        tags: ['dinner', 'easy'],
      };

      const middleware = validateBody(recipeSchema);
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should handle user registration validation', () => {
      const userSchema = z.object({
        name: z.string().min(2).max(50),
        email: z.string().email(),
        password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
      });

      req.body = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'StrongPass123',
      };

      const middleware = validateBody(userSchema);
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should handle search query validation', () => {
      const searchSchema = z.object({
        q: z.string().min(1),
        category: z.string().optional(),
        difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
        page: z.string().transform(Number).pipe(z.number().min(1)).default(1),
        limit: z.string().transform(Number).pipe(z.number().min(1).max(50)).default(10),
      });

      req.query = {
        q: 'pasta',
        category: 'italian',
        difficulty: 'medium',
        page: '2',
        limit: '20',
      };

      const middleware = validateQuery(searchSchema);
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });
  });
}); 