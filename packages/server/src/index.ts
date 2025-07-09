import dotenv from 'dotenv';
import app from './app';
import { db } from './config/database';
import logger from './utils/logger';

// Load environment variables
dotenv.config();

const port = process.env.PORT || 3001;

const server = app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});

// Handle graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} signal received. Closing server...`);
  
  server.close(async () => {
    logger.info('Server closed');
    
    try {
      await db.close();
      logger.info('Database connections closed');
    } catch (error) {
      logger.error('Error closing database connections', { error });
    }
    
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT')); 