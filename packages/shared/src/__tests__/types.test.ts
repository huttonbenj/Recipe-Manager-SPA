import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { UserSchema, UserCredentialsSchema, UserRegistrationSchema } from '../types/user';
import { RecipeSchema, RecipeCreateSchema, RecipeUpdateSchema } from '../types/recipe';
import { ApiResponseSchema, ErrorResponseSchema } from '../types/api';

describe('User Types', () => {
  describe('UserSchema', () => {
    it('should validate a valid user object', () => {
      const validUser = {
        id: 'user-123',
        email: 'user@example.com',
        name: 'John Doe',
        created_at: new Date(),
        updated_at: new Date()
      };

      const result = UserSchema.safeParse(validUser);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validUser);
      }
    });

    it('should reject invalid user objects', () => {
      const invalidUsers = [
        { id: '', email: 'user@example.com', name: 'John' }, // empty id
        { id: 'user-123', email: 'invalid-email', name: 'John' }, // invalid email
        { id: 'user-123', email: 'user@example.com', name: '' }, // empty name
        { id: 'user-123', email: 'user@example.com' }, // missing name
        { email: 'user@example.com', name: 'John' }, // missing id
        { id: 'user-123', name: 'John' }, // missing email
      ];

      invalidUsers.forEach((user) => {
        const result = UserSchema.safeParse(user);
        expect(result.success).toBe(false);
        expect(result.error?.issues.length).toBeGreaterThan(0);
      });
    });

    it('should handle date parsing', () => {
      const userWithStringDates = {
        id: 'user-123',
        email: 'user@example.com',
        name: 'John Doe',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z'
      };

      const result = UserSchema.safeParse(userWithStringDates);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.created_at).toBeInstanceOf(Date);
        expect(result.data.updated_at).toBeInstanceOf(Date);
      }
    });
  });

  describe('UserCredentialsSchema', () => {
    it('should validate valid login requests', () => {
      const validLogin = {
        email: 'user@example.com',
        password: 'SecureP@ssword123!'
      };

      const result = UserCredentialsSchema.safeParse(validLogin);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validLogin);
      }
    });

    it('should reject invalid login requests', () => {
      const invalidLogins = [
        { email: 'invalid-email', password: 'password' }, // invalid email
        { email: 'user@example.com', password: '' }, // empty password
        { email: 'user@example.com' }, // missing password
        { password: 'password' }, // missing email
        { email: '', password: 'password' }, // empty email
      ];

      invalidLogins.forEach((login) => {
        const result = UserCredentialsSchema.safeParse(login);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('UserRegistrationSchema', () => {
    it('should validate valid registration requests', () => {
      const validRegistration = {
        email: 'user@example.com',
        name: 'John Doe',
        password: 'SecureP@ssword123!'
      };

      const result = UserRegistrationSchema.safeParse(validRegistration);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validRegistration);
      }
    });

    it('should reject invalid registration requests', () => {
      const invalidRegistrations = [
        { email: 'invalid-email', name: 'John', password: 'password' }, // invalid email
        { email: 'user@example.com', name: '', password: 'password' }, // empty name
        { email: 'user@example.com', name: 'John', password: '' }, // empty password
        { email: 'user@example.com', name: 'John' }, // missing password
        { email: 'user@example.com', password: 'password' }, // missing name
        { name: 'John', password: 'password' }, // missing email
      ];

      invalidRegistrations.forEach((registration) => {
        const result = UserRegistrationSchema.safeParse(registration);
        expect(result.success).toBe(false);
      });
    });

    it('should validate name length constraints', () => {
      const shortName = {
        email: 'user@example.com',
        name: 'J', // too short
        password: 'SecureP@ssword123!'
      };

      const longName = {
        email: 'user@example.com',
        name: 'J'.repeat(101), // too long
        password: 'SecureP@ssword123!'
      };

      expect(UserRegistrationSchema.safeParse(shortName).success).toBe(false);
      expect(UserRegistrationSchema.safeParse(longName).success).toBe(false);
    });
  });
});

