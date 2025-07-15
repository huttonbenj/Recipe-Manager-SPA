/**
 * Recipe Service
 * Handles all recipe-related business logic including CRUD operations,
 * search, filtering, and pagination
 */

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { prisma } from '../config/database'

// Custom types that work with both production and test schemas
export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

interface CreateRecipeData {
  title: string
  description?: string
  ingredients: string[]
  instructions: string | string[]
  imageUrl?: string
  cookTime?: number
  prepTime?: number
  servings?: number
  difficulty?: string
  tags?: string[]
  cuisine?: string
  authorId?: string
}



interface RecipeFilters {
  search?: string
  tags?: string[]
  cuisine?: string
  difficulty?: string
  authorId?: string
  cookTimeMax?: number
}

interface SortOptions {
  sortBy?: string
  sortOrder?: string
}

// Helper functions to handle schema differences
const isTestEnv = process.env.NODE_ENV === 'test'

function normalizeRecipeForStorage(data: CreateRecipeData) {
  const normalized: any = {
    title: data.title,
    description: data.description,
    imageUrl: data.imageUrl,
    cookTime: data.cookTime,
    prepTime: data.prepTime,
    servings: data.servings,
    difficulty: data.difficulty || 'MEDIUM',
    cuisine: data.cuisine,
    authorId: data.authorId
  }

  // Handle ingredients: array for PostgreSQL, JSON string for SQLite
  if (isTestEnv) {
    normalized.ingredients = JSON.stringify(data.ingredients || [])
    normalized.instructions = JSON.stringify(Array.isArray(data.instructions) ? data.instructions : [data.instructions])
    normalized.tags = JSON.stringify(data.tags || [])
  } else {
    normalized.ingredients = data.ingredients || []
    normalized.instructions = Array.isArray(data.instructions) ? data.instructions.join('\n') : data.instructions
    normalized.tags = data.tags || []
  }

  return normalized
}

function normalizeRecipeForOutput(recipe: any) {
  if (!recipe) return null

  // Handle ingredients and tags: parse JSON strings in test env
  let ingredients, tags, instructions
  
  if (isTestEnv) {
    try {
      ingredients = typeof recipe.ingredients === 'string' ? JSON.parse(recipe.ingredients) : recipe.ingredients
      tags = typeof recipe.tags === 'string' ? JSON.parse(recipe.tags) : recipe.tags
      instructions = typeof recipe.instructions === 'string' ? JSON.parse(recipe.instructions) : recipe.instructions
    } catch (error) {
      ingredients = [recipe.ingredients]
      tags = [recipe.tags]
      instructions = [recipe.instructions]
    }
  } else {
    ingredients = recipe.ingredients
    tags = recipe.tags
    instructions = Array.isArray(recipe.instructions) ? recipe.instructions : [recipe.instructions]
  }

  return {
    ...recipe,
    ingredients,
    tags,
    instructions: Array.isArray(instructions) ? instructions.join('\n\n') : instructions
  }
}

