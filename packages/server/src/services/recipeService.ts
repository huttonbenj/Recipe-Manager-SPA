import { Recipe, Prisma } from '../generated/prisma';
import { prisma } from '../config/database';
import logger from '../utils/logger';
import { 
  CreateRecipeRequest, 
  UpdateRecipeRequest, 
  RecipeSearchParams,
  PAGINATION_DEFAULTS
} from '@recipe-manager/shared';

export interface RecipeCreateData extends CreateRecipeRequest {
  user_id: string;
}

export interface RecipeUpdateData extends UpdateRecipeRequest {}

export interface RecipeFilters extends Pick<RecipeSearchParams, 'search' | 'category' | 'difficulty'> {
  user_id?: string;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export class RecipeService {
  static async getAllRecipes(
    filters: RecipeFilters = {},
    pagination: PaginationOptions = {}
  ): Promise<{ recipes: Recipe[]; totalCount: number; totalPages: number }> {
    try {
      const { search, category, difficulty, user_id } = filters;
      const { page = PAGINATION_DEFAULTS.PAGE, limit = PAGINATION_DEFAULTS.LIMIT } = pagination;
      
      const skip = (page - 1) * limit;
      
      // Build where clause
      const where: Prisma.RecipeWhereInput = {};
      
      if (user_id) {
        where.user_id = user_id;
      }
      
      if (category) {
        where.category = category;
      }
      
      if (difficulty) {
        where.difficulty = difficulty;
      }
      
      if (search) {
        where.OR = [
          { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { ingredients: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { instructions: { contains: search, mode: Prisma.QueryMode.insensitive } },
        ];
      }
      
      const [recipes, totalCount] = await Promise.all([
        prisma.recipe.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            created_at: 'desc',
          },
          skip,
          take: limit,
        }),
        prisma.recipe.count({ where }),
      ]);
      
      const totalPages = Math.ceil(totalCount / limit);
      
      logger.info(`Retrieved ${recipes.length} recipes (page ${page}/${totalPages})`);
      
      return {
        recipes,
        totalCount,
        totalPages,
      };
    } catch (error) {
      logger.error('Error fetching recipes:', error);
      throw new Error('Failed to fetch recipes');
    }
  }

  static async getRecipeById(id: string): Promise<Recipe | null> {
    try {
      const recipe = await prisma.recipe.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
      
      if (recipe) {
        logger.info(`Retrieved recipe: ${recipe.title}`);
      }
      
      return recipe;
    } catch (error) {
      logger.error('Error fetching recipe by ID:', error);
      throw new Error('Failed to fetch recipe');
    }
  }

