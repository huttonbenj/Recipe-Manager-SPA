/// <reference types="vitest/globals" />
import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { HTTP_STATUS } from '@recipe-manager/shared';

// Mock dependencies before any other imports
vi.mock('../../../../services/userService', () => ({
  UserService: {
    deleteUser: vi.fn(),
  },
}));

vi.mock('../../../../middleware/auth', () => ({
  authenticate: (req: any, _res: any, next: any) => {
    req.user = { userId: 'test-user-id' };
    next();
  },
}));

// Now import the code that uses the mocks
import router from '../../../../routes/users/account';
import { UserService } from '../../../../services/userService';

const setupApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/', router);
  return app;
};

describe('Account Router Unit', () => {
  let app: express.Express;

  beforeEach(() => {
    app = setupApp();
    vi.clearAllMocks();
  });

  describe('DELETE /me', () => {
    it('returns 200 on successful account deletion', async () => {
      (UserService.deleteUser as any).mockResolvedValue(undefined);

      const res = await request(app).delete('/me');

      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('User account deleted successfully');
      expect(UserService.deleteUser).toHaveBeenCalledWith('test-user-id');
    });

    it('returns 500 on service error', async () => {
      (UserService.deleteUser as any).mockRejectedValue(new Error('Database error'));

      const res = await request(app).delete('/me');

      expect(res.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Failed to delete user account');
    });
  });
}); 