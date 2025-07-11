/// <reference types="vitest/globals" />
import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { HTTP_STATUS } from '@recipe-manager/shared';

// Mock dependencies before any other imports
vi.mock('../../../../services/recipeService', () => ({
  RecipeService: {
    getRecipeCategories: vi.fn(),
    getRecipesByCategory: vi.fn(),
  },
}));

vi.mock('../../../../middleware/validation', () => ({
  validateParams: () => (_req: express.Request, _res: express.Response, next: express.NextFunction) => next(),
  validateQuery: () => (_req: express.Request, _res: express.Response, next: express.NextFunction) => next(),
}));

// Now import the code that uses the mocks
import router from '../../../../routes/recipes/categories';
import { RecipeService } from '../../../../services/recipeService';

const setupApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/', router);
  return app;
};

describe('Recipes Categories Router Unit', () => {
  let app: express.Express;

  beforeEach(() => {
    app = setupApp();
    vi.clearAllMocks();
  });

  describe('GET /categories', () => {
    it('should return all recipe categories successfully', async () => {
      const mockCategories = ['Main Course', 'Dessert', 'Appetizer', 'Salad'];
      (RecipeService.getRecipeCategories as any).mockResolvedValue(mockCategories);

      const res = await request(app).get('/categories');

      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(mockCategories);
      expect(RecipeService.getRecipeCategories).toHaveBeenCalledTimes(1);
    });

    it('should handle empty categories list', async () => {
      (RecipeService.getRecipeCategories as any).mockResolvedValue([]);

      const res = await request(app).get('/categories');

      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
    });

    it('should handle service errors', async () => {
      (RecipeService.getRecipeCategories as any).mockRejectedValue(new Error('Database error'));

      const res = await request(app).get('/categories');

      expect(res.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    });
  });

  describe('GET /category/:category', () => {
    const mockRecipes = [
      {
        id: 'recipe-1',
        title: 'Pasta Carbonara',
        category: 'Main Course',
        user: { id: 'user-1', name: 'Chef John', email: 'chef@example.com' },
        created_at: '2025-07-11T09:58:11.183Z',
        updated_at: '2025-07-11T09:58:11.183Z',
      },
      {
        id: 'recipe-2',
        title: 'Spaghetti Bolognese',
        category: 'Main Course',
        user: { id: 'user-2', name: 'Chef Mary', email: 'mary@example.com' },
        created_at: '2025-07-11T09:58:11.183Z',
        updated_at: '2025-07-11T09:58:11.183Z',
      },
    ];

    it('should return recipes by category with default pagination', async () => {
      const mockResult = {
        recipes: mockRecipes,
        totalCount: 2,
        totalPages: 1,
      };

      (RecipeService.getRecipesByCategory as any).mockResolvedValue(mockResult);

      const res = await request(app).get('/category/Main%20Course');

      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(mockRecipes);
      expect(res.body.pagination).toEqual({
        page: 1,
        limit: 10,
        totalCount: 2,
        totalPages: 1,
      });
      expect(RecipeService.getRecipesByCategory).toHaveBeenCalledWith('Main Course', { page: 1, limit: 10 });
    });

    it('should return recipes by category with custom pagination', async () => {
      const mockResult = {
        recipes: mockRecipes.slice(0, 1),
        totalCount: 2,
        totalPages: 2,
      };

      (RecipeService.getRecipesByCategory as any).mockResolvedValue(mockResult);

      const res = await request(app).get('/category/Main%20Course?page=2&limit=1');

      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(mockResult.recipes);
      expect(res.body.pagination).toEqual({
        page: 2,
        limit: 1,
        totalCount: 2,
        totalPages: 2,
      });
      expect(RecipeService.getRecipesByCategory).toHaveBeenCalledWith('Main Course', { page: 2, limit: 1 });
    });

    it('should handle empty results for category', async () => {
      const mockResult = {
        recipes: [],
        totalCount: 0,
        totalPages: 0,
      };

      (RecipeService.getRecipesByCategory as any).mockResolvedValue(mockResult);

      const res = await request(app).get('/category/NonExistentCategory');

      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
      expect(res.body.pagination.totalCount).toBe(0);
    });

    it('should handle service errors for category recipes', async () => {
      (RecipeService.getRecipesByCategory as any).mockRejectedValue(new Error('Database error'));

      const res = await request(app).get('/category/Main%20Course');

      expect(res.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    });

    it('should handle URL encoded category names', async () => {
      const mockResult = {
        recipes: [],
        totalCount: 0,
        totalPages: 0,
      };

      (RecipeService.getRecipesByCategory as any).mockResolvedValue(mockResult);

      const res = await request(app).get('/category/Side%20Dish');

      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(RecipeService.getRecipesByCategory).toHaveBeenCalledWith('Side Dish', { page: 1, limit: 10 });
    });
  });
}); 