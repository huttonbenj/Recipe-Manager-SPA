/**
 * Authentication Service
 * Handles user authentication, registration, JWT tokens, and password management
 */

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { User } from '@prisma/client'
import { prisma } from '../config/database'

interface RegisterData {
  email: string
  password: string
  name?: string
}

interface LoginData {
  email: string
  password: string
}

interface TokenPayload {
  userId: string
  email: string
}

interface AuthResult {
  user: Omit<User, 'password'>
  accessToken: string
  refreshToken: string
}

export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key'
  private readonly JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret'
  private readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m'
  private readonly JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  private readonly SALT_ROUNDS = 12

  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<AuthResult> {
    const { email, password, name } = data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      throw new Error('User already exists with this email')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name: name || null
      }
    })

    // Generate tokens
    const { accessToken, refreshToken } = this.generateTokens({
      userId: user.id,
      email: user.email
    })

    // Return user without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken
    }
  }

  /**
   * Login user with email and password
   */
  async login(data: LoginData): Promise<AuthResult> {
    const { email, password } = data

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!user) {
      throw new Error('Invalid email or password')
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      throw new Error('Invalid email or password')
    }

    // Generate tokens
    const { accessToken, refreshToken } = this.generateTokens({
      userId: user.id,
      email: user.email
    })

    // Return user without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password2, ...userWithoutPassword } = user

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, this.JWT_REFRESH_SECRET) as TokenPayload

      // Check if user still exists
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      })

      if (!user) {
        throw new Error('User not found')
      }

      // Generate new tokens
      const tokens = this.generateTokens({
        userId: user.id,
        email: user.email
      })

      return tokens
    } catch (error) {
      throw new Error('Invalid refresh token')
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<Omit<User, 'password'> | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return null
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password3, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  /**
   * Verify JWT access token
   */
  verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.JWT_SECRET) as TokenPayload
    } catch (error) {
      throw new Error('Invalid access token')
    }
  }

  /**
   * Generate access and refresh tokens
   */
  private generateTokens(payload: TokenPayload): { accessToken: string; refreshToken: string } {
    const accessToken = jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN
    } as jwt.SignOptions)

    const refreshToken = jwt.sign(payload, this.JWT_REFRESH_SECRET, {
      expiresIn: this.JWT_REFRESH_EXPIRES_IN
    } as jwt.SignOptions)

    return { accessToken, refreshToken }
  }

  /**
   * Hash password (utility method)
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS)
  }

  /**
   * Compare password with hash (utility method)
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }
}

export default new AuthService() 