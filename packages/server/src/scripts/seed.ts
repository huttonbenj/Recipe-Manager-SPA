import { PrismaClient } from '../generated/prisma';
import logger from '../utils/logger';
import { seedUsers } from './seeders/userSeeder';
import { seedRecipes } from './seeders/recipeSeeder';
import { seedInteractions } from './seeders/interactionSeeder';

const prisma = new PrismaClient();

export async function main() {
  try {
    logger.info('Starting database seeding...');
    
    // Seed users first
    const users = await seedUsers();
    
    // Seed recipes with the created users
    const recipes = await seedRecipes(users);
    
    // Seed interactions (likes and saves) with the created users and recipes
    await seedInteractions(users, recipes);
    
    logger.info('Database seeding completed successfully!');
    
    // Display summary
    const userCount = await prisma.user.count();
    const recipeCount = await prisma.recipe.count();
    const prismaAny = prisma as any;
    const likeCount = await prismaAny.recipeLike?.count() || 0;
    const saveCount = await prismaAny.recipeSave?.count() || 0;
    
    logger.info(`Total users: ${userCount}`);
    logger.info(`Total recipes: ${recipeCount}`);
    logger.info(`Total likes: ${likeCount}`);
    logger.info(`Total saves: ${saveCount}`);
    
  } catch (error) {
    logger.error('Error during database seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the main function only when this script is run directly
if (require.main === module) {
  main();
} 