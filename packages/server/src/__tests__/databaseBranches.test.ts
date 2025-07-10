import { dbManager } from '../config/database';

/**
 * These tests exercise the success-path branches inside Database manager
 * to raise overall branch coverage without requiring a live database connection.
 */

describe('Database utility branches', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should connect to database successfully', async () => {
    // Arrange: Mock the Prisma client connect method
    const mockConnect = jest.fn().mockResolvedValue(undefined);
    jest.spyOn(dbManager.getClient(), '$connect').mockImplementation(mockConnect);

    // Act
    await dbManager.connect();

    // Assert
    expect(mockConnect).toHaveBeenCalled();
  });

  it('should disconnect from database successfully', async () => {
    // Arrange: Mock the Prisma client disconnect method
    const mockDisconnect = jest.fn().mockResolvedValue(undefined);
    jest.spyOn(dbManager.getClient(), '$disconnect').mockImplementation(mockDisconnect);

    // Act
    await dbManager.disconnect();

    // Assert
    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('should perform health check successfully', async () => {
    // Arrange: Mock the Prisma client queryRaw method
    const mockQueryRaw = jest.fn().mockResolvedValue([{ result: 1 }]);
    jest.spyOn(dbManager.getClient(), '$queryRaw').mockImplementation(mockQueryRaw);

    // Act
    const result = await dbManager.healthCheck();

    // Assert
    expect(result).toBe(true);
    expect(mockQueryRaw).toHaveBeenCalled();
  });
}); 