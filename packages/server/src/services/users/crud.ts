import { prisma } from '../../config/database';
import { AuthUtils } from '../../utils/auth';
import logger from '../../utils/logger';
import { CreateUserData, UpdateUserData, SanitizedUser, sanitizeUser } from './types';

export class UserCrudService {
  static async createUser(userData: CreateUserData): Promise<SanitizedUser> {
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

  static async getUserById(id: string): Promise<SanitizedUser | null> {
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

  static async getUserByEmail(email: string): Promise<SanitizedUser | null> {
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

  static async updateUser(id: string, userData: UpdateUserData): Promise<SanitizedUser> {
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

  static async getAllUsers(): Promise<SanitizedUser[]> {
    try {
      const users = await prisma.user.findMany({
        orderBy: {
          created_at: 'desc',
        },
      });

      return users.map(sanitizeUser);
    } catch (error) {
      logger.error('Error fetching all users:', error);
      throw new Error('Failed to fetch users');
    }
  }
} 