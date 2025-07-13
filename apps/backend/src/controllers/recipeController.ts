/**
 * Recipe Controller
 * Handles HTTP requests for recipe operations
 */

import { Request, Response } from 'express'
import Joi from 'joi'
import recipeService from '../services/recipeService'
import { Difficulty } from '@prisma/client'

// Validation schemas
const createRecipeSchema = Joi.object({
  title: Joi.string().min(3).required().messages({
    'string.min': 'Title must be at least 3 characters long',
    'string.empty': 'Title is required'
  }),
  description: Joi.string().optional().allow(''),
  ingredients: Joi.array().items(Joi.string().min(1)).min(1).required().messages({
    'array.min': 'At least one ingredient is required',
    'array.base': 'Ingredients must be an array'
  }),
  instructions: Joi.string().min(10).required().messages({
    'string.min': 'Instructions must be at least 10 characters long',
    'string.empty': 'Instructions are required'
  }),
  imageUrl: Joi.string().uri().optional().allow(''),
  cookTime: Joi.number().min(0).optional(),
  prepTime: Joi.number().min(0).optional(),
  servings: Joi.number().min(1).optional(),
  difficulty: Joi.string().valid('EASY', 'MEDIUM', 'HARD').optional(),
  tags: Joi.array().items(Joi.string().min(1)).optional(),
  cuisine: Joi.string().optional().allow('')
})

const updateRecipeSchema = Joi.object({
  title: Joi.string().min(3).optional(),
  description: Joi.string().optional().allow(''),
  ingredients: Joi.array().items(Joi.string().min(1)).min(1).optional(),
  instructions: Joi.string().min(10).optional(),
  imageUrl: Joi.string().uri().optional().allow(''),
  cookTime: Joi.number().min(0).optional(),
  prepTime: Joi.number().min(0).optional(),
  servings: Joi.number().min(1).optional(),
  difficulty: Joi.string().valid('EASY', 'MEDIUM', 'HARD').optional(),
  tags: Joi.array().items(Joi.string().min(1)).optional(),
  cuisine: Joi.string().optional().allow('')
})

const searchQuerySchema = Joi.object({
  search: Joi.string().optional(),
  tags: Joi.string().optional(), // Comma-separated tags
  cuisine: Joi.string().optional(),
  difficulty: Joi.string().valid('EASY', 'MEDIUM', 'HARD').optional(),
  cookTimeMax: Joi.number().min(0).optional(),
  prepTimeMax: Joi.number().min(0).optional(),
  page: Joi.number().min(1).optional(),
  limit: Joi.number().min(1).max(100).optional(),
  sortBy: Joi.string().valid('title', 'createdAt', 'cookTime', 'prepTime', 'difficulty', 'relevance').optional(),
  sortOrder: Joi.string().valid('asc', 'desc').optional()
})

