import { dbManager } from '../config/database';

// Set up test database connection
beforeAll(async () => {
  await dbManager.connect();
});

// Clean up after tests
afterAll(async () => {
  await dbManager.disconnect();
}); 