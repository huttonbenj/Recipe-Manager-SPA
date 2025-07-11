import { describe, it, expect, beforeEach } from 'vitest';
import { z } from 'zod';
import { 
  validate, 
  ValidationError, 
  validateEmail, 
  validatePassword, 
  validateRecipe, 
  validateUser,
  validateRecipeCreate,
  validateRecipeUpdate,
  validateUserCredentials,
  validateUserRegistration 
} from '../validation/index';
import { RECIPE_CONFIG } from '../constants/recipe';
import { TEST_CONFIG } from '../constants/index';
import * as core from '../validation/core';
import { ValidationError as CoreValidationError } from '../validation/errors';

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

    it('should handle special characters and edge cases', () => {
      // Test with special characters that should be valid
      expect(validateEmail('user+tag@example.com')).toBe(true);
      expect(validateEmail('user.name@example.com')).toBe(true);
      expect(validateEmail('user123@example.com')).toBe(true);
      
      // Test with invalid special characters
      expect(validateEmail('user@exam ple.com')).toBe(false);
      expect(validateEmail('user@example..com')).toBe(false);
      expect(validateEmail('user@@example.com')).toBe(false);
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

    it('should validate individual password requirements', () => {
      // Test minimum length exactly
      const exactMinLength = 'Aa1!bcde'; // exactly 8 characters
      expect(validatePassword(exactMinLength).isValid).toBe(true);
      
      // Test just under minimum length
      const underMinLength = 'Aa1!bcd'; // 7 characters
      const underResult = validatePassword(underMinLength);
      expect(underResult.isValid).toBe(false);
      expect(underResult.errors).toContain('minLength');

      // Test missing uppercase
      const noUppercase = 'password123!';
      const noUpperResult = validatePassword(noUppercase);
      expect(noUpperResult.isValid).toBe(false);
      expect(noUpperResult.errors).toContain('uppercase');

      // Test missing lowercase
      const noLowercase = 'PASSWORD123!';
      const noLowerResult = validatePassword(noLowercase);
      expect(noLowerResult.isValid).toBe(false);
      expect(noLowerResult.errors).toContain('lowercase');

      // Test missing number
      const noNumber = 'Password!';
      const noNumberResult = validatePassword(noNumber);
      expect(noNumberResult.isValid).toBe(false);
      expect(noNumberResult.errors).toContain('number');

      // Test missing special character
      const noSpecial = 'Password123';
      const noSpecialResult = validatePassword(noSpecial);
      expect(noSpecialResult.isValid).toBe(false);
      expect(noSpecialResult.errors).toContain('specialChar');
    });

    it('should handle various special characters', () => {
      const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '-', '=', '[', ']', '{', '}', ';', "'", ':', '"', '\\', '|', ',', '.', '<', '>', '/', '?'];
      
      specialChars.forEach(char => {
        const passwordWithSpecialChar = `Password123${char}`;
        const result = validatePassword(passwordWithSpecialChar);
        expect(result.isValid).toBe(true);
      });
    });

    it('should return proper error messages', () => {
      const result = validatePassword('weak');
      expect(result.message).toBe('Password does not meet requirements');
      expect(result.isValid).toBe(false);
      
      const strongResult = validatePassword('Str0ngP@ssword!');
      expect(strongResult.message).toBe('');
      expect(strongResult.isValid).toBe(true);
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
      category: string;
      image_url: string;
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
        tags: JSON.stringify(['tag1', 'tag2']),
        category: 'Main Course',
        image_url: 'https://example.com/image.jpg'
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
      const longTitle = { ...validRecipeData, title: 'A'.repeat(TEST_CONFIG.VALIDATION_TEST_LIMITS.TITLE_OVERFLOW) };
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

      // Non-number cook time
      const nonNumberCookTime = { ...validRecipeData, cook_time: 'not a number' as any };
      expect(validateRecipe(nonNumberCookTime).errors).toContain('cookTime');
    });

    it('should validate servings constraints', () => {
      // Invalid servings
      const invalidServings = { ...validRecipeData, servings: -1 };
      expect(validateRecipe(invalidServings).errors).toContain('servings');

      // Zero servings should be invalid
      const zeroServings = { ...validRecipeData, servings: 0 };
      expect(validateRecipe(zeroServings).errors).toContain('servings');

      // Non-number servings
      const nonNumberServings = { ...validRecipeData, servings: 'not a number' as any };
      expect(validateRecipe(nonNumberServings).errors).toContain('servings');
    });

    it('should validate difficulty values', () => {
      // Invalid difficulty
      const invalidDifficulty = { ...validRecipeData, difficulty: 'Invalid' };
      expect(validateRecipe(invalidDifficulty).errors).toContain('difficulty');

      // Valid difficulties
      const validDifficulties = RECIPE_CONFIG.DIFFICULTY_LEVELS;
      validDifficulties.forEach(difficulty => {
        const validData = { ...validRecipeData, difficulty };
        expect(validateRecipe(validData).isValid).toBe(true);
      });

      // Non-string difficulty
      const nonStringDifficulty = { ...validRecipeData, difficulty: 123 as any };
      expect(validateRecipe(nonStringDifficulty).errors).toContain('difficulty');
    });

    it('should validate category constraints', () => {
      // Too long category
      const longCategory = { ...validRecipeData, category: 'A'.repeat(RECIPE_CONFIG.CATEGORY.MAX_LENGTH + 1) };
      expect(validateRecipe(longCategory).errors).toContain('category');

      // Non-string category
      const nonStringCategory = { ...validRecipeData, category: 123 as any };
      expect(validateRecipe(nonStringCategory).errors).toContain('category');

      // Valid category
      const validCategory = { ...validRecipeData, category: 'Valid Category' };
      expect(validateRecipe(validCategory).isValid).toBe(true);
    });

    it('should validate image_url format', () => {
      // Invalid URL
      const invalidUrl = { ...validRecipeData, image_url: 'not-a-url' };
      expect(validateRecipe(invalidUrl).errors).toContain('imageUrl');

      // Non-string URL
      const nonStringUrl = { ...validRecipeData, image_url: 123 as any };
      expect(validateRecipe(nonStringUrl).errors).toContain('imageUrl');

      // Valid URLs
      const validUrls = [
        'https://example.com/image.jpg',
        'http://example.com/image.png',
        'https://cdn.example.com/path/to/image.gif'
      ];
      validUrls.forEach(url => {
        const validData = { ...validRecipeData, image_url: url };
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

      // Non-string tags
      const nonStringTags = { ...validRecipeData, tags: 123 as any };
      expect(validateRecipe(nonStringTags).errors).toContain('tags');
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

    it('should handle null and undefined recipe data', () => {
      expect(validateRecipe(null).isValid).toBe(false);
      expect(validateRecipe(undefined).isValid).toBe(false);
      expect(validateRecipe('not an object').isValid).toBe(false);
      expect(validateRecipe(123).isValid).toBe(false);
    });

    it('should handle empty string in required fields', () => {
      // Empty title after trim
      const emptyTitleSpaces = { ...validRecipeData, title: '   ' };
      expect(validateRecipe(emptyTitleSpaces).errors).toContain('title');

      // Empty instructions after trim
      const emptyInstructions = { ...validRecipeData, instructions: '   ' };
      expect(validateRecipe(emptyInstructions).errors).toContain('instructions');
    });
  });

  describe('validateRecipeCreate', () => {
    it('should use the same validation as validateRecipe', () => {
      const validData = {
        title: 'Test Recipe',
        ingredients: JSON.stringify(['ingredient1', 'ingredient2']),
        instructions: 'Do something.'
      };

      const result = validateRecipeCreate(validData);
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid recipe data', () => {
      const invalidData = {
        title: '', // Invalid title
        ingredients: JSON.stringify(['ingredient1']),
        instructions: 'Do something.'
      };

      const result = validateRecipeCreate(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('title');
    });
  });

  describe('validateRecipeUpdate', () => {
    it('should allow partial updates with valid fields', () => {
      const partialData = {
        title: 'Updated Recipe Title'
      };

      const result = validateRecipeUpdate(partialData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate present fields', () => {
      const invalidPartialData = {
        title: '', // Invalid title
        ingredients: JSON.stringify(['ingredient1']) // Valid ingredients
      };

      const result = validateRecipeUpdate(invalidPartialData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('title');
    });

    it('should handle ingredients validation in updates', () => {
      // Invalid ingredients JSON
      const invalidIngredients = {
        ingredients: 'invalid json'
      };
      expect(validateRecipeUpdate(invalidIngredients).errors).toContain('ingredients');

      // Non-string ingredients
      const nonStringIngredients = {
        ingredients: 123 as any
      };
      expect(validateRecipeUpdate(nonStringIngredients).errors).toContain('ingredients');

      // Valid ingredients
      const validIngredients = {
        ingredients: JSON.stringify(['ingredient1', 'ingredient2'])
      };
      expect(validateRecipeUpdate(validIngredients).isValid).toBe(true);
    });

    it('should handle instructions validation in updates', () => {
      // Empty instructions
      const emptyInstructions = {
        instructions: ''
      };
      expect(validateRecipeUpdate(emptyInstructions).errors).toContain('instructions');

      // Non-string instructions
      const nonStringInstructions = {
        instructions: 123 as any
      };
      expect(validateRecipeUpdate(nonStringInstructions).errors).toContain('instructions');

      // Valid instructions
      const validInstructions = {
        instructions: 'Updated instructions'
      };
      expect(validateRecipeUpdate(validInstructions).isValid).toBe(true);
    });

    it('should handle null and undefined data', () => {
      expect(validateRecipeUpdate(null).isValid).toBe(false);
      expect(validateRecipeUpdate(undefined).isValid).toBe(false);
      expect(validateRecipeUpdate('not an object').isValid).toBe(false);
    });

    it('should allow empty updates', () => {
      const emptyUpdate = {};
      const result = validateRecipeUpdate(emptyUpdate);
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

    it('should return valid result for user data without password', () => {
      const userData = {
        email: 'user@example.com',
        name: 'John Doe'
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

      // Name with only spaces
      const spacesNameData = {
        email: 'user@example.com',
        name: '   ',
        password: 'Str0ngP@ssword!'
      };

      const result2 = validateUser(spacesNameData);
      expect(result2.isValid).toBe(false);
      expect(result2.errors).toContain('name');
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

    it('should handle null and undefined user data', () => {
      expect(validateUser(null).isValid).toBe(false);
      expect(validateUser(undefined).isValid).toBe(false);
      expect(validateUser('not an object').isValid).toBe(false);
      expect(validateUser(123).isValid).toBe(false);
    });

    it('should handle non-string email and name', () => {
      // Non-string email
      const nonStringEmailData = {
        email: 123 as any,
        name: 'John Doe'
      };
      expect(validateUser(nonStringEmailData).errors).toContain('email');

      // Non-string name
      const nonStringNameData = {
        email: 'user@example.com',
        name: 123 as any
      };
      expect(validateUser(nonStringNameData).errors).toContain('name');
    });

    it('should handle non-string password', () => {
      const nonStringPasswordData = {
        email: 'user@example.com',
        name: 'John Doe',
        password: 123 as any
      };

      const result = validateUser(nonStringPasswordData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('password');
    });
  });

  describe('validateUserCredentials', () => {
    it('should return valid result for valid credentials', () => {
      const credentials = {
        email: 'user@example.com',
        password: 'anypassword'
      };

      const result = validateUserCredentials(credentials);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return invalid result for missing email', () => {
      const credentials = {
        password: 'anypassword'
      };

      const result = validateUserCredentials(credentials);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('email');
    });

    it('should return invalid result for missing password', () => {
      const credentials = {
        email: 'user@example.com'
      };

      const result = validateUserCredentials(credentials);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('password');
    });

    it('should validate email format', () => {
      const invalidEmailCredentials = {
        email: 'invalid-email',
        password: 'anypassword'
      };

      const result = validateUserCredentials(invalidEmailCredentials);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('email');
    });

    it('should handle null and undefined credentials', () => {
      expect(validateUserCredentials(null).isValid).toBe(false);
      expect(validateUserCredentials(undefined).isValid).toBe(false);
      expect(validateUserCredentials('not an object').isValid).toBe(false);
      expect(validateUserCredentials(123).isValid).toBe(false);
    });

    it('should handle non-string email and password', () => {
      // Non-string email
      const nonStringEmailCreds = {
        email: 123 as any,
        password: 'anypassword'
      };
      expect(validateUserCredentials(nonStringEmailCreds).errors).toContain('email');

      // Non-string password
      const nonStringPasswordCreds = {
        email: 'user@example.com',
        password: 123 as any
      };
      expect(validateUserCredentials(nonStringPasswordCreds).errors).toContain('password');
    });

    it('should handle empty string email and password', () => {
      // Empty email
      const emptyEmailCreds = {
        email: '',
        password: 'anypassword'
      };
      expect(validateUserCredentials(emptyEmailCreds).errors).toContain('email');

      // Empty password
      const emptyPasswordCreds = {
        email: 'user@example.com',
        password: ''
      };
      expect(validateUserCredentials(emptyPasswordCreds).errors).toContain('password');
    });
  });

  describe('validateUserRegistration', () => {
    it('should return valid result for complete registration data', () => {
      const registrationData = {
        email: 'user@example.com',
        name: 'John Doe',
        password: 'Str0ngP@ssword!'
      };

      const result = validateUserRegistration(registrationData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should require password for registration', () => {
      const registrationDataNoPassword = {
        email: 'user@example.com',
        name: 'John Doe'
      };

      const result = validateUserRegistration(registrationDataNoPassword);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('password');
      expect(result.message).toBe('Password is required for registration');
    });

    it('should validate all user fields', () => {
      // Invalid email
      const invalidEmailData = {
        email: 'invalid-email',
        name: 'John Doe',
        password: 'Str0ngP@ssword!'
      };
      expect(validateUserRegistration(invalidEmailData).isValid).toBe(false);

      // Empty name
      const emptyNameData = {
        email: 'user@example.com',
        name: '',
        password: 'Str0ngP@ssword!'
      };
      expect(validateUserRegistration(emptyNameData).isValid).toBe(false);

      // Weak password
      const weakPasswordData = {
        email: 'user@example.com',
        name: 'John Doe',
        password: 'weak'
      };
      expect(validateUserRegistration(weakPasswordData).isValid).toBe(false);
    });

    it('should handle null and undefined registration data', () => {
      expect(validateUserRegistration(null).isValid).toBe(false);
      expect(validateUserRegistration(undefined).isValid).toBe(false);
      expect(validateUserRegistration('not an object').isValid).toBe(false);
      expect(validateUserRegistration(123).isValid).toBe(false);
    });

    it('should handle empty string password', () => {
      const emptyPasswordData = {
        email: 'user@example.com',
        name: 'John Doe',
        password: ''
      };

      const result = validateUserRegistration(emptyPasswordData);
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

describe('validateArray', () => {
  const schema = z.object({ id: z.number(), name: z.string() });
  it('should parse valid array data', () => {
    const data = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' }
    ];
    const result = core.validateArray(schema, data);
    expect(result).toEqual(data);
  });
  it('should throw ValidationError for invalid array data', () => {
    const data = [
      { id: 1, name: 'A' },
      { id: 'bad', name: 2 }
    ];
    expect(() => core.validateArray(schema, data)).toThrow(CoreValidationError);
  });
  it('should throw ValidationError for non-array input', () => {
    expect(() => core.validateArray(schema, { id: 1, name: 'A' })).toThrow(CoreValidationError);
  });
});

describe('safeValidate', () => {
  const schema = z.object({ id: z.number(), name: z.string() });
  const safeValidate = core.safeValidate;
  it('should return isValid true and data for valid input', () => {
    const data = { id: 1, name: 'A' };
    const result = safeValidate(schema, data);
    expect(result.isValid).toBe(true);
    expect(result.data).toEqual(data);
    expect(result.errors).toEqual([]);
  });
  it('should return isValid false and errors for invalid input', () => {
    const data = { id: 'bad', name: 2 };
    const result = safeValidate(schema, data);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.message).toBeTruthy();
  });
  it('should return unknown error for non-zod error', () => {
    const badSchema = { parse: () => { throw new Error('fail'); } };
    // Cast to any to satisfy type checker
    const result = safeValidate(badSchema as any, {});
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('unknown');
    expect(result.message).toBe('Unknown validation error');
  });
});

describe('sanitizeInput', () => {
  const sanitizeInput = core.sanitizeInput;
  it('should trim whitespace', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello');
  });
  it('should remove HTML tags and quotes', () => {
    expect(sanitizeInput('<b>hi</b> "test"')).toBe('bhi/b test');
    expect(sanitizeInput("'quoted' <script>alert(1)</script>")).toBe('quoted scriptalert(1)/script');
  });
  it('should limit length to 1000 chars', () => {
    const long = 'a'.repeat(2000);
    expect(sanitizeInput(long).length).toBe(1000);
  });
  it('should handle empty string', () => {
    expect(sanitizeInput('')).toBe('');
  });
}); 