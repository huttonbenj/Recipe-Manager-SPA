import { Recipe } from '../../generated/prisma';
import { prisma } from '../../config/database';
import logger from '../../utils/logger';
import { RecipeCreateData, RecipeUpdateData } from './types';

export class RecipeCrudService {
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

  static async verifyRecipeOwnership(recipeId: string, userId: string): Promise<boolean> {
    try {
      const recipe = await prisma.recipe.findUnique({
        where: { id: recipeId },
        select: { user_id: true },
      });

      return recipe?.user_id === userId;
    } catch (error) {
      logger.error('Error verifying recipe ownership:', error);
      throw new Error('Failed to verify recipe ownership');
    }
  }
} 