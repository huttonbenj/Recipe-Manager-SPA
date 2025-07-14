/**
 * Axios client configuration with interceptors
 */

import axios, { AxiosError, AxiosResponse } from 'axios'
import { API_BASE_URL, TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from '@/utils/constants'
import type { ApiResponse } from '@/types'

// Create axios instance with default configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Flag to prevent multiple refresh attempts
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: any) => void
  reject: (error: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token)
    }
  })
  
  failedQueue = []
}

// Helper to get clean token from localStorage
const getToken = (): string | null => {
  try {
    const tokenRaw = localStorage.getItem(TOKEN_STORAGE_KEY)
    if (!tokenRaw || tokenRaw === 'null' || tokenRaw === 'undefined') {
      return null
    }

    // Handle JSON-wrapped tokens (from useLocalStorage)
    if (tokenRaw.startsWith('"') && tokenRaw.endsWith('"')) {
      return JSON.parse(tokenRaw)
    }
    
    return tokenRaw
  } catch (error) {
    console.warn('[API Client] Error parsing token:', error)
    return null
  }
}

// Helper to get refresh token from localStorage
const getRefreshToken = (): string | null => {
  try {
    const refreshTokenRaw = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)
    if (!refreshTokenRaw || refreshTokenRaw === 'null' || refreshTokenRaw === 'undefined') {
      return null
    }

    // Handle JSON-wrapped tokens (from useLocalStorage)
    if (refreshTokenRaw.startsWith('"') && refreshTokenRaw.endsWith('"')) {
      return JSON.parse(refreshTokenRaw)
    }
    
    return refreshTokenRaw
  } catch (error) {
    console.warn('[API Client] Error parsing refresh token:', error)
    return null
  }
}

// Helper to clear auth data
const clearAuthData = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
  localStorage.removeItem('recipe_manager_user')
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY)
}

// Request interceptor - add auth token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('[API Client] Sending request with token:', token.substring(0, 20) + '...')
    } else {
      console.log('[API Client] No valid token found')
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
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

    console.log('[API Client] Creating error:', {
      message: errorMessage,
      status: error.response?.status,
      details: details,
      errorType: typeof apiError,
      errorMessage: apiError.message,
      errorKeys: Object.keys(apiError)
    })

    // Handle 401 - unauthorized (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return apiClient(originalRequest)
        }).catch(err => {
          return Promise.reject(err)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        console.log('[API Client] Token expired, attempting refresh...')
        
        const refreshToken = getRefreshToken()
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }
        
        // Try to refresh the token
        const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })

        const newToken = refreshResponse.data?.data?.accessToken
        const newRefreshToken = refreshResponse.data?.data?.refreshToken
        
        if (newToken) {
          console.log('[API Client] Token refresh successful')
          
          // Update localStorage with new tokens
          localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(newToken))
          if (newRefreshToken) {
            localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, JSON.stringify(newRefreshToken))
          }
          
          // Update the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          
          // Process the queue with the new token
          processQueue(null, newToken)
          
          // Retry the original request
          return apiClient(originalRequest)
        } else {
          throw new Error('No token in refresh response')
        }
      } catch (refreshError) {
        console.warn('[API Client] Token refresh failed:', refreshError)
        
        // Refresh failed, clear auth data and redirect to login
        processQueue(refreshError, null)
        clearAuthData()
        
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          console.log('[API Client] Redirecting to login due to auth failure')
          window.location.href = '/login'
        }
        
        return Promise.reject(apiError)
      } finally {
        isRefreshing = false
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