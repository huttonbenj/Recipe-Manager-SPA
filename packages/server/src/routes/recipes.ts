import { Router, Request, Response } from 'express';
import { RecipeService } from '../services/recipeService';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import { body, param, query, validationResult } from 'express-validator';
import logger from '../utils/logger';

const router = Router();

// Validation middleware
const createRecipeValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('ingredients')
    .notEmpty()
    .withMessage('Ingredients are required'),
  body('instructions')
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Instructions must be between 1 and 5000 characters'),
  body('cook_time')
    .optional()
    .isInt({ min: 0, max: 1440 })
    .withMessage('Cook time must be between 0 and 1440 minutes'),
  body('servings')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Servings must be between 1 and 50'),
  body('difficulty')
    .optional()
    .isIn(['Easy', 'Medium', 'Hard'])
    .withMessage('Difficulty must be Easy, Medium, or Hard'),
  body('category')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Category must be less than 100 characters'),
  body('image_url')
    .optional()
    .isURL()
    .withMessage('Image URL must be a valid URL'),
  body('tags')
    .optional()
    .isString()
    .withMessage('Tags must be a string'),
];

const updateRecipeValidation = [
  param('id')
    .isString()
    .withMessage('Recipe ID must be a string'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('ingredients')
    .optional()
    .notEmpty()
    .withMessage('Ingredients cannot be empty'),
  body('instructions')
    .optional()
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Instructions must be between 1 and 5000 characters'),
  body('cook_time')
    .optional()
    .isInt({ min: 0, max: 1440 })
    .withMessage('Cook time must be between 0 and 1440 minutes'),
  body('servings')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Servings must be between 1 and 50'),
  body('difficulty')
    .optional()
    .isIn(['Easy', 'Medium', 'Hard'])
    .withMessage('Difficulty must be Easy, Medium, or Hard'),
  body('category')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Category must be less than 100 characters'),
  body('image_url')
    .optional()
    .isURL()
    .withMessage('Image URL must be a valid URL'),
  body('tags')
    .optional()
    .isString()
    .withMessage('Tags must be a string'),
];

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
      error: 'Validation failed',
      details: errors.array()
    });
    return true;
  }
  return false;
};

// GET /api/recipes - Get all recipes with filtering and pagination
router.get(
  '/',
  paginationValidation,
  asyncHandler(async (req: Request, res: Response) => {
    if (handleValidationErrors(req, res)) return;

    const { page = 1, limit = 10, search, category, difficulty } = req.query;
    
    const filters = {
      search: search as string,
      category: category as string,
      difficulty: difficulty as string,
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
  [
    query('search')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Search query is required'),
    ...paginationValidation,
  ],
  asyncHandler(async (req: Request, res: Response) => {
    if (handleValidationErrors(req, res)) return;

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
  asyncHandler(async (req: Request, res: Response) => {
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
  param('id').isString().withMessage('Recipe ID must be a string'),
  asyncHandler(async (req: Request, res: Response) => {
    if (handleValidationErrors(req, res)) return;

    const { id } = req.params;
    
    const recipe = await RecipeService.getRecipeById(id);
    
    if (!recipe) {
      res.status(404).json({
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
  createRecipeValidation,
  asyncHandler(async (req: Request, res: Response) => {
    if (handleValidationErrors(req, res)) return;

    const userId = (req as AuthenticatedRequest).user.userId;
    const recipeData = {
      ...req.body,
      user_id: userId,
    };

    const recipe = await RecipeService.createRecipe(recipeData);
    
    logger.info(`User ${userId} created recipe: ${recipe.title}`);
    
    res.status(201).json({
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
  updateRecipeValidation,
  asyncHandler(async (req: Request, res: Response) => {
    if (handleValidationErrors(req, res)) return;

    const { id } = req.params;
    const userId = (req as AuthenticatedRequest).user.userId;
    
    // Check if recipe exists and user owns it
    const existingRecipe = await RecipeService.getRecipeById(id);
    if (!existingRecipe) {
      res.status(404).json({
        success: false,
        error: 'Recipe not found'
      });
      return;
    }

    if (existingRecipe.user_id !== userId) {
      res.status(403).json({
        success: false,
        error: 'You can only update your own recipes'
      });
      return;
    }

    const updatedRecipe = await RecipeService.updateRecipe(id, req.body);
    
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
  param('id').isString().withMessage('Recipe ID must be a string'),
  asyncHandler(async (req: Request, res: Response) => {
    if (handleValidationErrors(req, res)) return;

    const { id } = req.params;
    const userId = (req as AuthenticatedRequest).user.userId;
    
    // Check if recipe exists and user owns it
    const existingRecipe = await RecipeService.getRecipeById(id);
    if (!existingRecipe) {
      res.status(404).json({
        success: false,
        error: 'Recipe not found'
      });
      return;
    }

    if (existingRecipe.user_id !== userId) {
      res.status(403).json({
        success: false,
        error: 'You can only delete your own recipes'
      });
      return;
    }

    await RecipeService.deleteRecipe(id);
    
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
  [
    param('category').isString().withMessage('Category must be a string'),
    ...paginationValidation,
  ],
  asyncHandler(async (req: Request, res: Response) => {
    if (handleValidationErrors(req, res)) return;

    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const pagination = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
    };

    const result = await RecipeService.getRecipesByCategory(category, pagination);
    
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