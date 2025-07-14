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
    console.log('🔵 Auth API login called with:', credentials)
    
    try {
      const response = await apiClient.post<{ 
        success: boolean; 
        data: { 
          user: User; 
          accessToken: string; 
          refreshToken?: string; 
        } 
      }>('/auth/login', credentials)
      
      console.log('✅ Auth API login successful:', response.data)
      
      // Map backend response to frontend interface
      return {
        user: response.data.data.user,
        token: response.data.data.accessToken,
        refreshToken: response.data.data.refreshToken
      }
    } catch (error) {
      console.log('❌ Auth API login error:', error)
      throw error
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
   * Logout user
   */
  async logout(): Promise<void> {
    await apiClient.delete('/auth/logout')
  },

  /**
   * Refresh authentication token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<{ 
      success: boolean; 
      data: { 
        user?: User; 
        accessToken: string; 
        refreshToken?: string; 
      } 
    }>('/auth/refresh', { refreshToken })
    
    // Map backend response to frontend interface
    return {
      user: response.data.data.user, // May be undefined, handled in context
      token: response.data.data.accessToken,
      refreshToken: response.data.data.refreshToken
    }
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    const response = await apiClient.get<{ 
      success: boolean; 
      data: { user: User } 
    }>('/auth/me')
    
    return response.data.data.user
  },

  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<User>): Promise<User> {
    const response = await apiClient.put<{ 
      success: boolean; 
      data: { user: User } 
    }>('/auth/profile', updates)
    
    return response.data.data.user
  }
}