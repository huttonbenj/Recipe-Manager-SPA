/**
 * Authentication context provider
 * Manages user authentication state across the application
 */

import { createContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react'
import { authApi } from '@/services'
import { useLocalStorage } from '@/hooks'
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from '@/utils/constants'
import type { User, LoginCredentials, RegisterData, AuthContextType, AuthErrors } from '@/types'

// Create context with default value
export const AuthContext = createContext<AuthContextType | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

/**
 * Authentication provider component
 * Wraps app to provide auth state to all components
 */
export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useLocalStorage<User | null>(USER_STORAGE_KEY, null)
  const [token, setToken] = useLocalStorage<string | null>(TOKEN_STORAGE_KEY, null)
  const [refreshTokenStored, setRefreshTokenStored] = useLocalStorage<string | null>(REFRESH_TOKEN_STORAGE_KEY, null)
  const [isLoading, setIsLoading] = useState(true)
  const [errors, setErrors] = useState<AuthErrors>({})
  const initializationRef = useRef(false)

  // Computed values
  const isAuthenticated = !!user && !!token

  /**
   * Clear all auth errors
   */
  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  /**
   * Clear all auth data
   */
  const clearAuthData = useCallback(() => {
    setUser(null)
    setToken(null)
    setRefreshTokenStored(null)
  }, [setUser, setToken, setRefreshTokenStored])

  /**
   * Validate token and get user data
   */
  const validateToken = useCallback(async (): Promise<User | null> => {
    if (!token) {
      return null
    }

    try {
      const userData = await authApi.getProfile()
      return userData
    } catch (error) {
      console.error('Token validation failed:', error)
      clearAuthData()
      return null
    }
  }, [token, clearAuthData])

  /**
   * Initialize auth state on app load
   */
  useEffect(() => {
    const initializeAuth = async () => {
      // Skip if already initialized
      if (initializationRef.current) {
        return
      }

      initializationRef.current = true

      try {
        setIsLoading(true)

        // If we have a token but no user, validate the token
        if (token && !user) {
          const userData = await validateToken()

          if (userData) {
            setUser(userData)
          } else {
            // Token validation failed, clear everything
            clearAuthData()
          }
        } else if (!token && user) {
          // User data without token is invalid
          clearAuthData()
        } else if (token && user) {
          // Both token and user exist, verify token is still valid
          const userData = await validateToken()

          if (!userData) {
            // Token is invalid, clear everything
            clearAuthData()
          } else {
            // Update user data in case it changed
            setUser(userData)
          }
        }
      } catch (error) {
        console.error('[AuthContext] Auth initialization error:', error)
        clearAuthData()
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [token, user, validateToken, clearAuthData, setUser])

  /**
   * Login user with credentials
   */
  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    try {
      setIsLoading(true)
      setErrors({})

      const response = await authApi.login(credentials)

      // Store auth data
      setUser(response.user || null)
      setToken(response.token)
      setRefreshTokenStored(response.refreshToken || null)
    } catch (error: any) {
      console.error('[AuthContext] Login failed:', error)
      setErrors({ login: error.message || 'Login failed' })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [setUser, setToken, setRefreshTokenStored])

  /**
   * Register new user
   */
  const register = useCallback(async (userData: RegisterData): Promise<void> => {
    try {
      setIsLoading(true)
      setErrors({})

      const response = await authApi.register(userData)

      // Store auth data
      setUser(response.user || null)
      setToken(response.token)
      setRefreshTokenStored(response.refreshToken || null)
    } catch (error: any) {
      console.error('[AuthContext] Registration failed:', error)
      setErrors({ register: error.message || 'Registration failed' })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [setUser, setToken, setRefreshTokenStored])

  /**
   * Logout user
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true)

      // Call logout API if we have a token
      if (token) {
        await authApi.logout()
      }

      // Clear auth data
      clearAuthData()
    } catch (error: any) {
      console.error('[AuthContext] Logout failed:', error)
      // Still clear local auth data even if logout API fails
      clearAuthData()
    } finally {
      setIsLoading(false)
    }
  }, [token, clearAuthData])

  /**
 * Refresh auth token
 */
  const refreshToken = useCallback(async (): Promise<void> => {
    if (!refreshTokenStored) {
      return
    }

    try {
      setIsLoading(true)

      const response = await authApi.refreshToken(refreshTokenStored)

      // Update tokens
      setToken(response.token)
      setRefreshTokenStored(response.refreshToken || null)
    } catch (error: any) {
      console.error('[AuthContext] Token refresh failed:', error)

      // Clear auth data on refresh failure
      clearAuthData()
    } finally {
      setIsLoading(false)
    }
  }, [refreshTokenStored, setToken, setRefreshTokenStored, clearAuthData])

  /**
   * Check if user is still authenticated
   */
  const checkAuthStatus = useCallback(async (): Promise<boolean> => {
    if (!token) {
      return false
    }

    try {
      const user = await authApi.getProfile()
      setUser(user)
      return true
    } catch (error: any) {
      console.error('[AuthContext] Auth status check failed:', error)
      clearAuthData()
      return false
    }
  }, [token, setUser, clearAuthData])

  /**
   * Periodic auth check (every 5 minutes)
   */
  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    const interval = setInterval(async () => {
      await checkAuthStatus()
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [isAuthenticated, checkAuthStatus])

  // Context value
  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading: isLoading || !initializationRef.current,
    errors,
    login,
    register,
    logout,
    refreshToken,
    clearErrors,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}