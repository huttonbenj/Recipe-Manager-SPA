import dotenv from 'dotenv';
import app from './app';
import { dbManager } from './config/database';
import logger from './utils/logger';
import { Server } from 'http';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000; // Backend server on port 3000

let server: Server;

async function startServer() {
  try {
    // Connect to database
    await dbManager.connect();
    
    // Start server
    server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
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
      logger.info('Server closed.');
      
      // Close database connection
      await dbManager.disconnect();
      logger.info('Database connection closed.');
      
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
startServer(); 