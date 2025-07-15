/**
 * Monitoring Service
 * Handles application metrics, health monitoring, and alerting
 */

import { performance } from 'perf_hooks'
import { prisma } from '../config/database'
import { logger } from '../utils/logger'

export interface ApplicationMetrics {
  memory: {
    heapUsed: number
    heapTotal: number
    external: number
    rss: number
    usagePercent: number
  }
  cpu: {
    loadAverage: number[]
    processCpuUsage: NodeJS.CpuUsage
  }
  database: {
    connectionStatus: boolean
    responseTime: number
    activeConnections: number
  }
  api: {
    requestCount: number
    errorRate: number
    avgResponseTime: number
  }
  uptime: number
  timestamp: string
}

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  checks: {
    database: boolean
    memory: boolean
    diskSpace: boolean
    responseTime: boolean
  }
  metrics: ApplicationMetrics
}

class MonitoringService {
  private requestCount = 0
  private errorCount = 0
  private responseTimes: number[] = []
  private readonly maxResponseTimes = 1000 // Keep last 1000 response times

  /**
   * Record API request metrics
   */
  recordRequest(responseTime: number, statusCode: number): void {
    this.requestCount++
    
    if (statusCode >= 400) {
      this.errorCount++
    }
    
    this.responseTimes.push(responseTime)
    if (this.responseTimes.length > this.maxResponseTimes) {
      this.responseTimes.shift()
    }
  }

  /**
   * Get current application metrics
   */
  async getMetrics(): Promise<ApplicationMetrics> {
    const memoryUsage = process.memoryUsage()
    const cpuUsage = process.cpuUsage()
    
    // Database metrics
    const dbStartTime = performance.now()
    let dbConnectionStatus = false
    let dbResponseTime = 0
    
    try {
      await prisma.user.findFirst({ take: 1 })
      dbConnectionStatus = true
      dbResponseTime = performance.now() - dbStartTime
    } catch (error) {
      logger.error('Database health check failed:', error)
    }
    
    // API metrics
    const avgResponseTime = this.responseTimes.length > 0 
      ? this.responseTimes.reduce((sum, time) => sum + time, 0) / this.responseTimes.length
      : 0
    
    const errorRate = this.requestCount > 0 
      ? (this.errorCount / this.requestCount) * 100
      : 0

    return {
      memory: {
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        external: Math.round(memoryUsage.external / 1024 / 1024),
        rss: Math.round(memoryUsage.rss / 1024 / 1024),
        usagePercent: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100)
      },
      cpu: {
        loadAverage: process.platform === 'darwin' ? [] : [], // Load average not available on all platforms
        processCpuUsage: cpuUsage
      },
      database: {
        connectionStatus: dbConnectionStatus,
        responseTime: Math.round(dbResponseTime),
        activeConnections: 1 // Simplified for now
      },
      api: {
        requestCount: this.requestCount,
        errorRate: Math.round(errorRate * 100) / 100,
        avgResponseTime: Math.round(avgResponseTime * 100) / 100
      },
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Get overall health status
   */
  async getHealthStatus(): Promise<HealthStatus> {
    const metrics = await this.getMetrics()
    
    const checks = {
      database: metrics.database.connectionStatus,
      memory: metrics.memory.usagePercent < 90,
      diskSpace: true, // Simplified check
      responseTime: metrics.api.avgResponseTime < 2000 // 2 seconds threshold
    }
    
    const healthyChecks = Object.values(checks).filter(check => check).length
    const totalChecks = Object.values(checks).length
    
    let status: 'healthy' | 'degraded' | 'unhealthy'
    if (healthyChecks === totalChecks) {
      status = 'healthy'
    } else if (healthyChecks >= totalChecks * 0.7) {
      status = 'degraded'
    } else {
      status = 'unhealthy'
    }
    
    return {
      status,
      checks,
      metrics
    }
  }

  /**
   * Get system information
   */
  getSystemInfo(): object {
    return {
      node: {
        version: process.version,
        platform: process.platform,
        arch: process.arch
      },
      environment: process.env.NODE_ENV || 'development',
      pid: process.pid,
      startTime: new Date(Date.now() - process.uptime() * 1000).toISOString()
    }
  }

  /**
   * Reset metrics (useful for testing)
   */
  resetMetrics(): void {
    this.requestCount = 0
    this.errorCount = 0
    this.responseTimes = []
  }

  /**
   * Get database statistics
   */
  async getDatabaseStats(): Promise<object> {
    try {
      const [userCount, recipeCount, favoriteCount] = await Promise.all([
        prisma.user.count(),
        prisma.recipe.count(),
        prisma.userFavorite.count()
      ])
      
      return {
        tables: {
          users: userCount,
          recipes: recipeCount,
          favorites: favoriteCount
        },
        totalRecords: userCount + recipeCount + favoriteCount
      }
    } catch (error) {
      logger.error('Failed to get database stats:', error)
      return {
        error: 'Failed to retrieve database statistics'
      }
    }
  }

  /**
   * Log performance metrics
   */
  logMetrics(): void {
    this.getMetrics().then(metrics => {
      logger.info('Application Metrics:', {
        memory: metrics.memory,
        api: metrics.api,
        database: metrics.database,
        uptime: metrics.uptime
      })
    }).catch(error => {
      logger.error('Failed to log metrics:', error)
    })
  }

  /**
   * Check for alerts based on metrics
   */
  async checkAlerts(): Promise<string[]> {
    const alerts: string[] = []
    
    try {
      const metrics = await this.getMetrics()
      
      // Memory alert
      if (metrics.memory.usagePercent > 85) {
        alerts.push(`High memory usage: ${metrics.memory.usagePercent}%`)
      }
      
      // Error rate alert
      if (metrics.api.errorRate > 5) {
        alerts.push(`High error rate: ${metrics.api.errorRate}%`)
      }
      
      // Database response time alert
      if (metrics.database.responseTime > 1000) {
        alerts.push(`Slow database response: ${metrics.database.responseTime}ms`)
      }
      
      // API response time alert
      if (metrics.api.avgResponseTime > 2000) {
        alerts.push(`Slow API response: ${metrics.api.avgResponseTime}ms`)
      }
      
    } catch (error) {
      alerts.push('Failed to check metrics for alerts')
      logger.error('Alert check failed:', error)
    }
    
    return alerts
  }
}

export const monitoringService = new MonitoringService()
export default monitoringService 