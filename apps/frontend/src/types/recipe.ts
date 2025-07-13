/**
 * Recipe-related type definitions
 */

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export interface Recipe {
  id: string
  title: string
  description?: string
  ingredients: string[]
  instructions: string
  imageUrl?: string
  cookTime?: number // in minutes
  prepTime?: number // in minutes
  servings?: number
  difficulty?: Difficulty
  tags: string[]
  cuisine?: string
  authorId?: string
  author?: {
    id: string
    name?: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

export interface CreateRecipeData {
  title: string
  description?: string
  ingredients: string[]
  instructions: string
  imageUrl?: string
  cookTime?: number
  prepTime?: number
  servings?: number
  difficulty?: Difficulty
  tags: string[]
  cuisine?: string
}

export interface UpdateRecipeData extends Partial<CreateRecipeData> {
  id: string
}

export interface RecipeFilters {
  search?: string
  tags?: string[]
  cuisine?: string
  difficulty?: Difficulty
  maxCookTime?: number
  minServings?: number
  maxServings?: number
}

export interface RecipeSearchParams {
  search?: string
  tags?: string
  cuisine?: string
  difficulty?: string
  limit?: number
  offset?: number
  sortBy?: 'createdAt' | 'title' | 'cookTime' | 'difficulty'
  sortOrder?: 'asc' | 'desc'
}