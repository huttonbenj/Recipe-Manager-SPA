import { Router, Request, Response } from 'express';
import { UserService } from '../../services/userService';
import { AuthUtils } from '../../utils/auth';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth';
import { asyncHandler } from '../../utils/asyncHandler';
import { validateBody } from '../../middleware/validation';
import { 
  ChangePasswordRequestSchema,
  UpdateProfileRequestSchema,
  HTTP_STATUS
} from '@recipe-manager/shared';
import logger from '../../utils/logger';

const router = Router();

// GET /api/auth/profile - Get user profile (requires authentication)
router.get(
  '/profile',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as AuthenticatedRequest).user.userId;

    try {
      const user = await UserService.getUserProfile(userId);

      if (!user) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
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
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
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
  validateBody(UpdateProfileRequestSchema),
  asyncHandler(async (req: Request, res: Response) => {
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
        res.status(HTTP_STATUS.CONFLICT).json({
          success: false,
          error: 'Email already in use'
        });
        return;
      }

      logger.error('Profile update error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
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
  validateBody(ChangePasswordRequestSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as AuthenticatedRequest).user.userId;
    const { currentPassword, newPassword } = req.body;

    // Validate new password strength
    const passwordValidation = AuthUtils.validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
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
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: 'Current password is incorrect'
        });
        return;
      }

      logger.error('Password change error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Failed to change password'
      });
    }
  })
);

export default router; 