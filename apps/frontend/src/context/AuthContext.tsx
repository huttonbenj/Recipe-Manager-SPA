/**
 * Authentication context provider
 * Manages user authentication state across the application
 */

import { createContext, useState, useEffect, ReactNode } from 'react'
import { authApi } from '@/services'
import { useLocalStorage } from '@/hooks'
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '@/utils/constants'
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
  const [isLoading, setIsLoading] = useState(true)

  // Computed values
  const isAuthenticated = !!user && !!token

  /**
   * Initialize auth state on app load
   */
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('AuthContext: Initializing auth...', { token, user })

      // Only validate token if we have one and haven't already validated
      if (token && !user) {
        console.log('AuthContext: Validating existing token...')
        try {
          // Verify token is still valid and get fresh user data
          const userData = await authApi.getProfile()
          console.log('AuthContext: Token validation successful', userData)
          setUser(userData)
        } catch (error) {
          // Token is invalid, clear auth state
          console.warn('AuthContext: Token validation failed:', error)
          setUser(null)
          setToken(null)
        }
      } else {
        console.log('AuthContext: No token to validate or user already set')
      }

      console.log('AuthContext: Setting loading to false')
      setIsLoading(false)
    }

    initializeAuth()
  }, []) // Only run once on mount

  /**
   * Login user with credentials
   */
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setIsLoading(true)
      const response = await authApi.login(credentials)

      setUser(response.user)
      setToken(response.token)
    } catch (error) {
      setUser(null)
      setToken(null)
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
      const response = await authApi.register(userData)

      setUser(response.user)
      setToken(response.token)
    } catch (error) {
      setUser(null)
      setToken(null)
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
      // Call logout endpoint to invalidate server-side session
      await authApi.logout()
    } catch (error) {
      // Continue with logout even if server call fails
      console.warn('Logout API call failed:', error)
    } finally {
      // Always clear local auth state
      setUser(null)
      setToken(null)
    }
  }

  /**
   * Refresh authentication token
   */
  const refreshToken = async (): Promise<void> => {
    try {
      const response = await authApi.refreshToken()
      setUser(response.user)
      setToken(response.token)
    } catch (error) {
      // Refresh failed, logout user
      setUser(null)
      setToken(null)
      throw error
    }
  }

  // Context value
  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}