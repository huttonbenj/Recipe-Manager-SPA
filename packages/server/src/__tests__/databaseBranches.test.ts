import { db } from '../config/database';

/**
 * These tests exercise the success-path branches inside Database.query, Database.close and getPoolStats
 * to raise overall branch coverage without requiring a live database connection.
 */

describe('Database utility branches', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('query should resolve rows and log on success path', async () => {
    // Arrange: patch the pool.query method to simulate a successful query
    const mockRows = [{ id: 1 }];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const originalQuery = (db as any).pool.query;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (db as any).pool.query = jest.fn().mockResolvedValue({ rowCount: 1, rows: mockRows });

    // Act
    const result = await db.query('SELECT 1');

    // Assert
    expect(result).toEqual(mockRows);

    // Cleanup
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (db as any).pool.query = originalQuery;
  });

  it('close should call pool.end and log on success', async () => {
    // Arrange: patch the pool.end method
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const originalEnd = (db as any).pool.end;
    const mockEnd = jest.fn().mockResolvedValue(undefined);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (db as any).pool.end = mockEnd;

    // Act
    await db.close();

    // Assert
    expect(mockEnd).toHaveBeenCalled();

    // Cleanup
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (db as any).pool.end = originalEnd;
  });

  it('getPoolStats should return numeric counters', () => {
    const stats = db.getPoolStats();
    expect(stats).toHaveProperty('totalCount');
    expect(stats).toHaveProperty('idleCount');
    expect(stats).toHaveProperty('waitingCount');
  });
}); 