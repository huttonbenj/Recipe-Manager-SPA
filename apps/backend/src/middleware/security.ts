/**
 * Security middleware
 * Additional security measures for production deployment
 */

import { Request, Response, NextFunction } from 'express'
import rateLimit from 'express-rate-limit'
import { config } from '../config'

/**
 * Strict rate limiting for auth endpoints
 */
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again later',
    retryAfter: 15 * 60 * 1000
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    // Use IP + user agent for more accurate tracking
    return `${req.ip}-${req.get('User-Agent')}`
  }
})

/**
 * General API rate limiting
 */
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests, please try again later',
    retryAfter: 15 * 60 * 1000
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req: Request) => {
    // Skip rate limiting for health checks
    return req.path.startsWith('/health') || req.path.startsWith('/ready')
  }
})

/**
 * Upload rate limiting
 */
export const uploadRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 uploads per hour
  message: {
    success: false,
    error: 'Too many uploads, please try again later',
    retryAfter: 60 * 60 * 1000
  },
  standardHeaders: true,
  legacyHeaders: false
})

/**
 * Content Security Policy middleware
 */
export const contentSecurityPolicy = (req: Request, res: Response, next: NextFunction) => {
  const nonce = Buffer.from(Math.random().toString()).toString('base64')
  
  const cspDirectives = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}'`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: https:`,
    `font-src 'self' data:`,
    `connect-src 'self' ${config.cors.frontendUrl}`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `upgrade-insecure-requests`
  ]
  
  if (config.server.nodeEnv === 'development') {
    cspDirectives.push(`script-src 'self' 'unsafe-inline' 'unsafe-eval'`)
  }
  
  res.setHeader('Content-Security-Policy', cspDirectives.join('; '))
  res.locals.nonce = nonce
  next()
}

/**
 * Additional security headers
 */
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY')
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff')
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block')
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Permissions policy
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()')
  
  // HSTS in production
  if (config.server.nodeEnv === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }
  
  // Remove server information
  res.removeHeader('X-Powered-By')
  res.removeHeader('Server')
  
  next()
}

/**
 * Request sanitization middleware
 */
export const sanitizeRequest = (req: Request, res: Response, next: NextFunction) => {
  // Remove potential XSS vectors from query parameters
  if (req.query) {
    for (const key in req.query) {
      if (typeof req.query[key] === 'string') {
        req.query[key] = (req.query[key] as string)
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
          .replace(/javascript:/gi, '')
      }
    }
  }
  
  // Remove potential XSS vectors from request body
  if (req.body && typeof req.body === 'object') {
    sanitizeObject(req.body)
  }
  
  next()
}

/**
 * Sanitize object recursively
 */
function sanitizeObject(obj: any): void {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
          .replace(/javascript:/gi, '')
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObject(obj[key])
      }
    }
  }
}

/**
 * IP whitelist middleware for admin endpoints
 */
export const adminWhitelist = (allowedIPs: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 'unknown'
    
    if (!allowedIPs.includes(clientIP)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
        message: 'Your IP address is not authorized to access this resource'
      })
    }
    
    return next()
  }
}

/**
 * Request logging middleware for security monitoring
 */
export const securityLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now()
  
  res.on('finish', () => {
    const duration = Date.now() - startTime
    const logData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      statusCode: res.statusCode,
      duration,
      size: res.get('Content-Length') || 0
    }
    
    // Log suspicious requests
    if (res.statusCode >= 400 || duration > 5000) {
      console.warn('Security Alert:', logData)
    }
  })
  
  next()
}

/**
 * API key validation middleware
 */
export const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key']
  const validApiKey = process.env.API_KEY
  
  if (!validApiKey) {
    return next() // Skip validation if no API key is configured
  }
  
  if (!apiKey || apiKey !== validApiKey) {
    return res.status(401).json({
      success: false,
      error: 'Invalid API key',
      message: 'A valid API key is required to access this resource'
    })
  }
  
  next()
} 