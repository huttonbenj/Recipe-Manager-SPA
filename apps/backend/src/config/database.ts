/**
 * Database configuration
 * Singleton Prisma client with connection pooling
 */

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

// Conditional import for test client
let TestPrismaClient: any
if (process.env.NODE_ENV === 'test') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    TestPrismaClient = require('../../tests/node_modules/.prisma/test-client').PrismaClient
  } catch (error) {
    console.warn('Test Prisma client not found, using production client')
  }
}

// Database singleton
let _prisma: PrismaClient | undefined
let lastDatabaseUrl: string | undefined

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

// Function to create the appropriate Prisma client based on environment
function createPrismaClient(): PrismaClient {
  if (process.env.NODE_ENV === 'test' && TestPrismaClient) {
    // Only log that we're using test client, never log the actual DATABASE_URL
    console.log('Using test Prisma client')
    return new TestPrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    })
  } else {
    console.log('Using production Prisma client')
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
    return new PrismaClient({ adapter })
  }
}

// Function to get or create Prisma client with cache invalidation for tests
function getPrismaClient(): PrismaClient {
  // In test environment, check if DATABASE_URL has changed and recreate client
  if (process.env.NODE_ENV === 'test' && process.env.DATABASE_URL !== lastDatabaseUrl) {
    console.log('Recreating Prisma client due to database configuration change')
    if (global.__prisma) {
      global.__prisma.$disconnect()
      global.__prisma = undefined
    }
    lastDatabaseUrl = process.env.DATABASE_URL
  }

  // Create or reuse Prisma client
  if (process.env.NODE_ENV === 'production') {
    if (!_prisma) {
      _prisma = createPrismaClient()
    }
    return _prisma
  } else {
    if (!global.__prisma) {
      global.__prisma = createPrismaClient()
    }
    return global.__prisma
  }
}

// Create a proxy that always calls getPrismaClient()
const prismaProxy = new Proxy({} as PrismaClient, {
  get(target, prop) {
    const client = getPrismaClient()
    return (client as any)[prop]
  }
})

export { prismaProxy as prisma, getPrismaClient }
export default prismaProxy 