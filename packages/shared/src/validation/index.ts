import { z } from 'zod';
import { ApiErrorSchema } from '../types/api';

export class ValidationError extends Error {
  constructor(
    public readonly errors: z.ZodError,
    message = 'Validation failed'
  ) {
    super(message);
    this.name = 'ValidationError';
  }

  toApiError(): z.infer<typeof ApiErrorSchema> {
    return {
      message: this.message,
      code: 'VALIDATION_ERROR',
      details: {
        errors: this.errors.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      }
    };
  }
}

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

export function validatePartial<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  data: unknown
): z.infer<z.ZodObject<T>> {
  const partialSchema = schema.deepPartial();
  try {
    return partialSchema.parse(data);
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