import { Prisma } from '../../generated/prisma';
import { prisma } from '../../config/database';
import logger from '../../utils/logger';
import { PAGINATION_DEFAULTS } from '@recipe-manager/shared';
import { RecipeFilters, PaginationOptions, RecipeListResult } from './types';

export class RecipeSearchService {
  static async getAllRecipes(
    filters: RecipeFilters = {},
    pagination: PaginationOptions = {}
  ): Promise<RecipeListResult> {
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

  static async getUserRecipes(
    userId: string,
    pagination: PaginationOptions = {}
  ): Promise<RecipeListResult> {
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
      
      logger.info(`Retrieved ${recipes.length} user recipes (page ${page}/${totalPages})`);
      
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
  ): Promise<RecipeListResult> {
    try {
      const { page = PAGINATION_DEFAULTS.PAGE, limit = PAGINATION_DEFAULTS.LIMIT } = pagination;
      const skip = (page - 1) * limit;
      
      const where: Prisma.RecipeWhereInput = {
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
      
      logger.info(`Search "${query}" returned ${recipes.length} recipes (page ${page}/${totalPages})`);
      
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
  ): Promise<RecipeListResult> {
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
      
      logger.info(`Retrieved ${recipes.length} recipes in category "${category}" (page ${page}/${totalPages})`);
      
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
      
      return categories.map(recipe => recipe.category!).filter(Boolean);
    } catch (error) {
      logger.error('Error fetching recipe categories:', error);
      throw new Error('Failed to fetch recipe categories');
    }
  }
} 