/// <reference types="vitest/globals" />
import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { HTTP_STATUS } from '@recipe-manager/shared';

// Mock dependencies before any other imports
vi.mock('../../../../services/userService', () => ({
  UserService: {
    getUserProfile: vi.fn(),
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
import router from '../../../../routes/users/profile';
import { UserService } from '../../../../services/userService';

const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  created_at: new Date(),
  updated_at: new Date(),
};

const setupApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/', router);
  return app;
};

describe('Users Profile Router Unit', () => {
  let app: express.Express;

  beforeEach(() => {
    app = setupApp();
    vi.clearAllMocks();
  });

  describe('GET /me', () => {
    it('returns 200 and user profile on success', async () => {
      (UserService.getUserProfile as any).mockResolvedValue(mockUser);

      const res = await request(app).get('/me');

      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual({
        ...mockUser,
        created_at: mockUser.created_at.toISOString(),
        updated_at: mockUser.updated_at.toISOString(),
      });
      expect(UserService.getUserProfile).toHaveBeenCalledWith('test-user-id');
    });

    it('returns 404 when user not found', async () => {
      (UserService.getUserProfile as any).mockResolvedValue(null);

      const res = await request(app).get('/me');

      expect(res.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('User not found');
    });

    it('returns 500 on service error', async () => {
      (UserService.getUserProfile as any).mockRejectedValue(new Error('Database error'));

      const res = await request(app).get('/me');

      expect(res.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Failed to fetch profile');
    });
  });

  describe('GET /:id', () => {
    it('returns 200 and public user profile on success', async () => {
      (UserService.getUserProfile as any).mockResolvedValue(mockUser);

      const res = await request(app).get('/other-user-id');

      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        created_at: mockUser.created_at.toISOString(),
      });
      expect(UserService.getUserProfile).toHaveBeenCalledWith('other-user-id');
    });

    it('returns 404 when user not found', async () => {
      (UserService.getUserProfile as any).mockResolvedValue(null);

      const res = await request(app).get('/non-existent-user');

      expect(res.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('User not found');
    });

    it('returns 500 on service error', async () => {
      (UserService.getUserProfile as any).mockRejectedValue(new Error('Database error'));

      const res = await request(app).get('/other-user-id');

      expect(res.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Failed to fetch user');
    });
  });
}); 