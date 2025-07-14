/**
 * Server entry point
 * Initializes Express app and starts the server
 */

import app from './app'
import { logger } from './utils/logger'
import { config } from './config'

const PORT = config.server.port

/**
 * Start the server
 */
const startServer = async (): Promise<void> => {
  try {
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`)
      logger.info(`📝 Environment: ${config.server.nodeEnv}`)
      logger.info(`🔗 Frontend URL: ${config.cors.frontendUrl}`)
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