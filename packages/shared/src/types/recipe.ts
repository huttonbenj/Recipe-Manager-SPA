import { z } from 'zod';

export const RecipeSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(200),
  ingredients: z.string(),
  instructions: z.string().min(1).max(5000),
  image_url: z.string().url().optional(),
  cook_time: z.number().positive().optional(),
  servings: z.number().positive().optional(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional(),
  category: z.string().max(50).optional(),
  tags: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  user_id: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email()
  }).optional()
});

export const RecipeCreateSchema = z.object({
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

export const RecipeUpdateSchema = z.object({
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

export const RecipeFiltersSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional(),
  user_id: z.string().optional(),
  tags: z.string().optional()
});

export const PaginationSchema = z.object({
  page: z.number().positive().default(1),
  limit: z.number().positive().max(100).default(10)
});

export const RecipeResponseSchema = z.object({
  success: z.boolean(),
  data: RecipeSchema,
  message: z.string().optional()
});

export const RecipesResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(RecipeSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    totalCount: z.number(),
    totalPages: z.number()
  })
});

export const RecipeSearchResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(RecipeSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    totalCount: z.number(),
    totalPages: z.number()
  }),
  filters: RecipeFiltersSchema.optional()
});

export const RecipeDeleteResponseSchema = z.object({
  success: z.boolean(),
  message: z.string()
});

export const RecipeIngredient = z.object({
  name: z.string(),
  quantity: z.string(),
  unit: z.string().optional()
});

export const RecipeInstructionStep = z.object({
  step: z.number(),
  instruction: z.string()
});

export const RecipeTag = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string().optional()
});

export const RecipeStats = z.object({
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
  data: RecipeStats
});

export type Recipe = z.infer<typeof RecipeSchema>;
export type RecipeCreate = z.infer<typeof RecipeCreateSchema>;
export type RecipeUpdate = z.infer<typeof RecipeUpdateSchema>;
export type RecipeFilters = z.infer<typeof RecipeFiltersSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
export type RecipeResponse = z.infer<typeof RecipeResponseSchema>;
export type RecipesResponse = z.infer<typeof RecipesResponseSchema>;
export type RecipeSearchResponse = z.infer<typeof RecipeSearchResponseSchema>;
export type RecipeDeleteResponse = z.infer<typeof RecipeDeleteResponseSchema>;
export type RecipeIngredient = z.infer<typeof RecipeIngredient>;
export type RecipeInstructionStep = z.infer<typeof RecipeInstructionStep>;
export type RecipeTag = z.infer<typeof RecipeTag>;
export type RecipeStats = z.infer<typeof RecipeStats>;
export type RecipeStatsResponse = z.infer<typeof RecipeStatsResponseSchema>; 