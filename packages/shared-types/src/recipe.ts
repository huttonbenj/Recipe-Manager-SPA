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
}