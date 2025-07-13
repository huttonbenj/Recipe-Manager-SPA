/**
 * Test setup file
 * Comprehensive test database setup and teardown with Prisma
 */

import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'
import { randomBytes } from 'crypto'

// Create a unique test database URL
const generateTestDatabaseUrl = (): string => {
  const testId = randomBytes(8).toString('hex')
  const baseUrl = process.env.DATABASE_URL || 'postgresql://recipe_user:recipe_password@localhost:5433/recipe_manager'
  const url = new URL(baseUrl)
  url.pathname = `/recipe_manager_test_${testId}`
  return url.toString()
}

// Global test database URL
const TEST_DATABASE_URL = generateTestDatabaseUrl()

// Global Prisma client for tests
let prisma: PrismaClient

/**
 * Setup test environment before all tests
 */
beforeAll(async () => {
  console.log('🧪 Setting up test environment...')
  
  try {
    // Set test database URL
    process.env.DATABASE_URL = TEST_DATABASE_URL
    
    // Create test database
    console.log('📦 Creating test database...')
    const createDbUrl = new URL(TEST_DATABASE_URL)
    const dbName = createDbUrl.pathname.slice(1) // Remove leading slash
    createDbUrl.pathname = '/postgres' // Connect to default postgres db to create new one
    
    // Create database using psql command
    execSync(`createdb -h ${createDbUrl.hostname} -p ${createDbUrl.port} -U ${createDbUrl.username} ${dbName}`, {
      env: { ...process.env, PGPASSWORD: createDbUrl.password },
      stdio: 'inherit'
    })
    
    // Initialize Prisma client
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: TEST_DATABASE_URL
        }
      }
    })
    
    // Run database migrations
    console.log('🔄 Running database migrations...')
    execSync('npx prisma migrate deploy', {
      env: { ...process.env, DATABASE_URL: TEST_DATABASE_URL },
      stdio: 'inherit'
    })
    
    // Connect to database
    await prisma.$connect()
    
    console.log('✅ Test environment setup complete')
  } catch (error) {
    console.error('❌ Failed to setup test environment:', error)
    throw error
  }
}, 30000) // 30 second timeout

/**
 * Cleanup test environment after all tests
 */
afterAll(async () => {
  console.log('🧹 Cleaning up test environment...')
  
  try {
    // Disconnect from database
    if (prisma) {
      await prisma.$disconnect()
    }
    
    // Drop test database
    const createDbUrl = new URL(TEST_DATABASE_URL)
    const dbName = createDbUrl.pathname.slice(1)
    
    execSync(`dropdb -h ${createDbUrl.hostname} -p ${createDbUrl.port} -U ${createDbUrl.username} ${dbName}`, {
      env: { ...process.env, PGPASSWORD: createDbUrl.password },
      stdio: 'inherit'
    })
    
    console.log('✅ Test environment cleanup complete')
  } catch (error) {
    console.error('❌ Failed to cleanup test environment:', error)
    // Don't throw here to avoid masking test failures
  }
}, 10000) // 10 second timeout

/**
 * Reset test data before each test
 */
beforeEach(async () => {
  if (!prisma) return
  
  try {
    // Clear all tables in reverse order to handle foreign key constraints
    await prisma.recipe.deleteMany({})
    await prisma.user.deleteMany({})
  } catch (error) {
    console.error('Failed to reset test data:', error)
    throw error
  }
})

/**
 * Optional cleanup after each test
 */
afterEach(async () => {
  // Additional cleanup if needed
  // This is typically not necessary if beforeEach cleans up properly
})

/**
 * Helper function to get test Prisma client
 */
export const getTestPrisma = (): PrismaClient => {
  if (!prisma) {
    throw new Error('Test Prisma client not initialized. Make sure tests are running in proper environment.')
  }
  return prisma
}

/**
 * Helper function to create test user
 */
export const createTestUser = async (overrides: any = {}) => {
  const prisma = getTestPrisma()
  return await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: '$2a$12$hashed_password', // Pre-hashed for tests
      name: 'Test User',
      ...overrides
    }
  })
}

/**
 * Helper function to create test recipe
 */
export const createTestRecipe = async (authorId: string, overrides: any = {}) => {
  const prisma = getTestPrisma()
  return await prisma.recipe.create({
    data: {
      title: 'Test Recipe',
      description: 'A test recipe',
      ingredients: ['ingredient 1', 'ingredient 2'],
      instructions: 'Test instructions',
      cookTime: 30,
      prepTime: 15,
      servings: 4,
      difficulty: 'EASY',
      tags: ['test'],
      cuisine: 'Test Cuisine',
      authorId,
      ...overrides
    }
  })
}

/**
 * Helper function to seed test data
 */
export const seedTestData = async () => {
  const user = await createTestUser()
  const recipe = await createTestRecipe(user.id)
  
  return { user, recipe }
}

// Export test database URL for use in tests
export { TEST_DATABASE_URL }