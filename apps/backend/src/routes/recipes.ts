/**
 * Recipe routes
 * Handles recipe CRUD and search endpoints
 */

import { Router } from 'express'
import recipeController from '../controllers/recipeController'
import { authenticateToken, optionalAuth } from '../middleware/auth'

const router = Router()

// GET /api/recipes/popular - Get popular recipes (public)
router.get('/popular', recipeController.getPopularRecipes)

// GET /api/recipes/stats - Get recipe statistics (public)
router.get('/stats', recipeController.getRecipeStats)

// GET /api/recipes/my - Get current user's recipes (protected)
router.get('/my', authenticateToken, recipeController.getMyRecipes)

// GET /api/recipes - Get all recipes with search/filtering (public with optional auth)
router.get('/', optionalAuth, recipeController.getRecipes)

// GET /api/recipes/:id - Get recipe by ID (public)
router.get('/:id', recipeController.getRecipeById)

// POST /api/recipes - Create new recipe (protected)
router.post('/', authenticateToken, recipeController.createRecipe)

// PUT /api/recipes/:id - Update recipe (protected, owner only)
router.put('/:id', authenticateToken, recipeController.updateRecipe)

// DELETE /api/recipes/:id - Delete recipe (protected, owner only)
router.delete('/:id', authenticateToken, recipeController.deleteRecipe)

export default router