process.env.SKIP_MSW = 'true';
import '../../setup/test-setup';
import { expect, describe, it, afterAll, afterEach } from 'vitest';
import request from 'supertest';
import app from '../../../app';

describe('Auth Routes Integration', () => {
  const testUser = {
    email: 'testuser@example.com',
    name: 'Test User',
    password: 'TestPassword123!'
  };

  afterAll(async () => {
    // Optionally, clean up test user from DB if needed
  });

  afterEach(async () => {
    // ensure user data persists within a single test but is cleaned between tests by test-setup cleanup.
  });

  it('fails to register duplicate user in same request sequence', async () => {
    // First registration should succeed
    await request(app)
      .post('/api/auth/register')
      .send(testUser);

    // Second registration with same email should fail
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/already exists/);
  });

  it('logs in with correct credentials', async () => {
    // Ensure the user exists by registering first
    await request(app)
      .post('/api/auth/register')
      .send(testUser);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testUser.email);
    expect(res.body.data.tokens).not.toBeUndefined();
  });

  it('fails login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'WrongPassword!' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/Invalid email or password/);
  });
}); 