import { describe, it, expect, vi } from 'vitest';
import { AuthUtils } from '../../../utils/auth';
import jwt from 'jsonwebtoken';

// Mock jsonwebtoken
vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn(),
    verify: vi.fn(),
    TokenExpiredError: class extends Error {
      constructor(message: string, expiredAt: Date) {
        super(message);
        this.name = 'TokenExpiredError';
        this.expiredAt = expiredAt;
      }
      expiredAt: Date;
    },
    JsonWebTokenError: class extends Error {
      constructor(message: string) {
        super(message);
        this.name = 'JsonWebTokenError';
      }
    }
  }
}));

describe('AuthUtils', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'testpassword123';
      const hashedPassword = await AuthUtils.hashPassword(password);
      
      expect(hashedPassword).toBeDefined();
      expect(typeof hashedPassword).toBe('string');
      expect(hashedPassword.length).toBeGreaterThan(10);
      expect(hashedPassword).not.toBe(password);
    });

    it('should create different hashes for the same password', async () => {
      const password = 'testpassword123';
      const hash1 = await AuthUtils.hashPassword(password);
      const hash2 = await AuthUtils.hashPassword(password);
      
      expect(hash1).not.toBe(hash2);
    });

    it('should handle empty password', async () => {
      const hashedPassword = await AuthUtils.hashPassword('');
      
      expect(hashedPassword).toBeDefined();
      expect(typeof hashedPassword).toBe('string');
      expect(hashedPassword.length).toBeGreaterThan(10);
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching password and hash', async () => {
      const password = 'testpassword123';
      const hashedPassword = await AuthUtils.hashPassword(password);
      
      const isValid = await AuthUtils.comparePassword(password, hashedPassword);
      expect(isValid).toBe(true);
    });

    it('should return false for non-matching password and hash', async () => {
      const password = 'testpassword123';
      const wrongPassword = 'wrongpassword';
      const hashedPassword = await AuthUtils.hashPassword(password);
      
      const isValid = await AuthUtils.comparePassword(wrongPassword, hashedPassword);
      expect(isValid).toBe(false);
    });

    it('should return false for empty password', async () => {
      const hashedPassword = await AuthUtils.hashPassword('testpassword123');
      
      const isValid = await AuthUtils.comparePassword('', hashedPassword);
      expect(isValid).toBe(false);
    });

    it('should return false for invalid hash', async () => {
      const password = 'testpassword123';
      const invalidHash = 'invalid-hash';
      
      const isValid = await AuthUtils.comparePassword(password, invalidHash);
      expect(isValid).toBe(false);
    });
  });

  describe('generateTokens', () => {
    it('should generate access and refresh tokens', () => {
      const mockAccessToken = 'mock-access-token';
      const mockRefreshToken = 'mock-refresh-token';
      (jwt.sign as ReturnType<typeof vi.fn>)
        .mockReturnValueOnce(mockAccessToken)
        .mockReturnValueOnce(mockRefreshToken);
      
      const user = { id: 'test-user-id', email: 'test@example.com' };
      const tokens = AuthUtils.generateTokens(user);
      
      expect(tokens.accessToken).toBe(mockAccessToken);
      expect(tokens.refreshToken).toBe(mockRefreshToken);
      expect(jwt.sign).toHaveBeenCalledTimes(2);
    });
  });

  describe('generateAccessToken', () => {
    it('should generate an access token', () => {
      const mockToken = 'mock-access-token';
      (jwt.sign as ReturnType<typeof vi.fn>).mockReturnValue(mockToken);
      
      const payload = { userId: 'test-user-id', email: 'test@example.com' };
      const token = AuthUtils.generateAccessToken(payload);
      
      expect(token).toBe(mockToken);
      expect(jwt.sign).toHaveBeenCalledWith(
        payload,
        process.env.JWT_SECRET || 'dev-secret-key',
        { expiresIn: '7d' }
      );
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a refresh token', () => {
      const mockToken = 'mock-refresh-token';
      (jwt.sign as ReturnType<typeof vi.fn>).mockReturnValue(mockToken);
      
      const payload = { userId: 'test-user-id', email: 'test@example.com' };
      const token = AuthUtils.generateRefreshToken(payload);
      
      expect(token).toBe(mockToken);
      expect(jwt.sign).toHaveBeenCalledWith(
        payload,
        process.env.JWT_SECRET || 'dev-secret-key',
        { expiresIn: '30d' }
      );
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const mockPayload = { userId: 'test-user-id', email: 'test@example.com' };
      (jwt.verify as ReturnType<typeof vi.fn>).mockReturnValue(mockPayload);
      
      const token = 'valid-token';
      const payload = AuthUtils.verifyToken(token);
      
      expect(payload).toEqual(mockPayload);
      expect(jwt.verify).toHaveBeenCalledWith(
        token,
        process.env.JWT_SECRET || 'dev-secret-key'
      );
    });

    it('should throw error for invalid token', () => {
      (jwt.verify as ReturnType<typeof vi.fn>).mockImplementation(() => {
        throw new jwt.JsonWebTokenError('Invalid token');
      });
      
      const token = 'invalid-token';
      expect(() => AuthUtils.verifyToken(token)).toThrow('Invalid token');
    });

    it('should throw error for expired token', () => {
      (jwt.verify as ReturnType<typeof vi.fn>).mockImplementation(() => {
        throw new jwt.TokenExpiredError('Token expired', new Date());
      });
      
      const token = 'expired-token';
      expect(() => AuthUtils.verifyToken(token)).toThrow('Token expired');
    });

    it('should throw generic error for other verification failures', () => {
      (jwt.verify as ReturnType<typeof vi.fn>).mockImplementation(() => {
        throw new Error('Generic error');
      });
      
      const token = 'malformed-token';
      expect(() => AuthUtils.verifyToken(token)).toThrow('Token verification failed');
    });
  });

  describe('extractTokenFromHeader', () => {
    it('should extract token from Authorization header', () => {
      const token = 'test-token';
      const authHeader = `Bearer ${token}`;
      
      const extractedToken = AuthUtils.extractTokenFromHeader(authHeader);
      expect(extractedToken).toBe(token);
    });

    it('should return null for missing Authorization header', () => {
      const extractedToken = AuthUtils.extractTokenFromHeader(undefined);
      expect(extractedToken).toBeNull();
    });

    it('should return null for invalid Authorization header format', () => {
      const authHeader = 'Invalid format';
      
      const extractedToken = AuthUtils.extractTokenFromHeader(authHeader);
      expect(extractedToken).toBeNull();
    });

    it('should return null for missing Bearer prefix', () => {
      const authHeader = 'test-token';
      
      const extractedToken = AuthUtils.extractTokenFromHeader(authHeader);
      expect(extractedToken).toBeNull();
    });

    it('should return null for empty token', () => {
      const authHeader = 'Bearer ';
      
      const extractedToken = AuthUtils.extractTokenFromHeader(authHeader);
      expect(extractedToken).toBeNull();
    });
  });

  describe('validatePassword', () => {
    it('should validate a strong password', () => {
      const password = 'StrongPass123!';
      const result = AuthUtils.validatePassword(password);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject password that is too short', () => {
      const password = 'Short1!';
      const result = AuthUtils.validatePassword(password);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('minLength');
    });

    it('should reject password without lowercase', () => {
      const password = 'PASSWORD123!';
      const result = AuthUtils.validatePassword(password);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('lowercase');
    });

    it('should reject password without uppercase', () => {
      const password = 'password123!';
      const result = AuthUtils.validatePassword(password);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('uppercase');
    });

    it('should reject password without number', () => {
      const password = 'Password!';
      const result = AuthUtils.validatePassword(password);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('number');
    });

    it('should reject password without special character', () => {
      const password = 'Password123';
      const result = AuthUtils.validatePassword(password);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('specialChar');
    });

    it('should return multiple errors for weak password', () => {
      const password = 'weak';
      const result = AuthUtils.validatePassword(password);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe('sanitizeUserResponse', () => {
    it('should remove password_hash from user object', () => {
      const user = {
        id: 'test-id',
        email: 'test@example.com',
        name: 'Test User',
        password_hash: 'hashed-password',
        created_at: new Date(),
        updated_at: new Date()
      };
      
      const sanitized = AuthUtils.sanitizeUserResponse(user);
      
      expect(sanitized).not.toHaveProperty('password_hash');
      expect(sanitized.id).toBe(user.id);
      expect(sanitized.email).toBe(user.email);
      expect(sanitized.name).toBe(user.name);
    });
  });
}); 