describe('Recipe Types', () => {
  describe('RecipeSchema', () => {
    it('should validate a valid recipe object', () => {
      const validRecipe = {
        id: 'recipe-123',
        title: 'Delicious Pasta',
        ingredients: JSON.stringify([
          { name: 'Pasta', amount: 1, unit: 'lb' },
          { name: 'Tomato Sauce', amount: 2, unit: 'cups' }
        ]),
        instructions: 'Cook pasta according to package directions. Heat sauce and serve.',
        image_url: 'https://example.com/pasta.jpg',
        cook_time: 30,
        servings: 4,
        difficulty: 'Easy',
        category: 'Italian',
        tags: JSON.stringify(['pasta', 'easy', 'dinner']),
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
        user_id: 'user-123',
        user: {
          id: 'user-123',
          name: 'John Doe',
          email: 'john@example.com'
        }
      };

      const result = RecipeSchema.safeParse(validRecipe);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe(validRecipe.id);
        expect(result.data.title).toBe(validRecipe.title);
        expect(result.data.difficulty).toBe('Easy');
      }
    });

    it('should reject invalid recipe objects', () => {
      const invalidRecipes = [
        { id: '', title: 'Recipe' }, // empty id
        { id: 'recipe-123', title: '' }, // empty title
        { id: 'recipe-123', title: 'A'.repeat(201) }, // title too long
        { id: 'recipe-123', title: 'Recipe', ingredients: '', instructions: '' }, // empty required fields
        { id: 'recipe-123', title: 'Recipe', ingredients: 'ingredients', instructions: 'A'.repeat(5001) }, // instructions too long
        { id: 'recipe-123', title: 'Recipe', ingredients: 'ingredients', instructions: 'instructions', difficulty: 'Invalid' }, // invalid difficulty
        { id: 'recipe-123', title: 'Recipe', ingredients: 'ingredients', instructions: 'instructions', image_url: 'not-a-url' }, // invalid URL
        { id: 'recipe-123', title: 'Recipe', ingredients: 'ingredients', instructions: 'instructions', cook_time: -1 }, // negative cook time
        { id: 'recipe-123', title: 'Recipe', ingredients: 'ingredients', instructions: 'instructions', servings: -1 }, // negative servings
      ];

      invalidRecipes.forEach((recipe) => {
        const result = RecipeSchema.safeParse(recipe);
        expect(result.success).toBe(false);
      });
    });

    it('should handle optional fields', () => {
      const minimalRecipe = {
        id: 'recipe-123',
        title: 'Simple Recipe',
        ingredients: JSON.stringify([{ name: 'Ingredient', amount: 1, unit: 'cup' }]),
        instructions: 'Mix and cook.',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
        user_id: 'user-123'
      };

      const result = RecipeSchema.safeParse(minimalRecipe);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.cook_time).toBeUndefined();
        expect(result.data.servings).toBeUndefined();
        expect(result.data.difficulty).toBeUndefined();
      }
    });
  });

  describe('RecipeCreateSchema', () => {
    it('should validate valid create recipe requests', () => {
      const validCreateRequest = {
        title: 'New Recipe',
        ingredients: JSON.stringify([
          { name: 'Ingredient 1', amount: 1, unit: 'cup' },
          { name: 'Ingredient 2', amount: 2, unit: 'tbsp' }
        ]),
        instructions: 'Step 1: Do something. Step 2: Do something else.',
        cook_time: 30,
        servings: 4,
        difficulty: 'Medium',
        category: 'Dessert',
        tags: JSON.stringify(['sweet', 'dessert'])
      };

      const result = RecipeCreateSchema.safeParse(validCreateRequest);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validCreateRequest);
      }
    });

    it('should reject invalid create recipe requests', () => {
      const invalidRequests = [
        { title: '', ingredients: 'ingredients', instructions: 'instructions' }, // empty title
        { title: 'Recipe', ingredients: '', instructions: 'instructions' }, // empty ingredients
        { title: 'Recipe', ingredients: 'ingredients', instructions: '' }, // empty instructions
        { title: 'Recipe', ingredients: 'ingredients', instructions: 'instructions', difficulty: 'Invalid' }, // invalid difficulty
        { title: 'Recipe', ingredients: 'ingredients', instructions: 'instructions', cook_time: -1 }, // negative cook time
        { title: 'Recipe', ingredients: 'ingredients', instructions: 'instructions', servings: 0 }, // zero servings
      ];

      invalidRequests.forEach((request) => {
        const result = RecipeCreateSchema.safeParse(request);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('RecipeUpdateSchema', () => {
    it('should validate valid update recipe requests', () => {
      const validUpdateRequest = {
        title: 'Updated Recipe',
        ingredients: JSON.stringify([{ name: 'Updated Ingredient', amount: 1, unit: 'cup' }]),
        instructions: 'Updated instructions.',
        cook_time: 45,
        servings: 6,
        difficulty: 'Hard',
        category: 'Updated Category'
      };

      const result = RecipeUpdateSchema.safeParse(validUpdateRequest);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validUpdateRequest);
      }
    });

    it('should allow partial updates', () => {
      const partialUpdateRequests = [
        { title: 'Updated Title' },
        { ingredients: JSON.stringify([{ name: 'New Ingredient', amount: 1, unit: 'cup' }]) },
        { instructions: 'New instructions.' },
        { cook_time: 20 },
        { servings: 2 },
        { difficulty: 'Easy' },
        { category: 'New Category' }
      ];

      partialUpdateRequests.forEach((request) => {
        const result = RecipeUpdateSchema.safeParse(request);
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid update recipe requests', () => {
      const invalidRequests = [
        { title: '' }, // empty title
        { ingredients: '' }, // empty ingredients
        { instructions: '' }, // empty instructions
        { difficulty: 'Invalid' }, // invalid difficulty
        { cook_time: -1 }, // negative cook time
        { servings: 0 }, // zero servings
      ];

      invalidRequests.forEach((request) => {
        const result = RecipeUpdateSchema.safeParse(request);
        expect(result.success).toBe(false);
      });
    });
  });
});

describe('API Types', () => {
  describe('ApiResponseSchema', () => {
    it('should validate valid API responses', () => {
      const validResponses = [
        { success: true, data: { id: 1, name: 'test' } },
        { success: false, error: 'Something went wrong' },
        { success: true, data: [], message: 'Success' },
        { success: false, error: 'Validation failed', details: [{ field: 'email', message: 'Invalid email' }] }
      ];

      validResponses.forEach((response) => {
        const result = ApiResponseSchema.safeParse(response);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.success).toBe(response.success);
        }
      });
    });

    it('should reject invalid API responses', () => {
      const invalidResponses = [
        { success: 'true' }, // success should be boolean
        { success: true, data: 'data', details: 'not an array' }, // details should be array
        {}, // missing success field
        { success: null }, // success should not be null
      ];

      invalidResponses.forEach((response) => {
        const result = ApiResponseSchema.safeParse(response);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('ErrorResponseSchema', () => {
    it('should validate valid error responses', () => {
      const validErrorResponses = [
        { success: false, error: 'Something went wrong' },
        { success: false, error: 'Validation failed', details: [{ field: 'email', message: 'Invalid' }] },
        { success: false, error: 'Not found', code: 404 },
        { success: false, error: 'Server error', timestamp: '2023-01-01T00:00:00.000Z' }
      ];

      validErrorResponses.forEach((response) => {
        const result = ErrorResponseSchema.safeParse(response);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.success).toBe(false);
          expect(result.data.error).toBeTruthy();
        }
      });
    });

    it('should reject invalid error responses', () => {
      const invalidErrorResponses = [
        { success: true, error: 'This should not work' }, // success should be false
        { success: false }, // missing error field
        { success: false, error: '' }, // empty error message
        { success: false, error: 'Error', details: 'not an array' }, // details should be array
        { success: false, error: 'Error', code: 'not a number' }, // code should be number
      ];

      invalidErrorResponses.forEach((response) => {
        const result = ErrorResponseSchema.safeParse(response);
        expect(result.success).toBe(false);
      });
    });
  });
});

describe('Type Inference', () => {
  it('should infer correct types from schemas', () => {
    // Test that TypeScript correctly infers types
    const user = UserSchema.parse({
      id: 'user-123',
      email: 'user@example.com',
      name: 'John Doe',
      created_at: new Date(),
      updated_at: new Date()
    });

    // These should compile without errors
    expect(typeof user.id).toBe('string');
    expect(typeof user.email).toBe('string');
    expect(typeof user.name).toBe('string');
    expect(user.created_at).toBeInstanceOf(Date);
    expect(user.updated_at).toBeInstanceOf(Date);
  });

  it('should handle complex nested types', () => {
    const recipe = RecipeSchema.parse({
      id: 'recipe-123',
      title: 'Test Recipe',
      ingredients: JSON.stringify([{ name: 'Ingredient', amount: 1, unit: 'cup' }]),
      instructions: 'Do something.',
      created_at: '2023-01-01T00:00:00.000Z',
      updated_at: '2023-01-01T00:00:00.000Z',
      user_id: 'user-123',
      user: {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com'
      }
    });

    expect(typeof recipe.id).toBe('string');
    expect(typeof recipe.title).toBe('string');
    expect(typeof recipe.ingredients).toBe('string');
    expect(typeof recipe.instructions).toBe('string');
    expect(typeof recipe.user_id).toBe('string');
    expect(recipe.user?.id).toBe('user-123');
  });
});

describe('Schema Composition', () => {
  it('should compose schemas correctly', () => {
    // Test that schemas can be composed and extended
    const ExtendedUserSchema = UserSchema.extend({
      isActive: z.boolean().default(true),
      lastLogin: z.date().optional()
    });

    const extendedUser = ExtendedUserSchema.parse({
      id: 'user-123',
      email: 'user@example.com',
      name: 'John Doe',
      created_at: new Date(),
      updated_at: new Date(),
      lastLogin: new Date()
    });

    expect(extendedUser.isActive).toBe(true);
    expect(extendedUser.lastLogin).toBeInstanceOf(Date);
  });

  it('should handle schema picking and omitting', () => {
    const UserIdSchema = UserSchema.pick({ id: true });
    const UserWithoutDatesSchema = UserSchema.omit({ created_at: true, updated_at: true });

    const userId = UserIdSchema.parse({ id: 'user-123' });
    expect(userId.id).toBe('user-123');

    const userWithoutDates = UserWithoutDatesSchema.parse({
      id: 'user-123',
      email: 'user@example.com',
      name: 'John Doe'
    });

    expect(userWithoutDates.id).toBe('user-123');
    expect(userWithoutDates.email).toBe('user@example.com');
    expect(userWithoutDates.name).toBe('John Doe');
  });
}); 