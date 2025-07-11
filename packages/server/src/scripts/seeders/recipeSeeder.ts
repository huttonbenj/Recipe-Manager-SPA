import { PrismaClient, User } from '../../generated/prisma';
import logger from '../../utils/logger';
import { sampleRecipes } from '../data/recipes';

const prisma = new PrismaClient();

export async function seedRecipes(users: User[]) {
  logger.info('Seeding recipes...');
  
  try {
    // Clear existing recipes
    await prisma.recipe.deleteMany();
    logger.info('Cleared existing recipes');
    
    if (users.length === 0) {
      logger.warn('No users available for recipe seeding');
      return [];
    }
    
    // Create sample recipes
    const createdRecipes = [];
    
    for (let i = 0; i < sampleRecipes.length; i++) {
      const recipeData = sampleRecipes[i];
      if (!recipeData) continue;
      
      // Assign recipes to users in round-robin fashion
      const assignedUser = users[i % users.length];
      if (!assignedUser) continue;
      
      const recipe = await prisma.recipe.create({
        data: {
          title: recipeData.title,
          ingredients: recipeData.ingredients,
          instructions: recipeData.instructions,
          image_url: recipeData.image_url,
          cook_time: recipeData.cook_time,
          servings: recipeData.servings,
          difficulty: recipeData.difficulty,
          category: recipeData.category,
          tags: recipeData.tags,
          user_id: assignedUser.id,
        },
      });
      
      createdRecipes.push(recipe);
      logger.info(`Created recipe: ${recipe.title} (assigned to ${assignedUser.name})`);
    }
    
    logger.info(`Successfully seeded ${createdRecipes.length} recipes`);
    return createdRecipes;
  } catch (error) {
    logger.error('Error seeding recipes:', error);
    throw error;
  }
} 