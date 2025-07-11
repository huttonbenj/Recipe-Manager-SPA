// Export all recipe service classes
export { RecipeCrudService } from './crud';
export { RecipeSearchService } from './search';

// Export types
export * from './types';

// Import for use in main service
import { RecipeCrudService } from './crud';
import { RecipeSearchService } from './search';

// Main RecipeService that combines all functionality
export class RecipeService {
  // CRUD operations
  static async getRecipeById(id: string) {
    return RecipeCrudService.getRecipeById(id);
  }

  static async createRecipe(data: import('./types').RecipeCreateData) {
    return RecipeCrudService.createRecipe(data);
  }

  static async updateRecipe(id: string, data: import('./types').RecipeUpdateData) {
    return RecipeCrudService.updateRecipe(id, data);
  }

  static async deleteRecipe(id: string) {
    return RecipeCrudService.deleteRecipe(id);
  }

  static async verifyRecipeOwnership(recipeId: string, userId: string) {
    return RecipeCrudService.verifyRecipeOwnership(recipeId, userId);
  }

  // Search operations
  static async getAllRecipes(filters?: import('./types').RecipeFilters, pagination?: import('./types').PaginationOptions) {
    return RecipeSearchService.getAllRecipes(filters, pagination);
  }

  static async getUserRecipes(userId: string, pagination?: import('./types').PaginationOptions) {
    return RecipeSearchService.getUserRecipes(userId, pagination);
  }

  static async searchRecipes(query: string, pagination?: import('./types').PaginationOptions) {
    return RecipeSearchService.searchRecipes(query, pagination);
  }

  static async getRecipesByCategory(category: string, pagination?: import('./types').PaginationOptions) {
    return RecipeSearchService.getRecipesByCategory(category, pagination);
  }

  static async getRecipeCategories() {
    return RecipeSearchService.getRecipeCategories();
  }
} 