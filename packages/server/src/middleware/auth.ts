import { Request, Response, NextFunction } from 'express';
import { AuthUtils, JwtPayload } from '../utils/auth';
import { ApiError } from './error';

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = AuthUtils.extractTokenFromHeader(authHeader);

    if (!token) {
      throw new ApiError(401, 'Access token required');
    }

    const decoded = AuthUtils.verifyToken(token);
    (req as AuthenticatedRequest).user = decoded;
    
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(401, 'Invalid or expired token'));
    }
  }
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = AuthUtils.extractTokenFromHeader(authHeader);

    if (token) {
      const decoded = AuthUtils.verifyToken(token);
      (req as AuthenticatedRequest).user = decoded;
    }
    
    next();
  } catch {
    // For optional auth, we don't throw errors, just continue without user
    next();
  }
}; 