// Server Configuration
export const SERVER_CONFIG = {
  DEFAULT_PORT: 3001,
  JWT_SECRET_FALLBACK: 'dev-secret-key',
  SALT_ROUNDS: 12,
  JWT_EXPIRATION: {
    ACCESS_TOKEN: '7d',
    REFRESH_TOKEN: '30d',
  },
} as const;

// Client Configuration
export const CLIENT_CONFIG = {
  DEFAULT_PORT: 3000,
  VITE_DEV_PORT: 5173,
  TOAST_DURATION: {
    DEFAULT: 4000,
    SUCCESS: 3000,
    ERROR: 5000,
  },
  VIEWPORT: {
    WIDTH: 1280,
    HEIGHT: 720,
  },
  POPULAR_ITEMS_LIMIT: 3,
} as const;

// Database Configuration
export const DATABASE_CONFIG = {
  DEFAULT_URL: process.env.DATABASE_URL || 'postgresql://postgres:your_password@localhost:5432/recipe_manager',
  TEST_URL: process.env.DATABASE_TEST_URL || 'postgresql://postgres:your_password@localhost:5432/recipe_manager_test',
  SQLITE_FALLBACK: 'sqlite://./test.db',
} as const;

// Query Configuration
export const QUERY_CONFIG = {
  RETRY: {
    DEFAULT: 3,
    MUTATIONS: 1,
  },
  STALE_TIME: {
    DEFAULT: 5 * 60 * 1000, // 5 minutes
    LONG: 30 * 60 * 1000, // 30 minutes
  },
} as const;

// Validation Configuration
export const VALIDATION_CONFIG = {
  INPUT_MAX_LENGTH: 1000,
  DEBOUNCE_DELAY: 300,
} as const; 