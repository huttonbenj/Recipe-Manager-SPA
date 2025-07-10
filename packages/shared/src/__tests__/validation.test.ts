import { describe, it, expect, beforeEach } from 'vitest';
import { z } from 'zod';
import { 
  validate, 
  ValidationError, 
  validateEmail, 
  validatePassword, 
  validateRecipe, 
  validateUser 
} from '../validation/index';

describe('Validation Functions', () => {
  describe('validateEmail', () => {
    it('should return true for valid email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'user123@test-domain.com',
        'firstname.lastname@company.com.au'
      ];

      validEmails.forEach(email => {
        expect(validateEmail(email)).toBe(true);
      });
    });

    it('should return false for invalid email addresses', () => {
      const invalidEmails = [
        'invalid-email',
        '@domain.com',
        'user@',
        'user..name@domain.com',
        'user@domain',
        'user@domain.',
        'user name@domain.com',
        '',
        ' ',
        'user@domain..com'
      ];

      invalidEmails.forEach(email => {
        expect(validateEmail(email)).toBe(false);
      });
    });

    it('should handle edge cases', () => {
      expect(validateEmail('   test@example.com   ')).toBe(true); // whitespace trimmed
      expect(validateEmail('Test@Example.COM')).toBe(true); // case insensitive
    });
  });

  describe('validatePassword', () => {
    it('should return valid result for strong passwords', () => {
      const strongPasswords = [
        'Str0ngP@ssword!',
        'MySecure123!',
        'C0mpl3x#Pass',
        'Test123!@#'
      ];

      strongPasswords.forEach(password => {
        const result = validatePassword(password);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
        expect(result.message).toBe('');
      });
    });

    it('should return invalid result for weak passwords', () => {
      const weakPasswords = [
        { password: 'weak', expectedErrors: ['minLength', 'uppercase', 'number', 'specialChar'] },
        { password: 'weakpassword', expectedErrors: ['uppercase', 'number', 'specialChar'] },
        { password: 'WeakPassword', expectedErrors: ['number', 'specialChar'] },
        { password: 'WeakPassword123', expectedErrors: ['specialChar'] },
        { password: 'weakpassword123!', expectedErrors: ['uppercase'] },
        { password: 'WEAKPASSWORD123!', expectedErrors: ['lowercase'] }
      ];

      weakPasswords.forEach(({ password, expectedErrors }) => {
        const result = validatePassword(password);
        expect(result.isValid).toBe(false);
        expect(result.errors).toEqual(expect.arrayContaining(expectedErrors));
        expect(result.message).toBeTruthy();
      });
    });

    it('should handle edge cases', () => {
      expect(validatePassword('').isValid).toBe(false);
      expect(validatePassword('   ').isValid).toBe(false);
      expect(validatePassword('1234567').isValid).toBe(false); // too short
    });
  });

  describe('validateRecipe', () => {
    let validRecipeData: {
      title: string;
      ingredients: string;
      instructions: string;
      cook_time: number;
      servings: number;
      difficulty: string;
      tags: string;
    };

    beforeEach(() => {
      validRecipeData = {
        title: 'Test Recipe',
        ingredients: JSON.stringify([
          { name: 'Ingredient 1', amount: 1, unit: 'cup' },
          { name: 'Ingredient 2', amount: 2, unit: 'tbsp' }
        ]),
        instructions: 'Step 1: Do something. Step 2: Do something else.',
        cook_time: 30,
        servings: 4,
        difficulty: 'Easy',
        tags: JSON.stringify(['tag1', 'tag2'])
      };
    });

    it('should return valid result for complete recipe data', () => {
      const result = validateRecipe(validRecipeData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return invalid result for missing required fields', () => {
      const requiredFields = ['title', 'ingredients', 'instructions'];
      
      requiredFields.forEach(field => {
        const incompleteData = { ...validRecipeData };
        delete (incompleteData as Record<string, unknown>)[field];
        
        const result = validateRecipe(incompleteData);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain(field);
      });
    });

    it('should validate title constraints', () => {
      // Empty title
      const emptyTitle = { ...validRecipeData, title: '' };
      expect(validateRecipe(emptyTitle).errors).toContain('title');

      // Too short title
      const shortTitle = { ...validRecipeData, title: 'AB' };
      expect(validateRecipe(shortTitle).errors).toContain('titleLength');

      // Too long title
      const longTitle = { ...validRecipeData, title: 'A'.repeat(201) };
      expect(validateRecipe(longTitle).errors).toContain('titleLength');
    });

    it('should validate ingredients format', () => {
      // Invalid JSON
      const invalidJson = { ...validRecipeData, ingredients: 'invalid json' };
      expect(validateRecipe(invalidJson).errors).toContain('ingredients');

      // Empty array
      const emptyArray = { ...validRecipeData, ingredients: JSON.stringify([]) };
      expect(validateRecipe(emptyArray).errors).toContain('ingredients');

      // Not an array
      const notArray = { ...validRecipeData, ingredients: JSON.stringify('not array') };
      expect(validateRecipe(notArray).errors).toContain('ingredients');
    });

    it('should validate cook_time constraints', () => {
      // Invalid cook time
      const invalidCookTime = { ...validRecipeData, cook_time: -1 };
      expect(validateRecipe(invalidCookTime).errors).toContain('cookTime');

      // Zero cook time should be invalid
      const zeroCookTime = { ...validRecipeData, cook_time: 0 };
      expect(validateRecipe(zeroCookTime).errors).toContain('cookTime');
    });

    it('should validate servings constraints', () => {
      // Invalid servings
      const invalidServings = { ...validRecipeData, servings: -1 };
      expect(validateRecipe(invalidServings).errors).toContain('servings');

      // Zero servings should be invalid
      const zeroServings = { ...validRecipeData, servings: 0 };
      expect(validateRecipe(zeroServings).errors).toContain('servings');
    });

    it('should validate difficulty values', () => {
      // Invalid difficulty
      const invalidDifficulty = { ...validRecipeData, difficulty: 'Invalid' };
      expect(validateRecipe(invalidDifficulty).errors).toContain('difficulty');

      // Valid difficulties
      const validDifficulties = ['Easy', 'Medium', 'Hard'];
      validDifficulties.forEach(difficulty => {
        const validData = { ...validRecipeData, difficulty };
        expect(validateRecipe(validData).isValid).toBe(true);
      });
    });

    it('should validate tags format', () => {
      // Invalid tags JSON
      const invalidTagsJson = { ...validRecipeData, tags: 'invalid json' };
      expect(validateRecipe(invalidTagsJson).errors).toContain('tags');

      // Tags not an array
      const tagsNotArray = { ...validRecipeData, tags: JSON.stringify('not array') };
      expect(validateRecipe(tagsNotArray).errors).toContain('tags');
    });

    it('should handle optional fields', () => {
      const minimalData = {
        title: 'Minimal Recipe',
        ingredients: JSON.stringify([{ name: 'Ingredient', amount: 1, unit: 'cup' }]),
        instructions: 'Do something.'
      };

      const result = validateRecipe(minimalData);
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateUser', () => {
    it('should return valid result for complete user data', () => {
      const userData = {
        email: 'user@example.com',
        name: 'John Doe',
        password: 'Str0ngP@ssword!'
      };

      const result = validateUser(userData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return invalid result for missing required fields', () => {
      const requiredFields = ['email', 'name'];
      
      requiredFields.forEach(field => {
        const incompleteData = {
          email: 'user@example.com',
          name: 'John Doe'
        };
        delete (incompleteData as Record<string, unknown>)[field];
        
        const result = validateUser(incompleteData);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain(field);
      });
    });

    it('should validate email format', () => {
      const invalidEmailData = {
        email: 'invalid-email',
        name: 'John Doe',
        password: 'Str0ngP@ssword!'
      };

      const result = validateUser(invalidEmailData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('email');
    });

    it('should validate name constraints', () => {
      // Empty name
      const emptyNameData = {
        email: 'user@example.com',
        name: '',
        password: 'Str0ngP@ssword!'
      };

      const result = validateUser(emptyNameData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('name');
    });

    it('should validate password strength', () => {
      const weakPasswordData = {
        email: 'user@example.com',
        name: 'John Doe',
        password: 'weak'
      };

      const result = validateUser(weakPasswordData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('password');
    });
  });
});

describe('ValidationError Class', () => {
  it('should create ValidationError with proper properties', () => {
    const schema = z.object({
      name: z.string().min(1),
      age: z.number().min(18)
    });

    try {
      validate(schema, { name: '', age: 16 });
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      if (error instanceof ValidationError) {
        expect(error.name).toBe('ValidationError');
        expect(error.message).toBe('Validation failed');
        expect(error.errors).toBeDefined();
      }
    }
  });

  it('should convert to API error format', () => {
    const schema = z.object({
      name: z.string().min(1),
      age: z.number().min(18)
    });

    try {
      validate(schema, { name: '', age: 16 });
    } catch (error) {
      if (error instanceof ValidationError) {
        const apiError = error.toApiError();
        expect(apiError.success).toBe(false);
        expect(apiError.error).toBe('Validation failed');
        expect(apiError.details).toBeDefined();
        expect(Array.isArray(apiError.details)).toBe(true);
      }
    }
  });
});

describe('validate function', () => {
  it('should return parsed data when validation succeeds', () => {
    const schema = z.object({
      name: z.string(),
      age: z.number()
    });

    const data = { name: 'John', age: 25 };
    const result = validate(schema, data);
    
    expect(result).toEqual(data);
  });

  it('should throw ValidationError when validation fails', () => {
    const schema = z.object({
      name: z.string().min(1),
      age: z.number().min(18)
    });

    const data = { name: '', age: 16 };
    
    expect(() => validate(schema, data)).toThrow(ValidationError);
  });

  it('should handle complex nested validation', () => {
    const schema = z.object({
      user: z.object({
        name: z.string().min(1),
        email: z.string().email()
      }),
      recipes: z.array(z.object({
        title: z.string().min(1),
        ingredients: z.array(z.string())
      }))
    });

    const validData = {
      user: {
        name: 'John Doe',
        email: 'john@example.com'
      },
      recipes: [
        {
          title: 'Test Recipe',
          ingredients: ['ingredient1', 'ingredient2']
        }
      ]
    };

    const result = validate(schema, validData);
    expect(result).toEqual(validData);

    const invalidData = {
      user: {
        name: '',
        email: 'invalid-email'
      },
      recipes: [
        {
          title: '',
          ingredients: []
        }
      ]
    };

    expect(() => validate(schema, invalidData)).toThrow(ValidationError);
  });
}); 