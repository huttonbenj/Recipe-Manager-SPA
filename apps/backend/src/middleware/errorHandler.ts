/**
 * Global error handling middleware
 * Comprehensive error handling with proper classification, logging, and response formatting
 */

import { Request, Response, NextFunction } from 'express'
import { Prisma } from '@prisma/client'
import { ValidationError, NotFoundError, UnauthorizedError, ForbiddenError } from '../types'

interface ErrorResponse {
  success: false
  error: string
  message: string
  statusCode: number
  timestamp: string
  path: string
  details?: any
}

/**
 * Global error handling middleware
 * Handles all types of errors and formats them consistently
 */
export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const timestamp = new Date().toISOString()
  const path = req.originalUrl

  let statusCode = 500
  let errorType = 'Internal Server Error'
  let message = 'Something went wrong on the server'
  let details: any = undefined

  // Log the error for debugging
  console.error(`[${timestamp}] Error on ${req.method} ${path}:`, error)

  // Handle different types of errors
  if (error instanceof ValidationError) {
    statusCode = 400
    errorType = 'Validation Error'
    message = error.message
    if (error.field) {
      details = { field: error.field }
    }
  }
  
  else if (error instanceof NotFoundError) {
    statusCode = 404
    errorType = 'Not Found'
    message = error.message
  }
  
  else if (error instanceof UnauthorizedError) {
    statusCode = 401
    errorType = 'Unauthorized'
    message = error.message
  }
  
  else if (error instanceof ForbiddenError) {
    statusCode = 403
    errorType = 'Forbidden'
    message = error.message
  }
  
  // Handle Joi validation errors
  else if (error.isJoi) {
    statusCode = 400
    errorType = 'Validation Error'
    message = 'Invalid input data'
    details = {
      issues: error.details?.map((err: any) => ({
        field: err.path?.join('.') || err.context?.key,
        message: err.message,
        type: err.type
      }))
    }
  }
  
  // Handle Prisma errors
  else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        statusCode = 409
        errorType = 'Conflict'
        message = 'A record with this data already exists'
        details = { 
          constraint: error.meta?.target,
          field: Array.isArray(error.meta?.target) ? error.meta?.target[0] : error.meta?.target
        }
        break
      
      case 'P2025':
        statusCode = 404
        errorType = 'Not Found'
        message = 'Record not found'
        break
      
      case 'P2003':
        statusCode = 400
        errorType = 'Foreign Key Constraint'
        message = 'Referenced record does not exist'
        details = { field: error.meta?.field_name }
        break
      
      case 'P2014':
        statusCode = 400
        errorType = 'Invalid Relation'
        message = 'The change you are trying to make would violate the required relation'
        break
      
      default:
        statusCode = 500
        errorType = 'Database Error'
        message = 'Database operation failed'
        if (process.env.NODE_ENV === 'development') {
          details = { code: error.code, meta: error.meta }
        }
    }
  }
  
  // Handle Prisma validation errors
  else if (error instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400
    errorType = 'Validation Error'
    message = 'Invalid data provided to database'
    if (process.env.NODE_ENV === 'development') {
      details = { originalError: error.message }
    }
  }
  
  // Handle JWT errors
  else if (error.name === 'JsonWebTokenError') {
    statusCode = 401
    errorType = 'Invalid Token'
    message = 'Invalid authentication token'
  }
  
  else if (error.name === 'TokenExpiredError') {
    statusCode = 401
    errorType = 'Token Expired'
    message = 'Authentication token has expired'
  }
  
  // Handle Multer errors (file upload)
  else if (error.code === 'LIMIT_FILE_SIZE') {
    statusCode = 413
    errorType = 'File Too Large'
    message = 'Uploaded file exceeds size limit'
  }
  
  else if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    statusCode = 400
    errorType = 'Invalid File'
    message = 'Unexpected file field or too many files'
  }
  
  // Handle syntax errors (malformed JSON, etc.)
  else if (error instanceof SyntaxError && 'body' in error) {
    statusCode = 400
    errorType = 'Syntax Error'
    message = 'Invalid JSON in request body'
  }
  
  // Handle generic HTTP errors
  else if (error.statusCode || error.status) {
    statusCode = error.statusCode || error.status
    errorType = error.name || 'HTTP Error'
    message = error.message || 'Request failed'
  }
  
  // Handle unknown errors
  else {
    statusCode = 500
    errorType = 'Internal Server Error'
    message = process.env.NODE_ENV === 'development' 
      ? error.message || 'Something went wrong on the server'
      : 'Something went wrong on the server'
    
    if (process.env.NODE_ENV === 'development') {
      details = {
        stack: error.stack,
        name: error.name
      }
    }
  }

  // Create error response
  const errorResponse: ErrorResponse = {
    success: false,
    error: errorType,
    message,
    statusCode,
    timestamp,
    path
  }

  // Add details if available
  if (details) {
    errorResponse.details = details
  }

  // Send error response
  res.status(statusCode).json(errorResponse)
}

/**
 * 404 Not Found handler for unmatched routes
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  const errorResponse: ErrorResponse = {
    success: false,
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
    statusCode: 404,
    timestamp: new Date().toISOString(),
    path: req.originalUrl
  }

  res.status(404).json(errorResponse)
}

/**
 * Async error wrapper to catch errors in async route handlers
 */
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}