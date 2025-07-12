import { Router, Request, Response } from 'express';
import { RecipeService } from '../../services/recipeService';
import { asyncHandler } from '../../utils/asyncHandler';
import { optionalAuth } from '../../middleware/auth';
import { prisma } from '../../config/database';
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
  optionalAuth,
  validateQuery(RecipeSearchParamsSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { 
      page = PAGINATION_DEFAULTS.PAGE, 
      limit = PAGINATION_DEFAULTS.LIMIT, 
      search, 
      category, 
      difficulty,
      sortBy = 'created_at',
      sortOrder = 'desc',
      cookTime,
      saved,
      liked,
      user_id
    } = req.query;
    
    const filters: any = {
      search: search as string,
      category: category as string,
      difficulty: difficulty as 'Easy' | 'Medium' | 'Hard' | undefined,
      sortBy: sortBy as 'created_at' | 'updated_at' | 'title' | 'cook_time',
      sortOrder: sortOrder as 'asc' | 'desc',
      cookTime: cookTime ? Number(cookTime) : undefined,
      saved: typeof saved === 'boolean' ? saved : saved === 'true',
      liked: typeof liked === 'boolean' ? liked : liked === 'true',
    };
    if (typeof user_id === 'string') {
      filters.user_id = user_id;
    }
    
    const pagination = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
    };

    const result = await RecipeService.getAllRecipes(filters, pagination);

    // Enrich with liked and saved flag when user authenticated
    let recipes = result.recipes as any[];
    const userId = (req as any).user?.userId;
    if (userId) {
      const likes: { recipe_id: string }[] = await prisma.recipeLike.findMany({
        where: { user_id: userId },
        select: { recipe_id: true },
      });
      const likedIds = new Set<string>(likes.map((like) => like.recipe_id));
      const prismaAny = prisma as any;
      const saves: { recipe_id: string }[] = await prismaAny.recipeSave.findMany({
        where: { user_id: userId },
        select: { recipe_id: true },
      });
      const savedIds = new Set<string>(saves.map((save) => save.recipe_id));
      recipes = recipes.map(r => ({ ...r, liked: likedIds.has(r.id), saved: savedIds.has(r.id) }));
    }

    res.json({
      success: true,
      data: recipes,
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