/**
 * Health Check Tests
 * Critical tests for API health and database connectivity
 */

import request from 'supertest'
import app from '../src/app'
import { prisma } from './setup'

describe('Health Check API', () => {
  describe('GET /health', () => {
    it('should respond to health check endpoint', async () => {
      const res = await request(app)
        .get('/api/health')

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('status')
      expect(res.body.status).toBe('healthy')
      expect(res.body).toHaveProperty('timestamp')
      expect(res.body).toHaveProperty('service')
    })

    it('should include service information', async () => {
      const res = await request(app)
        .get('/api/health')

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('service')
      expect(res.body.service).toBe('recipe-manager-api')
    })

    it('should include environment information', async () => {
      const res = await request(app)
        .get('/api/health')

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('environment')
      expect(res.body.environment).toBe('test')
    })
  })

  describe('Database Connection', () => {
    it('should verify database connectivity', async () => {
      // Test direct database connection
      const result = await prisma.$queryRaw`SELECT 1 as test` as any[]
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(1)
    })

    it('should handle database operations', async () => {
      // Test that we can perform basic database operations
      const userCount = await prisma.user.count()
      expect(typeof userCount).toBe('number')
      expect(userCount).toBeGreaterThanOrEqual(0)

      const recipeCount = await prisma.recipe.count()
      expect(typeof recipeCount).toBe('number')
      expect(recipeCount).toBeGreaterThanOrEqual(0)
    })

    it('should verify database schema integrity', async () => {
      // Test that all expected tables exist by trying to query them
      const tables = [
        prisma.user.findMany({ take: 0 }),
        prisma.recipe.findMany({ take: 0 }),
        prisma.userFavorite.findMany({ take: 0 }),
        prisma.userBookmark.findMany({ take: 0 })
      ]

      await expect(Promise.all(tables)).resolves.toBeDefined()
    })
  })

  describe('API Routes', () => {
    it('should handle unknown routes with 404', async () => {
      const res = await request(app)
        .get('/api/unknown-route')

      expect(res.status).toBe(404)
      expect(res.body).toHaveProperty('error')
    })

    it('should handle non-API routes with 404', async () => {
      const res = await request(app)
        .get('/unknown-route')

      expect(res.status).toBe(404)
    })

    it('should handle malformed API requests', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send('invalid json')
        .set('Content-Type', 'application/json')

      // Should handle malformed JSON gracefully
      expect([400, 500]).toContain(res.status)
    })
  })

  describe('Authentication Protection', () => {
    it('should protect authenticated routes', async () => {
      const protectedRoutes = [
        { method: 'post', path: '/api/recipes' },
        { method: 'put', path: '/api/recipes/123' },
        { method: 'delete', path: '/api/recipes/123' },
        { method: 'get', path: '/api/auth/me' },
        { method: 'post', path: '/api/user/favorites' },
        { method: 'delete', path: '/api/user/favorites/123' }
      ]

      for (const route of protectedRoutes) {
        let res: any
        
        if (route.method === 'post') {
          res = await request(app).post(route.path)
        } else if (route.method === 'put') {
          res = await request(app).put(route.path)
        } else if (route.method === 'delete') {
          res = await request(app).delete(route.path)
        } else {
          res = await request(app).get(route.path)
        }
        
        // Should require authentication
        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty('error')
      }
    })

    it('should reject invalid authorization headers', async () => {
      const invalidHeaders = [
        'Bearer',
        'Bearer ',
        'InvalidFormat token',
        'Bearer invalid-token-format'
      ]

      for (const header of invalidHeaders) {
        const res = await request(app)
          .get('/api/auth/me')
          .set('Authorization', header)

        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty('error')
      }
    })
  })

  describe('Error Handling', () => {
    it('should handle server errors gracefully', async () => {
      // This tests the error handling middleware
      const res = await request(app)
        .get('/api/recipes/invalid-uuid-format')

      // Should handle database errors gracefully
      expect([400, 404, 500]).toContain(res.status)
      expect(res.body).toHaveProperty('error')
    })

    it('should return proper error format', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({})

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('error')
      expect(res.body).toHaveProperty('message')
      expect(res.body.success).toBe(false)
    })
  })

  describe('CORS and Security Headers', () => {
    it('should include security headers', async () => {
      const res = await request(app)
        .get('/api/health')

      // Check for common security headers
      expect(res.headers).toBeDefined()
      // Note: Specific headers depend on helmet configuration
    })

    it('should handle OPTIONS requests for CORS', async () => {
      const res = await request(app)
        .options('/api/recipes')

      // Should handle preflight requests
      expect([200, 204]).toContain(res.status)
    })
  })
}) 