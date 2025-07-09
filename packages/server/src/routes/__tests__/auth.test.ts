import request from 'supertest';
import express from 'express';
import authRoutes from '../auth';
import { UserService } from '../../services/userService';
import { AuthUtils } from '../../utils/auth';
import { errorHandler } from '../../middleware/error';

// Mock dependencies
jest.mock('../../services/userService');
jest.mock('../../utils/auth');

const mockUserService = UserService as jest.Mocked<typeof UserService>;
const mockAuthUtils = AuthUtils as jest.Mocked<typeof AuthUtils>;

// Create test app
const app = express();
app.use(express.json());
app.use('/auth', authRoutes);
// Make sure to add error handler at the end
app.use(errorHandler);

// Add a catch-all error handler for unhandled promise rejections
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  errorHandler(err, req, res, next);
});

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    const validRegistrationData = {
      email: 'test@example.com',
      password: 'StrongP@ssw0rd',
      name: 'Test User',
    };

    it('should register user successfully', async () => {
      const createdUser = {
        id: 'user123',
        email: validRegistrationData.email,
        name: validRegistrationData.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserService.createUser.mockResolvedValue(createdUser);

      const response = await request(app)
        .post('/auth/register')
        .send(validRegistrationData)
        .expect(201);

      expect(response.body.message).toBe('User created successfully');
      expect(response.body.user.id).toBe(createdUser.id);
      expect(response.body.user.email).toBe(createdUser.email);
      expect(response.body.user.name).toBe(createdUser.name);
      expect(response.body.user.createdAt).toBeDefined();
      expect(response.body.user.updatedAt).toBeDefined();
      expect(mockUserService.createUser).toHaveBeenCalledWith(validRegistrationData);
    });

    it('should return 400 for invalid email', async () => {
      const invalidData = {
        ...validRegistrationData,
        email: 'invalid-email',
      };

      const response = await request(app)
        .post('/auth/register')
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toBe('Validation Error');
      expect(mockUserService.createUser).not.toHaveBeenCalled();
    });

    it('should return 400 for short password', async () => {
      const invalidData = {
        ...validRegistrationData,
        password: 'short',
      };

      const response = await request(app)
        .post('/auth/register')
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toBe('Validation Error');
      expect(mockUserService.createUser).not.toHaveBeenCalled();
    });

    it('should return 400 for missing name', async () => {
      const invalidData = {
        email: validRegistrationData.email,
        password: validRegistrationData.password,
      };

      const response = await request(app)
        .post('/auth/register')
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toBe('Validation Error');
      expect(mockUserService.createUser).not.toHaveBeenCalled();
    });
  });

  describe('POST /auth/login', () => {
    const validCredentials = {
      email: 'test@example.com',
      password: 'StrongP@ssw0rd',
    };

    it('should login successfully', async () => {
      const loginResult = {
        user: {
          id: 'user123',
          email: validCredentials.email,
          name: 'Test User',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        tokens: {
          accessToken: 'accessToken',
          refreshToken: 'refreshToken',
        },
      };

      mockUserService.login.mockResolvedValue(loginResult);

      const response = await request(app)
        .post('/auth/login')
        .send(validCredentials)
        .expect(200);

      expect(response.body.message).toBe('Login successful');
      expect(response.body.user.id).toBe(loginResult.user.id);
      expect(response.body.user.email).toBe(loginResult.user.email);
      expect(response.body.user.name).toBe(loginResult.user.name);
      expect(response.body.accessToken).toBe(loginResult.tokens.accessToken);
      expect(response.body.refreshToken).toBe(loginResult.tokens.refreshToken);
      expect(mockUserService.login).toHaveBeenCalledWith(validCredentials);
    });

    it('should return 400 for invalid email format', async () => {
      const invalidCredentials = {
        email: 'invalid-email',
        password: validCredentials.password,
      };

      const response = await request(app)
        .post('/auth/login')
        .send(invalidCredentials)
        .expect(400);

      expect(response.body.error).toBe('Validation Error');
      expect(mockUserService.login).not.toHaveBeenCalled();
    });

    it('should return 400 for missing password', async () => {
      const invalidCredentials = {
        email: validCredentials.email,
      };

      const response = await request(app)
        .post('/auth/login')
        .send(invalidCredentials)
        .expect(400);

      expect(response.body.error).toBe('Validation Error');
      expect(mockUserService.login).not.toHaveBeenCalled();
    });
  });

  describe('GET /auth/me', () => {
    it('should return user profile when authenticated', async () => {
      const user = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockAuthUtils.extractTokenFromHeader.mockReturnValue('validToken');
      mockAuthUtils.verifyToken.mockReturnValue({ userId: user.id, email: user.email });
      mockUserService.findById.mockResolvedValue(user);

      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', 'Bearer validToken')
        .expect(200);

      expect(response.body.user.id).toBe(user.id);
      expect(response.body.user.email).toBe(user.email);
      expect(response.body.user.name).toBe(user.name);
      expect(mockUserService.findById).toHaveBeenCalledWith(user.id);
    });

    it('should return 401 when no token provided', async () => {
      mockAuthUtils.extractTokenFromHeader.mockReturnValue(null);

      const response = await request(app)
        .get('/auth/me')
        .expect(401);

      expect(response.body.error).toBe('Access token required');
      expect(mockUserService.findById).not.toHaveBeenCalled();
    });

    it('should return 404 when user not found', async () => {
      mockAuthUtils.extractTokenFromHeader.mockReturnValue('validToken');
      mockAuthUtils.verifyToken.mockReturnValue({ userId: 'nonexistent', email: 'test@example.com' });
      mockUserService.findById.mockResolvedValue(null);

      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', 'Bearer validToken')
        .expect(404);

      expect(response.body.error).toBe('User not found');
    });
  });

  describe('PUT /auth/profile', () => {
    const updateData = {
      name: 'Updated Name',
    };

    it('should update profile successfully', async () => {
      const updatedUser = {
        id: 'user123',
        email: 'test@example.com',
        name: updateData.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockAuthUtils.extractTokenFromHeader.mockReturnValue('validToken');
      mockAuthUtils.verifyToken.mockReturnValue({ userId: updatedUser.id, email: updatedUser.email });
      mockUserService.updateProfile.mockResolvedValue(updatedUser);

      const response = await request(app)
        .put('/auth/profile')
        .set('Authorization', 'Bearer validToken')
        .send(updateData)
        .expect(200);

      expect(response.body.message).toBe('Profile updated successfully');
      expect(response.body.user.id).toBe(updatedUser.id);
      expect(response.body.user.email).toBe(updatedUser.email);
      expect(response.body.user.name).toBe(updatedUser.name);
      expect(mockUserService.updateProfile).toHaveBeenCalledWith(updatedUser.id, updateData);
    });

    it('should return 401 when not authenticated', async () => {
      mockAuthUtils.extractTokenFromHeader.mockReturnValue(null);

      const response = await request(app)
        .put('/auth/profile')
        .send(updateData)
        .expect(401);

      expect(response.body.error).toBe('Access token required');
      expect(mockUserService.updateProfile).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid name', async () => {
      const invalidData = {
        name: '', // Empty name
      };

      mockAuthUtils.extractTokenFromHeader.mockReturnValue('validToken');
      mockAuthUtils.verifyToken.mockReturnValue({ userId: 'user123', email: 'test@example.com' });

      const response = await request(app)
        .put('/auth/profile')
        .set('Authorization', 'Bearer validToken')
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toBe('Validation Error');
      expect(mockUserService.updateProfile).not.toHaveBeenCalled();
    });
  });

  describe('POST /auth/change-password', () => {
    const passwordData = {
      currentPassword: 'OldP@ssw0rd',
      newPassword: 'NewP@ssw0rd',
    };

    it('should change password successfully', async () => {
      mockAuthUtils.extractTokenFromHeader.mockReturnValue('validToken');
      mockAuthUtils.verifyToken.mockReturnValue({ userId: 'user123', email: 'test@example.com' });
      mockUserService.changePassword.mockResolvedValue();

      const response = await request(app)
        .post('/auth/change-password')
        .set('Authorization', 'Bearer validToken')
        .send(passwordData)
        .expect(200);

      expect(response.body).toEqual({
        message: 'Password changed successfully',
      });
      expect(mockUserService.changePassword).toHaveBeenCalledWith(
        'user123',
        passwordData.currentPassword,
        passwordData.newPassword
      );
    });

    it('should return 401 when not authenticated', async () => {
      mockAuthUtils.extractTokenFromHeader.mockReturnValue(null);

      const response = await request(app)
        .post('/auth/change-password')
        .send(passwordData)
        .expect(401);

      expect(response.body.error).toBe('Access token required');
      expect(mockUserService.changePassword).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid new password', async () => {
      const invalidData = {
        currentPassword: 'OldP@ssw0rd',
        newPassword: 'weak', // Too weak
      };

      mockAuthUtils.extractTokenFromHeader.mockReturnValue('validToken');
      mockAuthUtils.verifyToken.mockReturnValue({ userId: 'user123', email: 'test@example.com' });

      const response = await request(app)
        .post('/auth/change-password')
        .set('Authorization', 'Bearer validToken')
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toBe('Validation Error');
      expect(mockUserService.changePassword).not.toHaveBeenCalled();
    });

    it('should return 400 for missing current password', async () => {
      const invalidData = {
        newPassword: 'NewP@ssw0rd',
      };

      mockAuthUtils.extractTokenFromHeader.mockReturnValue('validToken');
      mockAuthUtils.verifyToken.mockReturnValue({ userId: 'user123', email: 'test@example.com' });

      const response = await request(app)
        .post('/auth/change-password')
        .set('Authorization', 'Bearer validToken')
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toBe('Validation Error');
      expect(mockUserService.changePassword).not.toHaveBeenCalled();
    });
  });
}); 