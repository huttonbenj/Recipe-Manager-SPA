import { Router, Request, Response } from 'express';
import { UserService } from '../services/userService';
import { AuthUtils } from '../utils/auth';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import { body, validationResult } from 'express-validator';
import logger from '../utils/logger';

const router = Router();

// Validation middleware
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long'),
];

const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
];

// Helper function to handle validation errors
const handleValidationErrors = (req: Request, res: Response): boolean => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
    return true;
  }
  return false;
};

// POST /api/auth/register - Register a new user
router.post(
  '/register',
  registerValidation,
  asyncHandler(async (req: Request, res: Response) => {
    if (handleValidationErrors(req, res)) return;

    const { email, name, password } = req.body;

    // Validate password strength
    const passwordValidation = AuthUtils.validatePassword(password);
    if (!passwordValidation.isValid) {
      res.status(400).json({
        success: false,
        error: 'Password validation failed',
        details: passwordValidation.errors
      });
      return;
    }

    try {
      // Create user
      const user = await UserService.createUser({
        email,
        name,
        password,
      });

      // Generate tokens
      const tokens = AuthUtils.generateTokens(user);

      // Return user without password hash
      const userResponse = {
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };

      logger.info(`New user registered: ${user.email}`);

      res.status(201).json({
        success: true,
        data: {
          user: userResponse,
          tokens,
        },
        message: 'User registered successfully'
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('already exists')) {
        res.status(409).json({
          success: false,
          error: 'User with this email already exists'
        });
        return;
      }
      
      logger.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to register user'
      });
    }
  })
);

// POST /api/auth/login - Login user
router.post(
  '/login',
  loginValidation,
  asyncHandler(async (req: Request, res: Response) => {
    if (handleValidationErrors(req, res)) return;

    const { email, password } = req.body;

    try {
      // Authenticate user
      const user = await UserService.authenticateUser({ email, password });

      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Invalid email or password'
        });
        return;
      }

      // Generate tokens
      const tokens = AuthUtils.generateTokens(user);

      // Return user without password hash
      const userResponse = {
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };

      logger.info(`User logged in: ${user.email}`);

      res.json({
        success: true,
        data: {
          user: userResponse,
          tokens,
        },
        message: 'Login successful'
      });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to login'
      });
    }
  })
);

// POST /api/auth/refresh - Refresh access token
router.post(
  '/refresh',
  body('refreshToken').notEmpty().withMessage('Refresh token is required'),
  asyncHandler(async (req: Request, res: Response) => {
    if (handleValidationErrors(req, res)) return;

    const { refreshToken } = req.body;

    try {
      // Verify refresh token
      const payload = AuthUtils.verifyToken(refreshToken);
      
      // Get user to ensure they still exist
      const user = await UserService.getUserById(payload.userId);
      
      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Invalid refresh token'
        });
        return;
      }

      // Generate new tokens
      const tokens = AuthUtils.generateTokens(user);

      res.json({
        success: true,
        data: tokens,
        message: 'Tokens refreshed successfully'
      });
    } catch (error) {
      logger.error('Token refresh error:', error);
      res.status(401).json({
        success: false,
        error: 'Invalid refresh token'
      });
    }
  })
);

// GET /api/auth/profile - Get user profile (requires authentication)
router.get(
  '/profile',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as AuthenticatedRequest).user.userId;

    try {
      const user = await UserService.getUserProfile(userId);

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      logger.error('Profile fetch error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch profile'
      });
    }
  })
);

// PUT /api/auth/profile - Update user profile (requires authentication)
router.put(
  '/profile',
  authenticate,
  updateProfileValidation,
  asyncHandler(async (req: Request, res: Response) => {
    if (handleValidationErrors(req, res)) return;

    const userId = (req as AuthenticatedRequest).user.userId;
    const { name, email } = req.body;

    try {
      const updatedUser = await UserService.updateUser(userId, { name, email });

      // Return user without password hash
      const userResponse = {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        created_at: updatedUser.created_at,
        updated_at: updatedUser.updated_at,
      };

      res.json({
        success: true,
        data: userResponse,
        message: 'Profile updated successfully'
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('Email already in use')) {
        res.status(409).json({
          success: false,
          error: 'Email already in use'
        });
        return;
      }

      logger.error('Profile update error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update profile'
      });
    }
  })
);

// POST /api/auth/change-password - Change user password (requires authentication)
router.post(
  '/change-password',
  authenticate,
  changePasswordValidation,
  asyncHandler(async (req: Request, res: Response) => {
    if (handleValidationErrors(req, res)) return;

    const userId = (req as AuthenticatedRequest).user.userId;
    const { currentPassword, newPassword } = req.body;

    // Validate new password strength
    const passwordValidation = AuthUtils.validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      res.status(400).json({
        success: false,
        error: 'New password validation failed',
        details: passwordValidation.errors
      });
      return;
    }

    try {
      await UserService.changePassword(userId, currentPassword, newPassword);

      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('Current password is incorrect')) {
        res.status(400).json({
          success: false,
          error: 'Current password is incorrect'
        });
        return;
      }

      logger.error('Password change error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to change password'
      });
    }
  })
);

// GET /api/auth/stats - Get user statistics (requires authentication)
router.get(
  '/stats',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as AuthenticatedRequest).user.userId;

    try {
      const stats = await UserService.getUserStats(userId);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      logger.error('Stats fetch error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user statistics'
      });
    }
  })
);

// POST /api/auth/logout - Logout user (for completeness, client-side token removal)
router.post(
  '/logout',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    // In a JWT-based system, logout is typically handled client-side
    // by removing the token from storage. This endpoint is for completeness.
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  })
);

export default router; 