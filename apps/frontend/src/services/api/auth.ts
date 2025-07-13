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
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
    return response.data
  },

  /**
   * Register new user
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData)
    return response.data
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
    const response = await apiClient.post<AuthResponse>('/auth/refresh')
    return response.data
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/auth/profile')
    return response.data
  },

  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<User>): Promise<User> {
    const response = await apiClient.put<User>('/auth/profile', updates)
    return response.data
  },
}