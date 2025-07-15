/**
 * Validation utilities and schemas using Zod
 */

import { z } from 'zod'
import { Difficulty } from '@/types'

// Common validation schemas
export const emailSchema = z
  .string()
  .email('Invalid email address')
  .min(1, 'Email is required')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one lowercase letter, one uppercase letter, and one number'
  )

export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(50, 'Name must be less than 50 characters')

// Auth schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
})

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema.optional()
})

// Recipe schemas
export const recipeSchema = z.object({
  title: z
    .string()
    .min(1, 'Recipe title is required')
    .max(100, 'Title must be less than 100 characters'),
  
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  
  ingredients: z
    .array(z.string().min(1, 'Ingredient cannot be empty'))
    .min(1, 'At least one ingredient is required')
    .max(50, 'Too many ingredients'),
  
  instructions: z
    .string()
    .min(10, 'Instructions must be at least 10 characters')
    .max(5000, 'Instructions must be less than 5000 characters'),
  
  imageUrl: z
    .string()
    .url('Invalid image URL')
    .optional()
    .or(z.literal('')),
  
  cookTime: z
    .number()
    .int()
    .min(1, 'Cook time must be at least 1 minute')
    .max(1440, 'Cook time cannot exceed 24 hours')
    .optional(),
  
  prepTime: z
    .number()
    .int()
    .min(1, 'Prep time must be at least 1 minute')
    .max(480, 'Prep time cannot exceed 8 hours')
    .optional(),
  
  servings: z
    .number()
    .int()
    .min(1, 'Must serve at least 1 person')
    .max(50, 'Cannot serve more than 50 people')
    .optional(),
  
  difficulty: z
    .nativeEnum(Difficulty)
    .optional(),
  
  tags: z
    .array(z.string())
    .max(10, 'Too many tags')
    .default([]),
  
  cuisine: z
    .string()
    .max(50, 'Cuisine name too long')
    .optional()
})

// Search and filter schemas
export const searchParamsSchema = z.object({
  search: z.string().optional(),
  tags: z.string().optional(),
  cuisine: z.string().optional(),
  difficulty: z.nativeEnum(Difficulty).optional(),
  limit: z.number().int().min(1).max(50).default(12),
  offset: z.number().int().min(0).default(0),
  sortBy: z.enum(['createdAt', 'title', 'cookTime', 'difficulty']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})

// File upload validation
export const fileSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'File size must be less than 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'File must be a JPEG, PNG, or WebP image'
    )
})

// Type inference for schemas
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type RecipeFormData = z.infer<typeof recipeSchema>
export type SearchParams = z.infer<typeof searchParamsSchema>