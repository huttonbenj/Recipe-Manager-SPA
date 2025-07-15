/**
 * Simple Test Setup
 * Sets up minimal environment variables for testing without database
 */

import path from 'path'

// Set minimal required environment variables for testing
process.env.NODE_ENV = 'test'
// Use SQLite for tests, matching env-setup.js
process.env.DATABASE_URL = `file:${path.join(process.cwd(), 'tests', 'test.db')}`
process.env.JWT_SECRET = 'test-jwt-secret-at-least-32-characters-long-for-testing'
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-at-least-32-characters-long-for-testing'
process.env.FRONTEND_URL = 'http://localhost:3000'
process.env.ALLOWED_ORIGINS = 'http://localhost:3000,http://localhost:5173'
process.env.PORT = '3001' 