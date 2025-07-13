/**
 * Backend type definitions
 * Comprehensive types for API responses, database models, and service interfaces
 */

import { Request } from 'express'
import { User, Recipe, Difficulty } from '@prisma/client'

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

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message: string
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: PaginationMeta
}

// Database Model Extensions
export interface UserWithoutPassword extends Omit<User, 'password'> {}

export interface RecipeWithAuthor extends Recipe {
  author?: UserWithoutPassword | null
}

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

export interface CreateRecipeInput {
  title: string
  description?: string
  ingredients: string[]
  instructions: string
  imageUrl?: string
  cookTime?: number
  prepTime?: number
  servings?: number
  difficulty?: Difficulty
  tags: string[]
  cuisine?: string
  authorId?: string
}

export interface UpdateRecipeInput extends Partial<CreateRecipeInput> {
  id: string
}

export interface RecipeSearchQuery {
  search?: string
  tags?: string[]
  cuisine?: string
  difficulty?: Difficulty
  cookTimeMax?: number
  prepTimeMax?: number
  page?: number
  limit?: number
  sortBy?: 'title' | 'createdAt' | 'cookTime' | 'prepTime' | 'difficulty' | 'relevance'
  sortOrder?: 'asc' | 'desc'
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