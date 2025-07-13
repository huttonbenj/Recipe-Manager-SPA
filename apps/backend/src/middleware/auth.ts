/**
 * Authentication Middleware
 * Verifies JWT tokens and protects routes
 */

import { Request, Response, NextFunction } from 'express'
import authService from '../services/authService'

// Extend Express Request interface
declare global {
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
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Access denied',
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
        error: 'Access denied',
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
    console.error('Authentication error:', error)
    
    if (error instanceof Error) {
      if (error.message === 'Invalid access token') {
        res.status(401).json({
          success: false,
          error: 'Access denied',
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
        console.log('Optional auth token verification failed:', error)
      }
    }

    next()
  } catch (error) {
    // Don't fail on optional auth errors
    console.error('Optional authentication error:', error)
    next()
  }
} 