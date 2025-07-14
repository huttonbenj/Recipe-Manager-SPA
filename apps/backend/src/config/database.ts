/**
 * Database configuration
 * Singleton Prisma client with connection pooling
 */

import { PrismaClient } from '@prisma/client'
import { config } from './index'

declare global {
  // eslint-disable-next-line no-var
  var __db: PrismaClient | undefined
}

let prisma: PrismaClient

if (config.server.nodeEnv === 'production') {
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: config.database.url,
      },
    },
    log: ['warn', 'error'],
  })
} else {
  // In development, use a global variable to prevent multiple instances
  if (!global.__db) {
    global.__db = new PrismaClient({
      datasources: {
        db: {
          url: config.database.url,
        },
      },
      log: ['query', 'warn', 'error'],
    })
  }
  prisma = global.__db
}

export { prisma }
export default prisma 