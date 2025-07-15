/**
 * Auth API Tests
 * Critical tests for authentication endpoints
 */

import request from 'supertest'
import app from '../src/app'
import { createTestUser, getUserById, prisma } from './setup'
import bcrypt from 'bcryptjs'

describe('Auth API', () => {
  describe('POST /auth/register', () => {
    const validUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    }

    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(validUser)

      expect(res.status).toBe(201)
      expect(res.body).toHaveProperty('data')
      expect(res.body.data).toHaveProperty('user')
      expect(res.body.data).toHaveProperty('accessToken')
      expect(res.body.data.user.email).toBe(validUser.email)
      expect(res.body.data.user.name).toBe(validUser.name)
      expect(res.body.data.user).not.toHaveProperty('password')

      // Verify user was created in database
      const dbUser = await prisma.user.findUnique({
        where: { email: validUser.email }
      })
      expect(dbUser).toBeTruthy()
      expect(dbUser?.email).toBe(validUser.email)
    })

    it('should hash the password before storing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(validUser)

      expect(res.status).toBe(201)

      // Check password is hashed in database
      const dbUser = await prisma.user.findUnique({
        where: { email: validUser.email }
      })
      expect(dbUser).toBeTruthy()
      expect(dbUser?.password).not.toBe(validUser.password)
      
      // Verify password hash is valid
      const isValidHash = await bcrypt.compare(validUser.password, dbUser!.password)
      expect(isValidHash).toBe(true)
    })

    it('should reject registration with missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com'
          // Missing name and password
        })

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('error')
    })

    it('should reject duplicate email registration', async () => {
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send(validUser)

      // Attempt duplicate registration
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          ...validUser,
          name: 'Different Name'
        })

      expect(res.status).toBe(409)
      expect(res.body).toHaveProperty('error')
      expect(res.body.error).toContain('already exists')
    })

    it('should reject invalid email format', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          ...validUser,
          email: 'invalid-email'
        })

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('error')
    })

    it('should reject weak password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          ...validUser,
          password: '123' // Too short
        })

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('error')
    })
  })

  describe('POST /auth/login', () => {
    let testUser: any

    beforeEach(async () => {
      // Create test user directly in database with hashed password
      const hashedPassword = await bcrypt.hash('password123', 10)
      testUser = await createTestUser({
        email: 'login-test@example.com',
        password: hashedPassword,
        name: 'Login Test User'
      })
    })

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'password123'
        })

      expect(res.status).toBe(200)
      expect(res.body.data).toHaveProperty('user')
      expect(res.body.data).toHaveProperty('accessToken')
      expect(res.body.data.user.email).toBe(testUser.email)
      expect(res.body.data.user).not.toHaveProperty('password')
    })

    it('should reject invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid@example.com',
          password: 'password123'
        })

      expect(res.status).toBe(401)
      expect(res.body).toHaveProperty('error')
      expect(res.body.error).toContain('Authentication failed')
    })

    it('should reject invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        })

      expect(res.status).toBe(401)
      expect(res.body).toHaveProperty('error')
      expect(res.body.error).toContain('Authentication failed')
    })

    it('should reject missing credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({})

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('error')
    })
  })

  describe('JWT Token Protection', () => {
    let authToken: string

    beforeEach(async () => {
      // Register and login to get token
      const testUser = {
        email: 'jwt-test@example.com',
        password: 'password123',
        name: 'JWT Test User'
      }

      await request(app)
        .post('/api/auth/register')
        .send(testUser)

      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })

      authToken = loginRes.body.data.accessToken
    })

    it('should access protected route with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)

      expect(res.status).toBe(200)
    })

    it('should reject access without token', async () => {
      const res = await request(app)
        .get('/api/auth/me')

      expect(res.status).toBe(401)
      expect(res.body).toHaveProperty('error')
      expect(res.body.error).toContain('Access token required')
    })

    it('should reject access with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')

      expect(res.status).toBe(401)
      expect(res.body).toHaveProperty('error')
      expect(res.body.error).toContain('Invalid access token')
    })

    it('should reject access with malformed authorization header', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'NotBearer token')

      expect(res.status).toBe(401)
      expect(res.body).toHaveProperty('error')
      expect(res.body.error).toContain('Invalid authorization format')
    })
  })
}) 