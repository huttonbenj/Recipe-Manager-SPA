import { z } from 'zod';
import { USER_CONFIG } from '../constants/index';

// Core User Schema - this is the authoritative user type definition
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().min(USER_CONFIG.NAME.MIN_LENGTH).max(USER_CONFIG.NAME.MAX_LENGTH),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

// User type derived from schema
export type User = z.infer<typeof UserSchema>;

// User Credentials Schema for login
export const UserCredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1) // Keep min(1) for login - just checking password is provided
});

export type UserCredentials = z.infer<typeof UserCredentialsSchema>;

// User Registration Schema
export const UserRegistrationSchema = z.object({
  email: z.string().email(),
  name: z.string().min(USER_CONFIG.NAME.MIN_LENGTH).max(USER_CONFIG.NAME.MAX_LENGTH),
  password: z.string().min(USER_CONFIG.PASSWORD.MIN_LENGTH)
});

export type UserRegistration = z.infer<typeof UserRegistrationSchema>;

// User Stats Schema
export const UserStatsSchema = z.object({
  totalRecipes: z.number().int().min(0),
  totalFavorites: z.number().int().min(0), // Recipes the user has liked
  totalSaved: z.number().int().min(0), // Recipes the user has saved
  totalViews: z.number().int().min(0), // Keep this for now as 4th stat
  recipesByCategory: z.array(z.object({
    category: z.string(),
    count: z.number().int().min(0)
  }))
});

export type UserStats = z.infer<typeof UserStatsSchema>;

// Tokens Schema
export const TokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string()
});

export type Tokens = z.infer<typeof TokensSchema>;

// Auth Response Schema
export const AuthResponseSchema = z.object({
  user: UserSchema,
  tokens: TokensSchema
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;

// Auth Context Type
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: UserRegistration) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: { name?: string; email?: string }) => Promise<void>;
  changePassword: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
  refreshUser: () => Promise<void>;
} 