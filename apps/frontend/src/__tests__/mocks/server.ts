/**
 * Mock Service Worker server setup for testing
 * Intercepts API calls during tests
 */

import { setupServer } from 'msw/node'
import { handlers } from './handlers'

// Setup mock server with handlers
export const server = setupServer(...handlers)