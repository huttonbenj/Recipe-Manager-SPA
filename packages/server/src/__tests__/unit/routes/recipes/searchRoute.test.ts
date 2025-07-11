/// <reference types="vitest/globals" />
import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { HTTP_STATUS } from '@recipe-manager/shared';

// Mock dependencies before any other imports
vi.mock('../../../../services/recipeService', () => ({
  RecipeService: {
    getAllRecipes: vi.fn(),
    searchRecipes: vi.fn(),
  },
}));

vi.mock('../../../../middleware/validation', () => ({
  validateQuery: () => (_req: express.Request, _res: express.Response, next: express.NextFunction) => next(),
}));

// Now import the code that uses the mocks
import router from '../../../../routes/recipes/search';
import { RecipeService } from '../../../../services/recipeService';

const mockRecipes = [
  {
    id: 'recipe-1',
    title: 'Pasta Carbonara',
    ingredients: JSON.stringify(['pasta', 'eggs', 'bacon']),
    instructions: 'Cook pasta, mix with eggs and bacon',
    category: 'Main Course',
    difficulty: 'Easy',
    user: { id: 'user-1', name: 'Chef John', email: 'chef@example.com' },
    created_at: '2025-07-11T09:58:11.180Z',
    updated_at: '2025-07-11T09:58:11.180Z',
  },
  {
    id: 'recipe-2',
    title: 'Chocolate Cake',
    ingredients: JSON.stringify(['flour', 'chocolate', 'sugar']),
    instructions: 'Mix ingredients and bake',
    category: 'Dessert',
    difficulty: 'Medium',
    user: { id: 'user-2', name: 'Chef Mary', email: 'mary@example.com' },
    created_at: '2025-07-11T09:58:11.180Z',
    updated_at: '2025-07-11T09:58:11.180Z',
  },
];

const setupApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/', router);
  return app;
};

