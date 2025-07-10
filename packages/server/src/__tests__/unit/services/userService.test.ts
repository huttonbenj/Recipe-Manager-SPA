import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserService, CreateUserData, UpdateUserData, UserLoginData } from '../../../services/userService';
import { AuthUtils } from '../../../utils/auth';
import { prisma } from '../../../config/database';

// Mock dependencies
vi.mock('../../../config/database', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
      findMany: vi.fn(),
    },
    recipe: {
      count: vi.fn(),
      groupBy: vi.fn(),
    },
  }
}));

vi.mock('../../../utils/auth', () => ({
  AuthUtils: {
    hashPassword: vi.fn(),
    comparePassword: vi.fn(),
    validatePassword: vi.fn(),
  }
}));

describe('UserService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const userData: CreateUserData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123'
      };

      const hashedPassword = 'hashed-password';
      const mockUser = {
        id: 'user-id',
        email: userData.email,
        name: userData.name,
        password_hash: hashedPassword,
        created_at: new Date(),
        updated_at: new Date()
      };

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);
      (AuthUtils.hashPassword as ReturnType<typeof vi.fn>).mockResolvedValue(hashedPassword);
      (prisma.user.create as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser);

      const result = await UserService.createUser(userData);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: userData.email }
      });
      expect(AuthUtils.hashPassword).toHaveBeenCalledWith(userData.password);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: userData.email,
          name: userData.name,
          password_hash: hashedPassword,
        }
      });
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        created_at: mockUser.created_at,
        updated_at: mockUser.updated_at
      });
    });

    it('should throw error if user already exists', async () => {
      const userData: CreateUserData = {
        email: 'existing@example.com',
        name: 'Existing User',
        password: 'password123'
      };

      const existingUser = {
        id: 'existing-user-id',
        email: userData.email,
        name: userData.name,
        password_hash: 'hashed-password',
        created_at: new Date(),
        updated_at: new Date()
      };

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(existingUser);

      await expect(UserService.createUser(userData)).rejects.toThrow('User with this email already exists');
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      const userData: CreateUserData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123'
      };

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);
      (AuthUtils.hashPassword as ReturnType<typeof vi.fn>).mockResolvedValue('hashed-password');
      (prisma.user.create as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Database error'));

      await expect(UserService.createUser(userData)).rejects.toThrow('Database error');
    });
  });

  describe('getUserById', () => {
    it('should return user by ID', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        name: 'Test User',
        password_hash: 'hashed-password',
        created_at: new Date(),
        updated_at: new Date()
      };

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser);

      const result = await UserService.getUserById('user-id');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-id' }
      });
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        created_at: mockUser.created_at,
        updated_at: mockUser.updated_at
      });
    });

    it('should return null if user not found', async () => {
      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      const result = await UserService.getUserById('non-existent-id');

      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Database error'));

      await expect(UserService.getUserById('user-id')).rejects.toThrow('Failed to fetch user');
    });
  });

  describe('getUserByEmail', () => {
    it('should return user by email', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        name: 'Test User',
        password_hash: 'hashed-password',
        created_at: new Date(),
        updated_at: new Date()
      };

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser);

      const result = await UserService.getUserByEmail('test@example.com');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' }
      });
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        created_at: mockUser.created_at,
        updated_at: mockUser.updated_at
      });
    });

    it('should return null if user not found', async () => {
      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      const result = await UserService.getUserByEmail('non-existent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const userId = 'user-id';
      const updateData: UpdateUserData = {
        name: 'Updated Name',
        email: 'updated@example.com'
      };

      const existingUser = {
        id: userId,
        email: 'old@example.com',
        name: 'Old Name',
        password_hash: 'hashed-password',
        created_at: new Date(),
        updated_at: new Date()
      };

      const updatedUser = {
        ...existingUser,
        ...updateData,
        updated_at: new Date()
      };

      (prisma.user.findUnique as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce(existingUser) // First call - check if user exists
        .mockResolvedValueOnce(null); // Second call - check if email exists
      (prisma.user.update as ReturnType<typeof vi.fn>).mockResolvedValue(updatedUser);

      const result = await UserService.updateUser(userId, updateData);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          ...updateData,
          updated_at: expect.any(Date)
        }
      });
      expect(result).toEqual({
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        created_at: updatedUser.created_at,
        updated_at: updatedUser.updated_at
      });
    });

    it('should throw error if user not found', async () => {
      const userId = 'non-existent-id';
      const updateData: UpdateUserData = {
        name: 'Updated Name'
      };

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      await expect(UserService.updateUser(userId, updateData)).rejects.toThrow('User not found');
    });

    it('should throw error if email already exists', async () => {
      const userId = 'user-id';
      const updateData: UpdateUserData = {
        email: 'existing@example.com'
      };

      const existingUser = {
        id: userId,
        email: 'old@example.com',
        name: 'User Name',
        password_hash: 'hashed-password',
        created_at: new Date(),
        updated_at: new Date()
      };

      const emailUser = {
        id: 'other-user-id',
        email: 'existing@example.com',
        name: 'Other User',
        password_hash: 'hashed-password',
        created_at: new Date(),
        updated_at: new Date()
      };

      (prisma.user.findUnique as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce(existingUser) // First call - check if user exists
        .mockResolvedValueOnce(emailUser); // Second call - check if email exists

      await expect(UserService.updateUser(userId, updateData)).rejects.toThrow('Email already in use');
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const userId = 'user-id';
      const existingUser = {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
        password_hash: 'hashed-password',
        created_at: new Date(),
        updated_at: new Date()
      };

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(existingUser);
      (prisma.user.delete as ReturnType<typeof vi.fn>).mockResolvedValue(existingUser);

      await UserService.deleteUser(userId);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        select: { email: true }
      });
      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: userId }
      });
    });

    it('should throw error if user not found', async () => {
      const userId = 'non-existent-id';

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      await expect(UserService.deleteUser(userId)).rejects.toThrow('User not found');
      expect(prisma.user.delete).not.toHaveBeenCalled();
    });
  });

  describe('authenticateUser', () => {
    it('should authenticate user successfully', async () => {
      const loginData: UserLoginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockUser = {
        id: 'user-id',
        email: loginData.email,
        name: 'Test User',
        password_hash: 'hashed-password',
        created_at: new Date(),
        updated_at: new Date()
      };

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser);
      (AuthUtils.comparePassword as ReturnType<typeof vi.fn>).mockResolvedValue(true);

      const result = await UserService.authenticateUser(loginData);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginData.email }
      });
      expect(AuthUtils.comparePassword).toHaveBeenCalledWith(loginData.password, mockUser.password_hash);
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        created_at: mockUser.created_at,
        updated_at: mockUser.updated_at
      });
    });

    it('should return null if user not found', async () => {
      const loginData: UserLoginData = {
        email: 'non-existent@example.com',
        password: 'password123'
      };

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      const result = await UserService.authenticateUser(loginData);

      expect(result).toBeNull();
      expect(AuthUtils.comparePassword).not.toHaveBeenCalled();
    });

    it('should return null if password is invalid', async () => {
      const loginData: UserLoginData = {
        email: 'test@example.com',
        password: 'wrong-password'
      };

      const mockUser = {
        id: 'user-id',
        email: loginData.email,
        name: 'Test User',
        password_hash: 'hashed-password',
        created_at: new Date(),
        updated_at: new Date()
      };

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser);
      (AuthUtils.comparePassword as ReturnType<typeof vi.fn>).mockResolvedValue(false);

      const result = await UserService.authenticateUser(loginData);

      expect(result).toBeNull();
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const userId = 'user-id';
      const currentPassword = 'current-password';
      const newPassword = 'new-password';

      const mockUser = {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
        password_hash: 'current-hashed-password',
        created_at: new Date(),
        updated_at: new Date()
      };

      const newHashedPassword = 'new-hashed-password';
      const updatedUser = {
        ...mockUser,
        password_hash: newHashedPassword,
        updated_at: new Date()
      };

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser);
      (AuthUtils.comparePassword as ReturnType<typeof vi.fn>).mockResolvedValue(true);
      (AuthUtils.validatePassword as ReturnType<typeof vi.fn>).mockReturnValue({ isValid: true, errors: [] });
      (AuthUtils.hashPassword as ReturnType<typeof vi.fn>).mockResolvedValue(newHashedPassword);
      (prisma.user.update as ReturnType<typeof vi.fn>).mockResolvedValue(updatedUser);

      await UserService.changePassword(userId, currentPassword, newPassword);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId }
      });
      expect(AuthUtils.comparePassword).toHaveBeenCalledWith(currentPassword, mockUser.password_hash);
      expect(AuthUtils.hashPassword).toHaveBeenCalledWith(newPassword);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          password_hash: newHashedPassword,
          updated_at: expect.any(Date)
        }
      });
    });

    it('should throw error if user not found', async () => {
      const userId = 'non-existent-id';
      const currentPassword = 'current-password';
      const newPassword = 'new-password';

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      await expect(UserService.changePassword(userId, currentPassword, newPassword))
        .rejects.toThrow('User not found');
      expect(AuthUtils.comparePassword).not.toHaveBeenCalled();
    });

    it('should throw error if current password is invalid', async () => {
      const userId = 'user-id';
      const currentPassword = 'wrong-password';
      const newPassword = 'new-password';

      const mockUser = {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
        password_hash: 'current-hashed-password',
        created_at: new Date(),
        updated_at: new Date()
      };

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser);
      (AuthUtils.comparePassword as ReturnType<typeof vi.fn>).mockResolvedValue(false);

      await expect(UserService.changePassword(userId, currentPassword, newPassword))
        .rejects.toThrow('Current password is incorrect');
      expect(AuthUtils.hashPassword).not.toHaveBeenCalled();
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        {
          id: 'user-1',
          email: 'user1@example.com',
          name: 'User 1',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 'user-2',
          email: 'user2@example.com',
          name: 'User 2',
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      (prisma.user.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(mockUsers);

      const result = await UserService.getAllUsers();

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          email: true,
          name: true,
          created_at: true,
          updated_at: true
        },
        orderBy: {
          created_at: 'desc'
        }
      });
      expect(result).toHaveLength(2);
      expect(result[0]).not.toHaveProperty('password_hash');
      expect(result[1]).not.toHaveProperty('password_hash');
    });
  });

  describe('getUserStats', () => {
    it('should return user statistics', async () => {
      const userId = 'user-id';
      const mockRecipeCount = 5;
      const mockCategoryStats = [
        { category: 'Main Course', _count: { category: 3 } },
        { category: 'Dessert', _count: { category: 2 } }
      ];

      (prisma.recipe.count as ReturnType<typeof vi.fn>).mockResolvedValue(mockRecipeCount);
      (prisma.recipe.groupBy as ReturnType<typeof vi.fn>).mockResolvedValue(mockCategoryStats);

      const result = await UserService.getUserStats(userId);

      expect(prisma.recipe.count).toHaveBeenCalledWith({
        where: { user_id: userId }
      });
      expect(prisma.recipe.groupBy).toHaveBeenCalledWith({
        by: ['category'],
        where: { 
          user_id: userId,
          category: {
            not: null
          }
        },
        _count: { category: true }
      });
      expect(result).toEqual({
        totalRecipes: mockRecipeCount,
        recipesByCategory: [
          { category: 'Main Course', count: 3 },
          { category: 'Dessert', count: 2 }
        ]
      });
    });
  });
}); 