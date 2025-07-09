import { Request, Response } from 'express';
import { z } from 'zod';
import { ApiError, errorHandler } from './error';

describe('Error Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      path: '/test',
      method: 'GET'
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
  });

  it('should handle ApiError', () => {
    const error = new ApiError(400, 'Bad Request', { field: 'invalid' });
    
    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Bad Request',
      details: { field: 'invalid' }
    });
  });

  it('should handle ZodError', () => {
    const schema = z.object({ name: z.string() });
    const result = schema.safeParse({ name: 123 });
    
    if (!result.success) {
      errorHandler(
        result.error,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Validation Error',
        details: result.error.errors
      });
    }
  });

  it('should handle unknown errors in development', () => {
    process.env.NODE_ENV = 'development';
    const error = new Error('Unknown Error');
    
    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Internal Server Error',
      message: 'Unknown Error'
    });
  });

  it('should handle unknown errors in production', () => {
    process.env.NODE_ENV = 'production';
    const error = new Error('Unknown Error');
    
    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Internal Server Error',
      message: undefined
    });
  });
}); 