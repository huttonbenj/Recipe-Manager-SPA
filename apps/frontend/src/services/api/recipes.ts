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
    
    const response: any = await apiClient.get(`/recipes?${searchParams}`)
    
    // Transform backend response to frontend format
    // Note: apiClient interceptor already extracts data from { success, data, message } structure
    return {
      recipes: response.recipes,
      pagination: {
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
        hasNext: response.hasNext,
        hasPrev: response.hasPrev
      }
    }
  },

  /**
   * Get single recipe by ID
   */
  async getRecipe(id: string): Promise<Recipe> {
    const response: any = await apiClient.get(`/recipes/${id}`)
    // Note: apiClient interceptor already extracts data from { success, data, message } structure
    return response.recipe
  },

  /**
   * Create new recipe
   */
  async createRecipe(recipeData: CreateRecipeData): Promise<Recipe> {
    const response: any = await apiClient.post('/recipes', recipeData)
    // Note: apiClient interceptor already extracts data from { success, data, message } structure
    return response.recipe
  },

  /**
   * Update existing recipe
   */
  async updateRecipe(id: string, updates: Partial<CreateRecipeData>): Promise<Recipe> {
    const response: any = await apiClient.put(`/recipes/${id}`, updates)
    // Note: apiClient interceptor already extracts data from { success, data, message } structure
    return response.recipe
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
    
    const response: any = await apiClient.get(`/recipes?${searchParams}`)
    // Note: apiClient interceptor already extracts data from { success, data, message } structure
    return {
      recipes: response.recipes,
      pagination: {
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
        hasNext: response.hasNext,
        hasPrev: response.hasPrev
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
    
    const response: any = await apiClient.get(`/recipes?${searchParams}`)
    // Note: apiClient interceptor already extracts data from { success, data, message } structure
    return {
      recipes: response.recipes,
      pagination: {
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
        hasNext: response.hasNext,
        hasPrev: response.hasPrev
      }
    }
  },

  /**
   * Get popular recipes
   */
  async getPopularRecipes(limit: number = 6): Promise<Recipe[]> {
    const response: any = await apiClient.get(`/recipes/popular?limit=${limit}`)
    // Note: apiClient interceptor already extracts data from { success, data, message } structure
    return response.recipes
  },

  /**
   * Get recent recipes (uses popular endpoint since it returns most recent)
   */
  async getRecentRecipes(limit: number = 6): Promise<Recipe[]> {
    const response: any = await apiClient.get(`/recipes/popular?limit=${limit}`)
    // Note: apiClient interceptor already extracts data from { success, data, message } structure
    return response.recipes
  },
}