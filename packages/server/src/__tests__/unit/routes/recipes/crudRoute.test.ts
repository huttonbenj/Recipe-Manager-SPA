/// <reference types="vitest/globals" />
import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { HTTP_STATUS } from '@recipe-manager/shared';

// Mock dependencies before any other imports
vi.mock('../../../../services/recipeService', () => ({
  RecipeService: {
    getRecipeById: vi.fn(),
    createRecipe: vi.fn(),
    updateRecipe: vi.fn(),
    deleteRecipe: vi.fn(),
  },
}));

vi.mock('../../../../middleware/validation', () => ({
  validateBody: () => (_req: express.Request, _res: express.Response, next: express.NextFunction) => next(),
  validateParams: () => (_req: express.Request, _res: express.Response, next: express.NextFunction) => next(),
  IdParamsSchema: {},
}));

vi.mock('../../../../middleware/auth', () => ({
  authenticate: (req: any, _res: any, next: any) => {
    req.user = { userId: 'user-123' };
    next();
  },
}));

vi.mock('../../../../utils/logger', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

// Now import the code that uses the mocks
import router from '../../../../routes/recipes/crud';
import { RecipeService } from '../../../../services/recipeService';

const mockRecipe = {
  id: 'recipe-1',
  title: 'Test Recipe',
  ingredients: JSON.stringify(['ingredient 1', 'ingredient 2']),
  instructions: 'Test instructions',
  cook_time: 30,
  servings: 4,
  difficulty: 'Easy',
  category: 'Main Course',
  tags: JSON.stringify(['tag1', 'tag2']),
  user_id: 'user-123',
  image_url: null,
  created_at: '2025-07-11T09:58:11.154Z',
  updated_at: '2025-07-11T09:58:11.154Z',
  user: { id: 'user-123', name: 'Test User', email: 'test@example.com' },
};

const setupApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/', router);
  return app;
};

describe('Recipes CRUD Router Unit', () => {
  let app: express.Express;

  beforeEach(() => {
    app = setupApp();
    vi.clearAllMocks();
  });

  describe('GET /:id', () => {
    it('should return recipe by ID successfully', async () => {
      (RecipeService.getRecipeById as any).mockResolvedValue(mockRecipe);

      const res = await request(app).get('/recipe-1');

      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(mockRecipe);
      expect(RecipeService.getRecipeById).toHaveBeenCalledWith('recipe-1');
    });

    it('should return 404 when recipe not found', async () => {
      (RecipeService.getRecipeById as any).mockResolvedValue(null);

      const res = await request(app).get('/non-existent-recipe');

      expect(res.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Recipe not found');
    });

    it('should handle service errors', async () => {
      (RecipeService.getRecipeById as any).mockRejectedValue(new Error('Database error'));

      const res = await request(app).get('/recipe-1');

      expect(res.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    });
  });

  describe('POST /', () => {
    const recipeData = {
      title: 'New Recipe',
      ingredients: JSON.stringify(['ingredient 1']),
      instructions: 'New instructions',
      cook_time: 45,
      servings: 6,
      difficulty: 'Medium',
      category: 'Dessert',
      tags: JSON.stringify(['dessert', 'sweet']),
    };

    it('should create recipe successfully', async () => {
      const createdRecipe = { ...mockRecipe, ...recipeData };
      (RecipeService.createRecipe as any).mockResolvedValue(createdRecipe);

      const res = await request(app).post('/').send(recipeData);

      expect(res.status).toBe(HTTP_STATUS.CREATED);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(createdRecipe);
      expect(res.body.message).toBe('Recipe created successfully');
      expect(RecipeService.createRecipe).toHaveBeenCalledWith({
        ...recipeData,
        user_id: 'user-123',
      });
    });

    it('should handle service errors during creation', async () => {
      (RecipeService.createRecipe as any).mockRejectedValue(new Error('Database error'));

      const res = await request(app).post('/').send(recipeData);

      expect(res.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    });
  });

  describe('PUT /:id', () => {
    const updateData = {
      title: 'Updated Recipe',
      cook_time: 60,
    };

    it('should update recipe successfully when user owns it', async () => {
      const updatedRecipe = { ...mockRecipe, ...updateData };
      (RecipeService.getRecipeById as any).mockResolvedValue(mockRecipe);
      (RecipeService.updateRecipe as any).mockResolvedValue(updatedRecipe);

      const res = await request(app).put('/recipe-1').send(updateData);

      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(updatedRecipe);
      expect(res.body.message).toBe('Recipe updated successfully');
      expect(RecipeService.updateRecipe).toHaveBeenCalledWith('recipe-1', updateData);
    });

    it('should return 404 when recipe not found', async () => {
      (RecipeService.getRecipeById as any).mockResolvedValue(null);

      const res = await request(app).put('/non-existent-recipe').send(updateData);

      expect(res.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Recipe not found');
      expect(RecipeService.updateRecipe).not.toHaveBeenCalled();
    });

    it('should return 403 when user does not own the recipe', async () => {
      const otherUserRecipe = { ...mockRecipe, user_id: 'other-user' };
      (RecipeService.getRecipeById as any).mockResolvedValue(otherUserRecipe);

      const res = await request(app).put('/recipe-1').send(updateData);

      expect(res.status).toBe(HTTP_STATUS.FORBIDDEN);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('You can only update your own recipes');
      expect(RecipeService.updateRecipe).not.toHaveBeenCalled();
    });

    it('should handle service errors during update', async () => {
      (RecipeService.getRecipeById as any).mockResolvedValue(mockRecipe);
      (RecipeService.updateRecipe as any).mockRejectedValue(new Error('Database error'));

      const res = await request(app).put('/recipe-1').send(updateData);

      expect(res.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    });
  });

  describe('DELETE /:id', () => {
    it('should delete recipe successfully when user owns it', async () => {
      (RecipeService.getRecipeById as any).mockResolvedValue(mockRecipe);
      (RecipeService.deleteRecipe as any).mockResolvedValue(undefined);

      const res = await request(app).delete('/recipe-1');

      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Recipe deleted successfully');
      expect(RecipeService.deleteRecipe).toHaveBeenCalledWith('recipe-1');
    });

    it('should return 404 when recipe not found', async () => {
      (RecipeService.getRecipeById as any).mockResolvedValue(null);

      const res = await request(app).delete('/non-existent-recipe');

      expect(res.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Recipe not found');
      expect(RecipeService.deleteRecipe).not.toHaveBeenCalled();
    });

    it('should return 403 when user does not own the recipe', async () => {
      const otherUserRecipe = { ...mockRecipe, user_id: 'other-user' };
      (RecipeService.getRecipeById as any).mockResolvedValue(otherUserRecipe);

      const res = await request(app).delete('/recipe-1');

      expect(res.status).toBe(HTTP_STATUS.FORBIDDEN);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('You can only delete your own recipes');
      expect(RecipeService.deleteRecipe).not.toHaveBeenCalled();
    });

    it('should handle service errors during deletion', async () => {
      (RecipeService.getRecipeById as any).mockResolvedValue(mockRecipe);
      (RecipeService.deleteRecipe as any).mockRejectedValue(new Error('Database error'));

      const res = await request(app).delete('/recipe-1');

      expect(res.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    });
  });
}); 