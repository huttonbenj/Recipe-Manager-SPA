import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RecipeService, RecipeCreateData, RecipeUpdateData, RecipeFilters, PaginationOptions } from '../../../services/recipeService';
import { prisma } from '../../../config/database';

// Mock dependencies
vi.mock('../../../config/database', () => ({
  prisma: {
    recipe: {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      groupBy: vi.fn(),
    },
  }
}));

describe('RecipeService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllRecipes', () => {
    it('should return paginated recipes with default pagination', async () => {
      const mockRecipes = [
        {
          id: 'recipe-1',
          title: 'Recipe 1',
          ingredients: JSON.stringify(['ingredient 1']),
          instructions: 'Instructions 1',
          cook_time: 30,
          servings: 4,
          difficulty: 'Easy',
          category: 'Main Course',
          tags: JSON.stringify(['tag1']),
          user_id: 'user-1',
          created_at: new Date(),
          updated_at: new Date(),
          user: { id: 'user-1', name: 'User 1', email: 'user1@example.com' }
        }
      ];

      (prisma.recipe.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(mockRecipes);
      (prisma.recipe.count as ReturnType<typeof vi.fn>).mockResolvedValue(1);

      const result = await RecipeService.getAllRecipes();

      expect(prisma.recipe.findMany).toHaveBeenCalledWith({
        where: {},
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        skip: 0,
        take: 10,
      });

      expect(result).toEqual({
        recipes: mockRecipes,
        totalCount: 1,
        totalPages: 1,
      });
    });

    it('should filter recipes by search term', async () => {
      const filters: RecipeFilters = { search: 'pasta' };
      const mockRecipes: any[] = [];

      (prisma.recipe.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(mockRecipes);
      (prisma.recipe.count as ReturnType<typeof vi.fn>).mockResolvedValue(0);

      await RecipeService.getAllRecipes(filters);

      expect(prisma.recipe.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { title: { contains: 'pasta', mode: 'insensitive' } },
            { ingredients: { contains: 'pasta', mode: 'insensitive' } },
            { instructions: { contains: 'pasta', mode: 'insensitive' } },
          ],
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        skip: 0,
        take: 10,
      });
    });

    it('should filter recipes by category', async () => {
      const filters: RecipeFilters = { category: 'Main Course' };
      const mockRecipes: any[] = [];

      (prisma.recipe.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(mockRecipes);
      (prisma.recipe.count as ReturnType<typeof vi.fn>).mockResolvedValue(0);

      await RecipeService.getAllRecipes(filters);

      expect(prisma.recipe.findMany).toHaveBeenCalledWith({
        where: {
          category: 'Main Course',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        skip: 0,
        take: 10,
      });
    });

    it('should filter recipes by difficulty and user', async () => {
      const filters: RecipeFilters = { difficulty: 'Easy', user_id: 'user-1' };
      const mockRecipes: any[] = [];

      (prisma.recipe.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(mockRecipes);
      (prisma.recipe.count as ReturnType<typeof vi.fn>).mockResolvedValue(0);

      await RecipeService.getAllRecipes(filters);

      expect(prisma.recipe.findMany).toHaveBeenCalledWith({
        where: {
          user_id: 'user-1',
          difficulty: 'Easy',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        skip: 0,
        take: 10,
      });
    });

    it('should handle custom pagination', async () => {
      const filters: RecipeFilters = {};
      const pagination: PaginationOptions = { page: 2, limit: 5 };
      const mockRecipes: any[] = [];

      (prisma.recipe.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(mockRecipes);
      (prisma.recipe.count as ReturnType<typeof vi.fn>).mockResolvedValue(15);

      const result = await RecipeService.getAllRecipes(filters, pagination);

      expect(prisma.recipe.findMany).toHaveBeenCalledWith({
        where: {},
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        skip: 5,
        take: 5,
      });

      expect(result).toEqual({
        recipes: mockRecipes,
        totalCount: 15,
        totalPages: 3,
      });
    });
  });

  describe('getRecipeById', () => {
    it('should return recipe by ID', async () => {
      const mockRecipe = {
        id: 'recipe-1',
        title: 'Test Recipe',
        ingredients: JSON.stringify(['ingredient 1']),
        instructions: 'Test instructions',
        cook_time: 30,
        servings: 4,
        difficulty: 'Easy',
        category: 'Main Course',
        tags: JSON.stringify(['tag1']),
        user_id: 'user-1',
        created_at: new Date(),
        updated_at: new Date(),
        user: { id: 'user-1', name: 'User 1', email: 'user1@example.com' }
      };

      (prisma.recipe.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(mockRecipe);

      const result = await RecipeService.getRecipeById('recipe-1');

      expect(prisma.recipe.findUnique).toHaveBeenCalledWith({
        where: { id: 'recipe-1' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      expect(result).toEqual(mockRecipe);
    });

    it('should return null if recipe not found', async () => {
      (prisma.recipe.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      const result = await RecipeService.getRecipeById('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('createRecipe', () => {
    it('should create a new recipe successfully', async () => {
      const recipeData: RecipeCreateData = {
        title: 'New Recipe',
        ingredients: JSON.stringify(['ingredient 1', 'ingredient 2']),
        instructions: 'Mix and cook',
        cook_time: 45,
        servings: 6,
        difficulty: 'Medium',
        category: 'Main Course',
        tags: JSON.stringify(['tag1', 'tag2']),
        user_id: 'user-1',
      };

      const mockRecipe = {
        id: 'recipe-1',
        ...recipeData,
        image_url: null,
        created_at: new Date(),
        updated_at: new Date(),
        user: { id: 'user-1', name: 'User 1', email: 'user1@example.com' }
      };

      (prisma.recipe.create as ReturnType<typeof vi.fn>).mockResolvedValue(mockRecipe);

      const result = await RecipeService.createRecipe(recipeData);

      expect(prisma.recipe.create).toHaveBeenCalledWith({
        data: recipeData,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      expect(result).toEqual(mockRecipe);
    });

    it('should handle database errors', async () => {
      const recipeData: RecipeCreateData = {
        title: 'New Recipe',
        ingredients: JSON.stringify(['ingredient 1']),
        instructions: 'Test instructions',
        user_id: 'user-1',
      };

      (prisma.recipe.create as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Database error'));

      await expect(RecipeService.createRecipe(recipeData)).rejects.toThrow('Failed to create recipe');
    });
  });

  describe('updateRecipe', () => {
    it('should update recipe successfully', async () => {
      const recipeId = 'recipe-1';
      const updateData: RecipeUpdateData = {
        title: 'Updated Recipe',
        cook_time: 60,
      };

      const mockRecipe = {
        id: recipeId,
        title: 'Updated Recipe',
        ingredients: JSON.stringify(['ingredient 1']),
        instructions: 'Test instructions',
        cook_time: 60,
        servings: 4,
        difficulty: 'Easy',
        category: 'Main Course',
        tags: JSON.stringify(['tag1']),
        user_id: 'user-1',
        created_at: new Date(),
        updated_at: new Date(),
        user: { id: 'user-1', name: 'User 1', email: 'user1@example.com' }
      };

      (prisma.recipe.update as ReturnType<typeof vi.fn>).mockResolvedValue(mockRecipe);

      const result = await RecipeService.updateRecipe(recipeId, updateData);

      expect(prisma.recipe.update).toHaveBeenCalledWith({
        where: { id: recipeId },
        data: {
          ...updateData,
          updated_at: expect.any(Date),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      expect(result).toEqual(mockRecipe);
    });

    it('should handle database errors', async () => {
      const recipeId = 'recipe-1';
      const updateData: RecipeUpdateData = {
        title: 'Updated Recipe',
      };

      (prisma.recipe.update as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Database error'));

      await expect(RecipeService.updateRecipe(recipeId, updateData)).rejects.toThrow('Failed to update recipe');
    });
  });

  describe('deleteRecipe', () => {
    it('should delete recipe successfully', async () => {
      const recipeId = 'recipe-1';
      const mockRecipe = {
        id: recipeId,
        title: 'Recipe to Delete',
      };

      (prisma.recipe.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(mockRecipe);
      (prisma.recipe.delete as ReturnType<typeof vi.fn>).mockResolvedValue(mockRecipe);

      await RecipeService.deleteRecipe(recipeId);

      expect(prisma.recipe.findUnique).toHaveBeenCalledWith({
        where: { id: recipeId },
        select: { title: true },
      });
      expect(prisma.recipe.delete).toHaveBeenCalledWith({
        where: { id: recipeId },
      });
    });

    it('should throw error if recipe not found', async () => {
      const recipeId = 'non-existent-id';

      (prisma.recipe.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      await expect(RecipeService.deleteRecipe(recipeId)).rejects.toThrow('Failed to delete recipe');
      expect(prisma.recipe.delete).not.toHaveBeenCalled();
    });
  });

  describe('getUserRecipes', () => {
    it('should return user recipes with pagination', async () => {
      const userId = 'user-1';
      const mockRecipes = [
        {
          id: 'recipe-1',
          title: 'User Recipe 1',
          ingredients: JSON.stringify(['ingredient 1']),
          instructions: 'Test instructions',
          cook_time: 30,
          servings: 4,
          difficulty: 'Easy',
          category: 'Main Course',
          tags: JSON.stringify(['tag1']),
          user_id: userId,
          created_at: new Date(),
          updated_at: new Date(),
          user: { id: userId, name: 'User 1', email: 'user1@example.com' }
        }
      ];

      (prisma.recipe.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(mockRecipes);
      (prisma.recipe.count as ReturnType<typeof vi.fn>).mockResolvedValue(1);

      const result = await RecipeService.getUserRecipes(userId);

      expect(prisma.recipe.findMany).toHaveBeenCalledWith({
        where: { user_id: userId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        skip: 0,
        take: 10,
      });

      expect(result).toEqual({
        recipes: mockRecipes,
        totalCount: 1,
        totalPages: 1,
      });
    });
  });

  describe('searchRecipes', () => {
    it('should search recipes by query', async () => {
      const query = 'pasta';
      const mockRecipes: any[] = [];

      (prisma.recipe.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(mockRecipes);
      (prisma.recipe.count as ReturnType<typeof vi.fn>).mockResolvedValue(0);

      const result = await RecipeService.searchRecipes(query);

      expect(prisma.recipe.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { ingredients: { contains: query, mode: 'insensitive' } },
            { instructions: { contains: query, mode: 'insensitive' } },
            { category: { contains: query, mode: 'insensitive' } },
            { tags: { contains: query, mode: 'insensitive' } },
          ],
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        skip: 0,
        take: 10,
      });

      expect(result).toEqual({
        recipes: mockRecipes,
        totalCount: 0,
        totalPages: 0,
      });
    });
  });

  describe('getRecipesByCategory', () => {
    it('should return recipes by category', async () => {
      const category = 'Main Course';
      const mockRecipes: any[] = [];

      (prisma.recipe.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(mockRecipes);
      (prisma.recipe.count as ReturnType<typeof vi.fn>).mockResolvedValue(0);

      const result = await RecipeService.getRecipesByCategory(category);

      expect(prisma.recipe.findMany).toHaveBeenCalledWith({
        where: { category },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        skip: 0,
        take: 10,
      });

      expect(result).toEqual({
        recipes: mockRecipes,
        totalCount: 0,
        totalPages: 0,
      });
    });
  });

  describe('getRecipeCategories', () => {
    it('should return unique recipe categories', async () => {
      const mockCategories = [
        { category: 'Main Course' },
        { category: 'Dessert' },
        { category: 'Appetizer' },
      ];

      (prisma.recipe.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(mockCategories);

      const result = await RecipeService.getRecipeCategories();

      expect(prisma.recipe.findMany).toHaveBeenCalledWith({
        select: { category: true },
        distinct: ['category'],
        where: {
          category: { not: null },
        },
      });

      expect(result).toEqual(['Main Course', 'Dessert', 'Appetizer']);
    });
  });

  describe('verifyRecipeOwnership', () => {
    it('should return true if user owns the recipe', async () => {
      const recipeId = 'recipe-1';
      const userId = 'user-1';

      const mockRecipe = {
        id: recipeId,
        user_id: userId,
      };

      (prisma.recipe.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(mockRecipe);

      const result = await RecipeService.verifyRecipeOwnership(recipeId, userId);

      expect(prisma.recipe.findUnique).toHaveBeenCalledWith({
        where: { id: recipeId },
        select: { user_id: true },
      });

      expect(result).toBe(true);
    });

    it('should return false if user does not own the recipe', async () => {
      const recipeId = 'recipe-1';
      const userId = 'user-1';

      const mockRecipe = {
        id: recipeId,
        user_id: 'different-user',
      };

      (prisma.recipe.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(mockRecipe);

      const result = await RecipeService.verifyRecipeOwnership(recipeId, userId);

      expect(result).toBe(false);
    });

    it('should return false if recipe not found', async () => {
      const recipeId = 'non-existent-recipe';
      const userId = 'user-1';

      (prisma.recipe.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      const result = await RecipeService.verifyRecipeOwnership(recipeId, userId);

      expect(result).toBe(false);
    });
  });
}); 