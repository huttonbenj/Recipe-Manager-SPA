/**
 * Test setup file
 * Comprehensive test database setup and teardown with test-specific Prisma client
 */

import { randomBytes } from 'crypto'
import * as fs from 'fs'
import * as path from 'path'
import jwt from 'jsonwebtoken';
import { getPrismaClient } from '../src/config/database'

// Test environment variables
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only'
process.env.PORT = '0'

// Create a unique test database file for this test run
const testDbName = `test_${randomBytes(8).toString('hex')}.db`
const testDbPath = path.join(__dirname, testDbName)
process.env.DATABASE_URL = `file:${testDbPath}`

let prisma: any

beforeAll(async () => {
  console.log('🧪 Setting up test database...')
  
  try {
    // Initialize test-specific Prisma client using database configuration
    prisma = getPrismaClient()
    
    await prisma.$connect()
    
    // Create database and run migrations
    await prisma.$executeRaw`PRAGMA foreign_keys = ON`
    
    // Ensure all tables exist by creating them if they don't
    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "User" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "email" TEXT NOT NULL UNIQUE,
      "password" TEXT NOT NULL,
      "name" TEXT,
      "avatar" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL
    )`
    
    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "Recipe" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "title" TEXT NOT NULL,
      "description" TEXT,
      "ingredients" TEXT NOT NULL,
      "instructions" TEXT NOT NULL,
      "difficulty" TEXT,
      "prepTime" INTEGER,
      "cookTime" INTEGER,
      "servings" INTEGER,
      "imageUrl" TEXT,
      "tags" TEXT,
      "cuisine" TEXT,
      "authorId" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL,
      CONSTRAINT "Recipe_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
    )`
    
    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "UserFavorite" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "userId" TEXT NOT NULL,
      "recipeId" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "UserFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT "UserFavorite_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    )`
    
    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "UserBookmark" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "userId" TEXT NOT NULL,
      "recipeId" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "UserBookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT "UserBookmark_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    )`
    
    // Create unique constraints
    await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "UserFavorite_userId_recipeId_key" ON "UserFavorite"("userId", "recipeId")`
    await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "UserBookmark_userId_recipeId_key" ON "UserBookmark"("userId", "recipeId")`
    
    console.log('✅ Test database setup complete')
    
  } catch (error) {
    console.error('❌ Test database setup failed:', error)
    throw error
  }
}, 30000)

beforeEach(async () => {
  if (!prisma) return
  
  try {
    // Clean up data between tests in reverse dependency order
    await prisma.userBookmark.deleteMany()
    await prisma.userFavorite.deleteMany()  
    await prisma.recipe.deleteMany()
    await prisma.user.deleteMany()
  } catch (error) {
    console.error('Error cleaning test data:', error)
  }
})

afterAll(async () => {
  console.log('🧹 Cleaning up test database...')
  
  try {
    if (prisma) {
      await prisma.$disconnect()
    }
    
    // Remove test database file
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath)
    }
    
    console.log('✅ Test cleanup complete')
  } catch (error) {
    console.error('❌ Test cleanup error:', error)
  }
})

// Test helper functions for creating data
export const createTestUser = async (userData?: Partial<{email: string, password: string, name: string}>) => {
  const email = userData?.email || `test_${randomBytes(4).toString('hex')}@example.com`
  const password = userData?.password || '$2b$10$hashedPassword'
  const name = userData?.name || 'Test User'
  
  const user = await prisma.user.create({
    data: {
      email,
      password,
      name
    }
  })
  
  return user
}

export const createTestRecipe = async (recipeData: {
  title: string
  authorId: string
  description?: string
  ingredients?: string[]
  instructions?: string[]
  difficulty?: string
  tags?: string[]
  cuisine?: string
  cookTime?: number
  prepTime?: number
  servings?: number
}) => {
  const recipe = await prisma.recipe.create({
    data: {
      title: recipeData.title,
      description: recipeData.description || 'Test recipe description',
      ingredients: JSON.stringify(recipeData.ingredients || ['Test ingredient']),
      instructions: JSON.stringify(recipeData.instructions || ['Test instruction']),
      cookTime: recipeData.cookTime || 30,
      prepTime: recipeData.prepTime || 15,
      servings: recipeData.servings || 4,
      difficulty: recipeData.difficulty || 'EASY',
      tags: JSON.stringify(recipeData.tags || ['test']),
      cuisine: recipeData.cuisine || 'Test Cuisine',
      authorId: recipeData.authorId
    }
  })
  
  return recipe.id
}

export const getUserById = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId }
  })
}

export const getRecipeById = async (recipeId: string) => {
  return await prisma.recipe.findUnique({
    where: { id: recipeId },
    include: {
      author: true
    }
  })
}

export const getAllRecipes = async () => {
  return await prisma.recipe.findMany({
    include: {
      author: true
    }
  })
}

// Export for use in tests
export { prisma }
export const getTestDatabase = (): any => prisma

// Simple authentication helper for tests that creates mock tokens
export const generateTestToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || 'test-jwt-secret-key-for-testing-only';
  return jwt.sign({ userId }, secret, { expiresIn: '1h' });
}