import { db } from '../config/database';

// Configure test environment
process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'recipe_manager_test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-integration-tests';
process.env.JWT_REFRESH_SECRET = 'test-jwt-refresh-secret-key-for-integration-tests';

beforeAll(async () => {
  // Ensure database connection is established
  await db.healthCheck();
});

afterAll(async () => {
  // Close database connections after all tests
  await db.close();
}); 