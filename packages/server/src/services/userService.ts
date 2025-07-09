import { User, UserCredentials } from '@recipe-manager/shared';
import { db } from '../config/database';
import { AuthUtils, AuthTokens } from '../utils/auth';
import { ApiError } from '../middleware/error';

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
}

export interface LoginResult {
  user: Omit<User, 'passwordHash'>;
  tokens: AuthTokens;
}

export class UserService {
  static async createUser(userData: CreateUserData): Promise<User> {
    const { email, password, name } = userData;

    // Validate password
    const passwordValidation = AuthUtils.validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new ApiError(400, 'Invalid password', passwordValidation.errors);
    }

    // Check if user already exists
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ApiError(409, 'User with this email already exists');
    }

    // Hash password
    const passwordHash = await AuthUtils.hashPassword(password);

    // Create user
    const query = `
      INSERT INTO users (email, password_hash, name)
      VALUES ($1, $2, $3)
      RETURNING id, email, name, created_at, updated_at
    `;

    const result = await db.query<User>(query, [email, passwordHash, name]);
    
    if (result.length === 0) {
      throw new ApiError(500, 'Failed to create user');
    }

    const user = result[0];
    if (!user) {
      throw new ApiError(500, 'Failed to create user');
    }

    return user;
  }

  static async login(credentials: UserCredentials): Promise<LoginResult> {
    const { email, password } = credentials;

    // Find user by email
    const user = await this.findByEmailWithPassword(email);
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Verify password
    const isValidPassword = await AuthUtils.comparePassword(password, user.passwordHash);
    if (!isValidPassword) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Generate tokens
    const tokens = AuthUtils.generateTokens(user);

    // Return user without password hash
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      tokens,
    };
  }

  static async findById(id: string): Promise<User | null> {
    const query = `
      SELECT id, email, name, created_at, updated_at
      FROM users
      WHERE id = $1
    `;

    const result = await db.query<User>(query, [id]);
    return result[0] || null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const query = `
      SELECT id, email, name, created_at, updated_at
      FROM users
      WHERE email = $1
    `;

    const result = await db.query<User>(query, [email]);
    return result[0] || null;
  }

  static async findByEmailWithPassword(email: string): Promise<(User & { passwordHash: string }) | null> {
    const query = `
      SELECT id, email, password_hash as "passwordHash", name, created_at, updated_at
      FROM users
      WHERE email = $1
    `;

    const result = await db.query<User & { passwordHash: string }>(query, [email]);
    return result[0] || null;
  }

  static async updateProfile(userId: string, updates: Partial<Pick<User, 'name'>>): Promise<User> {
    const { name } = updates;
    
    if (name === undefined) {
      throw new ApiError(400, 'No valid fields to update');
    }

    const query = `
      UPDATE users
      SET name = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, email, name, created_at, updated_at
    `;

    const result = await db.query<User>(query, [name, userId]);
    
    if (result.length === 0) {
      throw new ApiError(404, 'User not found');
    }

    const user = result[0];
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return user;
  }

  static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    // Get user with current password hash
    const user = await this.findByIdWithPassword(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Verify current password
    const isValidPassword = await AuthUtils.comparePassword(currentPassword, user.passwordHash);
    if (!isValidPassword) {
      throw new ApiError(401, 'Current password is incorrect');
    }

    // Validate new password
    const passwordValidation = AuthUtils.validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      throw new ApiError(400, 'Invalid new password', passwordValidation.errors);
    }

    // Hash new password
    const newPasswordHash = await AuthUtils.hashPassword(newPassword);

    // Update password
    const query = `
      UPDATE users
      SET password_hash = $1, updated_at = NOW()
      WHERE id = $2
    `;

    await db.query(query, [newPasswordHash, userId]);
  }

  private static async findByIdWithPassword(id: string): Promise<(User & { passwordHash: string }) | null> {
    const query = `
      SELECT id, email, password_hash as "passwordHash", name, created_at, updated_at
      FROM users
      WHERE id = $1
    `;

    const result = await db.query<User & { passwordHash: string }>(query, [id]);
    return result[0] || null;
  }
} 