export class RecipeController {
  /**
   * Create a new recipe
   * POST /api/recipes
   */
  async createRecipe(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const { error, value } = createRecipeSchema.validate(req.body)
      if (error) {
        res.status(400).json({
          success: false,
          error: 'Validation error',
          message: error.details[0].message
        })
        return
      }

      // Add author ID from authenticated user
      const authorId = req.user?.userId
      const recipeData = { ...value, authorId }

      // Additional validation
      const validationErrors = recipeService.validateRecipeData(recipeData)
      if (validationErrors.length > 0) {
        res.status(400).json({
          success: false,
          error: 'Validation error',
          message: validationErrors[0]
        })
        return
      }

      // Create recipe
      const recipe = await recipeService.createRecipe(recipeData)

      res.status(201).json({
        success: true,
        data: { recipe },
        message: 'Recipe created successfully'
      })
    } catch (error) {
      console.error('Create recipe error:', error)
      
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to create recipe'
      })
    }
  }

  /**
   * Get all recipes with search and filtering
   * GET /api/recipes
   */
  async getRecipes(req: Request, res: Response): Promise<void> {
    try {
      // Validate query parameters
      const { error, value } = searchQuerySchema.validate(req.query)
      if (error) {
        res.status(400).json({
          success: false,
          error: 'Validation error',
          message: error.details[0].message
        })
        return
      }

      // Parse query parameters
      const {
        search,
        tags: tagsString,
        cuisine,
        difficulty,
        cookTimeMax,
        prepTimeMax,
        page = 1,
        limit = 20,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = value

      // Parse tags from comma-separated string
      const tags = tagsString ? tagsString.split(',').map((tag: string) => tag.trim()) : undefined

      // Build filters
      const filters = {
        search,
        tags,
        cuisine,
        difficulty: difficulty as Difficulty,
        cookTimeMax: cookTimeMax ? Number(cookTimeMax) : undefined,
        prepTimeMax: prepTimeMax ? Number(prepTimeMax) : undefined
      }

      // Build pagination
      const pagination = {
        page: Number(page),
        limit: Number(limit),
        sortBy,
        sortOrder: sortOrder as 'asc' | 'desc'
      }

      // Search recipes
      const result = await recipeService.searchRecipes(filters, pagination)

      res.status(200).json({
        success: true,
        data: result,
        message: 'Recipes retrieved successfully'
      })
    } catch (error) {
      console.error('Get recipes error:', error)
      
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve recipes'
      })
    }
  }

  /**
   * Get recipe by ID
   * GET /api/recipes/:id
   */
  async getRecipeById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params

      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Validation error',
          message: 'Recipe ID is required'
        })
        return
      }

      const recipe = await recipeService.getRecipeById(id)

      if (!recipe) {
        res.status(404).json({
          success: false,
          error: 'Not found',
          message: 'Recipe not found'
        })
        return
      }

      res.status(200).json({
        success: true,
        data: { recipe },
        message: 'Recipe retrieved successfully'
      })
    } catch (error) {
      console.error('Get recipe by ID error:', error)
      
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve recipe'
      })
    }
  }

  /**
   * Update recipe
   * PUT /api/recipes/:id
   */
  async updateRecipe(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const userId = req.user?.userId

      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Validation error',
          message: 'Recipe ID is required'
        })
        return
      }

      // Check if recipe exists and user owns it
      const existingRecipe = await recipeService.getRecipeById(id)
      if (!existingRecipe) {
        res.status(404).json({
          success: false,
          error: 'Not found',
          message: 'Recipe not found'
        })
        return
      }

      if (existingRecipe.authorId !== userId) {
        res.status(403).json({
          success: false,
          error: 'Forbidden',
          message: 'You can only update your own recipes'
        })
        return
      }

      // Validate request body
      const { error, value } = updateRecipeSchema.validate(req.body)
      if (error) {
        res.status(400).json({
          success: false,
          error: 'Validation error',
          message: error.details[0].message
        })
        return
      }

      // Additional validation
      const validationErrors = recipeService.validateRecipeData(value)
      if (validationErrors.length > 0) {
        res.status(400).json({
          success: false,
          error: 'Validation error',
          message: validationErrors[0]
        })
        return
      }

      // Update recipe
      const recipe = await recipeService.updateRecipe({ id, ...value })

      res.status(200).json({
        success: true,
        data: { recipe },
        message: 'Recipe updated successfully'
      })
    } catch (error) {
      console.error('Update recipe error:', error)
      
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to update recipe'
      })
    }
  }

  /**
   * Delete recipe
   * DELETE /api/recipes/:id
   */
  async deleteRecipe(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const userId = req.user?.userId

      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Validation error',
          message: 'Recipe ID is required'
        })
        return
      }

      // Check if recipe exists and user owns it
      const existingRecipe = await recipeService.getRecipeById(id)
      if (!existingRecipe) {
        res.status(404).json({
          success: false,
          error: 'Not found',
          message: 'Recipe not found'
        })
        return
      }

      if (existingRecipe.authorId !== userId) {
        res.status(403).json({
          success: false,
          error: 'Forbidden',
          message: 'You can only delete your own recipes'
        })
        return
      }

      // Delete recipe
      const success = await recipeService.deleteRecipe(id)

      if (!success) {
        res.status(500).json({
          success: false,
          error: 'Internal server error',
          message: 'Failed to delete recipe'
        })
        return
      }

      res.status(200).json({
        success: true,
        data: null,
        message: 'Recipe deleted successfully'
      })
    } catch (error) {
      console.error('Delete recipe error:', error)
      
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to delete recipe'
      })
    }
  }

  /**
   * Get popular recipes
   * GET /api/recipes/popular
   */
  async getPopularRecipes(req: Request, res: Response): Promise<void> {
    try {
      const limit = Number(req.query.limit) || 10

      const recipes = await recipeService.getPopularRecipes(limit)

      res.status(200).json({
        success: true,
        data: { recipes },
        message: 'Popular recipes retrieved successfully'
      })
    } catch (error) {
      console.error('Get popular recipes error:', error)
      
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve popular recipes'
      })
    }
  }

  /**
   * Get recipe statistics
   * GET /api/recipes/stats
   */
  async getRecipeStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await recipeService.getRecipeStats()

      res.status(200).json({
        success: true,
        data: { stats },
        message: 'Recipe statistics retrieved successfully'
      })
    } catch (error) {
      console.error('Get recipe stats error:', error)
      
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve recipe statistics'
      })
    }
  }

  /**
   * Get user's recipes
   * GET /api/recipes/my
   */
  async getMyRecipes(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
          message: 'User not authenticated'
        })
        return
      }

      // Parse pagination
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || 20
      const sortBy = (req.query.sortBy as string) || 'createdAt'
      const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc'

      const result = await recipeService.getRecipesByAuthor(userId, {
        page,
        limit,
        sortBy,
        sortOrder
      })

      res.status(200).json({
        success: true,
        data: result,
        message: 'User recipes retrieved successfully'
      })
    } catch (error) {
      console.error('Get my recipes error:', error)
      
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve user recipes'
      })
    }
  }
}

export default new RecipeController() 