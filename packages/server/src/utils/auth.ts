import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, SERVER_CONFIG } from '@recipe-manager/shared';

const JWT_SECRET = process.env.JWT_SECRET || SERVER_CONFIG.JWT_SECRET_FALLBACK;
const SALT_ROUNDS = SERVER_CONFIG.SALT_ROUNDS;

export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export class AuthUtils {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static generateAccessToken(payload: Pick<JwtPayload, 'userId' | 'email'>): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  }

  static generateRefreshToken(payload: Pick<JwtPayload, 'userId' | 'email'>): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
  }

  static generateTokens(user: Pick<User, 'id' | 'email'>): AuthTokens {
    const payload = {
      userId: user.id,
      email: user.email,
    };

    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  static verifyToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      }
      throw new Error('Token verification failed');
    }
  }

  static extractTokenFromHeader(authHeader?: string): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.substring(7);
    return token.length > 0 ? token : null;
  }

  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push('Password must contain at least one special character (@$!%*?&)');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static sanitizeUserResponse(user: User & { password_hash?: string }): Omit<User, 'password_hash'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash: _, ...sanitizedUser } = user;
    return sanitizedUser;
  }
} 