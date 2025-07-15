/**
 * Simple Test Setup
 * Sets up minimal environment variables for testing without database
 */

// Set minimal required environment variables for testing
process.env.NODE_ENV = 'test'
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db'
process.env.JWT_SECRET = 'test-jwt-secret-at-least-32-characters-long-for-testing'
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-at-least-32-characters-long-for-testing'
process.env.FRONTEND_URL = 'http://localhost:3000'
process.env.ALLOWED_ORIGINS = 'http://localhost:3000,http://localhost:5173'
process.env.PORT = '3001' 