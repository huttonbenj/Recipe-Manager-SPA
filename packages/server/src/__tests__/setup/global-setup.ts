import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';
import logger from '../../utils/logger';

export async function setup() {
  logger.info('Setting up test database...');
  
  // Ensure test database is properly set up
  const DATABASE_URL = process.env.DATABASE_URL || 'sqlite://./test.db';
  
  if (DATABASE_URL.includes('sqlite')) {
    // For SQLite, ensure the database file exists
    try {
      execSync('npx prisma db push --force-reset', { stdio: 'inherit' });
      logger.info('SQLite test database reset complete');
    } catch (error) {
      logger.error('Failed to reset SQLite test database:', error);
      throw error;
    }
  } else {
    // For PostgreSQL or other databases
    try {
      execSync('npx prisma migrate reset --force', { stdio: 'inherit' });
      logger.info('Test database migration complete');
    } catch (error) {
      logger.error('Failed to migrate test database:', error);
      throw error;
    }
  }
  
  // Seed test data if needed
  try {
    const prisma = new PrismaClient({
      log: ['error'],
      errorFormat: 'minimal',
    });
    await prisma.$connect();
    logger.info('Database connection established');
    await prisma.$disconnect();
  } catch (error) {
    logger.error('Failed to connect to test database:', error);
    throw error;
  }
}

export async function teardown() {
  logger.info('Tearing down test database...');
  
  // Clean up test database if needed
  const prisma = new PrismaClient({
    log: ['error'],
    errorFormat: 'minimal',
  });
  try {
    await prisma.$disconnect();
  } catch (error) {
    logger.error('Error during test database teardown:', error);
  }
} 