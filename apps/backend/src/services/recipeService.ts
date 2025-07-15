/**
 * Recipe Service
 * Handles all recipe-related business logic including CRUD operations,
 * search, filtering, and pagination
 */

import { Recipe, Difficulty, Prisma } from '@prisma/client'
import { prisma } from '../config/database'

interface CreateRecipeData {
  title: string
  description?: string
  ingredients: string[]
  instructions: string
  imageUrl?: string
  cookTime?: number
  prepTime?: number
  servings?: number
  difficulty?: Difficulty
  tags?: string[]
  cuisine?: string
  authorId?: string
}

interface UpdateRecipeData extends Partial<CreateRecipeData> {
  id: string
}

interface RecipeFilters {
  search?: string
  tags?: string[]
  cuisine?: string
  difficulty?: Difficulty
  cookTimeMax?: number
  prepTimeMax?: number
  authorId?: string
}

interface PaginationOptions {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

interface RecipeSearchResult {
  recipes: Recipe[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export class RecipeService {
  /**
   * Create a new recipe
   */
  async createRecipe(data: CreateRecipeData): Promise<Recipe> {
    // Normalize tags and cuisine
    const normalizedTags = data.tags?.map(tag => tag.toLowerCase().trim()) || []
    const normalizedCuisine = data.cuisine?.toLowerCase().trim()

    const recipe = await prisma.recipe.create({
      data: {
        title: data.title.trim(),
        description: data.description?.trim(),
        ingredients: data.ingredients.map(ing => ing.trim()),
        instructions: data.instructions.trim(),
        imageUrl: data.imageUrl,
        cookTime: data.cookTime,
        prepTime: data.prepTime,
        servings: data.servings,
        difficulty: data.difficulty,
        tags: normalizedTags,
        cuisine: normalizedCuisine,
        authorId: data.authorId
      }
    })

    // Update search vector for full-text search
    await this.updateSearchVector(recipe.id)

    return recipe
  }

  /**
   * Get recipe by ID
   */
  async getRecipeById(id: string): Promise<Recipe | null> {
    return prisma.recipe.findUnique({
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
  }

  /**
   * Update a recipe
   */
  async updateRecipe(data: UpdateRecipeData): Promise<Recipe> {
    const { id, ...updateData } = data
    
    // Normalize tags and cuisine if provided
    if (updateData.tags) {
      updateData.tags = updateData.tags.map(tag => tag.toLowerCase().trim())
    }
    if (updateData.cuisine) {
      updateData.cuisine = updateData.cuisine.toLowerCase().trim()
    }
    
    // Trim string fields if provided
    if (updateData.title) {
      updateData.title = updateData.title.trim()
    }
    if (updateData.description) {
      updateData.description = updateData.description.trim()
    }
    if (updateData.instructions) {
      updateData.instructions = updateData.instructions.trim()
    }
    if (updateData.ingredients) {
      updateData.ingredients = updateData.ingredients.map(ing => ing.trim())
    }

    const recipe = await prisma.recipe.update({
      where: { id },
      data: updateData
    })

    // Update search vector
    await this.updateSearchVector(id)

    return recipe
  }

  /**
   * Delete a recipe
   */
  async deleteRecipe(id: string): Promise<boolean> {
    try {
      console.log('🗑️ Service: Deleting recipe from database:', id)
      await prisma.recipe.delete({
        where: { id }
      })
      console.log('✅ Service: Recipe deleted from database successfully:', id)
      return true
    } catch (error) {
      console.error('❌ Service: Failed to delete recipe from database:', id, error)
      return false
    }
  }

  /**
   * Search and filter recipes with pagination
   */
  async searchRecipes(
    filters: RecipeFilters = {},
    pagination: PaginationOptions = {}
  ): Promise<RecipeSearchResult> {
    const {
      search,
      tags,
      cuisine,
      difficulty,
      cookTimeMax,
      prepTimeMax,
      authorId
    } = filters

    // If search query is provided, use full-text search
    if (search && search.trim().length > 0) {
      const otherFilters = {
        tags,
        cuisine,
        difficulty,
        cookTimeMax,
        prepTimeMax,
        authorId
      }
      return this.searchWithFullText(search.trim(), otherFilters, pagination)
    }

    // Otherwise, use regular filtering
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = pagination

    const skip = (page - 1) * limit

    // Build where clause for regular filtering
    const where: any = {}

    // Tag filtering
    if (tags && tags.length > 0) {
      where.tags = {
        hasSome: tags.map(tag => tag.toLowerCase())
      }
    }

    // Cuisine filtering
    if (cuisine) {
      where.cuisine = cuisine.toLowerCase()
    }

    // Difficulty filtering
    if (difficulty) {
      where.difficulty = difficulty
    }

    // Cook time filtering
    if (cookTimeMax) {
      where.cookTime = { lte: cookTimeMax }
    }

    // Prep time filtering
    if (prepTimeMax) {
      where.prepTime = { lte: prepTimeMax }
    }

    // Author filtering
    if (authorId) {
      where.authorId = authorId
    }

    // Build order by clause
    const orderBy: any = {}
    
    // Special handling for cookTime sorting
    if (sortBy === 'cookTime') {
      // Only include recipes with cookTime when sorting by cookTime
      where.cookTime = { 
        ...where.cookTime, 
        not: null 
      }
      orderBy[sortBy] = sortOrder
    } else {
      orderBy[sortBy] = sortOrder
    }

    // Execute queries
    const [recipes, total] = await Promise.all([
      prisma.recipe.findMany({
        where,
        orderBy,
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
        }
      }),
      prisma.recipe.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    return {
      recipes,
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  }

  /**
   * Get recipes by author
   */
  async getRecipesByAuthor(authorId: string, pagination: PaginationOptions = {}): Promise<RecipeSearchResult> {
    return this.searchRecipes({ authorId }, pagination)
  }

  /**
   * Get popular recipes (most recent for now, can be enhanced with view counts)
   */
  async getPopularRecipes(limit: number = 10): Promise<Recipe[]> {
    return prisma.recipe.findMany({
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
    })
  }

  /**
   * Get recipe statistics
   */
  async getRecipeStats(): Promise<{
    totalRecipes: number
    totalAuthors: number
    avgCookTime: number
    mostPopularCuisines: Array<{ cuisine: string; count: number }>
    mostPopularTags: Array<{ tag: string; count: number }>
  }> {
    const [totalRecipes, totalAuthors, recipes] = await Promise.all([
      prisma.recipe.count(),
      prisma.recipe.groupBy({
        by: ['authorId'],
        where: { authorId: { not: null } }
      }).then(results => results.length),
      prisma.recipe.findMany({
        select: {
          cookTime: true,
          cuisine: true,
          tags: true
        }
      })
    ])

    // Calculate average cook time
    const cookTimes = recipes.filter(r => r.cookTime).map(r => r.cookTime!)
    const avgCookTime = cookTimes.length > 0 
      ? Math.round(cookTimes.reduce((sum, time) => sum + time, 0) / cookTimes.length)
      : 0

    // Count cuisines
    const cuisineCount: Record<string, number> = {}
    recipes.forEach(recipe => {
      if (recipe.cuisine) {
        cuisineCount[recipe.cuisine] = (cuisineCount[recipe.cuisine] || 0) + 1
      }
    })

    // Count tags
    const tagCount: Record<string, number> = {}
    recipes.forEach(recipe => {
      recipe.tags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1
      })
    })

    const mostPopularCuisines = Object.entries(cuisineCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([cuisine, count]) => ({ cuisine, count }))

    const mostPopularTags = Object.entries(tagCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }))

    return {
      totalRecipes,
      totalAuthors,
      avgCookTime,
      mostPopularCuisines,
      mostPopularTags
    }
  }

  /**
   * Update search vector for full-text search
   * Uses PostgreSQL's tsvector for optimized full-text search
   */
  private async updateSearchVector(recipeId: string): Promise<void> {
    try {
      // Update the search vector using PostgreSQL's tsvector
      await prisma.$executeRaw`
        UPDATE recipes 
        SET "searchVector" = to_tsvector('english', 
          COALESCE(title, '') || ' ' || 
          COALESCE(description, '') || ' ' || 
          COALESCE(array_to_string(ingredients, ' '), '') || ' ' ||
          COALESCE(array_to_string(tags, ' '), '') || ' ' ||
          COALESCE(cuisine, '')
        )
        WHERE id = ${recipeId}
      `
    } catch (error) {
      console.error('Failed to update search vector:', error)
      // Don't throw error as this is not critical for recipe creation
    }
  }

  /**
   * Enhanced search using PostgreSQL full-text search
   */
  private async searchWithFullText(
    searchQuery: string,
    otherFilters: any,
    pagination: PaginationOptions
  ): Promise<RecipeSearchResult> {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = pagination

    const skip = (page - 1) * limit

    try {
      // Use a safer approach with Prisma's where clause instead of raw SQL
      const where: any = {
        OR: [
          { title: { contains: searchQuery, mode: 'insensitive' } },
          { description: { contains: searchQuery, mode: 'insensitive' } },
          { ingredients: { hasSome: [searchQuery] } },
          { tags: { hasSome: [searchQuery] } },
          { cuisine: { contains: searchQuery, mode: 'insensitive' } }
        ]
      }
      
      // Add other filters
      if (otherFilters.tags && otherFilters.tags.length > 0) {
        where.tags = { hasSome: otherFilters.tags.map((tag: string) => tag.toLowerCase()) }
      }

      if (otherFilters.cuisine) {
        where.cuisine = { equals: otherFilters.cuisine.toLowerCase(), mode: 'insensitive' }
      }

      if (otherFilters.difficulty) {
        where.difficulty = otherFilters.difficulty
      }

      if (otherFilters.cookTimeMax) {
        where.cookTime = { lte: otherFilters.cookTimeMax }
      }

      if (otherFilters.prepTimeMax) {
        where.prepTime = { lte: otherFilters.prepTimeMax }
      }

      if (otherFilters.authorId) {
        where.authorId = otherFilters.authorId
      }

      // Build order by
      const orderBy: any = {}
      if (sortBy === 'relevance') {
        orderBy.createdAt = 'desc'
      } else if (sortBy === 'cookTime') {
        // Only include recipes with cookTime when sorting by cookTime
        where.cookTime = { 
          ...where.cookTime, 
          not: null 
        }
        orderBy[sortBy] = sortOrder
      } else {
        orderBy[sortBy] = sortOrder
      }

      // Execute queries using Prisma's standard methods instead of raw SQL
      const [recipes, total] = await Promise.all([
        prisma.recipe.findMany({
          where,
          orderBy,
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
          }
        }),
        prisma.recipe.count({ where })
      ])

      const totalPages = Math.ceil(total / limit)

      return {
        recipes,
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    } catch (error) {
      console.error('Search error:', error)
      // Return empty results instead of throwing an error
      return {
        recipes: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
      }
    }
  }

  /**
   * Validate recipe data
   */
  validateRecipeData(data: Partial<CreateRecipeData>): string[] {
    const errors: string[] = []

    if (data.title && data.title.trim().length < 3) {
      errors.push('Title must be at least 3 characters long')
    }

    if (data.ingredients && data.ingredients.length === 0) {
      errors.push('At least one ingredient is required')
    }

    if (data.instructions && data.instructions.trim().length < 10) {
      errors.push('Instructions must be at least 10 characters long')
    }

    if (data.cookTime && data.cookTime < 0) {
      errors.push('Cook time cannot be negative')
    }

    if (data.prepTime && data.prepTime < 0) {
      errors.push('Prep time cannot be negative')
    }

    if (data.servings && data.servings < 1) {
      errors.push('Servings must be at least 1')
    }

    return errors
  }
}

export default new RecipeService() 