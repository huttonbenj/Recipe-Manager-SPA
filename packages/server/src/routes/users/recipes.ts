import { Router, Request, Response } from 'express';
import { UserService } from '../../services/userService';
import { RecipeService } from '../../services/recipeService';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth';
import { asyncHandler } from '../../utils/asyncHandler';
import {
  validateParams,
  validateQuery,
  IdParamsSchema
} from '../../middleware/validation';
import { PaginationParamsSchema, HTTP_STATUS, PAGINATION_DEFAULTS } from '@recipe-manager/shared';
import logger from '../../utils/logger';

const router = Router();

// GET /api/users/me/recipes - Get current user's recipes (requires authentication)
router.get(
  '/me/recipes',
  authenticate,
  validateQuery(PaginationParamsSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as AuthenticatedRequest).user.userId;
    const { page = PAGINATION_DEFAULTS.PAGE, limit = PAGINATION_DEFAULTS.LIMIT } = req.query;

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
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Failed to fetch user recipes'
      });
    }
  })
);

// GET /api/users/:id/recipes - Get user's recipes by ID (public endpoint)
router.get(
  '/:id/recipes',
  validateParams(IdParamsSchema),
  validateQuery(PaginationParamsSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { page = PAGINATION_DEFAULTS.PAGE, limit = PAGINATION_DEFAULTS.LIMIT } = req.query;

    const pagination = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
    };

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

      const result = await RecipeService.getUserRecipes(id!, pagination);

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
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Failed to fetch user recipes'
      });
    }
  })
);

export default router; 