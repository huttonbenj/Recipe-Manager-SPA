import request from 'supertest';
import { Request, Response, NextFunction } from 'express';
import app from '../../app';
import { AuthenticatedRequest } from '../../middleware/auth';

/* eslint-disable @typescript-eslint/no-explicit-any */

// Mock the database module
jest.mock('../../config/database', () => ({
  db: {
    query: jest.fn(),
    getClient: jest.fn(),
    healthCheck: jest.fn().mockResolvedValue(true),
    close: jest.fn().mockResolvedValue(undefined),
  }
}));

// Mock the auth utils for JWT operations
jest.mock('../../utils/auth', () => ({
  AuthUtils: {
    hashPassword: jest.fn().mockResolvedValue('$2b$10$hashedpassword'),
    comparePassword: jest.fn().mockResolvedValue(true),
    generateTokens: jest.fn().mockReturnValue({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token'
    }),
    verifyToken: jest.fn().mockReturnValue({
      userId: 'user-123',
      email: 'test@example.com'
    }),
    extractTokenFromHeader: jest.fn().mockReturnValue('mock-token'),
    validatePassword: jest.fn().mockReturnValue({ isValid: true, errors: [] })
  }
}));

// Mock the auth middleware
jest.mock('../../middleware/auth', () => ({
  authenticate: jest.fn((req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    (req as AuthenticatedRequest).user = { userId: 'user-123', email: 'test@example.com' };
    next();
  })
}));

