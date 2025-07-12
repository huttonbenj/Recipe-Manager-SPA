import { Recipe } from '../../generated/prisma';
import { 
  CreateRecipeRequest, 
  UpdateRecipeRequest, 
  RecipeSearchParams
} from '@recipe-manager/shared';

export interface RecipeCreateData extends CreateRecipeRequest {
  user_id: string;
}

export interface RecipeUpdateData extends UpdateRecipeRequest {}

export interface RecipeFilters extends Pick<RecipeSearchParams, 'search' | 'category' | 'difficulty' | 'sortBy' | 'sortOrder'> {
  cookTime?: number;
  user_id?: string;
  saved?: boolean;
  liked?: boolean;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface RecipeListResult {
  recipes: Recipe[];
  totalCount: number;
  totalPages: number;
}

export interface RecipeStats {
  totalRecipes: number;
  recipesByCategory: Array<{ category: string; count: number }>;
} 