/// <reference types="vitest/globals" />
// Unit tests for packages/server/src/routes/users/recipes.ts
// Covers success, error and edge-cases for both `/me/recipes` and `/:id/recipes` endpoints.

import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { HTTP_STATUS, PAGINATION_DEFAULTS } from '@recipe-manager/shared';

/*
 * ------------------------------------------------------------------
 * 1. Mock all dependent modules BEFORE importing the router under test
 * ------------------------------------------------------------------
 */

// Mock RecipeService methods used in the route
vi.mock('../../../../services/recipeService', () => ({
  RecipeService: {
    getUserRecipes: vi.fn(),
  },
}));

// Mock UserService methods used in the route
vi.mock('../../../../services/userService', () => ({
  UserService: {
    getUserProfile: vi.fn(),
  },
}));

// Bypass validation middlewares – they should just call `next()`
vi.mock('../../../../middleware/validation', () => ({
  validateQuery: () => (_req: express.Request, _res: express.Response, next: express.NextFunction) => next(),
  validateParams: () => (_req: express.Request, _res: express.Response, next: express.NextFunction) => next(),
  IdParamsSchema: {},
}));

// Mock authentication middleware – attach fake user to request
vi.mock('../../../../middleware/auth', () => ({
  authenticate: (req: any, _res: any, next: any) => {
    req.user = { userId: 'user-123' };
    next();
  },
  AuthenticatedRequest: Object,
}));

// Silence logger output during test runs
vi.mock('../../../../utils/logger', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

/*
 * ------------------------------------------------------------------
 * 2. Import router AFTER mocks so that it uses the mocked versions
 * ------------------------------------------------------------------
 */
import router from '../../../../routes/users/recipes';
import { RecipeService } from '../../../../services/recipeService';
import { UserService } from '../../../../services/userService';

/*
 * ------------------------------------------------------------------
 * 3. Test data & helper to create an express app instance per test
 * ------------------------------------------------------------------
 */

const sampleRecipes = [
  {
    id: 'recipe-1',
    title: 'Recipe One',
    user_id: 'user-123',
    created_at: '2025-07-11T10:00:00.000Z',
    updated_at: '2025-07-11T10:00:00.000Z',
  },
  {
    id: 'recipe-2',
    title: 'Recipe Two',
    user_id: 'user-123',
    created_at: '2025-07-11T10:05:00.000Z',
    updated_at: '2025-07-11T10:05:00.000Z',
  },
];

const makeApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/', router);
  return app;
};

/*
 * ------------------------------------------------------------------
 * 4. Test suite
 * ------------------------------------------------------------------
 */

describe('Users → Recipes Router', () => {
  let app: express.Express;

  beforeEach(() => {
    app = makeApp();
    vi.clearAllMocks();
  });

  /* -------------------------------------------------------------- */
  describe('GET /me/recipes', () => {
    it('returns current user recipes with default pagination', async () => {
      (RecipeService.getUserRecipes as any).mockResolvedValue({
        recipes: sampleRecipes,
        totalCount: sampleRecipes.length,
        totalPages: 1,
      });

      const res = await request(app).get('/me/recipes');

      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(sampleRecipes);
      expect(res.body.pagination).toEqual({
        page: PAGINATION_DEFAULTS.PAGE,
        limit: PAGINATION_DEFAULTS.LIMIT,
        totalCount: sampleRecipes.length,
        totalPages: 1,
      });

      expect(RecipeService.getUserRecipes).toHaveBeenCalledWith('user-123', {
        page: PAGINATION_DEFAULTS.PAGE,
        limit: PAGINATION_DEFAULTS.LIMIT,
      });
    });

    it('supports explicit page & limit query params', async () => {
      (RecipeService.getUserRecipes as any).mockResolvedValue({
        recipes: sampleRecipes,
        totalCount: 50,
        totalPages: 5,
      });

      const res = await request(app).get('/me/recipes?page=2&limit=10');

      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.pagination).toEqual({
        page: 2,
        limit: 10,
        totalCount: 50,
        totalPages: 5,
      });

      expect(RecipeService.getUserRecipes).toHaveBeenCalledWith('user-123', {
        page: 2,
        limit: 10,
      });
    });

    it('handles internal errors from service', async () => {
      (RecipeService.getUserRecipes as any).mockRejectedValue(new Error('DB failure'));

      const res = await request(app).get('/me/recipes');

      expect(res.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Failed to fetch user recipes');
    });
  });

  /* -------------------------------------------------------------- */
  describe('GET /:id/recipes', () => {
    const targetUserId = 'other-user';

    it('returns recipes for the specified user when the user exists', async () => {
      (UserService.getUserProfile as any).mockResolvedValue({ id: targetUserId, name: 'Other User' });
      (RecipeService.getUserRecipes as any).mockResolvedValue({
        recipes: sampleRecipes,
        totalCount: sampleRecipes.length,
        totalPages: 1,
      });

      const res = await request(app).get(`/${targetUserId}/recipes`);

      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(sampleRecipes);
      expect(res.body.user).toEqual({ id: targetUserId, name: 'Other User' });

      expect(UserService.getUserProfile).toHaveBeenCalledWith(targetUserId);
      expect(RecipeService.getUserRecipes).toHaveBeenCalledWith(targetUserId, {
        page: PAGINATION_DEFAULTS.PAGE,
        limit: PAGINATION_DEFAULTS.LIMIT,
      });
    });

    it('returns 404 when the user does not exist', async () => {
      (UserService.getUserProfile as any).mockResolvedValue(null);

      const res = await request(app).get(`/${targetUserId}/recipes`);

      expect(res.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('User not found');

      // Should NOT attempt to fetch recipes when user missing
      expect(RecipeService.getUserRecipes).not.toHaveBeenCalled();
    });

    it('handles service error when fetching user recipes', async () => {
      (UserService.getUserProfile as any).mockResolvedValue({ id: targetUserId, name: 'Other User' });
      (RecipeService.getUserRecipes as any).mockRejectedValue(new Error('DB failure'));

      const res = await request(app).get(`/${targetUserId}/recipes`);

      expect(res.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Failed to fetch user recipes');
    });
  });
}); 