/// <reference types="vitest/globals" />
import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { HTTP_STATUS } from '@recipe-manager/shared';

// Mock dependencies before any other imports
vi.mock('../../../../services/userService', () => ({
  UserService: {
    getUserProfile: vi.fn(),
    getUserStats: vi.fn(),
  },
}));

vi.mock('../../../../middleware/auth', () => ({
  authenticate: (req: any, _res: any, next: any) => {
    req.user = { userId: 'test-user-id' };
    next();
  },
}));

vi.mock('../../../../middleware/validation', () => ({
  validateParams: () => (_req: express.Request, _res: express.Response, next: express.NextFunction) => next(),
  IdParamsSchema: {},
}));

// Now import the code that uses the mocks
import router from '../../../../routes/users/stats';
import { UserService } from '../../../../services/userService';

const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  created_at: new Date(),
  updated_at: new Date(),
};

const mockStats = {
  totalRecipes: 25,
  totalViews: 1250,
  totalLikes: 340,
  averageRating: 4.2,
  recentActivity: {
    recipesCreatedThisMonth: 3,
    recipesUpdatedThisMonth: 7,
  },
};

const setupApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/', router);
  return app;
};

describe('Users Stats Router Unit', () => {
  let app: express.Express;

  beforeEach(() => {
    app = setupApp();
    vi.clearAllMocks();
  });

  describe('GET /me/stats', () => {
    it('returns 200 and user stats on success', async () => {
      (UserService.getUserStats as any).mockResolvedValue(mockStats);

      const res = await request(app).get('/me/stats');

      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(mockStats);
      expect(UserService.getUserStats).toHaveBeenCalledWith('test-user-id');
    });

    it('returns 500 on service error', async () => {
      (UserService.getUserStats as any).mockRejectedValue(new Error('Database error'));

      const res = await request(app).get('/me/stats');

      expect(res.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Failed to fetch user statistics');
    });
  });

  describe('GET /:id/stats', () => {
    it('returns 200 and user stats on success', async () => {
      (UserService.getUserProfile as any).mockResolvedValue(mockUser);
      (UserService.getUserStats as any).mockResolvedValue(mockStats);

      const res = await request(app).get('/other-user-id/stats');

      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(mockStats);
      expect(res.body.user).toEqual({
        id: mockUser.id,
        name: mockUser.name,
      });
      expect(UserService.getUserProfile).toHaveBeenCalledWith('other-user-id');
      expect(UserService.getUserStats).toHaveBeenCalledWith('other-user-id');
    });

    it('returns 404 when user not found', async () => {
      (UserService.getUserProfile as any).mockResolvedValue(null);

      const res = await request(app).get('/non-existent-user/stats');

      expect(res.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('User not found');
      expect(UserService.getUserStats).not.toHaveBeenCalled();
    });

    it('returns 500 on service error', async () => {
      (UserService.getUserProfile as any).mockResolvedValue(mockUser);
      (UserService.getUserStats as any).mockRejectedValue(new Error('Database error'));

      const res = await request(app).get('/other-user-id/stats');

      expect(res.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Failed to fetch user statistics');
    });
  });
}); 