import { z } from 'zod';

export const RecipeIngredientSchema = z.object({
  name: z.string().min(1),
  amount: z.number().positive(),
  unit: z.string().min(1),
  notes: z.string().optional()
});

export const RecipeStepSchema = z.object({
  order: z.number().int().positive(),
  instruction: z.string().min(1),
  duration: z.number().positive().optional(),
  notes: z.string().optional()
});

export const RecipeSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string(),
  servings: z.number().int().positive(),
  prepTime: z.number().positive(),
  cookTime: z.number().positive(),
  ingredients: z.array(RecipeIngredientSchema),
  steps: z.array(RecipeStepSchema),
  tags: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string().uuid()
});

export type RecipeIngredient = z.infer<typeof RecipeIngredientSchema>;
export type RecipeStep = z.infer<typeof RecipeStepSchema>;
export type Recipe = z.infer<typeof RecipeSchema>; 