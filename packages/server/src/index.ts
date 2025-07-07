import dotenv from 'dotenv';
import app from './app';
import logger from './utils/logger';

// Load environment variables
dotenv.config();

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received. Closing server...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
}); 