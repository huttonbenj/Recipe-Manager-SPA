/**
 * Recipe API service
 */

import { apiClient } from './client'
import type { Recipe, CreateRecipeData, RecipeSearchParams, PaginationInfo } from '@/types'

export interface RecipeListResponse {
  recipes: Recipe[]
  pagination: PaginationInfo
}

export const recipesApi = {
  /**
   * Get all recipes with optional filtering and pagination
   */
  async getRecipes(params?: RecipeSearchParams): Promise<RecipeListResponse> {
    const searchParams = new URLSearchParams()
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
    }
    
    const response = await apiClient.get(`/recipes?${searchParams}`)
    
    // Extract data from the backend response structure
    // Backend returns: { success: boolean, data: { recipes: Recipe[], total: number, ... }, message: string }
    const data = response.data.data || response.data
    
    return {
      recipes: data.recipes || [],
      pagination: {
        total: data.total || 0,
        page: data.page || 1,
        limit: data.limit || 20,
        totalPages: data.totalPages || 1,
        hasNext: data.hasNext || false,
        hasPrev: data.hasPrev || false
      }
    }
  },

  /**
   * Get recipe by ID
   */
  async getRecipe(id: string): Promise<Recipe> {
    const response = await apiClient.get(`/recipes/${id}`)
    // Backend returns: { success: boolean, data: { recipe: Recipe }, message: string }
    const data = response.data.data || response.data
    return data.recipe || data
  },

  /**
   * Create new recipe
   */
  async createRecipe(recipeData: CreateRecipeData): Promise<Recipe> {
    const response = await apiClient.post('/recipes', recipeData)
    // Backend returns: { success: boolean, data: { recipe: Recipe }, message: string }
    const data = response.data.data || response.data
    return data.recipe || data
  },

  /**
   * Update existing recipe
   */
  async updateRecipe(id: string, updates: Partial<CreateRecipeData>): Promise<Recipe> {
    const response = await apiClient.put(`/recipes/${id}`, updates)
    // Backend returns: { success: boolean, data: { recipe: Recipe }, message: string }
    const data = response.data.data || response.data
    return data.recipe || data
  },

  /**
   * Delete recipe
   */
  async deleteRecipe(id: string): Promise<void> {
    await apiClient.delete(`/recipes/${id}`)
  },

  /**
   * Search recipes with full-text search
   */
  async searchRecipes(query: string, params?: Omit<RecipeSearchParams, 'search'>): Promise<RecipeListResponse> {
    const searchParams = new URLSearchParams()
    searchParams.append('search', query)
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
    }
    
    const response = await apiClient.get(`/recipes?${searchParams}`)
    // Backend returns: { success: boolean, data: { recipes: Recipe[], total: number, ... }, message: string }
    const data = response.data.data || response.data
    
    return {
      recipes: data.recipes || [],
      pagination: {
        total: data.total || 0,
        page: data.page || 1,
        limit: data.limit || 20,
        totalPages: data.totalPages || 1,
        hasNext: data.hasNext || false,
        hasPrev: data.hasPrev || false
      }
    }
  },

  /**
   * Get recipes by tag
   */
  async getRecipesByTag(tag: string, params?: Omit<RecipeSearchParams, 'tags'>): Promise<RecipeListResponse> {
    const searchParams = new URLSearchParams()
    searchParams.append('tags', tag)
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
    }
    
    const response = await apiClient.get(`/recipes?${searchParams}`)
    // Backend returns: { success: boolean, data: { recipes: Recipe[], total: number, ... }, message: string }
    const data = response.data.data || response.data
    
    return {
      recipes: data.recipes || [],
      pagination: {
        total: data.total || 0,
        page: data.page || 1,
        limit: data.limit || 20,
        totalPages: data.totalPages || 1,
        hasNext: data.hasNext || false,
        hasPrev: data.hasPrev || false
      }
    }
  },

  /**
   * Get popular recipes
   */
  async getPopularRecipes(limit: number = 6): Promise<Recipe[]> {
    const response = await apiClient.get(`/recipes/popular?limit=${limit}`)
    // Backend returns: { success: boolean, data: { recipes: Recipe[] }, message: string }
    const data = response.data.data || response.data
    return data.recipes || []
  },

  /**
   * Get recent recipes (uses popular endpoint since it returns most recent)
   */
  async getRecentRecipes(limit: number = 6): Promise<Recipe[]> {
    const response = await apiClient.get(`/recipes/popular?limit=${limit}`)
    // Backend returns: { success: boolean, data: { recipes: Recipe[] }, message: string }
    const data = response.data.data || response.data
    return data.recipes || []
  },
}