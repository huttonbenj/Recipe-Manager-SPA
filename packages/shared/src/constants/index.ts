/**
 * Shared Constants for Recipe Manager SPA
 * 
 * This file contains all constants that are used across multiple packages
 * to ensure consistency and avoid duplication.
 */

// Re-export from organized constants modules
export * from './api';
export * from './config';
export * from './messages';
export * from './app';

// Import all constants for the combined export
import { API_CONFIG, API_ENDPOINTS, HTTP_STATUS, PAGINATION_DEFAULTS, TIMEOUTS } from './api';
import { SERVER_CONFIG, CLIENT_CONFIG, DATABASE_CONFIG, QUERY_CONFIG, VALIDATION_CONFIG } from './config';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from './messages';
import { STORAGE_KEYS, RECIPE_CONFIG, USER_CONFIG, UPLOAD_CONFIG, ENV_VARS, TEST_CONFIG } from './app';

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
  QUERY_CONFIG,
  VALIDATION_CONFIG,
} as const; 