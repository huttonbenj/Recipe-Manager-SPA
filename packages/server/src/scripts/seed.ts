import { PrismaClient } from '../generated/prisma';
import logger from '../utils/logger';
import { seedUsers } from './seeders/userSeeder';
import { seedRecipes } from './seeders/recipeSeeder';

const prisma = new PrismaClient();

export async function main() {
  try {
    logger.info('Starting database seeding...');
    
    // Seed users first
    const users = await seedUsers();
    
    // Seed recipes with the created users
    await seedRecipes(users);
    
    logger.info('Database seeding completed successfully!');
    
    // Display summary
    const userCount = await prisma.user.count();
    const recipeCount = await prisma.recipe.count();
    
    logger.info(`Total users: ${userCount}`);
    logger.info(`Total recipes: ${recipeCount}`);
    
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