/// <reference types="vitest/globals" />
import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { HTTP_STATUS } from '@recipe-manager/shared';

// Mock dependencies before any other imports
vi.mock('../../../../services/userService', () => ({
  UserService: {
    getUserProfile: vi.fn(),
    updateUser: vi.fn(),
    changePassword: vi.fn(),
  },
}));

vi.mock('../../../../utils/auth', () => ({
  AuthUtils: {
    validatePassword: vi.fn(() => ({ isValid: true, errors: [] })),
  },
}));

vi.mock('../../../../middleware/validation', () => ({
  validateBody: () => (_req: express.Request, _res: express.Response, next: express.NextFunction) => next(),
}));

vi.mock('../../../../middleware/auth', () => ({
  authenticate: (req: any, _res: any, next: any) => {
    req.user = { userId: 'test-user-id' };
    next();
  },
}));

// Now import the code that uses the mocks
import router from '../../../../routes/auth/profile';
import { UserService } from '../../../../services/userService';
import { AuthUtils } from '../../../../utils/auth';

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

describe('Profile Router Unit', () => {
  let app: express.Express;

  beforeEach(() => {
    app = setupApp();
    vi.clearAllMocks();
  });

  describe('GET /profile', () => {
    it('returns 200 and user profile on success', async () => {
      (UserService.getUserProfile as any).mockResolvedValue(mockUser);

      const res = await request(app).get('/profile');

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

      const res = await request(app).get('/profile');

      expect(res.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('User not found');
    });

    it('returns 500 on service error', async () => {
      (UserService.getUserProfile as any).mockRejectedValue(new Error('Database error'));

      const res = await request(app).get('/profile');

      expect(res.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Failed to fetch profile');
    });
  });

  describe('PUT /profile', () => {
    it('returns 200 and updated user on success', async () => {
      const updateData = { name: 'Updated Name', email: 'updated@example.com' };
      const updatedUser = { ...mockUser, ...updateData };
      (UserService.updateUser as any).mockResolvedValue(updatedUser);

      const res = await request(app).put('/profile').send(updateData);

      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual({
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        created_at: updatedUser.created_at.toISOString(),
        updated_at: updatedUser.updated_at.toISOString(),
      });
      expect(res.body.message).toBe('Profile updated successfully');
      expect(UserService.updateUser).toHaveBeenCalledWith('test-user-id', updateData);
    });

    it('returns 409 when email already in use', async () => {
      const updateData = { name: 'Updated Name', email: 'existing@example.com' };
      (UserService.updateUser as any).mockRejectedValue(new Error('Email already in use'));

      const res = await request(app).put('/profile').send(updateData);

      expect(res.status).toBe(HTTP_STATUS.CONFLICT);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Email already in use');
    });

    it('returns 500 on service error', async () => {
      const updateData = { name: 'Updated Name', email: 'updated@example.com' };
      (UserService.updateUser as any).mockRejectedValue(new Error('Database error'));

      const res = await request(app).put('/profile').send(updateData);

      expect(res.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Failed to update profile');
    });
  });

  describe('POST /change-password', () => {
    it('returns 200 on successful password change', async () => {
      const passwordData = { currentPassword: 'oldpass', newPassword: 'newpass123' };
      (AuthUtils.validatePassword as any).mockReturnValue({ isValid: true, errors: [] });
      (UserService.changePassword as any).mockResolvedValue(undefined);

      const res = await request(app).post('/change-password').send(passwordData);

      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Password changed successfully');
      expect(AuthUtils.validatePassword).toHaveBeenCalledWith('newpass123');
      expect(UserService.changePassword).toHaveBeenCalledWith('test-user-id', 'oldpass', 'newpass123');
    });

    it('returns 400 when new password validation fails', async () => {
      const passwordData = { currentPassword: 'oldpass', newPassword: 'weak' };
      (AuthUtils.validatePassword as any).mockReturnValue({ isValid: false, errors: ['Password too weak'] });

      const res = await request(app).post('/change-password').send(passwordData);

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('New password validation failed');
      expect(res.body.details).toEqual(['Password too weak']);
      expect(UserService.changePassword).not.toHaveBeenCalled();
    });

    it('returns 400 when current password is incorrect', async () => {
      const passwordData = { currentPassword: 'wrongpass', newPassword: 'newpass123' };
      (AuthUtils.validatePassword as any).mockReturnValue({ isValid: true, errors: [] });
      (UserService.changePassword as any).mockRejectedValue(new Error('Current password is incorrect'));

      const res = await request(app).post('/change-password').send(passwordData);

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Current password is incorrect');
    });

    it('returns 500 on service error', async () => {
      const passwordData = { currentPassword: 'oldpass', newPassword: 'newpass123' };
      (AuthUtils.validatePassword as any).mockReturnValue({ isValid: true, errors: [] });
      (UserService.changePassword as any).mockRejectedValue(new Error('Database error'));

      const res = await request(app).post('/change-password').send(passwordData);

      expect(res.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Failed to change password');
    });
  });
}); 