import { PrismaClient } from '../../generated/prisma';
import bcrypt from 'bcryptjs';
import logger from '../../utils/logger';
import { SERVER_CONFIG } from '@recipe-manager/shared';
import { sampleUsers } from '../data/users';

const prisma = new PrismaClient();

export async function seedUsers() {
  logger.info('Seeding users...');
  
  try {
    // Clear existing users
    await prisma.user.deleteMany();
    logger.info('Cleared existing users');
    
    // Create sample users
    const createdUsers = [];
    
    for (const userData of sampleUsers) {
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, SERVER_CONFIG.SALT_ROUNDS);
      
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          password_hash: hashedPassword,
        },
      });
      
      createdUsers.push(user);
      logger.info(`Created user: ${user.email}`);
    }
    
    logger.info(`Successfully seeded ${createdUsers.length} users`);
    return createdUsers;
  } catch (error) {
    logger.error('Error seeding users:', error);
    throw error;
  }
} 