import { prisma } from '../../config/database';
import { AuthUtils } from '../../utils/auth';
import logger from '../../utils/logger';
import { UserLoginData, SanitizedUser, sanitizeUser } from './types';

export class UserAuthService {
  static async authenticateUser(loginData: UserLoginData): Promise<SanitizedUser | null> {
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
} 