/**
 * Express application setup
 * Configures middleware, routes, and error handling
 */

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import multer from 'multer'

import { config } from './config'
import { logger } from './utils/logger'
import { errorHandler } from './middleware/errorHandler'
import { setCacheHeaders } from './middleware/cache'
import { securityHeaders, sanitizeRequest, securityLogger, apiRateLimit } from './middleware/security'
import { monitoringService } from './services/monitoringService'
import routes from './routes'

const app = express()

// Trust proxy for rate limiting and security
app.set('trust proxy', 1)

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'img-src': [
        "'self'", 
        'data:', 
        ...(config.server.nodeEnv === 'development' 
          ? ['http://localhost:3001', 'http://localhost:5173']
          : [`https://${config.server.backendHost}`]
        )
      ],
    },
  },
}))

// CORS configuration
app.use(cors({
  origin: config.cors.allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// Security middleware
app.use(securityHeaders)
app.use(sanitizeRequest)
app.use(securityLogger)

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimiting.windowMs,
  max: config.rateLimiting.maxRequests,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api/', limiter)

// Additional API rate limiting
app.use('/api/', apiRateLimit)

// Cache headers middleware
app.use(setCacheHeaders)

// Compression middleware
app.use(compression())

// Logging middleware
app.use(morgan(config.logging.format, {
  stream: { write: (message) => logger.info(message.trim()) }
}))

// Request tracking middleware for monitoring
app.use((req, res, next) => {
  const startTime = Date.now()
  
  res.on('finish', () => {
    const responseTime = Date.now() - startTime
    monitoringService.recordRequest(responseTime, res.statusCode)
  })
  
  next()
})

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Static file serving for uploads with proper CORS configuration
app.use('/uploads', cors({
  origin: config.cors.allowedOrigins,
  credentials: true,
  methods: ['GET', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  // Remove problematic security headers for static assets
  preflightContinue: false,
  optionsSuccessStatus: 204
}), (req, res, next) => {
  // Remove problematic security headers for images
  res.removeHeader('Cross-Origin-Embedder-Policy');
  res.removeHeader('Cross-Origin-Resource-Policy');
  res.removeHeader('Cross-Origin-Opener-Policy');
  
  next();
}, express.static(config.upload.uploadPath))

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.server.nodeEnv,
  })
})

// Health check routes (no /api prefix for Docker health checks)
import healthRoutes from './routes/health'
app.use('/', healthRoutes)

// API routes
app.use('/api', routes)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  })
})

// Multer error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (error instanceof multer.MulterError) {
    let message = 'File upload error'
    
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        message = `File too large. Maximum size is ${Math.floor(config.upload.maxFileSize / (1024 * 1024))}MB`
        break
      case 'LIMIT_UNEXPECTED_FILE':
        message = 'Unexpected file field'
        break
      case 'LIMIT_FILE_COUNT':
        message = 'Too many files'
        break
      default:
        message = error.message
    }
    
    return res.status(400).json({
      success: false,
      error: 'Upload error',
      message
    })
  }
  
  // Handle other upload-related errors (like file type validation)
  if (error.message && (
    error.message.includes('Invalid file type') ||
    error.message.includes('File too large') ||
    error.message.includes('Only JPEG, PNG, and WebP images are allowed')
  )) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      message: error.message
    })
  }
  
  // Pass to generic error handler
  return next(error)
})

// Global error handler
app.use(errorHandler)

export default app