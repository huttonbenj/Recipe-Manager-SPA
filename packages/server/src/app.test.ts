import request from 'supertest';
import app from './app';

// Mock the database module
jest.mock('./config/database', () => ({
  db: {
    healthCheck: jest.fn(),
    getPoolStats: jest.fn(() => ({
      totalCount: 10,
      idleCount: 5,
      waitingCount: 2,
    })),
  },
}));

describe('App', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('GET /health/db', () => {
    const db = jest.requireMock('./config/database').db;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return healthy database status', async () => {
      db.healthCheck.mockResolvedValue(true);

      const response = await request(app)
        .get('/health/db')
        .expect(200);

      expect(response.body).toEqual({
        status: 'ok',
        database: 'connected',
        pool: {
          totalCount: 10,
          idleCount: 5,
          waitingCount: 2,
        },
      });
    });

    it('should return unhealthy database status', async () => {
      db.healthCheck.mockResolvedValue(false);

      const response = await request(app)
        .get('/health/db')
        .expect(503);

      expect(response.body).toEqual({
        status: 'error',
        database: 'disconnected',
        pool: {
          totalCount: 10,
          idleCount: 5,
          waitingCount: 2,
        },
      });
    });

    it('should handle database health check errors', async () => {
      const error = new Error('Database connection failed');
      db.healthCheck.mockRejectedValue(error);

      const response = await request(app)
        .get('/health/db')
        .expect(503);

      expect(response.body).toEqual({
        status: 'error',
        database: 'error',
        message: 'Database connection failed',
      });
    });

    it('should handle unknown errors', async () => {
      db.healthCheck.mockRejectedValue('Unknown error');

      const response = await request(app)
        .get('/health/db')
        .expect(503);

      expect(response.body).toEqual({
        status: 'error',
        database: 'error',
        message: 'Unknown error',
      });
    });
  });
}); 