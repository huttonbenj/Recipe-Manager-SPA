// Storage Keys - Centralized localStorage/sessionStorage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
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
  MAX_REQUEST_SIZE: 10 * 1024 * 1024, // 10MB
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
  CI_TIMEOUT: 60000,
  RETRY: {
    RUN_MODE: 2,
    OPEN_MODE: 0,
  },
  COVERAGE_THRESHOLD: {
    STATEMENTS: 80,
    BRANCHES: 70,
    FUNCTIONS: 80,
    LINES: 80,
  },
  VIEWPORTS: {
    MOBILE: { width: 375, height: 667 },
    TABLET: { width: 768, height: 1024 },
    DESKTOP: { width: 1920, height: 1080 },
  },
  VALIDATION_TEST_LIMITS: {
    TITLE_OVERFLOW: 201,
    NAME_OVERFLOW: 101,
    INSTRUCTIONS_OVERFLOW: 5001,
  },
} as const; 