import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { UserService, CreateUserData } from '../services/userService';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { ApiError } from '../middleware/error';
import { validate } from '@recipe-manager/shared';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// Registration schema
const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  name: z.string().min(1).max(100),
});

// Login schema
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Update profile schema
const UpdateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
});

// Change password schema
const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(100),
});

// POST /auth/register
router.post('/register', asyncHandler(async (req: Request, res: Response) => {
  const validatedData = validate(RegisterSchema, req.body);
  
  const userData: CreateUserData = {
    email: validatedData.email,
    password: validatedData.password,
    name: validatedData.name,
  };

  const user = await UserService.createUser(userData);
  
  res.status(201).json({
    message: 'User created successfully',
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
}));

// POST /auth/login
router.post('/login', asyncHandler(async (req: Request, res: Response) => {
  const credentials = validate(LoginSchema, req.body);
  
  const result = await UserService.login(credentials);
  
  res.json({
    message: 'Login successful',
    user: result.user,
    accessToken: result.tokens.accessToken,
    refreshToken: result.tokens.refreshToken,
  });
}));

// GET /auth/me
router.get('/me', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const { userId } = (req as AuthenticatedRequest).user;
  
  const user = await UserService.findById(userId);
  
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  
  res.json({ user });
}));

// PUT /auth/profile
router.put('/profile', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const { userId } = (req as AuthenticatedRequest).user;
  const updates = validate(UpdateProfileSchema, req.body);
  
  const user = await UserService.updateProfile(userId, updates);
  
  res.json({
    message: 'Profile updated successfully',
    user,
  });
}));

// POST /auth/change-password
router.post('/change-password', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const { userId } = (req as AuthenticatedRequest).user;
  const { currentPassword, newPassword } = validate(ChangePasswordSchema, req.body);
  
  await UserService.changePassword(userId, currentPassword, newPassword);
  
  res.json({
    message: 'Password changed successfully',
  });
}));

export default router; 