import { Router, Request, Response } from 'express';
import { UserService } from '../../services/userService';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth';
import { asyncHandler } from '../../utils/asyncHandler';
import { HTTP_STATUS } from '@recipe-manager/shared';
import logger from '../../utils/logger';

const router = Router();

// DELETE /api/users/me - Delete current user account (requires authentication)
router.delete(
  '/me',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as AuthenticatedRequest).user.userId;

    try {
      await UserService.deleteUser(userId);

      logger.info(`User account deleted: ${userId}`);

      res.json({
        success: true,
        message: 'User account deleted successfully'
      });
    } catch (error) {
      logger.error('User deletion error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Failed to delete user account'
      });
    }
  })
);

export default router; 