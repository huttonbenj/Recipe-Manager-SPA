import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { RecipeService, CreateRecipeData, UpdateRecipeData } from '../services/recipeService';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { ApiError } from '../middleware/error';
import { validate } from '@recipe-manager/shared';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// Create recipe schema
const CreateRecipeSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  prepTime: z.number().positive(),
  cookTime: z.number().positive(),
  servings: z.number().int().positive(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  cuisineType: z.string().max(100).optional(),
  ingredients: z.array(z.object({
    name: z.string().min(1).max(255),
    amount: z.number().positive().optional(),
    unit: z.string().max(50).optional(),
    notes: z.string().optional(),
    orderIndex: z.number().int().nonnegative().optional()
  })).min(1),
  steps: z.array(z.object({
    stepNumber: z.number().int().positive().optional(),
    instruction: z.string().min(1),
    timeMinutes: z.number().positive().optional(),
    temperature: z.string().max(50).optional()
  })).min(1)
});

// Update recipe schema
const UpdateRecipeSchema = CreateRecipeSchema.partial();

// Query filters schema
const RecipeFiltersSchema = z.object({
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  cuisineType: z.string().optional(),
  maxPrepTime: z.coerce.number().positive().optional(),
  maxCookTime: z.coerce.number().positive().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10)
});

// Create a new recipe
router.post('/', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  const recipeData = validate(CreateRecipeSchema, req.body);
  
  const recipe = await RecipeService.createRecipe(user.userId, recipeData as CreateRecipeData);
  
  res.status(201).json({
    message: 'Recipe created successfully',
    recipe
  });
}));

// Get all recipes with filtering and pagination
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const filters = validate(RecipeFiltersSchema, req.query);
  
  const { page = 1, limit = 10, ...recipeFilters } = filters;
  
  const result = await RecipeService.getRecipes(recipeFilters, { page, limit });
  
  res.json({
    message: 'Recipes retrieved successfully',
    ...result
  });
}));

// Get current user's recipes
router.get('/my', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  const filters = validate(RecipeFiltersSchema, req.query);
  
  const { page = 1, limit = 10, ...recipeFilters } = filters;
  
  const result = await RecipeService.getRecipes(
    { ...recipeFilters, userId: user.userId },
    { page, limit }
  );
  
  res.json({
    message: 'Your recipes retrieved successfully',
    ...result
  });
}));

// Get a specific recipe by ID
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    throw new ApiError(400, 'Invalid recipe ID format');
  }
  
  const recipe = await RecipeService.getRecipeById(id);
  
  if (!recipe) {
    throw new ApiError(404, 'Recipe not found');
  }
  
  res.json({
    message: 'Recipe retrieved successfully',
    recipe
  });
}));

// Update a recipe (only by owner)
router.put('/:id', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  const { id } = req.params;
  
  if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    throw new ApiError(400, 'Invalid recipe ID format');
  }
  
  const updateData = validate(UpdateRecipeSchema, req.body);
  
  const recipe = await RecipeService.updateRecipe(id, user.userId, updateData as UpdateRecipeData);
  
  res.json({
    message: 'Recipe updated successfully',
    recipe
  });
}));

// Delete a recipe (only by owner)
router.delete('/:id', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  const { id } = req.params;
  
  if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    throw new ApiError(400, 'Invalid recipe ID format');
  }
  
  await RecipeService.deleteRecipe(id, user.userId);
  
  res.json({
    message: 'Recipe deleted successfully'
  });
}));

export default router; 