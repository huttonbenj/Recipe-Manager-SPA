import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';

// Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  details?: any[];
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Recipe {
  id: string;
  title: string;
  ingredients: string;
  instructions: string;
  image_url?: string;
  cook_time?: number;
  servings?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  category?: string;
  tags?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface RecipeCreateRequest {
  title: string;
  ingredients: string;
  instructions: string;
  image_url?: string;
  cook_time?: number;
  servings?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  category?: string;
  tags?: string;
}

export interface RecipeUpdateRequest {
  title?: string;
  ingredients?: string;
  instructions?: string;
  image_url?: string;
  cook_time?: number;
  servings?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  category?: string;
  tags?: string;
}

export interface RecipeSearchParams {
  search?: string;
  category?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  tags?: string;
  sortBy?: 'created_at' | 'updated_at' | 'title' | 'cook_time';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface UserStats {
  totalRecipes: number;
  totalLikes: number;
  totalViews: number;
  averageRating: number;
  recipesByCategory: Array<{ category: string; count: number }>;
}

// API Configuration
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors and token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await this.client.post('/api/auth/refresh', {
                refreshToken,
              });

              if (response.data.success) {
                const { accessToken, refreshToken: newRefreshToken } = response.data.data;
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', newRefreshToken);
                
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return this.client(originalRequest);
              }
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            this.handleAuthError();
            return Promise.reject(refreshError);
          }
        }

        this.handleApiError(error);
        return Promise.reject(error);
      }
    );
  }

  private handleApiError(error: any) {
    if (error.response?.data?.error) {
      toast.error(error.response.data.error);
    } else if (error.message) {
      toast.error(error.message);
    } else {
      toast.error('An unexpected error occurred');
    }
  }

  private handleAuthError() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response: AxiosResponse<ApiResponse<AuthResponse>> = await this.client.post(
      '/api/auth/login',
      credentials
    );
    
    if (response.data.success) {
      const { user, tokens } = response.data.data;
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      return response.data.data;
    }
    
    throw new Error(response.data.error || 'Login failed');
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response: AxiosResponse<ApiResponse<AuthResponse>> = await this.client.post(
      '/api/auth/register',
      userData
    );
    
    if (response.data.success) {
      const { user, tokens } = response.data.data;
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      return response.data.data;
    }
    
    throw new Error(response.data.error || 'Registration failed');
  }

  async logout(): Promise<void> {
    try {
      await this.client.post('/api/auth/logout');
    } catch (error) {
      // Ignore logout errors
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  async getCurrentUser(): Promise<User> {
    const response: AxiosResponse<ApiResponse<User>> = await this.client.get('/api/auth/profile');
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.error || 'Failed to fetch user profile');
  }

  async updateProfile(userData: { name?: string; email?: string }): Promise<User> {
    const response: AxiosResponse<ApiResponse<User>> = await this.client.put(
      '/api/auth/profile',
      userData
    );
    
    if (response.data.success) {
      localStorage.setItem('user', JSON.stringify(response.data.data));
      return response.data.data;
    }
    
    throw new Error(response.data.error || 'Failed to update profile');
  }

  async changePassword(passwordData: { currentPassword: string; newPassword: string }): Promise<void> {
    const response: AxiosResponse<ApiResponse<void>> = await this.client.post(
      '/api/auth/change-password',
      passwordData
    );
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to change password');
    }
  }

  async getUserStats(): Promise<UserStats> {
    const response: AxiosResponse<ApiResponse<UserStats>> = await this.client.get('/api/auth/stats');
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.error || 'Failed to fetch user stats');
  }

  // Recipe endpoints
  async getRecipes(params?: RecipeSearchParams): Promise<PaginatedResponse<Recipe>> {
    const response: AxiosResponse<PaginatedResponse<Recipe>> = await this.client.get('/api/recipes', {
      params,
    });
    
    if (response.data.success) {
      return response.data;
    }
    
    throw new Error('Failed to fetch recipes');
  }

  async getRecipe(id: string): Promise<Recipe> {
    const response: AxiosResponse<ApiResponse<Recipe>> = await this.client.get(`/api/recipes/${id}`);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.error || 'Failed to fetch recipe');
  }

  async createRecipe(recipeData: RecipeCreateRequest): Promise<Recipe> {
    const response: AxiosResponse<ApiResponse<Recipe>> = await this.client.post(
      '/api/recipes',
      recipeData
    );
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.error || 'Failed to create recipe');
  }

  async updateRecipe(id: string, recipeData: RecipeUpdateRequest): Promise<Recipe> {
    const response: AxiosResponse<ApiResponse<Recipe>> = await this.client.put(
      `/api/recipes/${id}`,
      recipeData
    );
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.error || 'Failed to update recipe');
  }

  async deleteRecipe(id: string): Promise<void> {
    const response: AxiosResponse<ApiResponse<void>> = await this.client.delete(`/api/recipes/${id}`);
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to delete recipe');
    }
  }

  async searchRecipes(params: RecipeSearchParams): Promise<PaginatedResponse<Recipe>> {
    const response: AxiosResponse<PaginatedResponse<Recipe>> = await this.client.get(
      '/api/recipes/search',
      { params }
    );
    
    if (response.data.success) {
      return response.data;
    }
    
    throw new Error('Failed to search recipes');
  }

  async getUserRecipes(userId?: string, params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Recipe>> {
    const endpoint = userId ? `/api/users/${userId}/recipes` : '/api/users/me/recipes';
    const response: AxiosResponse<PaginatedResponse<Recipe>> = await this.client.get(endpoint, {
      params,
    });
    
    if (response.data.success) {
      return response.data;
    }
    
    throw new Error('Failed to fetch user recipes');
  }

  async getRecipeCategories(): Promise<string[]> {
    const response: AxiosResponse<ApiResponse<string[]>> = await this.client.get('/api/recipes/categories');
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error('Failed to fetch recipe categories');
  }

  // File upload endpoints
  async uploadImage(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const response: AxiosResponse<ApiResponse<{ url: string; filename: string }>> = await this.client.post(
      '/api/upload/image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.error || 'Failed to upload image');
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  clearAuth(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
}

export const apiClient = new ApiClient();
export default apiClient; 