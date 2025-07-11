import { Router, Request, Response } from 'express';
import { RecipeService } from '../../services/recipeService';
import { asyncHandler } from '../../utils/asyncHandler';
import { validateQuery } from '../../middleware/validation';
import { 
  RecipeSearchParamsSchema,
  PAGINATION_DEFAULTS
} from '@recipe-manager/shared';
import { z } from 'zod';

const router = Router();

// Schema for search query validation
const SearchQuerySchema = z.object({
  search: z.string().min(1),
  page: z.coerce.number().int().min(1).optional().default(PAGINATION_DEFAULTS.PAGE),
  limit: z.coerce.number().int().min(1).max(PAGINATION_DEFAULTS.MAX_LIMIT).optional().default(PAGINATION_DEFAULTS.LIMIT)
});

// GET /api/recipes - Get all recipes with filtering and pagination
router.get(
  '/',
  validateQuery(RecipeSearchParamsSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { page = PAGINATION_DEFAULTS.PAGE, limit = PAGINATION_DEFAULTS.LIMIT, search, category, difficulty } = req.query;
    
    const filters = {
      search: search as string,
      category: category as string,
      difficulty: difficulty as 'Easy' | 'Medium' | 'Hard' | undefined,
    };
    
    const pagination = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
    };

    const result = await RecipeService.getAllRecipes(filters, pagination);
    
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

// GET /api/recipes/search - Search recipes
router.get(
  '/search',
  validateQuery(SearchQuerySchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { search, page = PAGINATION_DEFAULTS.PAGE, limit = PAGINATION_DEFAULTS.LIMIT } = req.query;
    
    const pagination = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
    };

    const result = await RecipeService.searchRecipes(search as string, pagination);
    
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