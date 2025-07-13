/**
 * Authentication context provider
 * Manages user authentication state across the application
 */

import { createContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { authApi } from '@/services'
import { useLocalStorage } from '@/hooks'
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from '@/utils/constants'
import type { User, LoginCredentials, RegisterData, AuthContextType } from '@/types'

// Create context with default value
export const AuthContext = createContext<AuthContextType | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

/**
 * Authentication provider component
 * Wraps app to provide auth state to all components
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useLocalStorage<User | null>(USER_STORAGE_KEY, null)
  const [token, setToken] = useLocalStorage<string | null>(TOKEN_STORAGE_KEY, null)
  const [refreshTokenStored, setRefreshTokenStored] = useLocalStorage<string | null>(REFRESH_TOKEN_STORAGE_KEY, null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  // Computed values
  const isAuthenticated = !!user && !!token

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
  const validateToken = useCallback(async (authToken: string): Promise<User | null> => {
    try {
      console.log('[AuthContext] Validating token...')
      const userData = await authApi.getProfile()
      console.log('[AuthContext] Token validation successful', userData)
      return userData
    } catch (error: any) {
      console.warn('[AuthContext] Token validation failed:', error)

      // If it's a 401 error, the token is invalid/expired
      if (error?.status === 401) {
        clearAuthData()
      }

      return null
    }
  }, [clearAuthData])

  /**
   * Initialize auth state on app load
   */
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('[AuthContext] Initializing auth...', { token, user, refreshTokenStored, isInitialized })

      // Skip if already initialized
      if (isInitialized) {
        console.log('[AuthContext] Already initialized, skipping')
        return
      }

      try {
        // If we have a token but no user, validate the token
        if (token && !user) {
          console.log('[AuthContext] Token found, validating...')
          const userData = await validateToken(token)

          if (userData) {
            setUser(userData)
          } else {
            // Token validation failed, clear everything
            clearAuthData()
          }
        } else if (!token && user) {
          // User data without token is invalid
          console.log('[AuthContext] User data found without token, clearing...')
          clearAuthData()
        } else if (token && user) {
          // Both token and user exist, verify token is still valid
          console.log('[AuthContext] Both token and user found, verifying token...')
          const userData = await validateToken(token)

          if (!userData) {
            // Token is invalid, clear everything
            clearAuthData()
          } else {
            // Update user data in case it changed
            setUser(userData)
          }
        } else {
          console.log('[AuthContext] No auth data found')
        }
      } catch (error) {
        console.error('[AuthContext] Auth initialization error:', error)
        clearAuthData()
      } finally {
        setIsLoading(false)
        setIsInitialized(true)
        console.log('[AuthContext] Auth initialization complete')
      }
    }

    initializeAuth()
  }, [token, user, refreshTokenStored, isInitialized, validateToken, clearAuthData, setUser])

  /**
   * Login user with credentials
   */
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setIsLoading(true)
      console.log('[AuthContext] Attempting login...')

      const response = await authApi.login(credentials)

      console.log('[AuthContext] Login successful', response.user)
      setUser(response.user)
      setToken(response.token)

      // Store refresh token if provided
      if (response.refreshToken) {
        setRefreshTokenStored(response.refreshToken)
      }
    } catch (error) {
      console.error('[AuthContext] Login failed:', error)
      clearAuthData()
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Register new user
   */
  const register = async (userData: RegisterData): Promise<void> => {
    try {
      setIsLoading(true)
      console.log('[AuthContext] Attempting registration...')

      const response = await authApi.register(userData)

      console.log('[AuthContext] Registration successful', response.user)
      setUser(response.user)
      setToken(response.token)

      // Store refresh token if provided
      if (response.refreshToken) {
        setRefreshTokenStored(response.refreshToken)
      }
    } catch (error) {
      console.error('[AuthContext] Registration failed:', error)
      clearAuthData()
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Logout user and clear auth state
   */
  const logout = async (): Promise<void> => {
    try {
      console.log('[AuthContext] Logging out...')

      // Call logout endpoint to invalidate server-side session
      if (token) {
        await authApi.logout()
      }
    } catch (error) {
      // Continue with logout even if server call fails
      console.warn('[AuthContext] Logout API call failed:', error)
    } finally {
      // Always clear local auth state
      console.log('[AuthContext] Clearing auth data')
      clearAuthData()
    }
  }

  /**
   * Refresh authentication token
   */
  const refreshToken = async (): Promise<void> => {
    try {
      console.log('[AuthContext] Refreshing token...')

      if (!refreshTokenStored) {
        throw new Error('No refresh token available')
      }

      const response = await authApi.refreshToken(refreshTokenStored)

      console.log('[AuthContext] Token refresh successful')

      // Use returned user data or keep current user
      const userData = response.user || user
      if (userData) {
        setUser(userData)
      }

      setToken(response.token)

      // Update refresh token if provided
      if (response.refreshToken) {
        setRefreshTokenStored(response.refreshToken)
      }
    } catch (error) {
      console.error('[AuthContext] Token refresh failed:', error)

      // Refresh failed, logout user
      clearAuthData()
      throw error
    }
  }

  /**
   * Check if user is still authenticated (for periodic checks)
   */
  const checkAuthStatus = useCallback(async (): Promise<boolean> => {
    if (!token || !user) {
      return false
    }

    try {
      const userData = await validateToken(token)
      if (userData) {
        // Update user data if it changed
        if (JSON.stringify(userData) !== JSON.stringify(user)) {
          setUser(userData)
        }
        return true
      } else {
        clearAuthData()
        return false
      }
    } catch (error) {
      console.error('[AuthContext] Auth status check failed:', error)
      clearAuthData()
      return false
    }
  }, [token, user, validateToken, clearAuthData, setUser])

  // Periodic auth status check (every 5 minutes)
  useEffect(() => {
    if (!isAuthenticated || !isInitialized) {
      return
    }

    const interval = setInterval(() => {
      console.log('[AuthContext] Performing periodic auth check...')
      checkAuthStatus()
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [isAuthenticated, isInitialized, checkAuthStatus])

  // Context value
  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading: isLoading || !isInitialized,
    login,
    register,
    logout,
    refreshToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}