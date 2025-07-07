import { z } from 'zod';
import { validate, validatePartial, validateArray, ValidationError } from './index';

describe('Validation Utilities', () => {
  const TestSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    age: z.number().int().positive(),
    email: z.string().email()
  });

  describe('validate', () => {
    it('should validate valid data', () => {
      const data = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'John Doe',
        age: 30,
        email: 'john@example.com'
      };
      expect(() => validate(TestSchema, data)).not.toThrow();
    });

    it('should throw ValidationError for invalid data', () => {
      const data = {
        id: 'not-a-uuid',
        name: '',
        age: -1,
        email: 'not-an-email'
      };
      expect(() => validate(TestSchema, data)).toThrow(ValidationError);
    });
  });

  describe('validatePartial', () => {
    it('should validate partial data', () => {
      const data = {
        name: 'John Doe',
        age: 30
      };
      expect(() => validatePartial(TestSchema, data)).not.toThrow();
    });

    it('should throw ValidationError for invalid partial data', () => {
      const data = {
        name: '',
        age: -1
      };
      expect(() => validatePartial(TestSchema, data)).toThrow(ValidationError);
    });
  });

  describe('validateArray', () => {
    it('should validate array of valid items', () => {
      const data = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'John Doe',
          age: 30,
          email: 'john@example.com'
        }
      ];
      expect(() => validateArray(TestSchema, data)).not.toThrow();
    });

    it('should throw ValidationError for array with invalid items', () => {
      const data = [
        {
          id: 'not-a-uuid',
          name: '',
          age: -1,
          email: 'not-an-email'
        }
      ];
      expect(() => validateArray(TestSchema, data)).toThrow(ValidationError);
    });
  });

  describe('ValidationError', () => {
    it('should convert to ApiError format', () => {
      const data = {
        id: 'not-a-uuid',
        name: '',
        age: -1,
        email: 'not-an-email'
      };
      try {
        validate(TestSchema, data);
      } catch (error) {
        if (error instanceof ValidationError) {
          const apiError = error.toApiError();
          expect(apiError.code).toBe('VALIDATION_ERROR');
          expect(apiError.message).toBe('Validation failed');
          expect(apiError.details?.errors).toBeDefined();
          expect(Array.isArray(apiError.details?.errors)).toBe(true);
        }
      }
    });
  });
}); 