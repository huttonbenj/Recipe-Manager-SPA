/**
 * Shared Constants for Recipe Manager SPA
 * 
 * This file contains all constants that are used across multiple packages
 * to ensure consistency and avoid duplication.
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3001',
  TIMEOUT: 10000,
  RATE_LIMIT: {
    WINDOW_MS: 900000, // 15 minutes
    MAX_REQUESTS: 100,
  },
} as const;

// Server Configuration
export const SERVER_CONFIG = {
  DEFAULT_PORT: 3001,
  JWT_SECRET_FALLBACK: 'dev-secret-key',
  SALT_ROUNDS: 12,
} as const;

// Client Configuration
export const CLIENT_CONFIG = {
  DEFAULT_PORT: 3000,
  TOAST_DURATION: {
    DEFAULT: 4000,
    SUCCESS: 3000,
    ERROR: 5000,
  },
} as const;

// Database Configuration
export const DATABASE_CONFIG = {
  DEFAULT_URL: 'postgresql://postgres:password@localhost:5432/recipe_manager',
  TEST_URL: 'postgresql://postgres:password@localhost:5432/recipe_manager_test',
  SQLITE_FALLBACK: 'sqlite://./test.db',
} as const;

// API Endpoints - Centralized endpoint definitions
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
    PROFILE: '/api/auth/profile',
    CHANGE_PASSWORD: '/api/auth/change-password',
    STATS: '/api/auth/stats',
  },
  
  // Recipe endpoints
  RECIPES: {
    LIST: '/api/recipes',
    CREATE: '/api/recipes',
    DETAIL: '/api/recipes/:id',
    UPDATE: '/api/recipes/:id',
    DELETE: '/api/recipes/:id',
    SEARCH: '/api/recipes/search',
    USER_RECIPES: '/api/recipes/user/:userId',
    CATEGORIES: '/api/recipes/categories',
    STATS: '/api/recipes/stats',
  },
  
  // User endpoints
  USERS: {
    ME: '/api/users/me',
    PROFILE: '/api/users/:id',
    MY_RECIPES: '/api/users/me/recipes',
    USER_RECIPES: '/api/users/:id/recipes',
    MY_STATS: '/api/users/me/stats',
    USER_STATS: '/api/users/:id/stats',
    DELETE_ACCOUNT: '/api/users/me',
  },
  
  // Upload endpoints
  UPLOAD: {
    IMAGE: '/api/upload/image',
    MULTIPLE: '/api/upload/multiple',
  },
} as const;

// Storage Keys - Centralized localStorage/sessionStorage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

// Pagination Defaults
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

// Timeouts and Delays
export const TIMEOUTS = {
  API_REQUEST: 10000,
  PAGE_LOAD: 30000,
  TEST_TIMEOUT: 30000,
  HOOK_TIMEOUT: 30000,
  TEARDOWN_TIMEOUT: 30000,
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  VALIDATION_FAILED: 'Validation failed',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Insufficient permissions',
  NOT_FOUND: 'Resource not found',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  TOO_MANY_REQUESTS: 'Too many requests from this IP, please try again later.',
  NETWORK_ERROR: 'Network error occurred',
  UNEXPECTED_ERROR: 'An unexpected error occurred',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  RECIPE_CREATED: 'Recipe created successfully',
  RECIPE_UPDATED: 'Recipe updated successfully',
  RECIPE_DELETED: 'Recipe deleted successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  LOGOUT_SUCCESS: 'Logged out successfully',
} as const;

// Recipe Configuration
export const RECIPE_CONFIG = {
  TITLE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 200,
  },
  INSTRUCTIONS: {
    MAX_LENGTH: 5000,
  },
  DIFFICULTY_LEVELS: ['Easy', 'Medium', 'Hard'] as const,
  CATEGORY: {
    MAX_LENGTH: 50,
  },
} as const;

// User Configuration
export const USER_CONFIG = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
  EMAIL: {
    MAX_LENGTH: 255,
  },
} as const;

// File Upload Configuration
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const,
  UPLOAD_DIR: 'uploads',
} as const;

// Environment Variables
export const ENV_VARS = {
  NODE_ENV: 'NODE_ENV',
  DATABASE_URL: 'DATABASE_URL',
  JWT_SECRET: 'JWT_SECRET',
  PORT: 'PORT',
  VITE_API_URL: 'VITE_API_URL',
  RATE_LIMIT_WINDOW_MS: 'RATE_LIMIT_WINDOW_MS',
  RATE_LIMIT_MAX_REQUESTS: 'RATE_LIMIT_MAX_REQUESTS',
} as const;

// Test Configuration
export const TEST_CONFIG = {
  TIMEOUT: 30000,
  COVERAGE_THRESHOLD: {
    STATEMENTS: 85,
    BRANCHES: 85,
    FUNCTIONS: 85,
    LINES: 85,
  },
} as const;

// Export all constants as a single object for convenience
export const CONSTANTS = {
  API_CONFIG,
  SERVER_CONFIG,
  CLIENT_CONFIG,
  DATABASE_CONFIG,
  API_ENDPOINTS,
  STORAGE_KEYS,
  PAGINATION_DEFAULTS,
  TIMEOUTS,
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  RECIPE_CONFIG,
  USER_CONFIG,
  UPLOAD_CONFIG,
  ENV_VARS,
  TEST_CONFIG,
} as const; 