import { describe, it, expect, vi, beforeEach } from 'vitest';

declare global {
  var __mockRecipePrismaInstance: any;
}

vi.mock('../../../../utils/logger', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  }
}));

vi.mock('../../../../generated/prisma', () => {
  const mockInstance = {
    recipe: {
      create: vi.fn(),
      deleteMany: vi.fn(),
    },
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  };
  globalThis.__mockRecipePrismaInstance = mockInstance;
  return {
    PrismaClient: vi.fn(() => mockInstance)
  };
});

// Mock the sample recipes data to test edge cases
vi.mock('../../../../scripts/data/recipes', () => ({
  sampleRecipes: [
    {
      title: 'Test Recipe 1',
      ingredients: JSON.stringify(['ingredient1']),
      instructions: 'Instructions 1',
      image_url: 'http://example.com/image1.jpg',
      cook_time: 30,
      servings: 4,
      difficulty: 'Easy',
      category: 'Main Course',
      tags: JSON.stringify(['tag1']),
    },
    undefined, // This should be skipped
    {
      title: 'Test Recipe 2',
      ingredients: JSON.stringify(['ingredient2']),
      instructions: 'Instructions 2',
      image_url: 'http://example.com/image2.jpg',
      cook_time: 45,
      servings: 6,
      difficulty: 'Medium',
      category: 'Dessert',
      tags: JSON.stringify(['tag2']),
    },
  ]
}));

import { seedRecipes } from '../../../../scripts/seeders/recipeSeeder';

describe('recipeSeeder', () => {
  const mockPrisma = globalThis.__mockRecipePrismaInstance;
  const mockUsers = [
    { id: '1', name: 'Test User', email: 'test@example.com', password_hash: 'hash', created_at: new Date(), updated_at: new Date() }
  ] as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('seeds recipes for users', async () => {
    mockPrisma.recipe.deleteMany.mockResolvedValue({});
    mockPrisma.recipe.create.mockResolvedValue({ 
      title: 'Test Recipe 1', 
      description: 'Test Description',
      id: 1,
      user_id: '1'
    });
    
    await seedRecipes(mockUsers);
    expect(mockPrisma.recipe.create).toHaveBeenCalledTimes(1);
  });

  it('handles no users', async () => {
    mockPrisma.recipe.deleteMany.mockResolvedValue({});
    const recipes = await seedRecipes([]);
    expect(recipes).toEqual([]);
  });

  it('handles errors', async () => {
    mockPrisma.recipe.deleteMany.mockRejectedValueOnce(new Error('seed fail'));
    await expect(seedRecipes(mockUsers)).rejects.toThrow('seed fail');
  });

  it('skips undefined recipe data', async () => {
    mockPrisma.recipe.deleteMany.mockResolvedValue({});
    mockPrisma.recipe.create.mockResolvedValue({ 
      title: 'Test Recipe', 
      description: 'Test Description',
      id: 1,
      user_id: '1'
    });
    
    await seedRecipes(mockUsers);
    // Should only create 2 recipes (skipping the undefined one)
    expect(mockPrisma.recipe.create).toHaveBeenCalledTimes(2);
  });

  it('handles users array with null/undefined elements', async () => {
    const usersWithNulls = [
      { id: '1', name: 'Test User', email: 'test@example.com', password_hash: 'hash', created_at: new Date(), updated_at: new Date() },
      null,
      undefined
    ] as any;

    mockPrisma.recipe.deleteMany.mockResolvedValue({});
    mockPrisma.recipe.create.mockResolvedValue({ 
      title: 'Test Recipe', 
      description: 'Test Description',
      id: 1,
      user_id: '1'
    });
    
    const recipes = await seedRecipes(usersWithNulls);
    // Should still create recipes but handle null/undefined users gracefully
    expect(recipes.length).toBeGreaterThan(0);
  });
}); 