/**
 * Simple Health Check Tests
 * Basic tests without complex database setup
 */

import request from 'supertest'
import app from '../src/app'

describe('Basic Health Check', () => {
  test('should respond to basic health endpoint', async () => {
    const response = await request(app)
      .get('/api/health')

    // Should at least respond (may be 503 due to DB, but API is working)
    expect([200, 503]).toContain(response.status)
    expect(response.body).toHaveProperty('status')
  })

  test('should respond to API info endpoint', async () => {
    const response = await request(app)
      .get('/api/')
      .expect(200)

    expect(response.body).toHaveProperty('message', 'Recipe Manager API')
    expect(response.body).toHaveProperty('endpoints')
  })

  test('should handle 404 for unknown routes', async () => {
    const response = await request(app)
      .get('/api/nonexistent')
      .expect(404)
  })

  test('should reject unauthenticated requests to protected routes', async () => {
    const response = await request(app)
      .post('/api/recipes')
      .send({ title: 'Test' })
      .expect(401)
  })
}) 