import { User } from '../../generated/prisma';

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

export interface UserStats {
  totalRecipes: number;
  totalFavorites: number; // Recipes the user has liked
  totalSaved: number; // Recipes the user has saved
  totalViews: number; // Keep this for now as 4th stat
  recipesByCategory: Array<{ category: string; count: number }>;
}

export type SanitizedUser = Omit<User, 'password_hash'>;

// Helper function to sanitize user response
export const sanitizeUser = (user: User): SanitizedUser => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password_hash, ...sanitizedUser } = user;
  return sanitizedUser;
}; 