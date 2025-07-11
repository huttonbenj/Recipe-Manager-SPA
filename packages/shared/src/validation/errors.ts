import { z } from 'zod';
import { ErrorResponseSchema } from '../types/api';

// Validation Error Class
export class ValidationError extends Error {
  constructor(
    public readonly errors: z.ZodError,
    message = 'Validation failed'
  ) {
    super(message);
    this.name = 'ValidationError';
  }

  toApiError(): z.infer<typeof ErrorResponseSchema> {
    return {
      success: false,
      error: this.message,
      details: this.errors.issues?.map(err => ({
        path: err.path.join('.'),
        message: err.message
      })) || []
    };
  }
}

// Validation Result Interfaces
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  message?: string;
}

export interface ValidationResultWithData<T> extends ValidationResult {
  sanitized?: T;
} 