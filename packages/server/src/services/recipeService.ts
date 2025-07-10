import { Recipe, Prisma } from '../generated/prisma';
import { prisma } from '../config/database';
import logger from '../utils/logger';

export interface RecipeCreateData {
  title: string;
  ingredients: string; // JSON string
  instructions: string;
  image_url?: string;
  cook_time?: number;
  servings?: number;
  difficulty?: string;
  category?: string;
  tags?: string; // JSON string
  user_id: string;
}

export interface RecipeUpdateData {
  title?: string;
  ingredients?: string;
  instructions?: string;
  image_url?: string;
  cook_time?: number;
  servings?: number;
  difficulty?: string;
  category?: string;
  tags?: string;
}

export interface RecipeFilters {
  search?: string;
  category?: string;
  difficulty?: string;
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
      const { page = 1, limit = 10 } = pagination;
      
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
      const recipe = await prisma.recipe.create({
        data,
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
      const recipe = await prisma.recipe.update({
        where: { id },
        data: {
          ...data,
          updated_at: new Date(),
        },
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
      const { page = 1, limit = 10 } = pagination;
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
      const { page = 1, limit = 10 } = pagination;
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
      const { page = 1, limit = 10 } = pagination;
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