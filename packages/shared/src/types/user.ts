import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().min(1),
  created_at: z.date(),
  updated_at: z.date()
});

export const UserCredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100)
});

export const UserRegistrationSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(50),
  password: z.string().min(8).max(100)
});

export const TokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string()
});

export const UserLoginResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    user: UserSchema,
    tokens: TokensSchema
  }),
  message: z.string()
});

export const UserRegistrationResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    user: UserSchema,
    tokens: TokensSchema
  }),
  message: z.string()
});

export const UserProfileResponseSchema = z.object({
  success: z.boolean(),
  data: UserSchema
});

export const UserStatsSchema = z.object({
  totalRecipes: z.number(),
  recipesByCategory: z.array(z.object({
    category: z.string(),
    count: z.number()
  }))
});

export const UserStatsResponseSchema = z.object({
  success: z.boolean(),
  data: UserStatsSchema
});

export const ApiErrorSchema = z.object({
  success: z.boolean(),
  error: z.string(),
  details: z.array(z.any()).optional()
});

export const PasswordChangeSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8).max(100)
});

export const UserUpdateSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  email: z.string().email().optional()
});

export type User = z.infer<typeof UserSchema>;
export type UserCredentials = z.infer<typeof UserCredentialsSchema>;
export type UserRegistration = z.infer<typeof UserRegistrationSchema>;
export type Tokens = z.infer<typeof TokensSchema>;
export type UserLoginResponse = z.infer<typeof UserLoginResponseSchema>;
export type UserRegistrationResponse = z.infer<typeof UserRegistrationResponseSchema>;
export type UserProfileResponse = z.infer<typeof UserProfileResponseSchema>;
export type UserStats = z.infer<typeof UserStatsSchema>;
export type UserStatsResponse = z.infer<typeof UserStatsResponseSchema>;
export type ApiError = z.infer<typeof ApiErrorSchema>;
export type PasswordChange = z.infer<typeof PasswordChangeSchema>;
export type UserUpdate = z.infer<typeof UserUpdateSchema>; 