import { AxiosResponse } from 'axios';
import { axiosInstance, BaseService } from '../base';
import { API_ENDPOINTS } from '@recipe-manager/shared';
import type { 
  User, 
  UserCredentials, 
  UserRegistration, 
  UserStats,
  AuthResponse,
  ApiResponse
} from '@recipe-manager/shared';

export type LoginRequest = UserCredentials;
export type RegisterRequest = UserRegistration;

export class AuthService extends BaseService {
  // Login user
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response: AxiosResponse<ApiResponse<AuthResponse>> = await axiosInstance.post(
      API_ENDPOINTS.AUTH.LOGIN, 
      credentials
    );
    const { user, tokens } = response.data.data;
    
    // Store tokens and user data
    this.storeTokens(tokens.accessToken, tokens.refreshToken);
    this.storeUser(user);
    
    return response.data.data;
  }

  // Register user
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response: AxiosResponse<ApiResponse<AuthResponse>> = await axiosInstance.post(
      API_ENDPOINTS.AUTH.REGISTER, 
      userData
    );
    const { user, tokens } = response.data.data;
    
    // Store tokens and user data
    this.storeTokens(tokens.accessToken, tokens.refreshToken);
    this.storeUser(user);
    
    return response.data.data;
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear stored data
      this.clearAuth();
    }
  }

  // Get current user profile
  async getCurrentUser(): Promise<User> {
    const response: AxiosResponse<ApiResponse<User>> = await axiosInstance.get(
      API_ENDPOINTS.AUTH.PROFILE
    );
    
    // Update stored user data
    this.storeUser(response.data.data);
    
    return response.data.data;
  }

  // Update user profile
  async updateProfile(userData: { name?: string; email?: string }): Promise<User> {
    const response: AxiosResponse<ApiResponse<User>> = await axiosInstance.put(
      API_ENDPOINTS.AUTH.PROFILE,
      userData
    );
    
    if (response.data.success) {
      this.storeUser(response.data.data);
      return response.data.data;
    }
    
    throw new Error(response.data.error || 'Failed to update profile');
  }

  // Change password
  async changePassword(passwordData: { currentPassword: string; newPassword: string }): Promise<void> {
    const response: AxiosResponse<ApiResponse<void>> = await axiosInstance.post(
      API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
      passwordData
    );
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to change password');
    }
  }

  // Get user statistics
  async getUserStats(): Promise<UserStats> {
    const response: AxiosResponse<ApiResponse<UserStats>> = await axiosInstance.get(
      API_ENDPOINTS.AUTH.STATS
    );
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.error || 'Failed to fetch user stats');
  }
}

// Export singleton instance
export const authService = new AuthService(); 