describe('API Integration Tests', () => {
  let mockDb: { query: jest.MockedFunction<any>; getClient: jest.MockedFunction<any> };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Get references to the mocked functions
    const { db } = jest.requireMock('../../config/database');
    mockDb = db;
    
    // Setup realistic database mocks
    mockDb.query.mockImplementation((query: string, params?: string[]) => {
      // User registration
      if (query.includes('SELECT * FROM users WHERE email')) {
        return Promise.resolve([]); // User doesn't exist
      }
      
      if (query.includes('INSERT INTO users')) {
        return Promise.resolve([{
          id: 'user-123',
          email: 'test-integration@integration.test',
          name: 'Test User',
          password_hash: '$2b$10$hashedpassword',
          created_at: new Date(),
          updated_at: new Date()
        }]);
      }
      
      // User login
      if (query.includes('SELECT * FROM users WHERE email') && params?.[0] === 'test-integration@integration.test') {
        return Promise.resolve([{
          id: 'user-123',
          email: 'test-integration@integration.test',
          name: 'Test User',
          password_hash: '$2b$10$hashedpassword',
          created_at: new Date(),
          updated_at: new Date()
        }]);
      }
      
      // Recipe operations
      if (query.includes('INSERT INTO recipes')) {
        return Promise.resolve([{
          id: '550e8400-e29b-41d4-a716-446655440000',
          title: 'Test Recipe',
          description: 'A delicious test recipe',
          prep_time_minutes: 10,
          cook_time_minutes: 20,
          servings: 4,
          difficulty_level: 'easy',
          cuisine_type: 'test',
          user_id: 'user-123',
          created_at: new Date(),
          updated_at: new Date()
        }]);
      }
      
      if (query.includes('SELECT r.* FROM recipes r WHERE r.id') && params?.[0] === '550e8400-e29b-41d4-a716-446655440000') {
        return Promise.resolve([{
          id: '550e8400-e29b-41d4-a716-446655440000',
          title: 'Test Recipe',
          description: 'A delicious test recipe',
          prep_time_minutes: 10,
          cook_time_minutes: 20,
          servings: 4,
          difficulty_level: 'easy',
          cuisine_type: 'test',
          user_id: 'user-123',
          created_at: new Date(),
          updated_at: new Date()
        }]);
      }
      
      // Ingredients and steps queries
      if (query.includes('SELECT * FROM recipe_ingredients')) {
        return Promise.resolve([{
          id: 'ing-1',
          recipe_id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Test Ingredient',
          amount: 1,
          unit: 'cup',
          notes: 'Fresh',
          order_index: 1
        }]);
      }
      
      if (query.includes('SELECT * FROM recipe_steps')) {
        return Promise.resolve([{
          id: 'step-1',
          recipe_id: '550e8400-e29b-41d4-a716-446655440000',
          step_number: 1,
          instruction: 'Mix ingredients',
          time_minutes: 5,
          temperature: null
        }]);
      }
      
      // Default empty result
      return Promise.resolve([]);
    });

    // Mock client for transactions
    const mockClient = {
      query: mockDb.query,
      release: jest.fn()
    };
    mockDb.getClient.mockResolvedValue(mockClient);
  });

  describe('API Health and Basic Functionality', () => {
    it('should handle health check endpoint', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
    });

    it('should handle 404 for unknown endpoints', async () => {
      await request(app)
        .get('/api/unknown')
        .expect(404);
    });
  });

  describe('Authentication Flow', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test-integration@integration.test',
          password: 'password123',
          name: 'Test User'
        })
        .expect(201);

      expect(response.body).toMatchObject({
        message: 'User created successfully',
        user: {
          email: 'test-integration@integration.test',
          name: 'Test User'
        }
      });
    });

    it('should login with valid credentials', async () => {
      // Setup mock to return existing user for login
      mockDb.query.mockImplementationOnce((query: string) => {
        if (query.includes('SELECT id, email, password_hash')) {
          return Promise.resolve([{
            id: 'user-123',
            email: 'test-integration@integration.test',
            name: 'Test User',
            passwordHash: '$2b$10$hashedpassword', // Note: passwordHash not password_hash
            created_at: new Date(),
            updated_at: new Date()
          }]);
        }
        return Promise.resolve([]);
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test-integration@integration.test',
          password: 'password123'
        })
        .expect(200);

      expect(response.body).toMatchObject({
        message: 'Login successful',
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
        user: {
          email: 'test-integration@integration.test',
          name: 'Test User'
        }
      });
    });

    it('should reject invalid credentials', async () => {
      // Mock comparePassword to return false for invalid password
      const { AuthUtils } = jest.requireMock('../../utils/auth');
      AuthUtils.comparePassword.mockResolvedValueOnce(false);

      await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test-integration@integration.test',
          password: 'wrongpassword'
        })
        .expect(401);
    });
  });

  describe('Recipe Management', () => {
    it('should create a recipe with authentication', async () => {
      // Mock the complete transaction flow for recipe creation
      const mockClient = {
        query: jest.fn()
          .mockResolvedValueOnce({ rows: [] }) // BEGIN transaction
          .mockResolvedValueOnce({ rows: [{ // Recipe insertion
            id: '550e8400-e29b-41d4-a716-446655440000',
            title: 'Test Recipe',
            description: 'A delicious test recipe',
            prep_time_minutes: 10,
            cook_time_minutes: 20,
            servings: 4,
            difficulty_level: 'easy',
            cuisine_type: 'test',
            user_id: 'user-123',
            created_at: new Date(),
            updated_at: new Date()
          }] })
          .mockResolvedValueOnce({ rows: [{ // Ingredient insertion
            id: 'ing-1',
            recipe_id: '550e8400-e29b-41d4-a716-446655440000',
            name: 'Test Ingredient',
            amount: 1,
            unit: 'cup',
            notes: 'Fresh',
            order_index: 1
          }] })
          .mockResolvedValueOnce({ rows: [{ // Step insertion
            id: 'step-1',
            recipe_id: '550e8400-e29b-41d4-a716-446655440000',
            step_number: 1,
            instruction: 'Mix ingredients',
            time_minutes: 5,
            temperature: null
          }] })
          .mockResolvedValueOnce({ rows: [] }), // COMMIT transaction
        release: jest.fn()
      };
      
      mockDb.getClient.mockResolvedValueOnce(mockClient);

      const recipeData = {
        title: 'Test Recipe',
        description: 'A delicious test recipe',
        prepTime: 10,
        cookTime: 20,
        servings: 4,
        difficulty: 'easy',
        cuisineType: 'test',
        ingredients: [
          {
            name: 'Test Ingredient',
            amount: 1,
            unit: 'cup',
            notes: 'Fresh',
            orderIndex: 1
          }
        ],
        steps: [
          {
            stepNumber: 1,
            instruction: 'Mix ingredients',
            timeMinutes: 5
          }
        ]
      };

      const response = await request(app)
        .post('/api/recipes')
        .set('Authorization', 'Bearer mock-access-token')
        .send(recipeData)
        .expect(201);

      expect(response.body).toMatchObject({
        message: 'Recipe created successfully',
        recipe: expect.objectContaining({
          title: 'Test Recipe',
          userId: 'user-123'
        })
      });
    });

    it('should retrieve a recipe by ID', async () => {
      // Mock the recipe retrieval queries
      mockDb.query
        .mockResolvedValueOnce([{ // Recipe query
          id: '550e8400-e29b-41d4-a716-446655440000',
          title: 'Test Recipe',
          description: 'A delicious test recipe',
          prep_time_minutes: 10,
          cook_time_minutes: 20,
          servings: 4,
          difficulty_level: 'easy',
          cuisine_type: 'test',
          user_id: 'user-123',
          created_at: new Date(),
          updated_at: new Date()
        }])
        .mockResolvedValueOnce([{ // Ingredients query
          id: 'ing-1',
          recipe_id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Test Ingredient',
          amount: 1,
          unit: 'cup',
          notes: 'Fresh',
          order_index: 1
        }])
        .mockResolvedValueOnce([{ // Steps query
          id: 'step-1',
          recipe_id: '550e8400-e29b-41d4-a716-446655440000',
          step_number: 1,
          instruction: 'Mix ingredients',
          time_minutes: 5,
          temperature: null
        }]);

      const response = await request(app)
        .get('/api/recipes/550e8400-e29b-41d4-a716-446655440000')
        .expect(200);

      expect(response.body).toMatchObject({
        message: 'Recipe retrieved successfully',
        recipe: expect.objectContaining({
          id: '550e8400-e29b-41d4-a716-446655440000',
          title: 'Test Recipe'
        })
      });
    });

    it('should return 404 for non-existent recipe', async () => {
      // Mock empty result for non-existent recipe
      mockDb.query.mockImplementationOnce(() => Promise.resolve([]));
      
      await request(app)
        .get('/api/recipes/550e8400-e29b-41d4-a716-446655440001')
        .expect(404);
    });

    it('should validate recipe ID format', async () => {
      await request(app)
        .get('/api/recipes/invalid-uuid')
        .expect(400);
    });
  });

  describe('Authorization', () => {
    it('should require authentication for protected routes', async () => {
      await request(app)
        .post('/api/recipes')
        .send({
          title: 'Test Recipe',
          prepTime: 10,
          cookTime: 20,
          servings: 2,
          ingredients: [{ name: 'Test', amount: 1, unit: 'cup' }],
          steps: [{ stepNumber: 1, instruction: 'Test' }]
        })
        .expect(401);
    });

    it('should reject invalid authorization header', async () => {
      await request(app)
        .post('/api/recipes')
        .set('Authorization', 'InvalidFormat')
        .send({
          title: 'Test Recipe',
          prepTime: 10,
          cookTime: 20,
          servings: 2,
          ingredients: [{ name: 'Test', amount: 1, unit: 'cup' }],
          steps: [{ stepNumber: 1, instruction: 'Test' }]
        })
        .expect(401);
    });
  });

  describe('Input Validation', () => {
    it('should validate recipe creation input', async () => {
      await request(app)
        .post('/api/recipes')
        .set('Authorization', 'Bearer mock-access-token')
        .send({
          title: '', // Invalid: empty title
          prepTime: -5, // Invalid: negative time
          ingredients: [], // Invalid: empty ingredients
          steps: [] // Invalid: empty steps
        })
        .expect(400);
    });

    it('should validate registration input', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email', // Invalid email format
          password: '123', // Too short
          name: '' // Empty name
        })
        .expect(400);
    });
  });
}); 