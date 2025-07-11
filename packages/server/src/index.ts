import dotenv from 'dotenv';
import app from './app';
import { dbManager } from './config/database';
import logger from './utils/logger';
import { Server } from 'http';
import { SERVER_CONFIG } from '@recipe-manager/shared';

// Load environment variables
dotenv.config();

const port = process.env.PORT || SERVER_CONFIG.DEFAULT_PORT;

let server: Server;

async function startServer() {
  try {
    // Connect to database
    await dbManager.connect();
    
    // Start server
    server = app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} signal received. Closing server...`);
  
  if (server) {
    server.close(async () => {
      logger.info('Server closed');
      
      try {
        await dbManager.disconnect();
        logger.info('Database connections closed');
      } catch (error) {
        logger.error('Error closing database connections', { error });
      }
      
      process.exit(0);
    });
  } else {
    logger.info('Server not running');
    process.exit(0);
  }
};

// Listen for shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer(); 