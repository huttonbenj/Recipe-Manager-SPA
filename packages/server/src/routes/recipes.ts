import { Router, Request, Response } from 'express';
import { RecipeService } from '../services/recipeService';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import { validateBody, validateQuery, validateParams, IdParamsSchema } from '../middleware/validation';
import { 
  CreateRecipeRequestSchema, 
  UpdateRecipeRequestSchema,
  PaginationParamsSchema,
  RecipeSearchParamsSchema,
  HTTP_STATUS,
  PAGINATION_DEFAULTS
} from '@recipe-manager/shared';
import { z } from 'zod';
import logger from '../utils/logger';

const router = Router();

// Schema for search query validation
const SearchQuerySchema = z.object({
  search: z.string().min(1),
  page: z.coerce.number().int().min(1).optional().default(PAGINATION_DEFAULTS.PAGE),
  limit: z.coerce.number().int().min(1).max(PAGINATION_DEFAULTS.MAX_LIMIT).optional().default(PAGINATION_DEFAULTS.LIMIT)
});

// Schema for category parameter validation
const CategoryParamsSchema = z.object({
  category: z.string().min(1)
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
    const { search, page = 1, limit = 10 } = req.query;
    
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

// GET /api/recipes/:id - Get recipe by ID
router.get(
  '/:id',
  validateParams(IdParamsSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    const recipe = await RecipeService.getRecipeById(id!);
    
    if (!recipe) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: 'Recipe not found'
      });
      return;
    }

    res.json({
      success: true,
      data: recipe,
    });
  })
);

// POST /api/recipes - Create new recipe (requires authentication)
router.post(
  '/',
  authenticate,
  validateBody(CreateRecipeRequestSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as AuthenticatedRequest).user.userId;
    const recipeData = {
      ...req.body,
      user_id: userId,
    };

    const recipe = await RecipeService.createRecipe(recipeData);
    
    logger.info(`User ${userId} created recipe: ${recipe.title}`);
    
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: recipe,
      message: 'Recipe created successfully'
    });
  })
);

// PUT /api/recipes/:id - Update recipe (requires authentication and ownership)
router.put(
  '/:id',
  authenticate,
  validateParams(IdParamsSchema),
  validateBody(UpdateRecipeRequestSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as AuthenticatedRequest).user.userId;
    
    // Check if recipe exists and user owns it
    const existingRecipe = await RecipeService.getRecipeById(id!);
    if (!existingRecipe) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: 'Recipe not found'
      });
      return;
    }

    if (existingRecipe.user_id !== userId) {
      res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        error: 'You can only update your own recipes'
      });
      return;
    }

    const updatedRecipe = await RecipeService.updateRecipe(id!, req.body);
    
    logger.info(`User ${userId} updated recipe: ${updatedRecipe.title}`);
    
    res.json({
      success: true,
      data: updatedRecipe,
      message: 'Recipe updated successfully'
    });
  })
);

// DELETE /api/recipes/:id - Delete recipe (requires authentication and ownership)
router.delete(
  '/:id',
  authenticate,
  validateParams(IdParamsSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as AuthenticatedRequest).user.userId;
    
    // Check if recipe exists and user owns it
    const existingRecipe = await RecipeService.getRecipeById(id!);
    if (!existingRecipe) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: 'Recipe not found'
      });
      return;
    }

    if (existingRecipe.user_id !== userId) {
      res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        error: 'You can only delete your own recipes'
      });
      return;
    }

    await RecipeService.deleteRecipe(id!);
    
    logger.info(`User ${userId} deleted recipe: ${existingRecipe.title}`);
    
    res.json({
      success: true,
      message: 'Recipe deleted successfully'
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
    const { page = 1, limit = 10 } = req.query;
    
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