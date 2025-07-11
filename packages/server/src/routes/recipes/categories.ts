import { Router, Request, Response } from 'express';
import { RecipeService } from '../../services/recipeService';
import { asyncHandler } from '../../utils/asyncHandler';
import { validateParams, validateQuery } from '../../middleware/validation';
import { 
  PaginationParamsSchema,
  PAGINATION_DEFAULTS
} from '@recipe-manager/shared';
import { z } from 'zod';

const router = Router();

// Schema for category parameter validation
const CategoryParamsSchema = z.object({
  category: z.string().min(1)
});

// GET /api/recipes/categories - Get all recipe categories
router.get(
  '/categories',
  asyncHandler(async (_req: Request, res: Response) => {
    const categories = await RecipeService.getRecipeCategories();
    
    res.json({
      success: true,
      data: categories,
    });
  })
);

// GET /api/recipes/category/:category - Get recipes by category
router.get(
  '/category/:category',
  validateParams(CategoryParamsSchema),
  validateQuery(PaginationParamsSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { category } = req.params;
    const { page = PAGINATION_DEFAULTS.PAGE, limit = PAGINATION_DEFAULTS.LIMIT } = req.query;
    
    const pagination = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
    };

    const result = await RecipeService.getRecipesByCategory(category!, pagination);
    
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
  })
);

export default router; 