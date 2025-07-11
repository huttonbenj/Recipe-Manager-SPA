// Error Messages
export const ERROR_MESSAGES = {
  VALIDATION_FAILED: 'Validation failed',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Insufficient permissions',
  NOT_FOUND: 'Resource not found',
  RECIPE_NOT_FOUND: 'Recipe not found',
  USER_NOT_FOUND: 'User not found',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  TOO_MANY_REQUESTS: 'Too many requests from this IP, please try again later.',
  NETWORK_ERROR: 'Network error occurred',
  UNEXPECTED_ERROR: 'An unexpected error occurred',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  REGISTRATION_SUCCESS: 'Registration successful',
  RECIPE_CREATED: 'Recipe created successfully',
  RECIPE_UPDATED: 'Recipe updated successfully',
  RECIPE_DELETED: 'Recipe deleted successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  LOGOUT_SUCCESS: 'Logged out successfully',
} as const; 