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

import { config } from '@/config'
import { logger } from '@/utils/logger'
import { errorHandler } from '@/middleware/errorHandler'
import routes from '@/routes'

const app = express()

// Trust proxy for rate limiting and security
app.set('trust proxy', 1)

// Security middleware
app.use(helmet())

// CORS configuration
app.use(cors({
  origin: config.cors.allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimiting.windowMs,
  max: config.rateLimiting.maxRequests,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api/', limiter)

// Compression middleware
app.use(compression())

// Logging middleware
app.use(morgan(config.logging.format, {
  stream: { write: (message) => logger.info(message.trim()) }
}))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Static file serving for uploads
app.use('/uploads', express.static(config.upload.uploadPath))

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.server.nodeEnv,
  })
})

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

// Global error handler
app.use(errorHandler)

export default app