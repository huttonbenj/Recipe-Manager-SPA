/**
 * Shared recipe types
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
  cookTime?: number
  prepTime?: number
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
  // Optional interaction data (populated by frontend)
  isFavorited?: boolean
  isBookmarked?: boolean
  favoritesCount?: number
  bookmarksCount?: number
  rating?: number
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
  page?: number
  sortBy?: 'createdAt' | 'title' | 'cookTime' | 'difficulty'
  sortOrder?: 'asc' | 'desc'
  cookTimeMax?: number
}

export interface UserFavorite {
  id: string
  userId: string
  recipeId: string
  recipe: Recipe
  createdAt: string
}

export interface UserBookmark {
  id: string
  userId: string
  recipeId: string
  recipe: Recipe
  createdAt: string
}

export interface InteractionCounts {
  favoritesCount: number
  bookmarksCount: number
}