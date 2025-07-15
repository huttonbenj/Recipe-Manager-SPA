/**
 * Recipe API service
 */

import { apiClient } from './client'
import type { Recipe, CreateRecipeData, RecipeSearchParams } from '@/types'
import type { ApiResponse } from '@/types/api'

export interface RecipeListResponse {
  recipes: Recipe[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export const recipesApi = {
  /**
   * Get all recipes with optional filtering and pagination
   */
  async getRecipes(params?: RecipeSearchParams): Promise<RecipeListResponse> {

    const searchParams = new URLSearchParams()
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        // Skip empty strings, undefined, null, or empty arrays
        if (
          value === undefined ||
          value === null ||
          (typeof value === 'string' && value.trim() === '') ||
          (Array.isArray(value) && value.length === 0)
        ) {
          return
        }

        // If the value is an array, convert to comma-separated list expected by the backend
        const formattedValue = Array.isArray(value) ? value.join(',') : String(value)
        searchParams.append(key, formattedValue)
      })
    }
    
    const response = await apiClient.get(`/recipes?${searchParams}`)
    
    // Extract data from the backend response structure
    // Backend returns: { success: boolean, data: { recipes: Recipe[], total: number, ... }, message: string }
    const data = response.data.data || response.data
    
    return {
      recipes: data.recipes || [],
      total: data.total || 0,
      page: data.page || 1,
      limit: data.limit || 20,
      totalPages: data.totalPages || 1,
      hasNext: data.hasNext || false,
      hasPrev: data.hasPrev || false
    }
  },

  /**
   * Get recipe by ID
   */
  async getRecipe(id: string): Promise<Recipe> {
    const response = await apiClient.get<ApiResponse<Recipe>>(`/recipes/${id}`)
    if (!response.data.data) {
      throw new Error('Recipe not found')
    }
    return response.data.data
  },

  /**
   * Create new recipe
   */
  async createRecipe(recipeData: CreateRecipeData): Promise<Recipe> {
    const response = await apiClient.post<ApiResponse<{ recipe: Recipe }>>('/recipes', recipeData)
    if (!response.data.data?.recipe) {
      throw new Error('Failed to create recipe')
    }
    return response.data.data.recipe
  },

  /**
   * Update existing recipe
   */
  async updateRecipe(id: string, updates: Partial<CreateRecipeData>): Promise<Recipe> {
    const response = await apiClient.put<ApiResponse<{ recipe: Recipe }>>(`/recipes/${id}`, updates)
    if (!response.data.data?.recipe) {
      throw new Error('Failed to update recipe')
    }
    return response.data.data.recipe
  },

  /**
   * Delete recipe
   */
  async deleteRecipe(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(`/recipes/${id}`)
  },

  /**
   * Search recipes with full-text search
   */
  async searchRecipes(query: string, params?: Omit<RecipeSearchParams, 'search'>): Promise<RecipeListResponse> {
    const searchParams = new URLSearchParams()
    searchParams.append('search', query)
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        // Skip empty strings, undefined, null, or empty arrays
        if (
          value === undefined ||
          value === null ||
          (typeof value === 'string' && value.trim() === '') ||
          (Array.isArray(value) && value.length === 0)
        ) {
          return
        }

        // If the value is an array, convert to comma-separated list expected by the backend
        const formattedValue = Array.isArray(value) ? value.join(',') : String(value)
        searchParams.append(key, formattedValue)
      })
    }
    
    const response = await apiClient.get(`/recipes?${searchParams}`)
    // Backend returns: { success: boolean, data: { recipes: Recipe[], total: number, ... }, message: string }
    const data = response.data.data || response.data
    
    return {
      recipes: data.recipes || [],
      total: data.total || 0,
      page: data.page || 1,
      limit: data.limit || 20,
      totalPages: data.totalPages || 1,
      hasNext: data.hasNext || false,
      hasPrev: data.hasPrev || false
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
        // Skip empty strings, undefined, null, or empty arrays
        if (
          value === undefined ||
          value === null ||
          (typeof value === 'string' && value.trim() === '') ||
          (Array.isArray(value) && value.length === 0)
        ) {
          return
        }

        // If the value is an array, convert to comma-separated list expected by the backend
        const formattedValue = Array.isArray(value) ? value.join(',') : String(value)
        searchParams.append(key, formattedValue)
      })
    }
    
    const response = await apiClient.get(`/recipes?${searchParams}`)
    // Backend returns: { success: boolean, data: { recipes: Recipe[], total: number, ... }, message: string }
    const data = response.data.data || response.data
    
    return {
      recipes: data.recipes || [],
      total: data.total || 0,
      page: data.page || 1,
      limit: data.limit || 20,
      totalPages: data.totalPages || 1,
      hasNext: data.hasNext || false,
      hasPrev: data.hasPrev || false
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