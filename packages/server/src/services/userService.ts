import { User } from '../generated/prisma';
import { prisma } from '../config/database';
import { AuthUtils } from '../utils/auth';
import logger from '../utils/logger';

export interface CreateUserData {
  email: string;
  name: string;
  password: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
}

export interface UserLoginData {
  email: string;
  password: string;
}

// Helper function to sanitize user response
const sanitizeUser = (user: User): Omit<User, 'password_hash'> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password_hash, ...sanitizedUser } = user;
  return sanitizedUser;
};

export class UserService {
  static async createUser(userData: CreateUserData): Promise<Omit<User, 'password_hash'>> {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hash password
      const hashedPassword = await AuthUtils.hashPassword(userData.password);

      // Create user
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          password_hash: hashedPassword,
        },
      });

      logger.info(`Created user: ${user.email}`);

      return sanitizeUser(user);
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error instanceof Error ? error : new Error('Failed to create user');
    }
  }

  static async getUserById(id: string): Promise<Omit<User, 'password_hash'> | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });

      return user ? sanitizeUser(user) : null;
    } catch (error) {
      logger.error('Error fetching user by ID:', error);
      throw new Error('Failed to fetch user');
    }
  }

  static async getUserByEmail(email: string): Promise<Omit<User, 'password_hash'> | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      return user ? sanitizeUser(user) : null;
    } catch (error) {
      logger.error('Error fetching user by email:', error);
      throw new Error('Failed to fetch user');
    }
  }

  static async updateUser(id: string, userData: UpdateUserData): Promise<Omit<User, 'password_hash'>> {
    try {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        throw new Error('User not found');
      }

      // Check if email is being updated and already exists
      if (userData.email && userData.email !== existingUser.email) {
        const emailExists = await prisma.user.findUnique({
          where: { email: userData.email },
        });

        if (emailExists) {
          throw new Error('Email already in use');
        }
      }

      // Update user
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          ...userData,
          updated_at: new Date(),
        },
      });

      logger.info(`Updated user: ${updatedUser.email}`);

      return sanitizeUser(updatedUser);
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error instanceof Error ? error : new Error('Failed to update user');
    }
  }

  static async deleteUser(id: string): Promise<void> {
    try {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id },
        select: { email: true },
      });

      if (!existingUser) {
        throw new Error('User not found');
      }

      // Delete user (recipes will be deleted due to cascade)
      await prisma.user.delete({
        where: { id },
      });

      logger.info(`Deleted user: ${existingUser.email}`);
    } catch (error) {
      logger.error('Error deleting user:', error);
      throw error instanceof Error ? error : new Error('Failed to delete user');
    }
  }

  static async authenticateUser(loginData: UserLoginData): Promise<Omit<User, 'password_hash'> | null> {
    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: loginData.email },
      });

      if (!user) {
        return null;
      }

      // Verify password
      const isPasswordValid = await AuthUtils.comparePassword(
        loginData.password,
        user.password_hash
      );

      if (!isPasswordValid) {
        return null;
      }

      logger.info(`User authenticated: ${user.email}`);

      return sanitizeUser(user);
    } catch (error) {
      logger.error('Error authenticating user:', error);
      throw new Error('Failed to authenticate user');
    }
  }

  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      // Find user
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await AuthUtils.comparePassword(
        currentPassword,
        user.password_hash
      );

      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Validate new password
      const validation = AuthUtils.validatePassword(newPassword);
      if (!validation.isValid) {
        throw new Error(`Password validation failed: ${validation.errors.join(', ')}`);
      }

      // Hash new password
      const hashedNewPassword = await AuthUtils.hashPassword(newPassword);

      // Update password
      await prisma.user.update({
        where: { id: userId },
        data: {
          password_hash: hashedNewPassword,
          updated_at: new Date(),
        },
      });

      logger.info(`Password changed for user: ${user.email}`);
    } catch (error) {
      logger.error('Error changing password:', error);
      throw error instanceof Error ? error : new Error('Failed to change password');
    }
  }

  static async getUserProfile(userId: string): Promise<Omit<User, 'password_hash'> | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          created_at: true,
          updated_at: true,
        },
      });

      return user;
    } catch (error) {
      logger.error('Error fetching user profile:', error);
      throw new Error('Failed to fetch user profile');
    }
  }

  static async getUserStats(userId: string): Promise<{
    totalRecipes: number;
    recipesByCategory: Array<{ category: string; count: number }>;
  }> {
    try {
      const [totalRecipes, recipesByCategory] = await Promise.all([
        prisma.recipe.count({
          where: { user_id: userId },
        }),
        prisma.recipe.groupBy({
          by: ['category'],
          where: { 
            user_id: userId,
            category: { not: null }
          },
          _count: {
            category: true,
          },
        }),
      ]);

      return {
        totalRecipes,
        recipesByCategory: recipesByCategory.map(item => ({
          category: item.category || 'Uncategorized',
          count: item._count.category,
        })),
      };
    } catch (error) {
      logger.error('Error fetching user stats:', error);
      throw new Error('Failed to fetch user stats');
    }
  }

  static async getAllUsers(): Promise<Array<Omit<User, 'password_hash'>>> {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          created_at: true,
          updated_at: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      return users;
    } catch (error) {
      logger.error('Error fetching all users:', error);
      throw new Error('Failed to fetch users');
    }
  }
} 