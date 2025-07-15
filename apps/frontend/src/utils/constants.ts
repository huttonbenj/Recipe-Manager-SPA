/**
 * Application constants
 */

// API Configuration
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL
console.log('VITE_API_BASE_URL during build:', VITE_API_BASE_URL)

if (!VITE_API_BASE_URL) {
  // In a build environment (like Vercel), fail the build if the variable is not set
  if (import.meta.env.PROD) {
    throw new Error('VITE_API_BASE_URL is not defined in the production environment. Please set it in your hosting provider settings.')
  }
}

export const API_BASE_URL = VITE_API_BASE_URL || 'http://localhost:3001/api' // Fallback for local development
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Recipe Manager'

// Authentication
export const TOKEN_STORAGE_KEY = 'recipe_manager_token'
export const USER_STORAGE_KEY = 'recipe_manager_user'
export const REFRESH_TOKEN_STORAGE_KEY = 'recipe_manager_refresh_token'

// File Upload
export const MAX_FILE_SIZE = parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB
export const ALLOWED_FILE_TYPES = import.meta.env.VITE_ALLOWED_FILE_TYPES?.split(',') || [
  'image/jpeg',
  'image/png',
  'image/webp'
]

// Pagination
export const DEFAULT_PAGE_SIZE = 12
export const MAX_PAGE_SIZE = 50

// Recipe Constants
export const DIFFICULTY_OPTIONS = [
  { value: 'EASY', label: 'Easy' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HARD', label: 'Hard' }
]

export const CUISINE_OPTIONS = [
  'Italian',
  'Mexican',
  'Chinese',
  'Indian',
  'French',
  'Japanese',
  'Mediterranean',
  'American',
  'Thai',
  'Other'
]

export const COMMON_TAGS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Quick',
  'Healthy',
  'Comfort Food',
  'Dessert',
  'Appetizer',
  'Main Course',
  'Side Dish',
  'Breakfast',
  'Lunch',
  'Dinner'
]

// UI Constants
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280
}

// Debounce delays
export const SEARCH_DEBOUNCE_MS = 300
export const INPUT_DEBOUNCE_MS = 500