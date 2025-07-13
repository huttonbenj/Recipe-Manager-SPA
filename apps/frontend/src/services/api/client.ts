/**
 * Axios client configuration with interceptors
 */

import axios, { AxiosError, AxiosResponse } from 'axios'
import { API_BASE_URL, TOKEN_STORAGE_KEY } from '@/utils/constants'
import type { ApiResponse, ApiError } from '@/types'

// Create axios instance with default configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add auth token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const tokenRaw = localStorage.getItem(TOKEN_STORAGE_KEY)
    if (tokenRaw) {
      let token = tokenRaw
      
      // Handle JSON-stored tokens (from useLocalStorage)
      if (tokenRaw.startsWith('"') && tokenRaw.endsWith('"')) {
        try {
          token = JSON.parse(tokenRaw)
        } catch (error) {
          // If JSON parsing fails, use the raw value
          token = tokenRaw
        }
      }
      
      // Only set authorization header if we have a valid token (not null/undefined)
      if (token && token !== 'null' && token !== 'undefined') {
        config.headers.Authorization = `Bearer ${token}`
        console.log('[API Client] Sending request with token:', token.substring(0, 20) + '...')
      } else {
        console.log('[API Client] No valid token found, tokenRaw:', tokenRaw, 'parsed token:', token)
      }
    } else {
      console.log('[API Client] No token in localStorage')
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
    // Return the response as-is for successful responses
    // The individual API methods will handle extracting the data
    return response
  },
  (error: AxiosError<ApiResponse>) => {
    // Handle different types of errors
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
      status: error.response?.status,
    }

    if (error.response?.data) {
      // Server responded with error - extract the message properly
      const errorData = error.response.data
      apiError.message = errorData.message || errorData.error || 'An error occurred'
      apiError.details = errorData
    } else if (error.request) {
      // Network error
      apiError.message = 'Network error - please check your connection'
    }

    // Handle 401 - unauthorized (token expired)
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
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