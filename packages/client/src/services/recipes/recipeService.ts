import { AxiosResponse } from 'axios';
import { axiosInstance, BaseService } from '../base';
import { API_ENDPOINTS } from '@recipe-manager/shared';
import type { 
  Recipe,
  RecipeCreate,
  RecipeUpdate,
  RecipeSearch,
  PaginatedResponse,
  ApiResponse
} from '@recipe-manager/shared';

export type RecipeCreateRequest = RecipeCreate;
export type RecipeUpdateRequest = RecipeUpdate;
export type RecipeSearchParams = RecipeSearch;

export class RecipeService extends BaseService {
  // Get recipes with optional search/filter parameters
  async getRecipes(params?: RecipeSearchParams): Promise<PaginatedResponse<Recipe>> {
    const response: AxiosResponse<PaginatedResponse<Recipe>> = await axiosInstance.get(
      API_ENDPOINTS.RECIPES.LIST,
      { params }
    );
    
    if (response.data.success) {
      return response.data;
    }
    
    throw new Error('Failed to fetch recipes');
  }

  // Get single recipe by ID
  async getRecipe(id: string): Promise<Recipe> {
    const response: AxiosResponse<ApiResponse<Recipe>> = await axiosInstance.get(
      API_ENDPOINTS.RECIPES.DETAIL.replace(':id', id)
    );
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.error || 'Failed to fetch recipe');
  }

  // Create new recipe
  async createRecipe(recipeData: RecipeCreateRequest): Promise<Recipe> {
    const response: AxiosResponse<ApiResponse<Recipe>> = await axiosInstance.post(
      API_ENDPOINTS.RECIPES.CREATE,
      recipeData
    );
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.error || 'Failed to create recipe');
  }

  // Update existing recipe
  async updateRecipe(id: string, recipeData: RecipeUpdateRequest): Promise<Recipe> {
    const response: AxiosResponse<ApiResponse<Recipe>> = await axiosInstance.put(
      API_ENDPOINTS.RECIPES.UPDATE.replace(':id', id),
      recipeData
    );
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.error || 'Failed to update recipe');
  }

  // Delete recipe
  async deleteRecipe(id: string): Promise<void> {
    const response: AxiosResponse<ApiResponse<void>> = await axiosInstance.delete(
      API_ENDPOINTS.RECIPES.DELETE.replace(':id', id)
    );
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to delete recipe');
    }
  }

  // Search recipes
  async searchRecipes(params: RecipeSearchParams): Promise<PaginatedResponse<Recipe>> {
    const response: AxiosResponse<PaginatedResponse<Recipe>> = await axiosInstance.get(
      API_ENDPOINTS.RECIPES.SEARCH,
      { params }
    );
    
    if (response.data.success) {
      return response.data;
    }
    
    throw new Error('Failed to search recipes');
  }

  // Get user's recipes
  async getUserRecipes(userId?: string, params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Recipe>> {
    const response: AxiosResponse<PaginatedResponse<Recipe>> = await axiosInstance.get(
      API_ENDPOINTS.RECIPES.USER_RECIPES.replace(':userId', userId || 'me'),
      { params }
    );
    
    if (response.data.success) {
      return response.data;
    }
    
    throw new Error('Failed to fetch user recipes');
  }

  // Get recipe categories
  async getRecipeCategories(): Promise<string[]> {
    const response: AxiosResponse<ApiResponse<string[]>> = await axiosInstance.get(
      API_ENDPOINTS.RECIPES.CATEGORIES
    );
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.error || 'Failed to fetch recipe categories');
  }
}

// Export singleton instance
export const recipeService = new RecipeService(); 