/**
 * Authentication hook
 * Provides auth state and methods
 */

import { useContext } from 'react'
import { AuthContext } from '@/context/AuthContext'
import type { AuthContextType } from '@/types'

/**
 * Hook to access authentication context
 * Must be used within AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}