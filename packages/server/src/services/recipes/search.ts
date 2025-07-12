import { Prisma } from '@prisma/client';
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
      const { search, category, difficulty, cookTime, user_id, sortBy = 'created_at', sortOrder = 'desc', saved, liked } = filters;
      const { page = PAGINATION_DEFAULTS.PAGE, limit = PAGINATION_DEFAULTS.LIMIT } = pagination;
      
      const skip = (page - 1) * limit;
      
      // Build where clause
      let where: Prisma.RecipeWhereInput = {};
      
      if (user_id) {
        where.user_id = user_id;
      }
      
      if (category) {
        where.category = category;
      }
      
      if (difficulty) {
        where.difficulty = difficulty;
      }

      if (cookTime) {
        const maxCook = typeof cookTime === 'string' ? parseInt(cookTime, 10) : cookTime;
        if (!isNaN(maxCook)) {
          where.cook_time = { lte: maxCook } as any;
        }
      }
      
      if (search) {
        where.OR = [
          { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { ingredients: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { instructions: { contains: search, mode: Prisma.QueryMode.insensitive } },
        ];
      }

      // If filtering by saved, join with RecipeSave
      if (saved && user_id) {
        const prismaAny = prisma as any;
        // Find all recipe IDs saved by the user
        const savedRecipes = await prismaAny.recipeSave.findMany({
          where: { user_id },
          select: { recipe_id: true },
        });
        const savedIds = savedRecipes.map((s: { recipe_id: string }) => s.recipe_id);
        where = { ...where, id: { in: savedIds.length > 0 ? savedIds : [''] } };
      }
      
      // If filtering by liked, join with RecipeLike
      if (liked && user_id) {
        // Find all recipe IDs liked by the user
        const likedRecipes = await prisma.recipeLike.findMany({
          where: { user_id },
          select: { recipe_id: true },
        });
        const likedIds = likedRecipes.map((l: { recipe_id: string }) => l.recipe_id);
        where = { ...where, id: { in: likedIds.length > 0 ? likedIds : [''] } };
      }
      
      // If filtering by liked or saved but no user_id, return empty result
      if ((liked || saved) && !user_id) {
        return {
          recipes: [],
          totalCount: 0,
          totalPages: 0,
        };
      }

      // Build orderBy clause
      let recipes;
      let totalCount;
      
      if (sortBy === 'likes') {
        // For sorting by likes, we'll get all recipes first, then sort by like count
        // This is less efficient but more reliable than raw SQL
        const allRecipes = await prisma.recipe.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            likes: true, // Include likes to count them
          },
        });
        
        // Sort by like count
        const sortedRecipes = allRecipes.sort((a, b) => {
          const aLikes = a.likes.length;
          const bLikes = b.likes.length;
          return sortOrder === 'asc' ? aLikes - bLikes : bLikes - aLikes;
        });
        
        // Apply pagination
        totalCount = sortedRecipes.length;
        recipes = sortedRecipes.slice(skip, skip + limit);
      } else {
        // Standard sorting
        const orderBy: Prisma.RecipeOrderByWithRelationInput = {};
        if (sortBy && ['created_at', 'updated_at', 'title', 'cook_time'].includes(sortBy)) {
          orderBy[sortBy as keyof Prisma.RecipeOrderByWithRelationInput] = sortOrder === 'asc' ? 'asc' : 'desc';
        } else {
          orderBy.created_at = 'desc';
        }
        
        [recipes, totalCount] = await Promise.all([
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
            orderBy,
            skip,
            take: limit,
          }),
          prisma.recipe.count({ where }),
        ]);
      }
      
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