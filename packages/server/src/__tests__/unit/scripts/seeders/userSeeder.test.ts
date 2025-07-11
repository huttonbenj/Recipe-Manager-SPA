import { describe, it, expect, vi, beforeEach } from 'vitest';

declare global {
  var __mockPrismaInstance: any;
}

vi.mock('../../../../utils/logger', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  }
}));

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(async (pw) => `hashed-${pw}`),
  },
}));

vi.mock('../../../../generated/prisma', () => {
  const mockInstance = {
    user: {
      create: vi.fn(),
      deleteMany: vi.fn(),
    },
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  };
  globalThis.__mockPrismaInstance = mockInstance;
  return {
    PrismaClient: vi.fn(() => mockInstance)
  };
});

import { seedUsers } from '../../../../scripts/seeders/userSeeder';

describe('userSeeder', () => {
  const mockPrisma = globalThis.__mockPrismaInstance;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('seeds users and hashes passwords', async () => {
    mockPrisma.user.deleteMany.mockResolvedValue({});
    mockPrisma.user.create.mockResolvedValue({ 
      email: 'a@b.com', 
      name: 'A', 
      password_hash: 'hashed-pw' 
    });
    
    const users = await seedUsers();
    expect(users.length).toBeGreaterThan(0);
    expect(users[0]!.password_hash.startsWith('hashed-')).toBe(true);
  });

  it('handles errors', async () => {
    mockPrisma.user.deleteMany.mockRejectedValueOnce(new Error('fail'));
    await expect(seedUsers()).rejects.toThrow('fail');
  });
}); 