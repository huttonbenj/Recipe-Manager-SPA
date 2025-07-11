import { Request, Response, NextFunction } from 'express';
import { AuthUtils, JwtPayload } from '../utils/auth';
import { ApiError } from './error';
import { HTTP_STATUS } from '@recipe-manager/shared';

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = AuthUtils.extractTokenFromHeader(authHeader);

    if (!token) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Access token required');
    }

    const decoded = AuthUtils.verifyToken(token);
    (req as AuthenticatedRequest).user = decoded;
    
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid or expired token'));
    }
  }
};

export const optionalAuth = (req: Request, _res: Response, next: NextFunction): void => {
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