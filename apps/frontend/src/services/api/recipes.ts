/**
 * Recipe API service
 */

import { apiClient } from './client'
import type { Recipe, CreateRecipeData, UpdateRecipeData, RecipeSearchParams, ApiResponse, PaginationInfo } from '@/types'

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
    
    const response = await apiClient.get<RecipeListResponse>(`/recipes?${searchParams}`)
    return response.data
  },

  /**
   * Get single recipe by ID
   */
  async getRecipe(id: string): Promise<Recipe> {
    const response = await apiClient.get<Recipe>(`/recipes/${id}`)
    return response.data
  },

  /**
   * Create new recipe
   */
  async createRecipe(recipeData: CreateRecipeData): Promise<Recipe> {
    const response = await apiClient.post<Recipe>('/recipes', recipeData)
    return response.data
  },

  /**
   * Update existing recipe
   */
  async updateRecipe(id: string, updates: Partial<CreateRecipeData>): Promise<Recipe> {
    const response = await apiClient.put<Recipe>(`/recipes/${id}`, updates)
    return response.data
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
    
    const response = await apiClient.get<RecipeListResponse>(`/recipes?${searchParams}`)
    return response.data
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
    
    const response = await apiClient.get<RecipeListResponse>(`/recipes?${searchParams}`)
    return response.data
  },

  /**
   * Get popular recipes
   */
  async getPopularRecipes(limit: number = 6): Promise<Recipe[]> {
    const response = await apiClient.get<Recipe[]>(`/recipes/popular?limit=${limit}`)
    return response.data
  },

  /**
   * Get recent recipes
   */
  async getRecentRecipes(limit: number = 6): Promise<Recipe[]> {
    const response = await apiClient.get<Recipe[]>(`/recipes/recent?limit=${limit}`)
    return response.data
  },
}