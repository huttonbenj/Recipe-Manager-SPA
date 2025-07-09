import { z } from 'zod';

export const RecipeIngredientSchema = z.object({
  id: z.string().uuid().optional(),
  recipeId: z.string().uuid().optional(),
  name: z.string().min(1),
  amount: z.number().positive().optional(),
  unit: z.string().optional(),
  notes: z.string().optional(),
  orderIndex: z.number().int().nonnegative().optional()
});

export const RecipeStepSchema = z.object({
  id: z.string().uuid().optional(),
  recipeId: z.string().uuid().optional(),
  stepNumber: z.number().int().positive(),
  instruction: z.string().min(1),
  timeMinutes: z.number().positive().optional(),
  temperature: z.string().optional()
});

export const RecipeSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  servings: z.number().int().positive(),
  prepTime: z.number().positive(),
  cookTime: z.number().positive(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  cuisineType: z.string().optional(),
  ingredients: z.array(RecipeIngredientSchema),
  steps: z.array(RecipeStepSchema),
  tags: z.array(z.string()).default([]),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string().uuid()
});

export type RecipeIngredient = z.infer<typeof RecipeIngredientSchema>;
export type RecipeStep = z.infer<typeof RecipeStepSchema>;
export type Recipe = z.infer<typeof RecipeSchema>; 