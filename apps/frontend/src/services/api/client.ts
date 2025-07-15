/**
 * Axios client configuration with interceptors
 */

import axios, { AxiosResponse, AxiosError } from 'axios'
import { API_BASE_URL, TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from '@/utils/constants'
import type { ApiResponse } from '@/types/api'

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
})

// Utility functions for token management
function getValidToken(): string | null {
  try {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY)
    return token ? JSON.parse(token) : null
  } catch (error) {
    console.warn('[API Client] Error parsing token:', error)
    return null
  }
}

function getValidRefreshToken(): string | null {
  try {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)
    return refreshToken ? JSON.parse(refreshToken) : null
  } catch (error) {
    console.warn('[API Client] Error parsing refresh token:', error)
    return null
  }
}

// Clear browser cache utility
export function clearBrowserCache(): void {
  try {
    // Clear caches if available
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name)
        })
      })
    }
    console.log('[API Client] Browser cache cleared')
  } catch (error) {
    console.warn('[API Client] Failed to clear browser cache:', error)
  }
}

// Request interceptor - add auth token and cache busting
apiClient.interceptors.request.use(
  (config) => {
    // Add cache busting parameter to prevent browser caching
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }

    // Add auth token if available
    const token = getValidToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle common responses and errors
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response
  },
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as any

    // Handle different types of errors
    let errorMessage = 'An unexpected error occurred'
    let details: any = undefined

    if (error.response?.data) {
      const errorData = error.response.data
      errorMessage = errorData.message || errorData.error || 'An error occurred'
      details = errorData
    } else if (error.request) {
      errorMessage = 'Network error - please check your connection'
    }

    // Create an actual Error object instead of a plain object
    const apiError = new Error(errorMessage) as any
    apiError.status = error.response?.status
    apiError.details = details

    // Handle 401 errors (authentication issues)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

              try {
          const refreshToken = getValidRefreshToken()
          if (refreshToken) {
            const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {
              refreshToken
            })
            const newToken = refreshResponse.data?.data?.accessToken || refreshResponse.data?.data?.token
            
            // Update the token in storage
            localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(newToken))
            
            // Update the authorization header and retry the request
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            
            return apiClient(originalRequest)
          }
        } catch (refreshError) {
          // Token refresh failed, clear auth data and redirect to login
          localStorage.removeItem(TOKEN_STORAGE_KEY)
          localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY)
          localStorage.removeItem('recipe_manager_user')
          
          // Only redirect if not already on login page
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login'
          }
        }
    }

    return Promise.reject(apiError)
  }
)

// Helper function to create form data
export function createFormData(data: Record<string, any>): FormData {
  const formData = new FormData()
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof File) {
        formData.append(key, value)
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          formData.append(`${key}[${index}]`, item)
        })
      } else {
        formData.append(key, String(value))
      }
    }
  })
  
  return formData
}