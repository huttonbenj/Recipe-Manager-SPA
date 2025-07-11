import { z } from 'zod';
import { ValidationError, ValidationResult } from './errors';

// Generic validation functions
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(error);
    }
    throw error;
  }
}

export function validateArray<T>(schema: z.ZodSchema<T>, data: unknown): T[] {
  const arraySchema = z.array(schema);
  try {
    return arraySchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(error);
    }
    throw error;
  }
}

// Safe validation functions that return results instead of throwing
export function safeValidate<T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult & { data?: T } {
  try {
    const result = schema.parse(data);
    return {
      isValid: true,
      errors: [],
      data: result
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: string[] = [];
      error.issues?.forEach(issue => {
        const fieldName = issue.path.join('.');
        // Add field name to errors for test compatibility
        if (fieldName) {
          errors.push(fieldName);
        }
        // Also add the full error message
        errors.push(fieldName + ': ' + issue.message);
      });
      
      return {
        isValid: false,
        errors: errors,
        message: error.issues?.[0]?.message || 'Validation failed'
      };
    }
    return {
      isValid: false,
      errors: ['unknown'],
      message: 'Unknown validation error'
    };
  }
}

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/['"]/g, '') // Remove quotes
    .slice(0, 1000); // Limit length
} 