import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { UserService } from '../services/userService';
import { asyncHandler } from '../utils/asyncHandler';
import { validate } from '@recipe-manager/shared';

const router = Router();

// Update profile schema
const UpdateProfileSchema = z.object({
  name: z.string().min(1).max(255).optional(),
});

// Change password schema
const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

// Get current user profile
router.get('/profile', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  
  const profile = await UserService.findById(user.userId);
  
  if (!profile) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  
  res.json({
    message: 'Profile retrieved successfully',
    user: profile
  });
}));

// Update user profile
router.put('/profile', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  const updateData = validate(UpdateProfileSchema, req.body);
  
  // Filter out undefined values for exactOptionalPropertyTypes compliance
  const cleanUpdateData: { name?: string } = {};
  if (updateData.name !== undefined) {
    cleanUpdateData.name = updateData.name;
  }
  
  const updatedUser = await UserService.updateProfile(user.userId, cleanUpdateData);
  
  res.json({
    message: 'Profile updated successfully',
    user: updatedUser
  });
}));

// Change password
router.put('/password', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  const { currentPassword, newPassword } = validate(ChangePasswordSchema, req.body);
  
  await UserService.changePassword(user.userId, currentPassword, newPassword);
  
  res.json({
    message: 'Password changed successfully'
  });
}));

export default router; 