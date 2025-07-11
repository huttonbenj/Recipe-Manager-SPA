import { Router, Request, Response } from 'express';
import { UserService } from '../../services/userService';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth';
import { asyncHandler } from '../../utils/asyncHandler';
import { HTTP_STATUS } from '@recipe-manager/shared';
import logger from '../../utils/logger';

const router = Router();

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
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Failed to fetch user statistics'
      });
    }
  })
);

export default router; 