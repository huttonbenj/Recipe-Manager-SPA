import { Database, db } from '../database';

// Mock the pg module
jest.mock('pg', () => {
  const mockQuery = jest.fn();
  const mockConnect = jest.fn();
  const mockEnd = jest.fn();
  const mockOn = jest.fn();

  const mockPool = {
    query: mockQuery,
    connect: mockConnect,
    end: mockEnd,
    on: mockOn,
    totalCount: 10,
    idleCount: 5,
    waitingCount: 2,
  };

  return {
    Pool: jest.fn(() => mockPool),
  };
});

// Mock logger
jest.mock('../../utils/logger', () => ({
  debug: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
}));

interface MockPool {
  query: jest.MockedFunction<(...args: unknown[]) => Promise<unknown>>;
  connect: jest.MockedFunction<() => Promise<unknown>>;
  end: jest.MockedFunction<() => Promise<void>>;
  on: jest.MockedFunction<(event: string, listener: (...args: unknown[]) => void) => void>;
  totalCount: number;
  idleCount: number;
  waitingCount: number;
}

describe('Database', () => {
  let database: Database;
  let mockPool: MockPool;

  beforeEach(() => {
    jest.clearAllMocks();
    database = new Database();
    // Get the mocked pool instance
    const pg = jest.requireMock('pg');
    mockPool = new pg.Pool() as MockPool;
  });

  describe('constructor', () => {
    it('should create a new database instance with pool', () => {
      expect(database).toBeInstanceOf(Database);
      expect(mockPool.on).toHaveBeenCalledWith('connect', expect.any(Function));
      expect(mockPool.on).toHaveBeenCalledWith('error', expect.any(Function));
      expect(mockPool.on).toHaveBeenCalledWith('remove', expect.any(Function));
    });
  });

  describe('query', () => {
    it('should execute query successfully', async () => {
      const mockResult = {
        rows: [{ id: 1, name: 'test' }],
        rowCount: 1,
      };
      mockPool.query.mockResolvedValue(mockResult);

      const result = await database.query('SELECT * FROM test');

      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM test', undefined);
      expect(result).toEqual([{ id: 1, name: 'test' }]);
    });

    it('should execute query with parameters', async () => {
      const mockResult = {
        rows: [{ id: 1, name: 'test' }],
        rowCount: 1,
      };
      mockPool.query.mockResolvedValue(mockResult);

      const result = await database.query('SELECT * FROM test WHERE id = $1', [1]);

      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM test WHERE id = $1', [1]);
      expect(result).toEqual([{ id: 1, name: 'test' }]);
    });

    it('should handle query errors', async () => {
      const error = new Error('Query failed');
      mockPool.query.mockRejectedValue(error);

      await expect(database.query('SELECT * FROM test')).rejects.toThrow('Query failed');
    });

    it('should handle query errors with non-Error object', async () => {
      const error = 'String error';
      mockPool.query.mockRejectedValue(error);

      await expect(database.query('SELECT * FROM test')).rejects.toEqual('String error');
    });
  });

  describe('getClient', () => {
    it('should return a database client', async () => {
      const mockClient = { processID: 123 };
      mockPool.connect.mockResolvedValue(mockClient);

      const client = await database.getClient();

      expect(mockPool.connect).toHaveBeenCalled();
      expect(client).toBe(mockClient);
    });
  });

  describe('healthCheck', () => {
    it('should return true when database is healthy', async () => {
      const mockResult = [{ current_time: new Date() }];
      mockPool.query.mockResolvedValue({ rows: mockResult, rowCount: 1 });

      const isHealthy = await database.healthCheck();

      expect(isHealthy).toBe(true);
      expect(mockPool.query).toHaveBeenCalledWith('SELECT NOW() as current_time', undefined);
    });

    it('should return false when database check fails', async () => {
      mockPool.query.mockRejectedValue(new Error('Connection failed'));

      const isHealthy = await database.healthCheck();

      expect(isHealthy).toBe(false);
    });

    it('should handle health check error with non-Error object', async () => {
      const error = 'String error';
      mockPool.query.mockRejectedValue(error);

      const isHealthy = await database.healthCheck();

      expect(isHealthy).toBe(false);
    });

    it('should return false when query returns no results', async () => {
      mockPool.query.mockResolvedValue({ rows: [], rowCount: 0 });

      const isHealthy = await database.healthCheck();

      expect(isHealthy).toBe(false);
    });
  });

  describe('close', () => {
    it('should close the database pool', async () => {
      mockPool.end.mockResolvedValue(undefined);

      await database.close();

      expect(mockPool.end).toHaveBeenCalled();
    });

    it('should handle close errors', async () => {
      const error = new Error('Close failed');
      mockPool.end.mockRejectedValue(error);

      await expect(database.close()).resolves.not.toThrow();
    });

    it('should handle close errors with non-Error object', async () => {
      const error = 'String error';
      mockPool.end.mockRejectedValue(error);

      await expect(database.close()).resolves.not.toThrow();
    });
  });

  describe('getPoolStats', () => {
    it('should return pool statistics', () => {
      const stats = database.getPoolStats();

      expect(stats).toEqual({
        totalCount: 10,
        idleCount: 5,
        waitingCount: 2,
      });
    });
  });
});

describe('db instance', () => {
  it('should export a database instance', () => {
    expect(db).toBeInstanceOf(Database);
  });
}); 