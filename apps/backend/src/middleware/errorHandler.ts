/**
 * Global error handling middleware
 * TODO: Implement comprehensive error handling
 */

import { Request, Response, NextFunction } from 'express'
import { logger } from '@/utils/logger'

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error('Error handled by global handler:', error)
  
  // Default error response
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: 'Something went wrong on the server',
  })
}