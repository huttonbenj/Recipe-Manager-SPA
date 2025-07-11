import { Router, Request, Response } from 'express';
import { UserService } from '../../services/userService';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth';
import { asyncHandler } from '../../utils/asyncHandler';
import {
  validateParams,
  IdParamsSchema
} from '../../middleware/validation';
import { HTTP_STATUS } from '@recipe-manager/shared';
import logger from '../../utils/logger';

const router = Router();

// GET /api/users/me - Get current user profile (requires authentication)
router.get(
  '/me',
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

// GET /api/users/:id - Get user profile by ID (public endpoint)
router.get(
  '/:id',
  validateParams(IdParamsSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const user = await UserService.getUserProfile(id!);

      if (!user) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      // Return public user info only
      const publicUserInfo = {
        id: user.id,
        name: user.name,
        created_at: user.created_at,
      };

      res.json({
        success: true,
        data: publicUserInfo,
      });
    } catch (error) {
      logger.error('User fetch error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Failed to fetch user'
      });
    }
  })
);

export default router; 