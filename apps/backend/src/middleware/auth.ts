/**
 * Authentication Middleware
 * Verifies JWT tokens and protects routes
 */

import { Request, Response, NextFunction } from 'express'
import authService from '../services/authService'

// Extend Express Request interface
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: {
        userId: string
        email: string
      }
    }
  }
}

/**
 * Middleware to verify JWT token and authenticate requests
 * Expects Authorization header with Bearer token
 */
export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    
    // Check for authorization header
    if (!authHeader) {
      res.status(401).json({
        success: false,
        error: 'Access token required',
        message: 'Authorization header missing'
      })
      return
    }

    // Check authorization format
    if (!authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Invalid authorization format',
        message: 'Authorization header must start with Bearer'
      })
      return
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Access token required',
        message: 'No token provided'
      })
      return
    }

    // Verify token
    const decoded = authService.verifyAccessToken(token)
    
    // Verify user still exists
    const user = await authService.getUserById(decoded.userId)
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid access token',
        message: 'User not found'
      })
      return
    }

    // Add user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email
    }

    next()
  } catch (error) {
    // Note: Auth error details intentionally not logged to prevent token exposure
    
    if (error instanceof Error) {
      if (error.message === 'Invalid access token') {
        res.status(401).json({
          success: false,
          error: 'Invalid access token',
          message: 'Invalid or expired token'
        })
        return
      }
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Authentication failed'
    })
  }
}

/**
 * Optional authentication middleware - doesn't fail if no token provided
 * Useful for endpoints that work differently for authenticated vs unauthenticated users
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (token) {
      try {
        const decoded = authService.verifyAccessToken(token)
        const user = await authService.getUserById(decoded.userId)
        
        if (user) {
          req.user = {
            userId: decoded.userId,
            email: decoded.email
          }
        }
      } catch (error) {
        // Ignore token verification errors for optional auth
        // Note: Error details intentionally not logged to prevent token exposure
      }
    }

    next()
  } catch (error) {
    // Don't fail on optional auth errors
    // Note: Auth error details intentionally not logged to prevent token exposure
    next()
  }
} 