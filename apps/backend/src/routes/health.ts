/**
 * Health check routes
 * Provides endpoints for monitoring application health
 */

import { Router } from 'express'
import { prisma } from '../config/database'
import { monitoringService } from '../services/monitoringService'
import { logger } from '../utils/logger'

const router = Router()

/**
 * Basic health check
 * Returns 200 if the application is running
 */
router.get('/health', async (req, res) => {
  logger.info('Health check endpoint called');
  try {
    logger.debug('Attempting DB query for health check');
    const user = await prisma.user.findFirst({ take: 1 });
    logger.debug('DB query succeeded', { user });
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'recipe-manager-api',
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    let errMsg = 'Unknown error';
    if (error instanceof Error) {
      logger.error('Health check failed', { error: error.message, stack: error.stack });
      errMsg = error.message;
    } else {
      logger.error('Health check failed', { error });
      errMsg = String(error);
    }
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'recipe-manager-api',
      error: errMsg
    });
  }
})

/**
 * Detailed health check
 * Returns detailed information about application health
 */
router.get('/health/detailed', async (req, res) => {
  try {
    const healthStatus = await monitoringService.getHealthStatus()
    const systemInfo = monitoringService.getSystemInfo()
    
    res.status(healthStatus.status === 'healthy' ? 200 : 503).json({
      ...healthStatus,
      service: 'recipe-manager-api',
      version: process.env.npm_package_version || '1.0.0',
      system: systemInfo
    })
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'recipe-manager-api',
      error: 'Health check failed'
    })
  }
})

/**
 * Readiness check
 * Returns 200 when the application is ready to accept requests
 */
router.get('/ready', async (req, res) => {
  try {
    // Check if database is ready with queryCompiler-compatible operation
    await prisma.user.findFirst({ take: 1 })
    
    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString(),
      service: 'recipe-manager-api'
    })
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      timestamp: new Date().toISOString(),
      service: 'recipe-manager-api',
      error: 'Database not ready'
    })
  }
})

/**
 * Liveness check
 * Returns 200 if the application is alive (doesn't check dependencies)
 */
router.get('/live', (req, res) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    service: 'recipe-manager-api'
  })
})

/**
 * Metrics endpoint
 * Returns detailed application metrics
 */
router.get('/metrics', async (req, res) => {
  try {
    const metrics = await monitoringService.getMetrics()
    const dbStats = await monitoringService.getDatabaseStats()
    const alerts = await monitoringService.checkAlerts()
    
    res.status(200).json({
      metrics,
      database: dbStats,
      alerts,
      service: 'recipe-manager-api'
    })
  } catch (error) {
    res.status(500).json({
      error: 'Failed to retrieve metrics',
      service: 'recipe-manager-api'
    })
  }
})

/**
 * System information endpoint
 */
router.get('/system', (req, res) => {
  try {
    const systemInfo = monitoringService.getSystemInfo()
    res.status(200).json({
      system: systemInfo,
      service: 'recipe-manager-api'
    })
  } catch (error) {
    res.status(500).json({
      error: 'Failed to retrieve system information',
      service: 'recipe-manager-api'
    })
  }
})

/**
 * Database statistics endpoint
 */
router.get('/database', async (req, res) => {
  try {
    const dbStats = await monitoringService.getDatabaseStats()
    res.status(200).json({
      database: dbStats,
      service: 'recipe-manager-api'
    })
  } catch (error) {
    res.status(500).json({
      error: 'Failed to retrieve database statistics',
      service: 'recipe-manager-api'
    })
  }
})

export default router 