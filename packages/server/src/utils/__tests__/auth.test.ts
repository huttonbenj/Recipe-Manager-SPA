import { AuthUtils } from '../auth';

// Mock the external dependencies
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
  TokenExpiredError: class extends Error {
    constructor(message: string, _expiredAt: Date) {
      super(message);
      this.name = 'TokenExpiredError';
    }
  },
  JsonWebTokenError: class extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'JsonWebTokenError';
    }
  },
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

describe('AuthUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('hashPassword', () => {
    it('should hash password with correct salt rounds', async () => {
      const password = 'testPassword123';
      const hashedPassword = 'hashedPassword';
      
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await AuthUtils.hashPassword(password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 12);
      expect(result).toBe(hashedPassword);
    });
  });

  describe('comparePassword', () => {
    it('should compare password correctly when valid', async () => {
      const password = 'testPassword123';
      const hashedPassword = 'hashedPassword';
      
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await AuthUtils.comparePassword(password, hashedPassword);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toBe(true);
    });

    it('should return false when password is invalid', async () => {
      const password = 'wrongPassword';
      const hashedPassword = 'hashedPassword';
      
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await AuthUtils.comparePassword(password, hashedPassword);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toBe(false);
    });
  });

  describe('generateAccessToken', () => {
    it('should generate access token with correct payload and options', () => {
      const payload = { userId: 'user123', email: 'test@example.com' };
      const token = 'generatedToken';
      
      (jwt.sign as jest.Mock).mockReturnValue(token);

      const result = AuthUtils.generateAccessToken(payload);

      expect(jwt.sign).toHaveBeenCalledWith(
        payload,
        'dev-secret-key',
        { expiresIn: '7d' }
      );
      expect(result).toBe(token);
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate refresh token with correct payload and options', () => {
      const payload = { userId: 'user123', email: 'test@example.com' };
      const token = 'generatedRefreshToken';
      
      (jwt.sign as jest.Mock).mockReturnValue(token);

      const result = AuthUtils.generateRefreshToken(payload);

      expect(jwt.sign).toHaveBeenCalledWith(
        payload,
        'dev-secret-key',
        { expiresIn: '30d' }
      );
      expect(result).toBe(token);
    });
  });

  describe('generateTokens', () => {
    it('should generate both access and refresh tokens', () => {
      const user = { id: 'user123', email: 'test@example.com' };
      const accessToken = 'accessToken';
      const refreshToken = 'refreshToken';
      
      (jwt.sign as jest.Mock)
        .mockReturnValueOnce(accessToken)
        .mockReturnValueOnce(refreshToken);

      const result = AuthUtils.generateTokens(user);

      expect(result).toEqual({
        accessToken,
        refreshToken,
      });
      expect(jwt.sign).toHaveBeenCalledTimes(2);
    });
  });

  describe('verifyToken', () => {
    it('should verify valid token and return payload', () => {
      const token = 'validToken';
      const payload = { userId: 'user123', email: 'test@example.com', iat: 123, exp: 456 };
      
      (jwt.verify as jest.Mock).mockReturnValue(payload);

      const result = AuthUtils.verifyToken(token);

      expect(jwt.verify).toHaveBeenCalledWith(token, 'dev-secret-key');
      expect(result).toEqual(payload);
    });

    it('should throw error for expired token', () => {
      const token = 'expiredToken';
      const error = new jwt.TokenExpiredError('jwt expired', new Date());
      
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw error;
      });

      expect(() => AuthUtils.verifyToken(token)).toThrow('Token expired');
    });

    it('should throw error for invalid token', () => {
      const token = 'invalidToken';
      const error = new jwt.JsonWebTokenError('invalid token');
      
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw error;
      });

      expect(() => AuthUtils.verifyToken(token)).toThrow('Invalid token');
    });

    it('should throw generic error for other JWT errors', () => {
      const token = 'invalidToken';
      const error = new Error('Some other error');
      
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw error;
      });

      expect(() => AuthUtils.verifyToken(token)).toThrow('Token verification failed');
    });
  });

  describe('extractTokenFromHeader', () => {
    it('should extract token from valid Bearer header', () => {
      const authHeader = 'Bearer validToken123';
      
      const result = AuthUtils.extractTokenFromHeader(authHeader);

      expect(result).toBe('validToken123');
    });

    it('should return null for missing header', () => {
      const result = AuthUtils.extractTokenFromHeader(undefined);

      expect(result).toBeNull();
    });

    it('should return null for header without Bearer prefix', () => {
      const authHeader = 'Basic sometoken';
      
      const result = AuthUtils.extractTokenFromHeader(authHeader);

      expect(result).toBeNull();
    });

    it('should return null for malformed Bearer header', () => {
      const authHeader = 'Bearer';
      
      const result = AuthUtils.extractTokenFromHeader(authHeader);

      expect(result).toBeNull();
    });

    it('should return null for Bearer header with space but no token', () => {
      const authHeader = 'Bearer ';
      
      const result = AuthUtils.extractTokenFromHeader(authHeader);

      expect(result).toBeNull();
    });
  });

  describe('validatePassword', () => {
    it('should validate strong password', () => {
      const password = 'StrongP@ssw0rd';
      
      const result = AuthUtils.validatePassword(password);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject password that is too short', () => {
      const password = 'Short1!';
      
      const result = AuthUtils.validatePassword(password);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters long');
    });

    it('should reject password without lowercase letter', () => {
      const password = 'PASSWORD123!';
      
      const result = AuthUtils.validatePassword(password);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
    });

    it('should reject password without uppercase letter', () => {
      const password = 'password123!';
      
      const result = AuthUtils.validatePassword(password);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    it('should reject password without number', () => {
      const password = 'Password!';
      
      const result = AuthUtils.validatePassword(password);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });

    it('should reject password without special character', () => {
      const password = 'Password123';
      
      const result = AuthUtils.validatePassword(password);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one special character (@$!%*?&)');
    });

    it('should return multiple errors for weak password', () => {
      const password = 'weak';
      
      const result = AuthUtils.validatePassword(password);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(4); // Only 4 errors since 'weak' has lowercase
    });
  });
}); 