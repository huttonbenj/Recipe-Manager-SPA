/**
 * Tests for auth API client
 * Critical API communication tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { authApi } from './auth'
import { apiClient } from './client'

// Mock the API client
vi.mock('./client', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
}))

describe('Auth API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('makes correct API call for login', async () => {
      const mockResponse = {
        data: {
          data: {
            user: { id: '1', email: 'test@example.com', name: 'Test User' },
            accessToken: 'mock-token',
            refreshToken: 'mock-refresh-token',
          }
        }
      }

      ;(apiClient.post as any).mockResolvedValue(mockResponse)

      const credentials = { email: 'test@example.com', password: 'password123' }
      const result = await authApi.login(credentials)

      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', credentials)
      expect(result).toEqual({
        user: mockResponse.data.data.user,
        token: mockResponse.data.data.accessToken,
        refreshToken: mockResponse.data.data.refreshToken,
      })
    })

    it('handles login API errors', async () => {
      const mockError = new Error('Invalid credentials')
      ;(apiClient.post as any).mockRejectedValue(mockError)

      const credentials = { email: 'test@example.com', password: 'wrong' }
      
      await expect(authApi.login(credentials)).rejects.toThrow('Invalid credentials')
    })
  })

  describe('register', () => {
    it('makes correct API call for register', async () => {
      const mockResponse = {
        data: {
          data: {
            user: { id: '1', email: 'new@example.com', name: 'New User' },
            accessToken: 'mock-token',
            refreshToken: 'mock-refresh-token',
          }
        }
      }

      ;(apiClient.post as any).mockResolvedValue(mockResponse)

      const userData = { email: 'new@example.com', password: 'Password123', name: 'New User' }
      const result = await authApi.register(userData)

      expect(apiClient.post).toHaveBeenCalledWith('/auth/register', userData)
      expect(result).toEqual({
        user: mockResponse.data.data.user,
        token: mockResponse.data.data.accessToken,
        refreshToken: mockResponse.data.data.refreshToken,
      })
    })

    it('handles register API errors', async () => {
      const mockError = new Error('User already exists')
      ;(apiClient.post as any).mockRejectedValue(mockError)

      const userData = { email: 'existing@example.com', password: 'Password123', name: 'Test User' }
      
      await expect(authApi.register(userData)).rejects.toThrow('User already exists')
    })
  })

  describe('logout', () => {
    it('makes correct API call for logout', async () => {
      (apiClient.delete as any).mockResolvedValue({ data: {} })

      await authApi.logout()

      expect(apiClient.delete).toHaveBeenCalledWith('/auth/logout')
    })

    it('handles logout API errors', async () => {
      const mockError = new Error('Logout failed')
      ;(apiClient.delete as any).mockRejectedValue(mockError)
      
      await expect(authApi.logout()).rejects.toThrow('Logout failed')
    })
  })

  describe('getProfile', () => {
    it('makes correct API call for getProfile', async () => {
      const mockResponse = {
        data: {
          data: {
            user: { id: '1', email: 'test@example.com', name: 'Test User' }
          }
        }
      }

      ;(apiClient.get as any).mockResolvedValue(mockResponse)

      const result = await authApi.getProfile()

      expect(apiClient.get).toHaveBeenCalledWith('/auth/me')
      expect(result).toEqual(mockResponse.data.data.user)
    })

    it('handles getProfile API errors', async () => {
      const mockError = new Error('Profile not found')
      ;(apiClient.get as any).mockRejectedValue(mockError)
      
      await expect(authApi.getProfile()).rejects.toThrow('Profile not found')
    })
  })

  describe('refreshToken', () => {
    it('makes correct API call for refreshToken', async () => {
      const mockResponse = {
        data: {
          data: {
            user: { id: '1', email: 'test@example.com', name: 'Test User' },
            accessToken: 'new-token',
            refreshToken: 'new-refresh-token',
          }
        }
      }

      ;(apiClient.post as any).mockResolvedValue(mockResponse)

      const refreshToken = 'old-refresh-token'
      const result = await authApi.refreshToken(refreshToken)

      expect(apiClient.post).toHaveBeenCalledWith('/auth/refresh', { refreshToken })
      expect(result).toEqual({
        user: mockResponse.data.data.user,
        token: mockResponse.data.data.accessToken,
        refreshToken: mockResponse.data.data.refreshToken,
      })
    })

    it('handles refreshToken API errors', async () => {
      const mockError = new Error('Token expired')
      ;(apiClient.post as any).mockRejectedValue(mockError)

      const refreshToken = 'invalid-token'
      
      await expect(authApi.refreshToken(refreshToken)).rejects.toThrow('Token expired')
    })
  })
}) 