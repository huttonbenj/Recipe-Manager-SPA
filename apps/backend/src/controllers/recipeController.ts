/**
 * Recipe Controller
 * Handles HTTP requests for recipe operations
 */

import { Request, Response } from 'express'
import Joi from 'joi'
import recipeService from '../services/recipeService'
import { logger } from '../utils/logger'

// Difficulty enum for validation (works with both production and test schemas)
export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

// Validation schemas
const createRecipeSchema = Joi.object({
  title: Joi.string().min(3).required().messages({
    'string.min': 'Title must be at least 3 characters long',
    'any.required': 'Title is required'
  }),
  description: Joi.string().allow('').optional(),
  ingredients: Joi.array().items(Joi.string().min(1)).min(1).required().messages({
    'array.min': 'At least one ingredient is required',
    'any.required': 'Ingredients are required'
  }),
  instructions: Joi.string().min(10).required().messages({
    'string.min': 'Instructions must be at least 10 characters long',
    'any.required': 'Instructions are required'
  }),
  imageUrl: Joi.string().uri().allow('').optional(),
  cookTime: Joi.number().integer().min(0).optional(),
  prepTime: Joi.number().integer().min(0).optional(),
  servings: Joi.number().integer().min(1).optional(),
  difficulty: Joi.string().valid(...Object.values(Difficulty)).optional(),
  tags: Joi.array().items(Joi.string().min(1)).optional(),
  cuisine: Joi.string().allow('').optional()
})

/**
 * Create a new recipe
 */
export const createRecipe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId

    if (!userId) {
      res.status(401).json({
        error: 'Authentication required',
        success: false
      })
      return
    }

    // Validate request body
    const { error, value } = createRecipeSchema.validate(req.body)

    if (error) {
      res.status(400).json({
        error: 'Validation error',
        message: error.details[0].message,
        success: false
      })
      return
    }

    // Prepare recipe data
    const recipeData = {
      ...value,
      authorId: userId
    }

    logger.info('Creating recipe:', { 
      title: recipeData.title, 
      authorId: userId 
    })

    // Additional validation
    const validationErrors: string[] = [] // Validation moved to controller
    if (validationErrors.length > 0) {
      res.status(400).json({
        error: 'Validation errors',
        messages: validationErrors,
        success: false
      })
      return
    }

    try {
      // Create recipe
      const recipe = await recipeService.create(recipeData)

      res.status(201).json({
        success: true,
        data: {
          recipe
        },
        message: 'Recipe created successfully'
      })
    } catch (serviceError) {
      logger.error('Service error creating recipe:', serviceError)
      res.status(500).json({
        error: 'Failed to create recipe',
        success: false
      })
    }
  } catch (error) {
    logger.error('Error creating recipe:', error)
    res.status(500).json({
      error: 'Internal server error',
      success: false
    })
  }
}

/**
 * Get all recipes with optional filtering and pagination
 */
export const getRecipes = async (req: Request, res: Response) => {
  try {
    // Parse query parameters
    const {
      search,
      tags,
      cuisine,
      difficulty,
      authorId,
      sortBy,
      sortOrder,
      cookTimeMax,
      page = '1',
      limit = '20'
    } = req.query

    // Convert and validate pagination parameters
    const pageNum = Math.max(1, parseInt(page as string) || 1)
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string) || 20))

    // Build filters object
    const filters: any = {}

    if (search && typeof search === 'string') {
      filters.search = search.trim()
    }

    if (tags) {
      // Handle both string and array formats
      if (typeof tags === 'string') {
        filters.tags = [tags]
      } else if (Array.isArray(tags)) {
        filters.tags = tags.filter(tag => typeof tag === 'string')
      }
    }

    if (cuisine && typeof cuisine === 'string') {
      filters.cuisine = cuisine.trim()
    }

    if (difficulty && typeof difficulty === 'string' && Object.values(Difficulty).includes(difficulty as Difficulty)) {
      filters.difficulty = difficulty
    }

    if (authorId && typeof authorId === 'string') {
      filters.authorId = authorId.trim()
    }

    if (cookTimeMax && typeof cookTimeMax === 'string') {
      const maxTime = parseInt(cookTimeMax)
      if (!isNaN(maxTime) && maxTime > 0) {
        filters.cookTimeMax = maxTime
      }
    }

    logger.info('Fetching recipes with filters:', { 
      filters, 
      page: pageNum, 
      limit: limitNum 
    })

    try {
      // Parse sorting parameters
      const sort = {
        sortBy: (sortBy as string) || 'createdAt',
        sortOrder: (sortOrder as string) || 'desc'
      }

      // Search recipes
      const result = await recipeService.getAll(filters, pageNum, limitNum, sort)

      res.status(200).json({
        message: 'Recipes retrieved successfully',
        ...result,
        success: true
      })
    } catch (serviceError) {
      logger.error('Service error fetching recipes:', serviceError)
      res.status(500).json({
        error: 'Failed to fetch recipes',
        success: false
      })
    }
  } catch (error) {
    logger.error('Error fetching recipes:', error)
    res.status(500).json({
      error: 'Internal server error',
      success: false
    })
  }
}

/**
 * Get a recipe by ID
 */
