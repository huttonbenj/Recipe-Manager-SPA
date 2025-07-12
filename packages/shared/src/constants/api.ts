// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3001',
  TIMEOUT: 10000,
  RATE_LIMIT: {
    WINDOW_MS: 900000, // 15 minutes
    MAX_REQUESTS: 100,
  },
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
    LIKE: '/api/recipes/:id/like',
    SAVE: '/api/recipes/:id/save',
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