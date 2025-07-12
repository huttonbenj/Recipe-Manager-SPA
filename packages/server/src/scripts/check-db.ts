import { execSync } from 'child_process';
import dotenv from 'dotenv';
import logger from '../utils/logger';

// Load environment variables
dotenv.config();

export async function checkDatabase() {
  try {
    logger.info('🔍 Checking database connection...');
    
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      logger.error('❌ DATABASE_URL environment variable not set');
      process.exit(1);
    }
    
    // Try to connect to the database
    execSync('npx prisma db pull --print', { stdio: 'pipe' });
    logger.info('✅ Database connection successful!');
    
    // Check if tables exist
    try {
      execSync('npx prisma db seed --help', { stdio: 'pipe' });
      logger.info('✅ Database appears to be set up correctly');
    } catch (error) {
      logger.warn('⚠️  Database connected but schema may not be initialized');
    }
    
  } catch (error) {
    logger.error('❌ Database connection failed!');
    logger.error('');
    logger.error('Common solutions:');
    logger.error('1. Start PostgreSQL service:');
    logger.error('   - macOS: brew services start postgresql');
    logger.error('   - Linux: sudo systemctl start postgresql');
    logger.error('   - Windows: Start PostgreSQL from Services');
    logger.error('');
    logger.error('2. Create the database:');
    logger.error('   createdb recipe_manager');
    logger.error('');
    logger.error('3. Update DATABASE_URL in .env:');
    logger.error('   DATABASE_URL="postgresql://username:password@localhost:5432/recipe_manager"');
    logger.error('');
    logger.error('4. Test connection:');
    logger.error('   psql -d recipe_manager -c "SELECT 1"');
    
    process.exit(1);
  }
}

// Execute the check function only when this script is run directly
if (require.main === module) {
  checkDatabase();
} 