/**
 * Authentication routes
 * Handles user authentication endpoints
 */

import { Router } from 'express'
import authController from '../controllers/authController'
import { authenticateToken } from '../middleware/auth'

const router = Router()

// POST /api/auth/register - Register new user
router.post('/register', authController.register)

// POST /api/auth/login - Login user
router.post('/login', authController.login)

// POST /api/auth/refresh - Refresh access token
router.post('/refresh', authController.refreshToken)

// DELETE /api/auth/logout - Logout user
router.delete('/logout', authController.logout)

// GET /api/auth/me - Get current user profile (protected route)
router.get('/me', authenticateToken, authController.getProfile)

export default router