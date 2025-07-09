import { UserService } from '../userService';
import { db } from '../../config/database';
import { AuthUtils } from '../../utils/auth';
import { ApiError } from '../../middleware/error';

// Mock dependencies
jest.mock('../../config/database');
jest.mock('../../utils/auth');

const mockDb = db as jest.Mocked<typeof db>;
const mockAuthUtils = AuthUtils as jest.Mocked<typeof AuthUtils>;

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    const validUserData = {
      email: 'test@example.com',
      password: 'StrongP@ssw0rd',
      name: 'Test User',
    };

    it('should create user successfully', async () => {
      const hashedPassword = 'hashedPassword';
      const createdUser = {
        id: 'user123',
        email: validUserData.email,
        name: validUserData.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockAuthUtils.validatePassword.mockReturnValue({ isValid: true, errors: [] });
      mockDb.query.mockResolvedValueOnce([]); // findByEmail returns empty
      mockAuthUtils.hashPassword.mockResolvedValue(hashedPassword);
      mockDb.query.mockResolvedValueOnce([createdUser]); // create user

      const result = await UserService.createUser(validUserData);

      expect(mockAuthUtils.validatePassword).toHaveBeenCalledWith(validUserData.password);
      expect(mockAuthUtils.hashPassword).toHaveBeenCalledWith(validUserData.password);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),
        [validUserData.email, hashedPassword, validUserData.name]
      );
      expect(result).toEqual(createdUser);
    });

    it('should throw error for invalid password', async () => {
      const invalidUserData = {
        ...validUserData,
        password: 'weak',
      };

      mockAuthUtils.validatePassword.mockReturnValue({
        isValid: false,
        errors: ['Password is too weak'],
      });

      await expect(UserService.createUser(invalidUserData)).rejects.toThrow(ApiError);
      expect(mockDb.query).not.toHaveBeenCalled();
    });

    it('should throw error if user already exists', async () => {
      const existingUser = {
        id: 'existing123',
        email: validUserData.email,
        name: 'Existing User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockAuthUtils.validatePassword.mockReturnValue({ isValid: true, errors: [] });
      mockDb.query.mockResolvedValueOnce([existingUser]); // findByEmail returns user

      await expect(UserService.createUser(validUserData)).rejects.toThrow(ApiError);
      expect(mockAuthUtils.hashPassword).not.toHaveBeenCalled();
    });

    it('should throw error if database insert fails', async () => {
      mockAuthUtils.validatePassword.mockReturnValue({ isValid: true, errors: [] });
      mockDb.query.mockResolvedValueOnce([]); // findByEmail returns empty
      mockAuthUtils.hashPassword.mockResolvedValue('hashedPassword');
      mockDb.query.mockResolvedValueOnce([]); // create user returns empty

      await expect(UserService.createUser(validUserData)).rejects.toThrow(ApiError);
    });
  });

  describe('login', () => {
    const credentials = {
      email: 'test@example.com',
      password: 'StrongP@ssw0rd',
    };

    const userWithPassword = {
      id: 'user123',
      email: credentials.email,
      passwordHash: 'hashedPassword',
      name: 'Test User',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should login successfully with valid credentials', async () => {
      const tokens = {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      };

      mockDb.query.mockResolvedValue([userWithPassword]);
      mockAuthUtils.comparePassword.mockResolvedValue(true);
      mockAuthUtils.generateTokens.mockReturnValue(tokens);

      const result = await UserService.login(credentials);

      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT id, email, password_hash'),
        [credentials.email]
      );
      expect(mockAuthUtils.comparePassword).toHaveBeenCalledWith(
        credentials.password,
        userWithPassword.passwordHash
      );
      expect(mockAuthUtils.generateTokens).toHaveBeenCalledWith(userWithPassword);
      expect(result.user).toEqual({
        id: userWithPassword.id,
        email: userWithPassword.email,
        name: userWithPassword.name,
        createdAt: userWithPassword.createdAt,
        updatedAt: userWithPassword.updatedAt,
      });
      expect(result.tokens).toEqual(tokens);
    });

    it('should throw error for non-existent user', async () => {
      mockDb.query.mockResolvedValue([]);

      await expect(UserService.login(credentials)).rejects.toThrow(ApiError);
      expect(mockAuthUtils.comparePassword).not.toHaveBeenCalled();
    });

    it('should throw error for invalid password', async () => {
      mockDb.query.mockResolvedValue([userWithPassword]);
      mockAuthUtils.comparePassword.mockResolvedValue(false);

      await expect(UserService.login(credentials)).rejects.toThrow(ApiError);
      expect(mockAuthUtils.generateTokens).not.toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      const user = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDb.query.mockResolvedValue([user]);

      const result = await UserService.findById('user123');

      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT id, email, name'),
        ['user123']
      );
      expect(result).toEqual(user);
    });

    it('should return null when user not found', async () => {
      mockDb.query.mockResolvedValue([]);

      const result = await UserService.findById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('updateProfile', () => {
    const userId = 'user123';
    const updates = { name: 'Updated Name' };

    it('should update user profile successfully', async () => {
      const updatedUser = {
        id: userId,
        email: 'test@example.com',
        name: updates.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDb.query.mockResolvedValue([updatedUser]);

      const result = await UserService.updateProfile(userId, updates);

      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE users'),
        [updates.name, userId]
      );
      expect(result).toEqual(updatedUser);
    });

    it('should throw error when no fields to update', async () => {
      await expect(UserService.updateProfile(userId, {})).rejects.toThrow(ApiError);
      expect(mockDb.query).not.toHaveBeenCalled();
    });

    it('should throw error when user not found', async () => {
      mockDb.query.mockResolvedValue([]);

      await expect(UserService.updateProfile(userId, updates)).rejects.toThrow(ApiError);
    });
  });

  describe('changePassword', () => {
    const userId = 'user123';
    const currentPassword = 'oldPassword';
    const newPassword = 'NewP@ssw0rd';

    const userWithPassword = {
      id: userId,
      email: 'test@example.com',
      passwordHash: 'oldHashedPassword',
      name: 'Test User',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should change password successfully', async () => {
      const newHashedPassword = 'newHashedPassword';

      mockDb.query.mockResolvedValueOnce([userWithPassword]); // findByIdWithPassword
      mockAuthUtils.comparePassword.mockResolvedValue(true);
      mockAuthUtils.validatePassword.mockReturnValue({ isValid: true, errors: [] });
      mockAuthUtils.hashPassword.mockResolvedValue(newHashedPassword);
      mockDb.query.mockResolvedValueOnce([]); // update password

      await UserService.changePassword(userId, currentPassword, newPassword);

      expect(mockAuthUtils.comparePassword).toHaveBeenCalledWith(
        currentPassword,
        userWithPassword.passwordHash
      );
      expect(mockAuthUtils.validatePassword).toHaveBeenCalledWith(newPassword);
      expect(mockAuthUtils.hashPassword).toHaveBeenCalledWith(newPassword);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE users'),
        [newHashedPassword, userId]
      );
    });

    it('should throw error when user not found', async () => {
      mockDb.query.mockResolvedValue([]);

      await expect(UserService.changePassword(userId, currentPassword, newPassword)).rejects.toThrow(ApiError);
    });

    it('should throw error when current password is incorrect', async () => {
      mockDb.query.mockResolvedValue([userWithPassword]);
      mockAuthUtils.comparePassword.mockResolvedValue(false);

      await expect(UserService.changePassword(userId, currentPassword, newPassword)).rejects.toThrow(ApiError);
    });

    it('should throw error when new password is invalid', async () => {
      mockDb.query.mockResolvedValue([userWithPassword]);
      mockAuthUtils.comparePassword.mockResolvedValue(true);
      mockAuthUtils.validatePassword.mockReturnValue({
        isValid: false,
        errors: ['Password is too weak'],
      });

      await expect(UserService.changePassword(userId, currentPassword, newPassword)).rejects.toThrow(ApiError);
    });
  });
}); 