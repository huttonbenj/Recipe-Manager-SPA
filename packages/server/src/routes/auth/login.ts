import { Router, Request, Response } from 'express';
import { UserService } from '../../services/userService';
import { AuthUtils } from '../../utils/auth';
import { asyncHandler } from '../../utils/asyncHandler';
import { validateBody } from '../../middleware/validation';
import { 
  RegisterRequestSchema, 
  LoginRequestSchema, 
  RefreshTokenRequestSchema,
  HTTP_STATUS
} from '@recipe-manager/shared';
import logger from '../../utils/logger';
import { authenticate } from '../../middleware/auth';

const router = Router();

// POST /api/auth/register - Register a new user
router.post(
  '/register',
  validateBody(RegisterRequestSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { email, name, password } = req.body;

    // Validate password strength
    const passwordValidation = AuthUtils.validatePassword(password);
    if (!passwordValidation.isValid) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
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

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        data: {
          user: userResponse,
          tokens,
        },
        message: 'User registered successfully'
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('already exists')) {
        res.status(HTTP_STATUS.CONFLICT).json({
          success: false,
          error: 'User with this email already exists'
        });
        return;
      }
      
      logger.error('Registration error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Failed to register user'
      });
    }
  })
);

// POST /api/auth/login - Login user
router.post(
  '/login',
  validateBody(LoginRequestSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      // Authenticate user
      const user = await UserService.authenticateUser({ email, password });

      if (!user) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
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
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Failed to login'
      });
    }
  })
);

// POST /api/auth/refresh - Refresh access token
router.post(
  '/refresh',
  validateBody(RefreshTokenRequestSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    try {
      // Verify refresh token
      const payload = AuthUtils.verifyToken(refreshToken);
      
      // Get user to ensure they still exist
      const user = await UserService.getUserById(payload.userId);
      
      if (!user) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
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
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: 'Invalid refresh token'
      });
    }
  })
);

// POST /api/auth/logout - Logout user (for completeness, client-side token removal)
router.post(
  '/logout',
  authenticate,
  asyncHandler(async (_req: Request, res: Response) => {
    // In a JWT-based system, logout is typically handled client-side
    // by removing the token from storage. This endpoint is for completeness.
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  })
);

export default router; 