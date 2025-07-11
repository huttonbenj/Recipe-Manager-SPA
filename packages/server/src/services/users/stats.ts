import { prisma } from '../../config/database';
import logger from '../../utils/logger';
import { UserStats, SanitizedUser, sanitizeUser } from './types';

export class UserStatsService {
  static async getUserProfile(userId: string): Promise<SanitizedUser | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      return user ? sanitizeUser(user) : null;
    } catch (error) {
      logger.error('Error fetching user profile:', error);
      throw new Error('Failed to fetch user profile');
    }
  }

  static async getUserStats(userId: string): Promise<UserStats> {
    try {
      // Get total recipe count for user
      const totalRecipes = await prisma.recipe.count({
        where: { user_id: userId },
      });

      // Get recipe count by category
      const recipesByCategory = await prisma.recipe.groupBy({
        by: ['category'],
        where: {
          user_id: userId,
          category: {
            not: null,
          },
        },
        _count: {
          category: true,
        },
      });

      const formattedStats = recipesByCategory.map(item => ({
        category: item.category!,
        count: item._count.category,
      }));

      logger.info(`Retrieved stats for user ${userId}: ${totalRecipes} recipes`);

      return {
        totalRecipes,
        recipesByCategory: formattedStats,
      };
    } catch (error) {
      logger.error('Error fetching user stats:', error);
      throw new Error('Failed to fetch user statistics');
    }
  }
} 