class RecipeService {
  /**
   * Create a new recipe
   */
  async create(data: CreateRecipeData) {
    try {
      const normalizedData = normalizeRecipeForStorage(data)
      
      const recipe = await prisma.recipe.create({
        data: normalizedData,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })

      return normalizeRecipeForOutput(recipe)
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('Recipe with this title already exists')
        }
      }
      throw error
    }
  }

  /**
   * Get recipe by ID
   */
  async getById(id: string) {
      const recipe = await prisma.recipe.findUnique({
        where: { id },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })

      return normalizeRecipeForOutput(recipe)
  }

  /**
   * Update recipe
   */
  async update(id: string, data: Partial<CreateRecipeData>) {
    try {
      // Prepare update data, excluding authorId for security
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { authorId, ...updateFields } = data
      const normalizedData = normalizeRecipeForStorage(updateFields as CreateRecipeData)
      
      // Remove undefined values
      Object.keys(normalizedData).forEach(key => {
        if (normalizedData[key] === undefined) {
          delete normalizedData[key]
        }
      })

      const recipe = await prisma.recipe.update({
        where: { id },
        data: normalizedData,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })

      return normalizeRecipeForOutput(recipe)
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('Recipe not found')
        }
      }
      throw error
    }
  }

  /**
   * Delete recipe
   */
  async delete(id: string) {
    try {
      await prisma.recipe.delete({
        where: { id }
      })
      return { message: 'Recipe deleted successfully' }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('Recipe not found')
        }
      }
      throw error
    }
  }

  /**
   * Get all recipes with filtering, searching, and pagination
   */
  async getAll(filters: RecipeFilters = {}, page = 1, limit = 10, sort: SortOptions = {}) {
      const skip = (page - 1) * limit
      const where: any = {}

      // Text search in title and description
      if (filters.search) {
      if (isTestEnv) {
        // SQLite doesn't support insensitive mode, but searching is already case-insensitive by default
        where.OR = [
          { title: { contains: filters.search } },
          { description: { contains: filters.search } }
        ]
      } else {
        // PostgreSQL supports case-insensitive mode
        where.OR = [
          { title: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } }
        ]
      }
      }

      // Filter by cuisine
      if (filters.cuisine) {
      if (isTestEnv) {
        // SQLite doesn't support insensitive mode
        where.cuisine = filters.cuisine
      } else {
        // PostgreSQL supports case-insensitive mode
        where.cuisine = { equals: filters.cuisine, mode: 'insensitive' }
      }
      }

      // Filter by difficulty
      if (filters.difficulty) {
        where.difficulty = filters.difficulty
      }

    // Filter by author
    if (filters.authorId) {
      where.authorId = filters.authorId
    }

    // Filter by maximum cook time
    if (filters.cookTimeMax) {
      where.cookTime = {
        lte: filters.cookTimeMax
      }
    }

      // Tag filtering (different approach for PostgreSQL vs SQLite)
      if (filters.tags && filters.tags.length > 0) {
        if (isTestEnv) {
          // For SQLite, search within JSON string
          where.AND = filters.tags.map(tag => ({
            tags: { contains: tag }
          }))
        } else {
          // For PostgreSQL, use array operations
          where.tags = {
            hasSome: filters.tags
          }
        }
      }

    // Build sort order
    const sortField = sort.sortBy || 'createdAt'
    const sortDirection = sort.sortOrder === 'asc' ? 'asc' : 'desc'

      const [recipes, total] = await Promise.all([
        prisma.recipe.findMany({
          where,
          skip,
          take: limit,
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
        orderBy: { [sortField]: sortDirection }
        }),
        prisma.recipe.count({ where })
      ])

      const normalizedRecipes = recipes.map(recipe => normalizeRecipeForOutput(recipe))

      return {
        recipes: normalizedRecipes,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
    }
  }

  /**
   * Get recipes by author
   */
  async getByAuthor(authorId: string, page = 1, limit = 10) {
      const skip = (page - 1) * limit

      const [recipes, total] = await Promise.all([
        prisma.recipe.findMany({
          where: { authorId },
          skip,
          take: limit,
        orderBy: { createdAt: 'desc' },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
        }
        }),
        prisma.recipe.count({ where: { authorId } })
      ])

      return {
      recipes: recipes.map(normalizeRecipeForOutput),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
    }
  }

  /**
   * Get recipe statistics
   */
  async getStats() {
      const [totalRecipes, totalAuthors] = await Promise.all([
        prisma.recipe.count(),
        prisma.recipe.groupBy({
          by: ['authorId'],
          _count: {
            authorId: true
          }
        }).then(result => result.length)
      ])

      // Get recipes by difficulty
      const difficultyStats = await prisma.recipe.groupBy({
        by: ['difficulty'],
        _count: {
          difficulty: true
        }
      })

      // Get popular cuisines
      const cuisineStats = await prisma.recipe.groupBy({
        by: ['cuisine'],
        _count: {
          cuisine: true
        },
        orderBy: {
          _count: {
            cuisine: 'desc'
          }
        },
        take: 10
      })

      return {
        totalRecipes,
        totalAuthors,
        byDifficulty: difficultyStats,
        popularCuisines: cuisineStats
    }
  }

  /**
   * Get trending tags
   */
  async getTrendingTags(limit = 20) {
      const recipes = await prisma.recipe.findMany({
        select: { tags: true }
      })

      const tagCounts: Record<string, number> = {}

             recipes.forEach((recipe: any) => {
         let tags: string[]
         
         if (isTestEnv) {
           // Parse JSON string for SQLite
           try {
             tags = typeof recipe.tags === 'string' ? JSON.parse(recipe.tags) : recipe.tags
           } catch {
             tags = [recipe.tags]
           }
         } else {
           tags = Array.isArray(recipe.tags) ? recipe.tags : [recipe.tags]
         }

        if (Array.isArray(tags)) {
          tags.forEach(tag => {
            if (tag && typeof tag === 'string') {
              const normalizedTag = tag.toLowerCase().trim()
              tagCounts[normalizedTag] = (tagCounts[normalizedTag] || 0) + 1
            }
          })
        }
      })

      return Object.entries(tagCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit)
        .map(([tag, count]) => ({ tag, count }))
  }

  /**
   * Search recipes by multiple criteria
   */
  async search(query: string, filters: RecipeFilters = {}, page = 1, limit = 10, sort: SortOptions = {}) {
    return this.getAll({ ...filters, search: query }, page, limit, sort)
  }
}

export default new RecipeService() 