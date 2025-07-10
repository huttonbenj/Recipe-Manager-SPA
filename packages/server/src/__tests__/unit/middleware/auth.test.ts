import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { authenticate, optionalAuth, AuthenticatedRequest } from '../../../middleware/auth';
import { AuthUtils } from '../../../utils/auth';
import { ApiError } from '../../../middleware/error';

// Mock AuthUtils
vi.mock('../../../utils/auth', () => ({
  AuthUtils: {
    extractTokenFromHeader: vi.fn(),
    verifyToken: vi.fn(),
  }
}));

describe('Auth Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('authenticate', () => {
    it('should authenticate valid token and add user to request', () => {
      const mockPayload = { userId: 'test-user-id', email: 'test@example.com' };
      const mockToken = 'valid-token';
      
      (AuthUtils.extractTokenFromHeader as ReturnType<typeof vi.fn>).mockReturnValue(mockToken);
      (AuthUtils.verifyToken as ReturnType<typeof vi.fn>).mockReturnValue(mockPayload);
      
      const req = {
        headers: { authorization: `Bearer ${mockToken}` }
      } as Request;
      const res = {} as Response;
      const next = vi.fn() as NextFunction;
      
      authenticate(req, res, next);
      
      expect(AuthUtils.extractTokenFromHeader).toHaveBeenCalledWith(`Bearer ${mockToken}`);
      expect(AuthUtils.verifyToken).toHaveBeenCalledWith(mockToken);
      expect((req as AuthenticatedRequest).user).toEqual(mockPayload);
      expect(next).toHaveBeenCalledWith();
    });

    it('should throw ApiError for missing authorization header', () => {
      (AuthUtils.extractTokenFromHeader as ReturnType<typeof vi.fn>).mockReturnValue(null);
      
      const req = {
        headers: {}
      } as Request;
      const res = {} as Response;
      const next = vi.fn() as NextFunction;
      
      authenticate(req, res, next);
      
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      const error = (next as any).mock.calls[0][0];
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('Access token required');
    });

    it('should throw ApiError for invalid token format', () => {
      (AuthUtils.extractTokenFromHeader as ReturnType<typeof vi.fn>).mockReturnValue(null);
      
      const req = {
        headers: { authorization: 'Invalid format' }
      } as Request;
      const res = {} as Response;
      const next = vi.fn() as NextFunction;
      
      authenticate(req, res, next);
      
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      const error = (next as any).mock.calls[0][0];
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('Access token required');
    });

    it('should throw ApiError for expired token', () => {
      const mockToken = 'expired-token';
      
      (AuthUtils.extractTokenFromHeader as ReturnType<typeof vi.fn>).mockReturnValue(mockToken);
      (AuthUtils.verifyToken as ReturnType<typeof vi.fn>).mockImplementation(() => {
        throw new Error('Token expired');
      });
      
      const req = {
        headers: { authorization: `Bearer ${mockToken}` }
      } as Request;
      const res = {} as Response;
      const next = vi.fn() as NextFunction;
      
      authenticate(req, res, next);
      
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      const error = (next as any).mock.calls[0][0];
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('Invalid or expired token');
    });

    it('should throw ApiError for invalid token', () => {
      const mockToken = 'invalid-token';
      
      (AuthUtils.extractTokenFromHeader as ReturnType<typeof vi.fn>).mockReturnValue(mockToken);
      (AuthUtils.verifyToken as ReturnType<typeof vi.fn>).mockImplementation(() => {
        throw new Error('Invalid token');
      });
      
      const req = {
        headers: { authorization: `Bearer ${mockToken}` }
      } as Request;
      const res = {} as Response;
      const next = vi.fn() as NextFunction;
      
      authenticate(req, res, next);
      
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      const error = (next as any).mock.calls[0][0];
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('Invalid or expired token');
    });

    it('should handle ApiError from AuthUtils correctly', () => {
      const mockToken = 'problematic-token';
      const apiError = new ApiError(401, 'Custom auth error');
      
      (AuthUtils.extractTokenFromHeader as ReturnType<typeof vi.fn>).mockReturnValue(mockToken);
      (AuthUtils.verifyToken as ReturnType<typeof vi.fn>).mockImplementation(() => {
        throw apiError;
      });
      
      const req = {
        headers: { authorization: `Bearer ${mockToken}` }
      } as Request;
      const res = {} as Response;
      const next = vi.fn() as NextFunction;
      
      authenticate(req, res, next);
      
      expect(next).toHaveBeenCalledWith(apiError);
    });
  });

  describe('optionalAuth', () => {
    it('should authenticate valid token and add user to request', () => {
      const mockPayload = { userId: 'test-user-id', email: 'test@example.com' };
      const mockToken = 'valid-token';
      
      (AuthUtils.extractTokenFromHeader as ReturnType<typeof vi.fn>).mockReturnValue(mockToken);
      (AuthUtils.verifyToken as ReturnType<typeof vi.fn>).mockReturnValue(mockPayload);
      
      const req = {
        headers: { authorization: `Bearer ${mockToken}` }
      } as Request;
      const res = {} as Response;
      const next = vi.fn() as NextFunction;
      
      optionalAuth(req, res, next);
      
      expect(AuthUtils.extractTokenFromHeader).toHaveBeenCalledWith(`Bearer ${mockToken}`);
      expect(AuthUtils.verifyToken).toHaveBeenCalledWith(mockToken);
      expect((req as AuthenticatedRequest).user).toEqual(mockPayload);
      expect(next).toHaveBeenCalledWith();
    });

    it('should continue without user for missing authorization header', () => {
      (AuthUtils.extractTokenFromHeader as ReturnType<typeof vi.fn>).mockReturnValue(null);
      
      const req = {
        headers: {}
      } as Request;
      const res = {} as Response;
      const next = vi.fn() as NextFunction;
      
      optionalAuth(req, res, next);
      
      expect((req as AuthenticatedRequest).user).toBeUndefined();
      expect(next).toHaveBeenCalledWith();
    });

    it('should continue without user for invalid token format', () => {
      (AuthUtils.extractTokenFromHeader as ReturnType<typeof vi.fn>).mockReturnValue(null);
      
      const req = {
        headers: { authorization: 'Invalid format' }
      } as Request;
      const res = {} as Response;
      const next = vi.fn() as NextFunction;
      
      optionalAuth(req, res, next);
      
      expect((req as AuthenticatedRequest).user).toBeUndefined();
      expect(next).toHaveBeenCalledWith();
    });

    it('should continue without user for expired token', () => {
      const mockToken = 'expired-token';
      
      (AuthUtils.extractTokenFromHeader as ReturnType<typeof vi.fn>).mockReturnValue(mockToken);
      (AuthUtils.verifyToken as ReturnType<typeof vi.fn>).mockImplementation(() => {
        throw new Error('Token expired');
      });
      
      const req = {
        headers: { authorization: `Bearer ${mockToken}` }
      } as Request;
      const res = {} as Response;
      const next = vi.fn() as NextFunction;
      
      optionalAuth(req, res, next);
      
      expect((req as AuthenticatedRequest).user).toBeUndefined();
      expect(next).toHaveBeenCalledWith();
    });

    it('should continue without user for invalid token', () => {
      const mockToken = 'invalid-token';
      
      (AuthUtils.extractTokenFromHeader as ReturnType<typeof vi.fn>).mockReturnValue(mockToken);
      (AuthUtils.verifyToken as ReturnType<typeof vi.fn>).mockImplementation(() => {
        throw new Error('Invalid token');
      });
      
      const req = {
        headers: { authorization: `Bearer ${mockToken}` }
      } as Request;
      const res = {} as Response;
      const next = vi.fn() as NextFunction;
      
      optionalAuth(req, res, next);
      
      expect((req as AuthenticatedRequest).user).toBeUndefined();
      expect(next).toHaveBeenCalledWith();
    });
  });
}); 