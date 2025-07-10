import axios, { AxiosInstance, AxiosResponse } from 'axios';
import type { 
  User, 
  UserCredentials, 
  UserRegistration, 
  UserStats,
  AuthResponse,
  Recipe,
  RecipeCreate,
  RecipeUpdate,
  RecipeSearch,
  PaginatedResponse
} from '@recipe-manager/shared';
import { 
  API_CONFIG,
  STORAGE_KEYS,
  API_ENDPOINTS
} from '@recipe-manager/shared';

// Import shared types
import type { ApiResponse } from '@recipe-manager/shared';

// Use shared types for auth and recipe requests
export type LoginRequest = UserCredentials;
export type RegisterRequest = UserRegistration;
export type RecipeCreateRequest = RecipeCreate;
export type RecipeUpdateRequest = RecipeUpdate;
export type RecipeSearchParams = RecipeSearch;

// API Configuration using shared constants
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || API_CONFIG.BASE_URL;

// Create axios instance with shared configuration
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`, {
            refreshToken,
          });
          
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

class ApiClient {
  constructor() {
    // Constructor is empty as axios instance is configured globally
  }

  // Auth methods
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response: AxiosResponse<ApiResponse<AuthResponse>> = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    const { user, tokens } = response.data.data;
    
    // Store tokens using shared constants
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    
    return response.data.data;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response: AxiosResponse<ApiResponse<AuthResponse>> = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    const { user, tokens } = response.data.data;
    
    // Store tokens using shared constants
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    
    return response.data.data;
  }

  async logout(): Promise<void> {
    try {
      await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear stored data using shared constants
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }

  async getCurrentUser(): Promise<User> {
    const response: AxiosResponse<ApiResponse<User>> = await axiosInstance.get(API_ENDPOINTS.AUTH.PROFILE);
    
    // Update stored user data using shared constants
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.data));
    
    return response.data.data;
  }

  async updateProfile(userData: { name?: string; email?: string }): Promise<User> {
    const response: AxiosResponse<ApiResponse<User>> = await axiosInstance.put(
      API_ENDPOINTS.AUTH.PROFILE,
      userData
    );
    
    if (response.data.success) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.data));
      return response.data.data;
    }
    
    throw new Error(response.data.error || 'Failed to update profile');
  }

  async changePassword(passwordData: { currentPassword: string; newPassword: string }): Promise<void> {
    const response: AxiosResponse<ApiResponse<void>> = await axiosInstance.post(
      API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
      passwordData
    );
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to change password');
    }
  }

  async getUserStats(): Promise<UserStats> {
    const response: AxiosResponse<ApiResponse<UserStats>> = await axiosInstance.get(API_ENDPOINTS.AUTH.STATS);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.error || 'Failed to fetch user stats');
  }

  // Recipe endpoints
  async getRecipes(params?: RecipeSearchParams): Promise<PaginatedResponse<Recipe>> {
    const response: AxiosResponse<PaginatedResponse<Recipe>> = await axiosInstance.get(API_ENDPOINTS.RECIPES.LIST, {
      params,
    });
    
    if (response.data.success) {
      return response.data;
    }
    
    throw new Error('Failed to fetch recipes');
  }

  async getRecipe(id: string): Promise<Recipe> {
    const response: AxiosResponse<ApiResponse<Recipe>> = await axiosInstance.get(API_ENDPOINTS.RECIPES.DETAIL.replace(':id', id));
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.error || 'Failed to fetch recipe');
  }

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

  async deleteRecipe(id: string): Promise<void> {
    const response: AxiosResponse<ApiResponse<void>> = await axiosInstance.delete(API_ENDPOINTS.RECIPES.DELETE.replace(':id', id));
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to delete recipe');
    }
  }

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

  async getUserRecipes(userId?: string, params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Recipe>> {
    const endpoint = userId ? API_ENDPOINTS.USERS.USER_RECIPES.replace(':id', userId) : API_ENDPOINTS.USERS.MY_RECIPES;
    const response: AxiosResponse<PaginatedResponse<Recipe>> = await axiosInstance.get(endpoint, {
      params,
    });
    
    if (response.data.success) {
      return response.data;
    }
    
    throw new Error('Failed to fetch user recipes');
  }

  async getRecipeCategories(): Promise<string[]> {
    const response: AxiosResponse<ApiResponse<string[]>> = await axiosInstance.get(API_ENDPOINTS.RECIPES.CATEGORIES);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error('Failed to fetch recipe categories');
  }

  // File upload endpoints
  async uploadImage(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const response: AxiosResponse<ApiResponse<{ url: string; filename: string; originalName: string; size: number; mimetype: string }>> = await axiosInstance.post(
      API_ENDPOINTS.UPLOAD.IMAGE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    if (response.data.success) {
      return {
        url: response.data.data.url,
        filename: response.data.data.filename
      };
    }
    
    throw new Error(response.data.error || 'Failed to upload image');
  }

  // Helper methods
  isAuthenticated(): boolean {
    return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  getStoredUser(): User | null {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  }

  clearAuth(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
}

export const apiClient = new ApiClient();
export default apiClient; 