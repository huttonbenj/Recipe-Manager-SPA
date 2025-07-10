import { z } from 'zod';

// Generic API Response Schema
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  message: z.string().optional(),
  error: z.string().optional(),
  details: z.array(z.unknown()).optional()
});

// Pagination Schema
export const PaginationParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10)
});

export const PaginationInfoSchema = z.object({
  page: z.number().int(),
  limit: z.number().int(),
  totalCount: z.number().int(),
  totalPages: z.number().int()
});

// Search/Filter Schemas
export const RecipeSearchParamsSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional(),
  tags: z.string().optional(),
  user_id: z.string().optional(),
  sortBy: z.enum(['created_at', 'updated_at', 'title', 'cook_time']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10)
});

// Auth API Types
export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const RegisterRequestSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(50),
  password: z.string().min(8).max(100)
});

export const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string()
});

export const ChangePasswordRequestSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8).max(100)
});

export const UpdateProfileRequestSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  email: z.string().email().optional()
});

// Recipe API Types
export const CreateRecipeRequestSchema = z.object({
  title: z.string().min(1).max(200),
  ingredients: z.string().min(1),
  instructions: z.string().min(1).max(5000),
  image_url: z.string().url().optional(),
  cook_time: z.number().positive().optional(),
  servings: z.number().positive().optional(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional(),
  category: z.string().max(50).optional(),
  tags: z.string().optional()
});

export const UpdateRecipeRequestSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  ingredients: z.string().min(1).optional(),
  instructions: z.string().min(1).max(5000).optional(),
  image_url: z.string().url().optional(),
  cook_time: z.number().positive().optional(),
  servings: z.number().positive().optional(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional(),
  category: z.string().max(50).optional(),
  tags: z.string().optional()
});

// File Upload Types
export const FileUploadResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    filename: z.string(),
    originalName: z.string(),
    size: z.number(),
    url: z.string(),
    mimetype: z.string()
  }),
  message: z.string().optional()
});

// Error Response Schema
export const ErrorResponseSchema = z.object({
  success: z.boolean(),
  error: z.string(),
  details: z.array(z.unknown()).optional(),
  code: z.number().optional(),
  timestamp: z.string().optional()
});

// Validation Error Schema (moved to validation module)
// export const ValidationErrorSchema = z.object({
//   field: z.string(),
//   message: z.string(),
//   value: z.unknown().optional()
// });

// API Endpoint Types
export interface ApiEndpoints {
  // Auth endpoints
  auth: {
    login: '/api/auth/login';
    register: '/api/auth/register';
    refresh: '/api/auth/refresh';
    logout: '/api/auth/logout';
    profile: '/api/auth/profile';
    changePassword: '/api/auth/change-password';
    stats: '/api/auth/stats';
  };
  
  // Recipe endpoints
  recipes: {
    list: '/api/recipes';
    create: '/api/recipes';
    detail: '/api/recipes/:id';
    update: '/api/recipes/:id';
    delete: '/api/recipes/:id';
    search: '/api/recipes/search';
    userRecipes: '/api/recipes/user/:userId';
    categories: '/api/recipes/categories';
    stats: '/api/recipes/stats';
  };
  
  // User endpoints
  users: {
    me: '/api/users/me';
    profile: '/api/users/:id';
    myRecipes: '/api/users/me/recipes';
    userRecipes: '/api/users/:id/recipes';
    myStats: '/api/users/me/stats';
    userStats: '/api/users/:id/stats';
    deleteAccount: '/api/users/me';
  };
  
  // Upload endpoints
  upload: {
    image: '/api/upload/image';
    multiple: '/api/upload/multiple';
  };
}

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// Request Configuration
export interface RequestConfig {
  method: HttpMethod;
  url: string;
  data?: unknown;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  timeout?: number;
}

// Response Configuration
export interface ResponseConfig<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

// Type Inference
export type ApiResponse<T = unknown> = z.infer<typeof ApiResponseSchema> & {
  data: T;
};

export type PaginationParams = z.infer<typeof PaginationParamsSchema>;
export type PaginationInfo = z.infer<typeof PaginationInfoSchema>;
export type RecipeSearchParams = z.infer<typeof RecipeSearchParamsSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;
export type ChangePasswordRequest = z.infer<typeof ChangePasswordRequestSchema>;
export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>;
export type CreateRecipeRequest = z.infer<typeof CreateRecipeRequestSchema>;
export type UpdateRecipeRequest = z.infer<typeof UpdateRecipeRequestSchema>;
export type FileUploadResponse = z.infer<typeof FileUploadResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
// export type ValidationError = z.infer<typeof ValidationErrorSchema>; 