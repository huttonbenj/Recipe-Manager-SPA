import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockSeedUsers = vi.fn();
const mockSeedRecipes = vi.fn();
const mockPrismaCount = vi.fn();
const mockPrismaDisconnect = vi.fn();
const mockLoggerInfo = vi.fn();
const mockLoggerError = vi.fn();

vi.mock('../../../utils/logger', () => ({
  default: {
    info: mockLoggerInfo,
    error: mockLoggerError,
    warn: vi.fn(),
    debug: vi.fn(),
  }
}));

vi.mock('../../../scripts/seeders/userSeeder', () => ({
  seedUsers: mockSeedUsers,
}));

vi.mock('../../../scripts/seeders/recipeSeeder', () => ({
  seedRecipes: mockSeedRecipes,
}));

vi.mock('../../../generated/prisma', () => ({
  PrismaClient: vi.fn(() => ({
    user: {
      count: mockPrismaCount,
    },
    recipe: {
      count: mockPrismaCount,
    },
    $disconnect: mockPrismaDisconnect,
  }))
}));

// Mock process.exit to prevent actual exit
const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);

describe('seed script', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('runs seeding process successfully', async () => {
    const mockUsers = [{ id: '1', name: 'Test User' }];
    mockSeedUsers.mockResolvedValue(mockUsers);
    mockSeedRecipes.mockResolvedValue([{ id: '1', title: 'Test Recipe' }]);
    mockPrismaCount.mockResolvedValue(5);
    mockPrismaDisconnect.mockResolvedValue(undefined);

    // Import and run the actual seed function
    const { main } = await import('../../../scripts/seed');
    await main();

    expect(mockLoggerInfo).toHaveBeenCalledWith('Starting database seeding...');
    expect(mockSeedUsers).toHaveBeenCalled();
    expect(mockSeedRecipes).toHaveBeenCalledWith(mockUsers);
    expect(mockPrismaCount).toHaveBeenCalledTimes(2); // user and recipe counts
    expect(mockLoggerInfo).toHaveBeenCalledWith('Database seeding completed successfully!');
    expect(mockLoggerInfo).toHaveBeenCalledWith('Total users: 5');
    expect(mockLoggerInfo).toHaveBeenCalledWith('Total recipes: 5');
    expect(mockPrismaDisconnect).toHaveBeenCalled();
  });

  it('handles errors and calls disconnect', async () => {
    const seedError = new Error('Seeding failed');
    mockSeedUsers.mockRejectedValue(seedError);
    mockPrismaDisconnect.mockResolvedValue(undefined);

    const { main } = await import('../../../scripts/seed');
    await main();

    expect(mockLoggerError).toHaveBeenCalledWith('Error during database seeding:', seedError);
    expect(mockExit).toHaveBeenCalledWith(1);
    expect(mockPrismaDisconnect).toHaveBeenCalled();
  });

  it('handles recipe seeding errors', async () => {
    const mockUsers = [{ id: '1', name: 'Test User' }];
    const recipeError = new Error('Recipe seeding failed');
    mockSeedUsers.mockResolvedValue(mockUsers);
    mockSeedRecipes.mockRejectedValue(recipeError);
    mockPrismaDisconnect.mockResolvedValue(undefined);

    const { main } = await import('../../../scripts/seed');
    await main();

    expect(mockLoggerError).toHaveBeenCalledWith('Error during database seeding:', recipeError);
    expect(mockExit).toHaveBeenCalledWith(1);
    expect(mockPrismaDisconnect).toHaveBeenCalled();
  });

  it('handles database count errors', async () => {
    const mockUsers = [{ id: '1', name: 'Test User' }];
    const countError = new Error('Count failed');
    mockSeedUsers.mockResolvedValue(mockUsers);
    mockSeedRecipes.mockResolvedValue([{ id: '1', title: 'Test Recipe' }]);
    mockPrismaCount.mockRejectedValue(countError);
    mockPrismaDisconnect.mockResolvedValue(undefined);

    const { main } = await import('../../../scripts/seed');
    await main();

    expect(mockLoggerError).toHaveBeenCalledWith('Error during database seeding:', countError);
    expect(mockExit).toHaveBeenCalledWith(1);
    expect(mockPrismaDisconnect).toHaveBeenCalled();
  });
}); 