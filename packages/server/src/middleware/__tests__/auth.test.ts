import { Request, Response, NextFunction } from 'express';
import { authenticate, optionalAuth, AuthenticatedRequest } from '../auth';
import { AuthUtils } from '../../utils/auth';
import { ApiError } from '../error';

// Mock AuthUtils
jest.mock('../../utils/auth');

const mockAuthUtils = AuthUtils as jest.Mocked<typeof AuthUtils>;

describe('Authentication Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {};
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('authenticate', () => {
    it('should authenticate valid token and set user', () => {
      const token = 'validToken';
      const authHeader = `Bearer ${token}`;
      const userPayload = { userId: 'user123', email: 'test@example.com' };

      mockRequest.headers = { authorization: authHeader };
      mockAuthUtils.extractTokenFromHeader.mockReturnValue(token);
      mockAuthUtils.verifyToken.mockReturnValue(userPayload);

      authenticate(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockAuthUtils.extractTokenFromHeader).toHaveBeenCalledWith(authHeader);
      expect(mockAuthUtils.verifyToken).toHaveBeenCalledWith(token);
      expect((mockRequest as AuthenticatedRequest).user).toEqual(userPayload);
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should throw ApiError when no token provided', () => {
      mockRequest.headers = {};
      mockAuthUtils.extractTokenFromHeader.mockReturnValue(null);

      authenticate(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
      const error = (mockNext as jest.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('Access token required');
    });

    it('should pass through ApiError from token verification', () => {
      const token = 'invalidToken';
      const authHeader = `Bearer ${token}`;
      const apiError = new ApiError(401, 'Invalid token');

      mockRequest.headers = { authorization: authHeader };
      mockAuthUtils.extractTokenFromHeader.mockReturnValue(token);
      mockAuthUtils.verifyToken.mockImplementation(() => {
        throw apiError;
      });

      authenticate(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(apiError);
    });

    it('should convert generic error to ApiError', () => {
      const token = 'invalidToken';
      const authHeader = `Bearer ${token}`;
      const genericError = new Error('Token expired');

      mockRequest.headers = { authorization: authHeader };
      mockAuthUtils.extractTokenFromHeader.mockReturnValue(token);
      mockAuthUtils.verifyToken.mockImplementation(() => {
        throw genericError;
      });

      authenticate(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
      const error = (mockNext as jest.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('Invalid or expired token');
    });
  });

  describe('optionalAuth', () => {
    it('should set user when valid token provided', () => {
      const token = 'validToken';
      const authHeader = `Bearer ${token}`;
      const userPayload = { userId: 'user123', email: 'test@example.com' };

      mockRequest.headers = { authorization: authHeader };
      mockAuthUtils.extractTokenFromHeader.mockReturnValue(token);
      mockAuthUtils.verifyToken.mockReturnValue(userPayload);

      optionalAuth(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockAuthUtils.extractTokenFromHeader).toHaveBeenCalledWith(authHeader);
      expect(mockAuthUtils.verifyToken).toHaveBeenCalledWith(token);
      expect((mockRequest as AuthenticatedRequest).user).toEqual(userPayload);
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should continue without user when no token provided', () => {
      mockRequest.headers = {};
      mockAuthUtils.extractTokenFromHeader.mockReturnValue(null);

      optionalAuth(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockAuthUtils.extractTokenFromHeader).toHaveBeenCalled();
      expect(mockAuthUtils.verifyToken).not.toHaveBeenCalled();
      expect((mockRequest as AuthenticatedRequest).user).toBeUndefined();
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should continue without user when token verification fails', () => {
      const token = 'invalidToken';
      const authHeader = `Bearer ${token}`;

      mockRequest.headers = { authorization: authHeader };
      mockAuthUtils.extractTokenFromHeader.mockReturnValue(token);
      mockAuthUtils.verifyToken.mockImplementation(() => {
        throw new Error('Token expired');
      });

      optionalAuth(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockAuthUtils.extractTokenFromHeader).toHaveBeenCalledWith(authHeader);
      expect(mockAuthUtils.verifyToken).toHaveBeenCalledWith(token);
      expect((mockRequest as AuthenticatedRequest).user).toBeUndefined();
      expect(mockNext).toHaveBeenCalledWith();
    });
  });
}); 