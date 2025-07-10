import { Router, Request, Response } from 'express';
import { UserService } from '../services/userService';
import { RecipeService } from '../services/recipeService';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import { query, param, validationResult } from 'express-validator';
import logger from '../utils/logger';

const router = Router();

// Validation middleware
const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
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

// GET /api/users/me - Get current user profile (requires authentication)
router.get(
  '/me',
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

// GET /api/users/me/recipes - Get current user's recipes (requires authentication)
router.get(
  '/me/recipes',
  authenticate,
  paginationValidation,
  asyncHandler(async (req: Request, res: Response) => {
    if (handleValidationErrors(req, res)) return;

    const userId = (req as AuthenticatedRequest).user.userId;
    const { page = 1, limit = 10 } = req.query;

    const pagination = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
    };

    try {
      const result = await RecipeService.getUserRecipes(userId, pagination);

      res.json({
        success: true,
        data: result.recipes,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          totalCount: result.totalCount,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      logger.error('User recipes fetch error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user recipes'
      });
    }
  })
);

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
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user statistics'
      });
    }
  })
);

// GET /api/users/:id - Get user profile by ID (public endpoint)
router.get(
  '/:id',
  param('id').isString().withMessage('User ID must be a string'),
  asyncHandler(async (req: Request, res: Response) => {
    if (handleValidationErrors(req, res)) return;

    const { id } = req.params;

    try {
      const user = await UserService.getUserProfile(id);

      if (!user) {
        res.status(404).json({
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
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user'
      });
    }
  })
);

// GET /api/users/:id/recipes - Get user's recipes by ID (public endpoint)
router.get(
  '/:id/recipes',
  [
    param('id').isString().withMessage('User ID must be a string'),
    ...paginationValidation,
  ],
  asyncHandler(async (req: Request, res: Response) => {
    if (handleValidationErrors(req, res)) return;

    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pagination = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
    };

    try {
      // First, verify the user exists
      const user = await UserService.getUserProfile(id);
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      const result = await RecipeService.getUserRecipes(id, pagination);

      res.json({
        success: true,
        data: result.recipes,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          totalCount: result.totalCount,
          totalPages: result.totalPages,
        },
        user: {
          id: user.id,
          name: user.name,
        },
      });
    } catch (error) {
      logger.error('User recipes fetch error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user recipes'
      });
    }
  })
);

// GET /api/users/:id/stats - Get user's statistics by ID (public endpoint)
router.get(
  '/:id/stats',
  param('id').isString().withMessage('User ID must be a string'),
  asyncHandler(async (req: Request, res: Response) => {
    if (handleValidationErrors(req, res)) return;

    const { id } = req.params;

    try {
      // First, verify the user exists
      const user = await UserService.getUserProfile(id);
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      const stats = await UserService.getUserStats(id);

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
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user statistics'
      });
    }
  })
);

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
      res.status(500).json({
        success: false,
        error: 'Failed to delete user account'
      });
    }
  })
);

export default router; 