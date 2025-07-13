/**
 * Authentication API service
 */

import { apiClient } from './client'
import type { User, LoginCredentials, RegisterData, AuthResponse } from '@/types'

export const authApi = {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<{ 
      success: boolean; 
      data: { 
        user: User; 
        accessToken: string; 
        refreshToken?: string; 
      } 
    }>('/auth/login', credentials)
    
    // Map backend response to frontend interface
    return {
      user: response.data.data.user,
      token: response.data.data.accessToken,
      refreshToken: response.data.data.refreshToken
    }
  },

  /**
   * Register new user
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<{ 
      success: boolean; 
      data: { 
        user: User; 
        accessToken: string; 
        refreshToken?: string; 
      } 
    }>('/auth/register', userData)
    
    // Map backend response to frontend interface
    return {
      user: response.data.data.user,
      token: response.data.data.accessToken,
      refreshToken: response.data.data.refreshToken
    }
  },

  /**
   * Logout user (invalidate token)
   */
  async logout(): Promise<void> {
    await apiClient.delete('/auth/logout')
  },

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<AuthResponse> {
    const response = await apiClient.post<{ 
      success: boolean; 
      data: { 
        user: User; 
        accessToken: string; 
        refreshToken?: string; 
      } 
    }>('/auth/refresh')
    
    // Map backend response to frontend interface
    return {
      user: response.data.data.user,
      token: response.data.data.accessToken,
      refreshToken: response.data.data.refreshToken
    }
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    const response = await apiClient.get<{ success: boolean; data: { user: User } }>('/auth/me')
    return response.data.data.user
  },

  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<User>): Promise<User> {
    const response = await apiClient.put<User>('/auth/profile', updates)
    return response.data
  },
}