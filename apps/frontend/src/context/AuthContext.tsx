/**
 * Authentication context provider
 * Manages user authentication state and operations
 */

import React, { createContext, useState, useEffect, ReactNode } from 'react'
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
      if (token) {
        try {
          // Verify token is still valid and get fresh user data
          const userData = await authApi.getProfile()
          setUser(userData)
        } catch (error) {
          // Token is invalid, clear auth state
          console.warn('Token validation failed:', error)
          setUser(null)
          setToken(null)
        }
      }
      setIsLoading(false)
    }

    initializeAuth()
  }, [token, setUser, setToken])

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