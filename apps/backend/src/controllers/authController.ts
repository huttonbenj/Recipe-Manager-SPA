/**
 * Authentication Controller
 * Handles HTTP requests for user authentication operations
 */

import { Request, Response } from 'express'
import Joi from 'joi'
import authService from '../services/authService'

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'string.empty': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'string.empty': 'Password is required'
  }),
  name: Joi.string().optional().allow('').messages({
    'string.base': 'Name must be a string'
  })
})

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'string.empty': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required'
  })
})

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'string.empty': 'Refresh token is required'
  })
})

export class AuthController {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const { error, value } = registerSchema.validate(req.body)
      if (error) {
        res.status(400).json({
          success: false,
          error: 'Validation error',
          message: error.details[0].message
        })
        return
      }

      // Register user
      const result = await authService.register(value)

      res.status(201).json({
        success: true,
        data: result,
        message: 'User registered successfully'
      })
    } catch (error) {
      console.error('Registration error:', error)
      
      if (error instanceof Error) {
        if (error.message === 'User already exists with this email') {
          res.status(409).json({
            success: false,
            error: 'User already exists',
            message: error.message
          })
          return
        }
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to register user'
      })
    }
  }

  /**
   * Login user
   * POST /api/auth/login
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const { error, value } = loginSchema.validate(req.body)
      if (error) {
        res.status(400).json({
          success: false,
          error: 'Validation error',
          message: error.details[0].message
        })
        return
      }

      // Login user
      const result = await authService.login(value)

      res.status(200).json({
        success: true,
        data: result,
        message: 'Login successful'
      })
    } catch (error) {
      console.error('Login error:', error)
      
      if (error instanceof Error) {
        if (error.message === 'Invalid email or password') {
          res.status(401).json({
            success: false,
            error: 'Authentication failed',
            message: error.message
          })
          return
        }
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to login'
      })
    }
  }

  /**
   * Refresh access token
   * POST /api/auth/refresh
   */
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const { error, value } = refreshTokenSchema.validate(req.body)
      if (error) {
        res.status(400).json({
          success: false,
          error: 'Validation error',
          message: error.details[0].message
        })
        return
      }

      // Refresh token
      const result = await authService.refreshToken(value.refreshToken)

      res.status(200).json({
        success: true,
        data: result,
        message: 'Token refreshed successfully'
      })
    } catch (error) {
      // Note: Token error details intentionally not logged to prevent token exposure
      
      if (error instanceof Error) {
        if (error.message === 'Invalid refresh token') {
          res.status(401).json({
            success: false,
            error: 'Invalid token',
            message: error.message
          })
          return
        }
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to refresh token'
      })
    }
  }

  /**
   * Logout user (client-side token removal)
   * DELETE /api/auth/logout
   */
  async logout(req: Request, res: Response): Promise<void> {
    try {
      // For JWT-based auth, logout is handled client-side by removing tokens
      // This endpoint can be used for logging purposes or future token blacklisting
      
      res.status(200).json({
        success: true,
        data: null,
        message: 'Logout successful'
      })
    } catch (error) {
      console.error('Logout error:', error)
      
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to logout'
      })
    }
  }

  /**
   * Get current user profile
   * GET /api/auth/me
   */
  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      // User ID is set by authentication middleware
      const userId = (req as any).user?.userId
      
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
          message: 'User not authenticated'
        })
        return
      }

      const user = await authService.getUserById(userId)
      
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found',
          message: 'User profile not found'
        })
        return
      }

      res.status(200).json({
        success: true,
        data: { user },
        message: 'Profile retrieved successfully'
      })
    } catch (error) {
      console.error('Get profile error:', error)
      
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to get user profile'
      })
    }
  }
}

export default new AuthController() 