export const getRecipe = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({
        error: 'Recipe ID is required',
        success: false
      })
    }

    logger.info('Fetching recipe:', { id })

    try {
      const recipe = await recipeService.getById(id)

      if (!recipe) {
        return res.status(404).json({
          error: 'Recipe not found',
          success: false
        })
      }

      return res.status(200).json({
        success: true,
        data: {
          recipe
        },
        message: 'Recipe retrieved successfully'
      })
    } catch (serviceError) {
      logger.error('Service error fetching recipe:', serviceError)
      return res.status(500).json({
        error: 'Failed to fetch recipe',
        success: false
      })
    }
  } catch (error) {
    logger.error('Error fetching recipe:', error)
    return res.status(500).json({
      error: 'Internal server error',
      success: false
    })
  }
}

/**
 * Update a recipe
 */
export const updateRecipe = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({
        error: 'Authentication required',
        success: false
      })
    }

    if (!id) {
      return res.status(400).json({
        error: 'Recipe ID is required',
        success: false
      })
    }

    logger.info('Updating recipe:', { id, userId })

    try {
      const existingRecipe = await recipeService.getById(id)

      if (!existingRecipe) {
        return res.status(404).json({
          error: 'Recipe not found',
          success: false
        })
      }

      // Check if the user owns the recipe
      if (existingRecipe.authorId !== userId) {
        return res.status(403).json({
          error: 'You can only update your own recipes',
          success: false
        })
      }

      // Validate update data
      const validationSchema = Joi.object({
        title: Joi.string().min(3).optional(),
        description: Joi.string().allow('').optional(),
        ingredients: Joi.array().items(Joi.string().min(1)).min(1).optional(),
        instructions: Joi.string().min(10).optional(),
        imageUrl: Joi.string().uri().allow('').optional(),
        cookTime: Joi.number().integer().min(0).optional(),
        prepTime: Joi.number().integer().min(0).optional(),
        servings: Joi.number().integer().min(1).optional(),
        difficulty: Joi.string().valid(...Object.values(Difficulty)).optional(),
        tags: Joi.array().items(Joi.string().min(1)).optional(),
        cuisine: Joi.string().allow('').optional()
      })

      const { error, value } = validationSchema.validate(req.body)

      if (error) {
        return res.status(400).json({
          error: 'Validation error',
          message: error.details[0].message,
          success: false
        })
      }

      const recipe = await recipeService.update(id, value)

      return res.status(200).json({
        success: true,
        data: {
          recipe
        },
        message: 'Recipe updated successfully'
      })
    } catch (serviceError) {
      logger.error('Service error updating recipe:', serviceError)
      return res.status(500).json({
        error: 'Failed to update recipe',
        success: false
      })
    }
  } catch (error) {
    logger.error('Error updating recipe:', error)
    return res.status(500).json({
      error: 'Internal server error',
      success: false
    })
  }
}

/**
 * Delete a recipe
 */
export const deleteRecipe = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({
        error: 'Authentication required',
        success: false
      })
    }

    if (!id) {
      return res.status(400).json({
        error: 'Recipe ID is required',
        success: false
      })
    }

    logger.info('Deleting recipe:', { id, userId })

    try {
      const existingRecipe = await recipeService.getById(id)

      if (!existingRecipe) {
        return res.status(404).json({
          error: 'Recipe not found',
          success: false
        })
      }

      // Check if the user owns the recipe
      if (existingRecipe.authorId !== userId) {
        return res.status(403).json({
          error: 'You can only delete your own recipes',
          success: false
        })
      }

      const result = await recipeService.delete(id)

      return res.status(200).json({
        ...result,
        success: true
      })
    } catch (serviceError) {
      logger.error('Service error deleting recipe:', serviceError)
      return res.status(500).json({
        error: 'Failed to delete recipe',
        success: false
      })
    }
  } catch (error) {
    logger.error('Error deleting recipe:', error)
    return res.status(500).json({
      error: 'Internal server error',
      success: false
    })
  }
}

/**
 * Get popular recipes
 */
export const getPopularRecipes = async (req: Request, res: Response) => {
  try {
    const { limit = '10' } = req.query
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string) || 10))

    logger.info('Fetching popular recipes:', { limit: limitNum })

    // For now, just return recent recipes
    const result = await recipeService.getAll({}, 1, limitNum)

    res.status(200).json({
      message: 'Popular recipes retrieved successfully',
      recipes: result.recipes,
      success: true
    })
  } catch (error) {
    logger.error('Error fetching popular recipes:', error)
    res.status(500).json({
      error: 'Internal server error',
      success: false
    })
  }
}

/**
 * Get recipe statistics
 */
export const getRecipeStats = async (req: Request, res: Response) => {
  try {
    logger.info('Fetching recipe statistics')

    const stats = await recipeService.getStats()

    res.status(200).json({
      message: 'Recipe statistics retrieved successfully',
      stats,
      success: true
    })
  } catch (error) {
    logger.error('Error fetching recipe statistics:', error)
    res.status(500).json({
      error: 'Internal server error',
      success: false
    })
  }
}

/**
 * Get recipes by author
 */
export const getRecipesByAuthor = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    const { page = '1', limit = '20' } = req.query

    if (!userId) {
      return res.status(400).json({
        error: 'User ID is required',
        success: false
      })
    }

    const pageNum = Math.max(1, parseInt(page as string) || 1)
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string) || 20))

    logger.info('Fetching recipes by author:', { userId, page: pageNum, limit: limitNum })

    const result = await recipeService.getByAuthor(userId, pageNum, limitNum)

    return res.status(200).json({
      message: 'Author recipes retrieved successfully',
      ...result,
      success: true
    })
  } catch (error) {
    logger.error('Error fetching recipes by author:', error)
    return res.status(500).json({
      error: 'Internal server error',
      success: false
    })
  }
} 