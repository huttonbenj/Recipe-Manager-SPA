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
export function AuthProvider({ children }: AuthProviderProps) {
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
        console.log('[AuthContext] Already initialized, skipping')
        return
      }

      console.log('[AuthContext] Initializing auth...', {
        hasToken: !!token,
        hasUser: !!user
      })

      initializationRef.current = true

      try {
        setIsLoading(true)

        // If we have a token but no user, validate the token
        if (token && !user) {
          console.log('[AuthContext] Token found, validating...')
          const userData = await validateToken()

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
          const userData = await validateToken()

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
        console.log('[AuthContext] Auth initialization complete')
      }
    }

    initializeAuth()
  }, [token, user, validateToken, clearAuthData, setUser])

  /**
   * Login user with credentials
   */
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setIsLoading(true)
      // Clear any previous errors
      setErrors(prev => ({ ...prev, login: undefined }))
      console.log('[AuthContext] Attempting login...')

      const response = await authApi.login(credentials)

      console.log('[AuthContext] Login successful', response.user)
      setUser(response.user || null)
      setToken(response.token)

      // Store refresh token if provided
      if (response.refreshToken) {
        setRefreshTokenStored(response.refreshToken)
      }
    } catch (error) {
      console.error('[AuthContext] Login failed:', error)
      clearAuthData()

      // Set error message
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      setErrors(prev => ({ ...prev, login: errorMessage }))

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
      // Clear any previous errors
      setErrors(prev => ({ ...prev, register: undefined }))
      console.log('[AuthContext] Attempting registration...')

      const response = await authApi.register(userData)

      console.log('[AuthContext] Registration successful', response.user)
      setUser(response.user || null)
      setToken(response.token)

      // Store refresh token if provided
      if (response.refreshToken) {
        setRefreshTokenStored(response.refreshToken)
      }
    } catch (error) {
      console.error('[AuthContext] Registration failed:', error)
      clearAuthData()

      // Set error message
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      setErrors(prev => ({ ...prev, register: errorMessage }))

      throw error
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Logout user
   */
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true)
      console.log('[AuthContext] Logging out...')

      await authApi.logout()

      console.log('[AuthContext] Logout successful')
      clearAuthData()
      clearErrors()
    } catch (error) {
      console.error('[AuthContext] Logout failed:', error)
      // Clear data even if logout fails
      clearAuthData()
      clearErrors()
    } finally {
      setIsLoading(false)
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
      const userData = await validateToken()
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
    if (!isAuthenticated || !initializationRef.current) {
      return
    }

    const interval = setInterval(() => {
      console.log('[AuthContext] Performing periodic auth check...')
      checkAuthStatus()
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