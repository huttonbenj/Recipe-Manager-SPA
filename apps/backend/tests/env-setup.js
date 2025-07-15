// Set environment variables for testing - MUST run before any other code
const path = require('path')

// Force override any existing environment variables
delete process.env.DATABASE_URL
process.env.DATABASE_URL = `file:${path.join(process.cwd(), 'tests', 'test.db')}`
process.env.NODE_ENV = 'test' 