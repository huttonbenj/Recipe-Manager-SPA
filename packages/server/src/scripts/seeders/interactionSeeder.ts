import { User, Recipe } from '../../generated/prisma';
import logger from '../../utils/logger';
import { prisma } from '../../config/database';

export async function seedInteractions(users: User[], recipes: Recipe[]) {
  logger.info('Seeding recipe interactions...');
  
  try {
    // Clear existing interactions
    await prisma.recipeLike.deleteMany();
    const prismaAny = prisma as any;
    await prismaAny.recipeSave.deleteMany();
    logger.info('Cleared existing interactions');
    
    if (users.length === 0 || recipes.length === 0) {
      logger.warn('No users or recipes available for interaction seeding');
      return;
    }
    
    let likesCreated = 0;
    let savesCreated = 0;
    
    // Create realistic interactions
    for (const user of users) {
      // Each user likes 30-70% of recipes randomly
      const likeProbability = 0.3 + Math.random() * 0.4;
      
      for (const recipe of recipes) {
        // Don't like your own recipes as much
        const isOwnRecipe = recipe.user_id === user.id;
        const shouldLike = Math.random() < (isOwnRecipe ? likeProbability * 0.3 : likeProbability);
        
        if (shouldLike) {
          try {
            await prisma.recipeLike.create({
              data: {
                user_id: user.id,
                recipe_id: recipe.id,
              },
            });
            likesCreated++;
          } catch (error) {
            // Ignore duplicate key errors
          }
        }
        
        // Each user saves 10-30% of recipes randomly
        const saveProbability = 0.1 + Math.random() * 0.2;
        const shouldSave = Math.random() < (isOwnRecipe ? saveProbability * 0.1 : saveProbability);
        
        if (shouldSave) {
          try {
            await prismaAny.recipeSave.create({
              data: {
                user_id: user.id,
                recipe_id: recipe.id,
              },
            });
            savesCreated++;
          } catch (error) {
            // Ignore duplicate key errors
          }
        }
      }
    }
    
    logger.info(`Successfully seeded ${likesCreated} likes and ${savesCreated} saves`);
    
  } catch (error) {
    logger.error('Error seeding interactions:', error);
    throw error;
  }
} 