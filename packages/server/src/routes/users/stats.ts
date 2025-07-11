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

// GET /api/users/me/stats - Get current user's statistics (requires authentication)
router.get(
  '/me/stats',
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
      logger.error('User stats fetch error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Failed to fetch user statistics'
      });
    }
  })
);

// GET /api/users/:id/stats - Get user's statistics by ID (public endpoint)
router.get(
  '/:id/stats',
  validateParams(IdParamsSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      // First, verify the user exists
      const user = await UserService.getUserProfile(id!);
      if (!user) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      const stats = await UserService.getUserStats(id!);

      res.json({
        success: true,
        data: stats,
        user: {
          id: user.id,
          name: user.name,
        },
      });
    } catch (error) {
      logger.error('User stats fetch error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Failed to fetch user statistics'
      });
    }
  })
);

export default router; 