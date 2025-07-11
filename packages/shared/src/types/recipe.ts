/* eslint-disable */
import { z } from 'zod';
// Import directly to avoid potential circular re-export issues that led to
// "Unexpected module status 3" during Node module resolution in some tooling.
import { RECIPE_CONFIG } from '../constants/recipe';
import { PAGINATION_DEFAULTS } from '../constants/api';

// Core Recipe Schema - this is the authoritative recipe type definition
export const RecipeSchema = z.object({
  id: z.string(),
  title: z.string().min(RECIPE_CONFIG.TITLE.MIN_LENGTH).max(RECIPE_CONFIG.TITLE.MAX_LENGTH),
  ingredients: z.string().min(RECIPE_CONFIG.TITLE.MIN_LENGTH), // JSON string in database
  instructions: z.string().min(RECIPE_CONFIG.TITLE.MIN_LENGTH).max(RECIPE_CONFIG.INSTRUCTIONS.MAX_LENGTH), // JSON string in database
  image_url: z.string().url().optional(),
  cook_time: z.number().positive().optional(),
  servings: z.number().positive().optional(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional(),
  category: z.string().max(RECIPE_CONFIG.CATEGORY.MAX_LENGTH).optional(),
  tags: z.string().optional(), // JSON string in database
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  user_id: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email()
  }).optional()
});

// Recipe Creation Schema (for API requests)
export const RecipeCreateSchema = z.object({
  title: z.string().min(RECIPE_CONFIG.TITLE.MIN_LENGTH).max(RECIPE_CONFIG.TITLE.MAX_LENGTH),
  ingredients: z.string().min(RECIPE_CONFIG.TITLE.MIN_LENGTH),
  instructions: z.string().min(RECIPE_CONFIG.TITLE.MIN_LENGTH).max(RECIPE_CONFIG.INSTRUCTIONS.MAX_LENGTH),
  image_url: z.string().url().optional(),
  cook_time: z.number().positive().optional(),
  servings: z.number().positive().optional(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional(),
  category: z.string().max(RECIPE_CONFIG.CATEGORY.MAX_LENGTH).optional(),
  tags: z.string().optional()
});

// Recipe Update Schema (for API requests)
export const RecipeUpdateSchema = z.object({
  title: z.string().min(RECIPE_CONFIG.TITLE.MIN_LENGTH).max(RECIPE_CONFIG.TITLE.MAX_LENGTH).optional(),
  ingredients: z.string().min(RECIPE_CONFIG.TITLE.MIN_LENGTH).optional(),
  instructions: z.string().min(RECIPE_CONFIG.TITLE.MIN_LENGTH).max(RECIPE_CONFIG.INSTRUCTIONS.MAX_LENGTH).optional(),
  image_url: z.string().url().optional(),
  cook_time: z.number().positive().optional(),
  servings: z.number().positive().optional(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional(),
  category: z.string().max(RECIPE_CONFIG.CATEGORY.MAX_LENGTH).optional(),
  tags: z.string().optional()
});

// Recipe Search/Filter Schema
export const RecipeSearchSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional(),
  tags: z.string().optional(),
  user_id: z.string().optional(),
  sortBy: z.enum(['created_at', 'updated_at', 'title', 'cook_time']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().int().positive().default(PAGINATION_DEFAULTS.PAGE),
  limit: z.coerce.number().int().positive().max(PAGINATION_DEFAULTS.MAX_LIMIT).default(PAGINATION_DEFAULTS.LIMIT)
});

// Pagination Schema
export const PaginationSchema = z.object({
  page: z.number().positive().default(PAGINATION_DEFAULTS.PAGE),
  limit: z.number().positive().max(PAGINATION_DEFAULTS.MAX_LIMIT).default(PAGINATION_DEFAULTS.LIMIT),
  totalCount: z.number(),
  totalPages: z.number()
});

// API Response Schemas
export const RecipeResponseSchema = z.object({
  success: z.boolean(),
  data: RecipeSchema,
  message: z.string().optional()
});

export const RecipesResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(RecipeSchema),
  pagination: PaginationSchema
});

export const RecipeDeleteResponseSchema = z.object({
  success: z.boolean(),
  message: z.string()
});

// Structured data types for client-side use
export const IngredientSchema = z.object({
  name: z.string(),
  amount: z.number(),
  unit: z.string()
});

export const InstructionStepSchema = z.object({
  step: z.number(),
  instruction: z.string()
});

// Recipe Statistics Schema
export const RecipeStatsSchema = z.object({
  totalRecipes: z.number(),
  recipesByCategory: z.array(z.object({
    category: z.string(),
    count: z.number()
  })),
  recipesByDifficulty: z.array(z.object({
    difficulty: z.string(),
    count: z.number()
  })),
  averageCookTime: z.number(),
  mostPopularTags: z.array(z.object({
    tag: z.string(),
    count: z.number()
  }))
});

export const RecipeStatsResponseSchema = z.object({
  success: z.boolean(),
  data: RecipeStatsSchema
});

// Type Exports - these are the types that should be used throughout the app
export type Recipe = z.infer<typeof RecipeSchema>;
export type RecipeCreate = z.infer<typeof RecipeCreateSchema>;
export type RecipeUpdate = z.infer<typeof RecipeUpdateSchema>;
export type RecipeSearch = z.infer<typeof RecipeSearchSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
export type RecipeResponse = z.infer<typeof RecipeResponseSchema>;
export type RecipesResponse = z.infer<typeof RecipesResponseSchema>;
export type RecipeDeleteResponse = z.infer<typeof RecipeDeleteResponseSchema>;
export type Ingredient = z.infer<typeof IngredientSchema>;
export type InstructionStep = z.infer<typeof InstructionStepSchema>;
export type RecipeStats = z.infer<typeof RecipeStatsSchema>;
export type RecipeStatsResponse = z.infer<typeof RecipeStatsResponseSchema>;

// Form data type for client-side recipe forms  
export interface RecipeFormData {
  title: string;
  ingredients: string;
  instructions: string;
  cook_time: number;
  servings: number;
  difficulty: typeof RECIPE_CONFIG.DIFFICULTY_LEVELS[number];
  category: string;
  tags: string;
  image_url?: string;
}

// Paginated Response type for API responses
export interface PaginatedResponse<T = unknown> {
  success: boolean;
  data: T[];
  pagination: Pagination;
} 