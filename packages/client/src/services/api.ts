// Re-export all organized services for backward compatibility
export * from './index';

// Create a unified API client using the organized services
import { authService, recipeService, uploadService, BaseService } from './index';

// Legacy ApiClient class for backward compatibility
export class ApiClient extends BaseService {
  // Auth methods (delegated to authService)
  async login(credentials: any) {
    return authService.login(credentials);
  }

  async register(userData: any) {
    return authService.register(userData);
  }

  async logout() {
    return authService.logout();
  }

  async getCurrentUser() {
    return authService.getCurrentUser();
  }

  async updateProfile(userData: any) {
    return authService.updateProfile(userData);
  }

  async changePassword(passwordData: any) {
    return authService.changePassword(passwordData);
  }

  async getUserStats() {
    return authService.getUserStats();
  }

  // Recipe methods (delegated to recipeService)
  async getRecipes(params?: any) {
    return recipeService.getRecipes(params);
  }

  async getRecipe(id: string) {
    return recipeService.getRecipe(id);
  }

  async createRecipe(recipeData: any) {
    return recipeService.createRecipe(recipeData);
  }

  async updateRecipe(id: string, recipeData: any) {
    return recipeService.updateRecipe(id, recipeData);
  }

  async deleteRecipe(id: string) {
    return recipeService.deleteRecipe(id);
  }

  async searchRecipes(params: any) {
    return recipeService.searchRecipes(params);
  }

  async getUserRecipes(userId?: string, params?: any) {
    return recipeService.getUserRecipes(userId, params);
  }

  async getRecipeCategories() {
    return recipeService.getRecipeCategories();
  }

  // Upload methods (delegated to uploadService)
  async uploadImage(file: File) {
    return uploadService.uploadImage(file);
  }
}

export const apiClient = new ApiClient();
export default apiClient; 