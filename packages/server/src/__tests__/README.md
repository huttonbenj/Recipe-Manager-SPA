# Server Test Organization Guide

This document outlines the test organization structure for the Recipe Manager SPA server package.

## Directory Structure

```
packages/server/src/__tests__/
├── unit/                    # Unit tests for individual modules
│   ├── services/           # Service layer tests
│   ├── middleware/         # Middleware tests
│   ├── utils/              # Utility function tests
│   └── routes/             # Route handler tests (individual functions)
├── integration/            # Integration tests
│   ├── routes/             # Full route integration tests
│   ├── database/           # Database integration tests
│   └── auth/               # Authentication flow tests
├── setup/                  # Test setup and configuration
│   ├── test-setup.ts       # Global test setup
│   └── db-setup.ts         # Database test setup
├── mocks/                  # Mock data and utilities
│   ├── database.ts         # Database mocks
│   ├── auth.ts             # Auth mocks
│   └── fixtures.ts         # Test fixtures
└── utils/                  # Test utilities
    ├── test-helpers.ts     # Test helper functions
    └── api-client.ts       # API client for integration tests
```

## Test Categories

### Unit Tests (Target: 95% coverage)
- **Services**: Business logic, data transformation, validation
- **Middleware**: Request/response processing, authentication, error handling
- **Utils**: Pure functions, helpers, utilities
- **Routes**: Individual route handlers (mocked dependencies)

### Integration Tests (Target: 85% coverage)
- **Routes**: Full HTTP request/response cycles
- **Database**: Database operations with real/test database
- **Auth**: Authentication and authorization flows

## Coverage Targets

- **Overall Server Coverage**: 80%+
- **Unit Tests**: 95%
- **Integration Tests**: 85%
- **Critical Paths**: 100% (auth, recipe CRUD)

## Test Patterns

### Unit Test Pattern
```typescript
describe('ServiceName', () => {
  describe('methodName', () => {
    it('should handle success case', () => {
      // Test implementation
    });
    
    it('should handle error case', () => {
      // Test implementation
    });
  });
});
```

### Integration Test Pattern
```typescript
describe('POST /api/recipes', () => {
  it('should create recipe successfully', async () => {
    // Full request/response test
  });
  
  it('should handle validation errors', async () => {
    // Error case test
  });
});
```

## Current Status

✅ Unit tests for services (userService, recipeService)
✅ Unit tests for middleware (auth)
✅ Unit tests for utils (auth)
⚠️ Missing integration tests for routes
⚠️ Missing database integration tests
⚠️ Missing middleware tests (error, validation)

## Next Steps

1. Create integration tests for all route endpoints
2. Add missing middleware tests
3. Create database integration tests
4. Add error handling tests
5. Achieve 80%+ overall coverage 