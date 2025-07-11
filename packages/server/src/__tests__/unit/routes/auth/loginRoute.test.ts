/// <reference types="vitest/globals" />
import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { HTTP_STATUS } from '@recipe-manager/shared';

// Mock dependencies before any other imports
vi.mock('../../../../services/userService', () => ({
  UserService: {
    createUser: vi.fn(),
    authenticateUser: vi.fn(),
    getUserById: vi.fn(),
  },
}));

vi.mock('../../../../utils/auth', () => ({
  AuthUtils: {
    validatePassword: vi.fn(() => ({ isValid: true, errors: [] })),
    generateTokens: vi.fn(() => ({ accessToken: 'access', refreshToken: 'refresh' })),
    verifyToken: vi.fn(),
  },
}));

vi.mock('../../../../middleware/validation', () => ({
  validateBody: () => (_req: express.Request, _res: express.Response, next: express.NextFunction) => next(),
}));

vi.mock('../../../../middleware/auth', () => ({ authenticate: (_req: any, _res: any, next: any) => next() }));

// Now import the code that uses the mocks
import router from '../../../../routes/auth/login';
import { UserService } from '../../../../services/userService';
import { AuthUtils } from '../../../../utils/auth';

const mockUser = {
  id: '123',
  email: 'unit@test.com',
  name: 'Unit Test',
  password: 'hashed',
  created_at: new Date(),
  updated_at: new Date(),
};

const setupApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/', router);
  return app;
};

describe('Auth Router Unit', () => {
  let app: express.Express;

  beforeEach(() => {
    app = setupApp();
    vi.clearAllMocks();
  });

  it('returns 400 when password validation fails on register', async () => {
    (AuthUtils.validatePassword as any).mockReturnValue({ isValid: false, errors: ['weak'] });

    const res = await request(app).post('/register').send({ email: mockUser.email, name: mockUser.name, password: 'bad' });

    expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/Password validation failed/);
  });

  it('returns 500 when login throws unexpected error', async () => {
    (UserService.authenticateUser as any).mockRejectedValue(new Error('db down'));

    const res = await request(app).post('/login').send({ email: mockUser.email, password: 'pass' });
    expect(res.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/Failed to login/);
  });

  it('refresh token success path', async () => {
    (AuthUtils.verifyToken as any).mockReturnValue({ userId: mockUser.id });
    (UserService.getUserById as any).mockResolvedValue(mockUser);

    const res = await request(app).post('/refresh').send({ refreshToken: 'valid' });

    expect(res.status).toBe(HTTP_STATUS.OK);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBe('access');
  });

  it('refresh token invalid path', async () => {
    (AuthUtils.verifyToken as any).mockImplementation(() => { throw new Error('invalid'); });

    const res = await request(app).post('/refresh').send({ refreshToken: 'invalid' });

    expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/Invalid refresh token/);
  });

  it('returns 201 on successful registration', async () => {
    (AuthUtils.validatePassword as any).mockReturnValue({ isValid: true });
    (UserService.createUser as any).mockResolvedValue(mockUser);

    const res = await request(app).post('/register').send({ email: mockUser.email, name: mockUser.name, password: 'validPass123' });

    expect(res.status).toBe(HTTP_STATUS.CREATED);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user).toEqual({
      id: mockUser.id,
      email: mockUser.email,
      name: mockUser.name,
      created_at: mockUser.created_at.toISOString(),
      updated_at: mockUser.updated_at.toISOString()
    });
    expect(res.body.data.tokens).toEqual({ accessToken: 'access', refreshToken: 'refresh' });
    expect(res.body.message).toBe('User registered successfully');
  });

  it('returns 409 when user already exists during registration', async () => {
    (AuthUtils.validatePassword as any).mockReturnValue({ isValid: true });
    (UserService.createUser as any).mockRejectedValue(new Error('User with this email already exists'));

    const res = await request(app).post('/register').send({ email: mockUser.email, name: mockUser.name, password: 'validPass123' });

    expect(res.status).toBe(HTTP_STATUS.CONFLICT);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/User with this email already exists/);
  });

  it('returns 200 on successful login', async () => {
    (UserService.authenticateUser as any).mockResolvedValue(mockUser);

    const res = await request(app).post('/login').send({ email: mockUser.email, password: 'validPass123' });

    expect(res.status).toBe(HTTP_STATUS.OK);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user).toEqual({
      id: mockUser.id,
      email: mockUser.email,
      name: mockUser.name,
      created_at: mockUser.created_at.toISOString(),
      updated_at: mockUser.updated_at.toISOString()
    });
    expect(res.body.data.tokens).toEqual({ accessToken: 'access', refreshToken: 'refresh' });
    expect(res.body.message).toBe('Login successful');
  });

  it('returns 401 on login with invalid credentials', async () => {
    (UserService.authenticateUser as any).mockResolvedValue(null);

    const res = await request(app).post('/login').send({ email: mockUser.email, password: 'wrongPass' });

    expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/Invalid email or password/);
  });

  it('returns 200 on logout', async () => {
    const res = await request(app).post('/logout').send();

    expect(res.status).toBe(HTTP_STATUS.OK);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Logged out successfully');
  });
}); 