  static async createRecipe(data: RecipeCreateData): Promise<Recipe> {
    try {
      // Transform undefined to null for Prisma compatibility
      const prismaData = {
        ...data,
        image_url: data.image_url ?? null,
        cook_time: data.cook_time ?? null,
        servings: data.servings ?? null,
        difficulty: data.difficulty ?? null,
        category: data.category ?? null,
        tags: data.tags ?? null,
      };

      const recipe = await prisma.recipe.create({
        data: prismaData,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
      
      logger.info(`Created recipe: ${recipe.title}`);
      
      return recipe;
    } catch (error) {
      logger.error('Error creating recipe:', error);
      throw new Error('Failed to create recipe');
    }
  }

  static async updateRecipe(id: string, data: RecipeUpdateData): Promise<Recipe> {
    try {
      // Filter out undefined values and transform to null for Prisma compatibility
      const updateData: Record<string, string | number | Date | null> = {
        updated_at: new Date(),
      };

      // Only include defined fields
      if (data.title !== undefined) updateData.title = data.title;
      if (data.ingredients !== undefined) updateData.ingredients = data.ingredients;
      if (data.instructions !== undefined) updateData.instructions = data.instructions;
      if (data.image_url !== undefined) updateData.image_url = data.image_url ?? null;
      if (data.cook_time !== undefined) updateData.cook_time = data.cook_time ?? null;
      if (data.servings !== undefined) updateData.servings = data.servings ?? null;
      if (data.difficulty !== undefined) updateData.difficulty = data.difficulty ?? null;
      if (data.category !== undefined) updateData.category = data.category ?? null;
      if (data.tags !== undefined) updateData.tags = data.tags ?? null;

      const recipe = await prisma.recipe.update({
        where: { id },
        data: updateData,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
      
      logger.info(`Updated recipe: ${recipe.title}`);
      
      return recipe;
    } catch (error) {
      logger.error('Error updating recipe:', error);
      throw new Error('Failed to update recipe');
    }
  }

  static async deleteRecipe(id: string): Promise<void> {
    try {
      const recipe = await prisma.recipe.findUnique({
        where: { id },
        select: { title: true },
      });
      
      if (!recipe) {
        throw new Error('Recipe not found');
      }
      
      await prisma.recipe.delete({
        where: { id },
      });
      
      logger.info(`Deleted recipe: ${recipe.title}`);
    } catch (error) {
      logger.error('Error deleting recipe:', error);
      throw new Error('Failed to delete recipe');
    }
  }

  static async getUserRecipes(
    userId: string,
    pagination: PaginationOptions = {}
  ): Promise<{ recipes: Recipe[]; totalCount: number; totalPages: number }> {
    try {
      const { page = PAGINATION_DEFAULTS.PAGE, limit = PAGINATION_DEFAULTS.LIMIT } = pagination;
      const skip = (page - 1) * limit;
      
      const [recipes, totalCount] = await Promise.all([
        prisma.recipe.findMany({
          where: { user_id: userId },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            created_at: 'desc',
          },
          skip,
          take: limit,
        }),
        prisma.recipe.count({ where: { user_id: userId } }),
      ]);
      
      const totalPages = Math.ceil(totalCount / limit);
      
      logger.info(`Retrieved ${recipes.length} recipes for user ${userId}`);
      
      return {
        recipes,
        totalCount,
        totalPages,
      };
    } catch (error) {
      logger.error('Error fetching user recipes:', error);
      throw new Error('Failed to fetch user recipes');
    }
  }

  static async searchRecipes(
    query: string,
    pagination: PaginationOptions = {}
  ): Promise<{ recipes: Recipe[]; totalCount: number; totalPages: number }> {
    try {
      const { page = PAGINATION_DEFAULTS.PAGE, limit = PAGINATION_DEFAULTS.LIMIT } = pagination;
      const skip = (page - 1) * limit;
      
      const where = {
        OR: [
          { title: { contains: query, mode: Prisma.QueryMode.insensitive } },
          { ingredients: { contains: query, mode: Prisma.QueryMode.insensitive } },
          { instructions: { contains: query, mode: Prisma.QueryMode.insensitive } },
          { category: { contains: query, mode: Prisma.QueryMode.insensitive } },
          { tags: { contains: query, mode: Prisma.QueryMode.insensitive } },
        ],
      };
      
      const [recipes, totalCount] = await Promise.all([
        prisma.recipe.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            created_at: 'desc',
          },
          skip,
          take: limit,
        }),
        prisma.recipe.count({ where }),
      ]);
      
      const totalPages = Math.ceil(totalCount / limit);
      
      logger.info(`Search for "${query}" returned ${recipes.length} recipes`);
      
      return {
        recipes,
        totalCount,
        totalPages,
      };
    } catch (error) {
      logger.error('Error searching recipes:', error);
      throw new Error('Failed to search recipes');
    }
  }

  static async getRecipesByCategory(
    category: string,
    pagination: PaginationOptions = {}
  ): Promise<{ recipes: Recipe[]; totalCount: number; totalPages: number }> {
    try {
      const { page = PAGINATION_DEFAULTS.PAGE, limit = PAGINATION_DEFAULTS.LIMIT } = pagination;
      const skip = (page - 1) * limit;
      
      const [recipes, totalCount] = await Promise.all([
        prisma.recipe.findMany({
          where: { category },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            created_at: 'desc',
          },
          skip,
          take: limit,
        }),
        prisma.recipe.count({ where: { category } }),
      ]);
      
      const totalPages = Math.ceil(totalCount / limit);
      
      logger.info(`Retrieved ${recipes.length} recipes for category "${category}"`);
      
      return {
        recipes,
        totalCount,
        totalPages,
      };
    } catch (error) {
      logger.error('Error fetching recipes by category:', error);
      throw new Error('Failed to fetch recipes by category');
    }
  }

  static async getRecipeCategories(): Promise<string[]> {
    try {
      const categories = await prisma.recipe.findMany({
        select: { category: true },
        distinct: ['category'],
        where: {
          category: {
            not: null,
          },
        },
      });
      
      return categories.map(c => c.category).filter(Boolean) as string[];
    } catch (error) {
      logger.error('Error fetching recipe categories:', error);
      throw new Error('Failed to fetch recipe categories');
    }
  }

  static async verifyRecipeOwnership(recipeId: string, userId: string): Promise<boolean> {
    try {
      const recipe = await prisma.recipe.findUnique({
        where: { id: recipeId },
        select: { user_id: true },
      });
      
      return recipe?.user_id === userId;
    } catch (error) {
      logger.error('Error verifying recipe ownership:', error);
      return false;
    }
  }
} 