describe('Recipes Search Router Unit', () => {
  let app: express.Express;

  beforeEach(() => {
    app = setupApp();
    vi.clearAllMocks();
  });

  describe('GET /', () => {
    it('should return all recipes with default pagination', async () => {
      const mockResult = {
        recipes: mockRecipes,
        totalCount: 2,
        totalPages: 1,
      };

      (RecipeService.getAllRecipes as any).mockResolvedValue(mockResult);

      const res = await request(app).get('/');

      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(mockRecipes);
      expect(res.body.pagination).toEqual({
        page: 1,
        limit: 10,
        totalCount: 2,
        totalPages: 1,
      });
      expect(RecipeService.getAllRecipes).toHaveBeenCalledWith(
        { search: undefined, category: undefined, difficulty: undefined },
        { page: 1, limit: 10 }
      );
    });

    it('should return filtered recipes by search term', async () => {
      const filteredRecipes = [mockRecipes[0]];
      const mockResult = {
        recipes: filteredRecipes,
        totalCount: 1,
        totalPages: 1,
      };

      (RecipeService.getAllRecipes as any).mockResolvedValue(mockResult);

      const res = await request(app).get('/?search=pasta');

      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(filteredRecipes);
      expect(RecipeService.getAllRecipes).toHaveBeenCalledWith(
        { search: 'pasta', category: undefined, difficulty: undefined },
        { page: 1, limit: 10 }
      );
    });

    it('should return filtered recipes by category', async () => {
      const filteredRecipes = [mockRecipes[1]];
      const mockResult = {
        recipes: filteredRecipes,
        totalCount: 1,
        totalPages: 1,
      };

      (RecipeService.getAllRecipes as any).mockResolvedValue(mockResult);

      const res = await request(app).get('/?category=Dessert');

      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(filteredRecipes);
      expect(RecipeService.getAllRecipes).toHaveBeenCalledWith(
        { search: undefined, category: 'Dessert', difficulty: undefined },
        { page: 1, limit: 10 }
      );
    });

    it('should return filtered recipes by difficulty', async () => {
      const filteredRecipes = [mockRecipes[0]];
      const mockResult = {
        recipes: filteredRecipes,
        totalCount: 1,
        totalPages: 1,
      };

      (RecipeService.getAllRecipes as any).mockResolvedValue(mockResult);

      const res = await request(app).get('/?difficulty=Easy');

      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(filteredRecipes);
      expect(RecipeService.getAllRecipes).toHaveBeenCalledWith(
        { search: undefined, category: undefined, difficulty: 'Easy' },
        { page: 1, limit: 10 }
      );
    });

    it('should return recipes with multiple filters', async () => {
      const filteredRecipes = [mockRecipes[0]];
      const mockResult = {
        recipes: filteredRecipes,
        totalCount: 1,
        totalPages: 1,
      };

      (RecipeService.getAllRecipes as any).mockResolvedValue(mockResult);

      const res = await request(app).get('/?search=pasta&category=Main%20Course&difficulty=Easy');

      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(filteredRecipes);
      expect(RecipeService.getAllRecipes).toHaveBeenCalledWith(
        { search: 'pasta', category: 'Main Course', difficulty: 'Easy' },
        { page: 1, limit: 10 }
      );
    });

    it('should return recipes with custom pagination', async () => {
      const mockResult = {
        recipes: [mockRecipes[0]],
        totalCount: 10,
        totalPages: 5,
      };

      (RecipeService.getAllRecipes as any).mockResolvedValue(mockResult);

      const res = await request(app).get('/?page=2&limit=2');

      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.success).toBe(true);
      expect(res.body.pagination).toEqual({
        page: 2,
        limit: 2,
        totalCount: 10,
        totalPages: 5,
      });
      expect(RecipeService.getAllRecipes).toHaveBeenCalledWith(
        { search: undefined, category: undefined, difficulty: undefined },
        { page: 2, limit: 2 }
      );
    });

    it('should handle empty results', async () => {
      const mockResult = {
        recipes: [],
        totalCount: 0,
        totalPages: 0,
      };

      (RecipeService.getAllRecipes as any).mockResolvedValue(mockResult);

      const res = await request(app).get('/?search=nonexistent');

      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
      expect(res.body.pagination.totalCount).toBe(0);
    });

    it('should handle service errors', async () => {
      (RecipeService.getAllRecipes as any).mockRejectedValue(new Error('Database error'));

      const res = await request(app).get('/');

      expect(res.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    });
  });

  describe('GET /search', () => {
    it('should search recipes successfully', async () => {
      const searchResults = [mockRecipes[0]];
      const mockResult = {
        recipes: searchResults,
        totalCount: 1,
        totalPages: 1,
      };

      (RecipeService.searchRecipes as any).mockResolvedValue(mockResult);

      const res = await request(app).get('/search?search=pasta');

      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(searchResults);
      expect(res.body.pagination).toEqual({
        page: 1,
        limit: 10,
        totalCount: 1,
        totalPages: 1,
      });
      expect(RecipeService.searchRecipes).toHaveBeenCalledWith('pasta', { page: 1, limit: 10 });
    });

    it('should search recipes with custom pagination', async () => {
      const searchResults = [mockRecipes[1]];
      const mockResult = {
        recipes: searchResults,
        totalCount: 5,
        totalPages: 3,
      };

      (RecipeService.searchRecipes as any).mockResolvedValue(mockResult);

      const res = await request(app).get('/search?search=chocolate&page=2&limit=2');

      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(searchResults);
      expect(res.body.pagination).toEqual({
        page: 2,
        limit: 2,
        totalCount: 5,
        totalPages: 3,
      });
      expect(RecipeService.searchRecipes).toHaveBeenCalledWith('chocolate', { page: 2, limit: 2 });
    });

    it('should handle empty search results', async () => {
      const mockResult = {
        recipes: [],
        totalCount: 0,
        totalPages: 0,
      };

      (RecipeService.searchRecipes as any).mockResolvedValue(mockResult);

      const res = await request(app).get('/search?search=nonexistent');

      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
      expect(res.body.pagination.totalCount).toBe(0);
    });

    it('should handle service errors during search', async () => {
      (RecipeService.searchRecipes as any).mockRejectedValue(new Error('Database error'));

      const res = await request(app).get('/search?search=pasta');

      expect(res.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    });

    it('should handle URL encoded search terms', async () => {
      const searchResults = [mockRecipes[0]];
      const mockResult = {
        recipes: searchResults,
        totalCount: 1,
        totalPages: 1,
      };

      (RecipeService.searchRecipes as any).mockResolvedValue(mockResult);

      const res = await request(app).get('/search?search=pasta%20carbonara');

      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(RecipeService.searchRecipes).toHaveBeenCalledWith('pasta carbonara', { page: 1, limit: 10 });
    });
  });
}); 