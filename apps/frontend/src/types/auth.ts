/**
 * Authentication-related type definitions
 */

// Import shared types
export type {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse
} from '@recipe-manager/shared-types'

// Import for use in interfaces below
import type {
  User,
  LoginCredentials,
  RegisterData
} from '@recipe-manager/shared-types'

export interface AuthErrors {
  login?: string
  register?: string
}

export interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  errors: AuthErrors
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  clearErrors: () => void
  refreshToken: () => Promise<void>
}