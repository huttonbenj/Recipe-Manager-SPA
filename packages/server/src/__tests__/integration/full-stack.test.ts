import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../app';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

describe('Full Stack Integration', () => {
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    // Ensure database is connected
    await prisma.$connect();
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.$disconnect();
  });

  describe('Authentication Flow', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'admin123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.tokens.accessToken).toBeDefined();
      expect(response.body.data.user.email).toBe('admin@example.com');
      
      // Store for later tests
      authToken = response.body.data.tokens.accessToken;
      userId = response.body.data.user.id;
    });

    it('should fail login with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Recipe Management', () => {
    it('should fetch all recipes without authentication', async () => {
      const response = await request(app)
        .get('/api/recipes');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.pagination).toBeDefined();
    });

    it('should fetch a single recipe by ID', async () => {
      // First get all recipes to get a valid ID
      const recipesResponse = await request(app)
        .get('/api/recipes');
      
      const recipeId = recipesResponse.body.data[0].id;

      const response = await request(app)
        .get(`/api/recipes/${recipeId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(recipeId);
      expect(response.body.data.title).toBeDefined();
      expect(response.body.data.ingredients).toBeDefined();
      expect(response.body.data.instructions).toBeDefined();
    });

    it('should create a new recipe with authentication', async () => {
      const newRecipe = {
        title: 'Integration Test Recipe',
        ingredients: JSON.stringify(['1 cup test ingredient', '2 tbsp test spice']),
        instructions: 'Mix ingredients and test.',
        cook_time: 30,
        servings: 4,
        difficulty: 'Easy',
        category: 'Test',
        tags: JSON.stringify(['Test', 'Integration'])
      };

      const response = await request(app)
        .post('/api/recipes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newRecipe);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(newRecipe.title);
      expect(response.body.data.user_id).toBe(userId);
    });

    it('should fail to create recipe without authentication', async () => {
      const newRecipe = {
        title: 'Unauthorized Recipe',
        ingredients: JSON.stringify(['1 cup test ingredient']),
        instructions: 'This should fail.',
        cook_time: 30,
        servings: 4,
        difficulty: 'Easy',
        category: 'Test'
      };

      const response = await request(app)
        .post('/api/recipes')
        .send(newRecipe);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('User Profile', () => {
    it('should fetch user profile with authentication', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(userId);
      expect(response.body.data.email).toBe('admin@example.com');
    });

    it('should fail to fetch profile without authentication', async () => {
      const response = await request(app)
        .get('/api/users/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Data Validation', () => {
    it('should validate recipe data structure', async () => {
      const recipesResponse = await request(app)
        .get('/api/recipes');

      const recipes = recipesResponse.body.data;
      
      // Define expected recipe schema
      const recipeSchema = z.object({
        id: z.string(),
        title: z.string(),
        ingredients: z.string(),
        instructions: z.string(),
        cook_time: z.number(),
        servings: z.number(),
        difficulty: z.string(),
        category: z.string(),
        created_at: z.string(),
        updated_at: z.string(),
        user_id: z.string(),
        user: z.object({
          id: z.string(),
          name: z.string(),
          email: z.string()
        })
      });

      // Validate each recipe
      recipes.forEach((recipe: any) => {
        expect(() => recipeSchema.parse(recipe)).not.toThrow();
      });
    });

    it('should return proper error for invalid recipe data', async () => {
      const invalidRecipe = {
        title: '', // Empty title should fail validation
        ingredients: 'not-json',
        instructions: '',
        cook_time: -1, // Invalid cook time
        servings: 0 // Invalid servings
      };

      const response = await request(app)
        .post('/api/recipes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidRecipe);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('Database Health', () => {
    it('should have seeded data in database', async () => {
      const users = await prisma.user.count();
      const recipes = await prisma.recipe.count();

      expect(users).toBeGreaterThanOrEqual(3); // At least 3 seed users
      expect(recipes).toBeGreaterThanOrEqual(10); // At least 10 seed recipes
    });
  });

  describe('API Response Format', () => {
    it('should return consistent success response format', async () => {
      const response = await request(app)
        .get('/api/recipes');

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
    });

    it('should return consistent error response format', async () => {
      const response = await request(app)
        .get('/api/recipes/invalid-id');

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBeDefined();
    });
  });
}); 