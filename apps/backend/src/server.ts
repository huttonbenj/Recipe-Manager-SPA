/**
 * Server entry point
 * Initializes Express app and starts the server
 */

import app from './app'
import { logger } from './utils/logger'
import { config } from './config'
import { PrismaClient } from '@prisma/client'

const PORT = config.server.port
const prisma = new PrismaClient()

function maskDbUrl(url: string | undefined): string | undefined {
  if (!url) return url;
  return url.replace(/(postgres(?:ql)?:\/\/[^:]+:)[^@]+(@)/, '$1****$2');
}

// Log environment info at startup
logger.info('Starting server...');
logger.info('NODE_ENV:', process.env.NODE_ENV);
logger.info('DATABASE_URL:', maskDbUrl(process.env.DATABASE_URL));
logger.debug('All env vars:', Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.toLowerCase().includes('secret'))));

/**
 * Start the server
 */
const startServer = async (): Promise<void> => {
  try {
    app.listen(PORT, async () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      try {
        await prisma.$connect();
        logger.info('Prisma DB connection successful');
      } catch (err) {
        logger.error('Prisma DB connection failed at startup', { error: err });
      }
      logger.info(`📝 Environment: ${process.env.NODE_ENV}`);
      logger.info(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`);
    })
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error)
  process.exit(1)
})

// Handle unhandled rejections
process.on('unhandledRejection', (reason: unknown, promise: Promise<any>) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...')
  process.exit(0)
})

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...')
  process.exit(0)
})

startServer()