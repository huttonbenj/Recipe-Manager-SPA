import { execSync } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import logger from '../utils/logger';
import { main as seedDatabase } from './seed';

// Load environment variables
dotenv.config();

export async function setupDatabase() {
  try {
    logger.info('🚀 Starting database setup...');
    
    // Check if .env file exists
    const envPath = path.join(process.cwd(), '.env');
    if (!existsSync(envPath)) {
      logger.warn('⚠️  .env file not found. Creating from .env.example...');
      if (existsSync(path.join(process.cwd(), '.env.example'))) {
        execSync('cp .env.example .env', { stdio: 'inherit' });
        logger.info('✅ Created .env file from .env.example');
        logger.info('🔧 Please update the DATABASE_URL in .env with your PostgreSQL credentials');
      }
    }
    
    // Generate Prisma client
    logger.info('📦 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    logger.info('✅ Prisma client generated');
    
    // Run database migrations
    logger.info('🔄 Running database migrations...');
    try {
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      logger.info('✅ Database migrations completed');
    } catch (error) {
      logger.warn('⚠️  Migration failed, trying to push schema...');
      try {
        execSync('npx prisma db push', { stdio: 'inherit' });
        logger.info('✅ Database schema pushed');
      } catch (pushError) {
        logger.error('❌ Database connection failed!');
        logger.error('Please ensure:');
        logger.error('1. PostgreSQL is running on your system');
        logger.error('2. A database named "recipe_manager" exists');
        logger.error('3. The DATABASE_URL in .env has correct credentials');
        logger.error('');
        logger.error('To create the database:');
        logger.error('  createdb recipe_manager');
        logger.error('');
        logger.error('Or update DATABASE_URL in .env with your credentials');
        process.exit(1);
      }
    }
    
    // Seed database
    logger.info('🌱 Seeding database with sample data...');
    await seedDatabase();
    logger.info('✅ Database seeded successfully');
    
    logger.info('🎉 Database setup completed successfully!');
    logger.info('');
    logger.info('Next steps:');
    logger.info('1. Start the server: npm run dev');
    logger.info('2. Open your browser: http://localhost:3001');
    logger.info('3. Test user credentials:');
    logger.info('   - Email: admin@example.com, Password: admin123');
    logger.info('   - Email: chef@example.com, Password: chef123');
    logger.info('   - Email: home@example.com, Password: home123');
    
  } catch (error) {
    logger.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

// Execute the setup function only when this script is run directly
if (require.main === module) {
  setupDatabase();
} 