/**
 * Application configuration
 * Centralizes all environment variables and settings
 */

import { z } from 'zod'

// Environment variable validation schema
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  
  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),
  
  // Server
  PORT: z.string().transform(Number).default('3001'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // CORS
  FRONTEND_URL: z.string().url(),
  ALLOWED_ORIGINS: z.string(),
  
  // Upload
  MAX_FILE_SIZE: z.string().transform(Number).default('5242880'),
  UPLOAD_PATH: z.string().default('./uploads'),
  ALLOWED_FILE_TYPES: z.string().default('image/jpeg,image/png,image/webp'),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),
  
  // Logging
  LOG_LEVEL: z.string().default('info'),
  LOG_FORMAT: z.string().default('combined'),
  
  // Security
  BCRYPT_ROUNDS: z.string().transform(Number).default('12'),
})

// Validate environment variables
const env = envSchema.parse(process.env)

// Export configuration object
export const config = {
  database: {
    url: env.DATABASE_URL,
  },
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
    refreshSecret: env.JWT_REFRESH_SECRET,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  },
  server: {
    port: env.PORT,
    nodeEnv: env.NODE_ENV,
  },
  cors: {
    frontendUrl: env.FRONTEND_URL,
    allowedOrigins: env.ALLOWED_ORIGINS.split(','),
  },
  upload: {
    maxFileSize: env.MAX_FILE_SIZE,
    uploadPath: env.UPLOAD_PATH,
    allowedFileTypes: env.ALLOWED_FILE_TYPES.split(','),
  },
  rateLimiting: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
  },
  logging: {
    level: env.LOG_LEVEL,
    format: env.LOG_FORMAT,
  },
  security: {
    bcryptRounds: env.BCRYPT_ROUNDS,
  },
} as const