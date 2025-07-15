/**
 * Backend type definitions
 * Comprehensive types for API responses, database models, and service interfaces
 */

import { Request } from 'express'
import { User, Recipe, UserFavorite, UserBookmark } from '@prisma/client'

// Define Difficulty enum for both production and test environments
export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

// Recipe and User Types
export interface BaseRecipe {
  id: string
  title: string
  description: string
  ingredients: string[]
  instructions: string[]
  prepTime: number
  cookTime: number
  servings: number
  difficulty: Difficulty
  imageUrl?: string
  tags: string[]
  authorId: string
  createdAt: Date
  updatedAt: Date
}

// JWT and Authentication Types
export interface JWTPayload {
  userId: string
  email: string
  iat?: number
  exp?: number
}

export interface RequestWithUser extends Request {
  user?: {
    userId: string
    email: string
  }
}

// Import shared types
export type {
  ApiResponse,
  PaginationInfo as PaginationMeta,
  UploadResponse
} from '@recipe-manager/shared-types'

// Import for use in interfaces below
import type { PaginationInfo as PaginationMeta } from '@recipe-manager/shared-types'

export interface PaginatedResponse<T> {
  items: T[]
  pagination: PaginationMeta
}

// Database Model Extensions
export interface UserWithoutPassword extends Omit<User, 'password'> {}

export interface RecipeWithAuthor extends Recipe {
  author?: UserWithoutPassword | null
}

// Favorites and Bookmarks Types
export interface UserFavoriteWithRecipe extends UserFavorite {
  recipe: RecipeWithAuthor
}

export interface UserBookmarkWithRecipe extends UserBookmark {
  recipe: RecipeWithAuthor
}

export interface RecipeWithInteractions extends RecipeWithAuthor {
  isFavorited?: boolean
  isBookmarked?: boolean
  favoritesCount?: number
  bookmarksCount?: number
}

// Import shared recipe types
export type {
  CreateRecipeData as CreateRecipeInput,
  UpdateRecipeData as UpdateRecipeInput,
  RecipeSearchParams as RecipeSearchQuery
} from '@recipe-manager/shared-types'

// Service Input Types
export interface CreateUserInput {
  email: string
  password: string
  name?: string
}

export interface UpdateUserInput {
  email?: string
  name?: string
  avatar?: string
}

// Upload Types
export interface UploadedFile {
  filename: string
  originalName: string
  mimetype: string
  size: number
  path: string
  url: string
}

export interface ImageProcessingOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'jpeg' | 'png' | 'webp'
}

// Error Types
export interface ApiError extends Error {
  statusCode: number
  code?: string
  details?: any
}

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends Error {
  constructor(resource: string, id?: string) {
    super(`${resource}${id ? ` with id ${id}` : ''} not found`)
    this.name = 'NotFoundError'
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string = 'Unauthorized access') {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends Error {
  constructor(message: string = 'Forbidden access') {
    super(message)
    this.name = 'ForbiddenError'
  }
}

// Configuration Types
export interface DatabaseConfig {
  url: string
}

export interface JWTConfig {
  secret: string
  expiresIn: string
  refreshSecret: string
  refreshExpiresIn: string
}

export interface ServerConfig {
  port: number
  nodeEnv: 'development' | 'production' | 'test'
}

export interface CorsConfig {
  frontendUrl: string
  allowedOrigins: string[]
}

export interface UploadConfig {
  maxFileSize: number
  uploadPath: string
  allowedFileTypes: string[]
}

export interface RateLimitConfig {
  windowMs: number
  maxRequests: number
}

export interface LoggingConfig {
  level: string
  format: string
}

export interface SecurityConfig {
  bcryptRounds: number
}

export interface AppConfig {
  database: DatabaseConfig
  jwt: JWTConfig
  server: ServerConfig
  cors: CorsConfig
  upload: UploadConfig
  rateLimiting: RateLimitConfig
  logging: LoggingConfig
  security: SecurityConfig
}

// Service Response Types
export interface AuthServiceResponse {
  user: UserWithoutPassword
  accessToken: string
  refreshToken: string
}

export interface TokenVerificationResult {
  valid: boolean
  payload?: JWTPayload
  error?: string
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>