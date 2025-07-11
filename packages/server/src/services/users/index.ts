// Export all user service classes
export { UserCrudService } from './crud';
export { UserAuthService } from './auth';
export { UserStatsService } from './stats';

// Export types
export * from './types';

// Import for use in main service
import { UserCrudService } from './crud';
import { UserAuthService } from './auth';
import { UserStatsService } from './stats';

// Main UserService that combines all functionality
export class UserService {
  // CRUD operations
  static async createUser(userData: import('./types').CreateUserData) {
    return UserCrudService.createUser(userData);
  }

  static async getUserById(id: string) {
    return UserCrudService.getUserById(id);
  }

  static async getUserByEmail(email: string) {
    return UserCrudService.getUserByEmail(email);
  }

  static async updateUser(id: string, userData: import('./types').UpdateUserData) {
    return UserCrudService.updateUser(id, userData);
  }

  static async deleteUser(id: string) {
    return UserCrudService.deleteUser(id);
  }

  static async getAllUsers() {
    return UserCrudService.getAllUsers();
  }

  // Authentication operations
  static async authenticateUser(loginData: import('./types').UserLoginData) {
    return UserAuthService.authenticateUser(loginData);
  }

  static async changePassword(userId: string, currentPassword: string, newPassword: string) {
    return UserAuthService.changePassword(userId, currentPassword, newPassword);
  }

  // Stats operations
  static async getUserProfile(userId: string) {
    return UserStatsService.getUserProfile(userId);
  }

  static async getUserStats(userId: string) {
    return UserStatsService.getUserStats(userId);
  }
} 