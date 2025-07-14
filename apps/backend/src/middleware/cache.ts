/**
 * Caching middleware
 * Provides response caching for GET requests
 */

import { Request, Response, NextFunction } from 'express'
import { config } from '../config'

// Simple in-memory cache for development
// In production, use Redis or similar
class MemoryCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()
  
  get(key: string): any | null {
    const entry = this.cache.get(key)
    if (!entry) return null
    
    const now = Date.now()
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return entry.data
  }
  
  set(key: string, data: any, ttl: number = 300000): void { // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }
  
  delete(key: string): void {
    this.cache.delete(key)
  }
  
  clear(): void {
    this.cache.clear()
  }
  
  // Clean up expired entries
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

// Global cache instance
export const cache = new MemoryCache()

// Cleanup expired entries every 5 minutes
setInterval(() => {
  cache.cleanup()
}, 300000)

/**
 * Cache middleware for GET requests
 */
export const cacheMiddleware = (ttl: number = 300000) => { // 5 minutes default
  return (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next()
    }
    
    // Skip caching in development for debugging
    if (config.server.nodeEnv === 'development') {
      return next()
    }
    
    // Create cache key from URL and query params
    const cacheKey = `${req.originalUrl || req.url}`
    
    // Try to get from cache
    const cachedResponse = cache.get(cacheKey)
    if (cachedResponse) {
      res.set('X-Cache', 'HIT')
      return res.json(cachedResponse)
    }
    
    // Override res.json to cache the response
    const originalJson = res.json
    res.json = function(data: any) {
      // Only cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cache.set(cacheKey, data, ttl)
      }
      
      res.set('X-Cache', 'MISS')
      return originalJson.call(this, data)
    }
    
    next()
  }
}

/**
 * Cache invalidation middleware
 * Clears cache when data is modified
 */
export const invalidateCacheMiddleware = (patterns: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Store original end function
    const originalEnd = res.end
    
    // Override end to invalidate cache after response
    res.end = function(chunk?: any, encoding?: any) {
      // Only invalidate on successful mutations
      if (res.statusCode >= 200 && res.statusCode < 300) {
        patterns.forEach(pattern => {
          // Simple pattern matching - in production use more sophisticated logic
          for (const [key] of cache['cache'].entries()) {
            if (key.includes(pattern)) {
              cache.delete(key)
            }
          }
        })
      }
      
      // Call original end
      return originalEnd.call(this, chunk, encoding)
    }
    
    next()
  }
}

/**
 * Set cache headers for static assets
 */
export const setCacheHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Cache static assets for 1 hour
  if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
    res.set('Cache-Control', 'public, max-age=3600')
  }
  // Cache API responses for 5 minutes
  else if (req.path.startsWith('/api/')) {
    res.set('Cache-Control', 'public, max-age=300')
  }
  
  next()
} 