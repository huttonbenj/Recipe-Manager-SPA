import { Router, Request, Response } from 'express';
import { RecipeService } from '../../services/recipeService';
import { authenticate, optionalAuth, AuthenticatedRequest } from '../../middleware/auth';
import { asyncHandler } from '../../utils/asyncHandler';
import { validateBody, validateParams, IdParamsSchema } from '../../middleware/validation';
import { 
  CreateRecipeRequestSchema, 
  UpdateRecipeRequestSchema,
  HTTP_STATUS
} from '@recipe-manager/shared';
import logger from '../../utils/logger';
import { prisma } from '../../config/database';

const router = Router();

// GET /api/recipes/:id - Get recipe by ID
router.get(
  '/:id',
  optionalAuth,
  validateParams(IdParamsSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    const recipe = await RecipeService.getRecipeById(id!);

    let liked = false;
    // If authenticated, check like status
    if ((req as any).user) {
      const userId = (req as AuthenticatedRequest).user.userId;
      liked = await prisma.recipeLike.findUnique({
        where: { user_id_recipe_id: { user_id: userId, recipe_id: id! } },
      }) !== null;
    }
    
    if (!recipe) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: 'Recipe not found'
      });
      return;
    }

    res.json({
      success: true,
      data: { ...recipe, liked },
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

export default router; 