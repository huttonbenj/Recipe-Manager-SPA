// @ts-nocheck
import { beforeEach, afterEach, vi } from 'vitest';
import { PrismaClient, Prisma } from '@prisma/client';
import logger from '../../utils/logger';

// Mock logger for tests
vi.mock('../../utils/logger', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  }
}));

// Mock environment variables
vi.stubEnv('NODE_ENV', 'test');
vi.stubEnv('JWT_SECRET', 'test-jwt-secret');
vi.stubEnv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/recipe_manager_test');
vi.stubEnv('SKIP_MSW', 'true');

// Create a test database client
let prisma: PrismaClient;

beforeEach(async () => {
  // Reset all mocks before each test
  vi.clearAllMocks();
  
  // Create fresh database client for each test
  if (!process.env.SKIP_DB_TESTS) {
    prisma = new PrismaClient({
      log: ['error'],
      errorFormat: 'minimal',
    });
    await prisma.$connect();
  }
});

afterEach(async () => {
  // Clean up database after each test
  if (prisma && !process.env.SKIP_DB_TESTS) {
    try {
      // Clean up test data
      await prisma.recipe.deleteMany({});
      await prisma.user.deleteMany({});
      await prisma.$disconnect();
    } catch (error) {
      logger.error('Error cleaning up test database:', error);
    }
  }
});

// Export test utilities
export { prisma };

// Types for test utilities
type TestUserData = Partial<Prisma.UserUncheckedCreateInput>;

interface TestRecipeData {
  title?: string;
  ingredients?: string;
  instructions?: string;
  cook_time?: number;
  servings?: number;
  difficulty?: string;
  category?: string;
  tags?: string;
  image_url?: string;
}

// Global test utilities
export const testUtils = {
  createTestUser: async (overrides: TestUserData = {}) => {
    if (process.env.SKIP_DB_TESTS) return null;
    
    const defaultUser = {
      email: 'test@example.com',
      password_hash: 'hashedpassword123',
      name: 'Test User',
      ...overrides
    };
    
    return await prisma.user.create({
      data: defaultUser as unknown as Prisma.UserCreateInput
    });
  },
  
  createTestRecipe: async (userId: string, overrides: TestRecipeData = {}) => {
    if (process.env.SKIP_DB_TESTS) return null;
    
    const defaultRecipe = {
      title: 'Test Recipe',
      ingredients: JSON.stringify(['1 cup flour', '2 eggs']),
      instructions: 'Mix ingredients. Bake at 350°F for 30 minutes.',
      cook_time: 30,
      servings: 4,
      difficulty: 'Medium',
      category: 'Main Course',
      tags: JSON.stringify(['test', 'recipe']),
      user_id: userId,
      ...overrides
    };
    
    return await prisma.recipe.create({
      data: defaultRecipe as unknown as Prisma.RecipeCreateInput
    });
  },
  
  // Mock request and response objects
  mockRequest: (overrides: Record<string, unknown> = {}) => ({
    body: {},
    params: {},
    query: {},
    headers: {},
    user: null,
    ...overrides
  }),
  
  mockResponse: () => {
    const res = {} as Record<string, unknown>;
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    res.send = vi.fn().mockReturnValue(res);
    res.cookie = vi.fn().mockReturnValue(res);
    res.clearCookie = vi.fn().mockReturnValue(res);
    return res;
  },
  
  mockNext: () => vi.fn()
}; 