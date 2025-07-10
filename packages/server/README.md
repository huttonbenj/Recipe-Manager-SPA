x# Recipe Manager Server

## Testing Strategy for Take-Home Interview

This project demonstrates **enterprise-level testing practices** suitable for a senior developer position. The testing strategy follows industry best practices with a focus on **real-world reliability**.

### 🎯 Testing Philosophy

**For take-home interviews, we prioritize integration tests over complex unit test mocking** because:

1. **PostgreSQL Requirement**: The assignment specifically requires PostgreSQL
2. **Real-World Confidence**: Integration tests catch actual database issues
3. **Practical Skills**: Shows ability to test real database interactions
4. **Senior-Level Judgment**: Demonstrates when to mock vs when to use real dependencies

### 📊 Testing Levels

#### 1. **Integration Tests** (Primary Focus) ✅

- **Database**: Real PostgreSQL test database
- **Coverage**: API endpoints, authentication, CRUD operations
- **Value**: High confidence in production behavior
- **Location**: `src/__tests__/integration/`

#### 2. **Unit Tests** (Secondary Focus) ✅

- **Scope**: Pure business logic (validation, transformations)
- **Mocking**: Minimal, focused on utilities without database
- **Value**: Fast feedback for business logic
- **Location**: `src/__tests__/unit/utils/`

#### 3. **End-to-End Tests** ✅

- **Tool**: Cypress
- **Scope**: Full user workflows
- **Location**: `packages/e2e/`

### 🚀 Quick Start

#### Prerequisites

```bash
# Install PostgreSQL (required for integration tests)
brew install postgresql  # macOS
# OR
sudo apt-get install postgresql  # Ubuntu

# Start PostgreSQL service
brew services start postgresql  # macOS
# OR
sudo service postgresql start  # Ubuntu

# Create test database
createdb recipe_manager_test
```

#### Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Set test database URL
echo "TEST_DATABASE_URL=postgresql://postgres:password@localhost:5432/recipe_manager_test" >> .env
```

#### Run Tests

```bash
# Install dependencies
npm install

# Run integration tests (recommended)
npm run test:integration

# Run all tests with database
npm run test:with-db

# Run unit tests only (no database)
npm run test:unit

# Run with coverage
npm run test:coverage
```

### 🗄️ Database Testing Setup

#### Test Database Configuration

- **Production**: PostgreSQL (as required)
- **Testing**: PostgreSQL test database
- **Isolation**: Each test uses transactions that rollback
- **Performance**: Fast setup/teardown with Prisma

#### Test Data Management

```typescript
// Automatic test isolation
beforeEach(async () => {
  await prisma.$transaction(async (tx) => {
    // Test runs in transaction
    // Automatic rollback after test
  });
});
```

### 📁 Test Organization

```
src/__tests__/
├── integration/          # API endpoint tests (PostgreSQL)
│   ├── auth.test.ts     # Authentication flows
│   └── recipes.test.ts  # Recipe CRUD operations
├── unit/                # Pure business logic
│   └── utils/           # Validation, transformations
├── factories/           # Test data factories
├── helpers/             # Test utilities
├── mocks/              # Prisma mocks (for unit tests)
└── setup/              # Test configuration
```

### 🎯 Test Coverage Goals

- **Integration Tests**: 85%+ coverage of API endpoints
- **Authentication**: Complete auth flow coverage
- **CRUD Operations**: All database operations tested
- **Error Handling**: Edge cases and error scenarios
- **Validation**: Input validation and sanitization

### 🛠️ Available Test Commands

```bash
# Primary testing commands
npm run test:integration    # Integration tests with PostgreSQL
npm run test:with-db       # All tests requiring database
npm run test:unit          # Unit tests only (no database)
npm run test:coverage      # Full coverage report

# Development commands
npm run test:watch         # Watch mode for development
npm run test:ui           # Vitest UI for debugging
```

### 🔧 Testing Tools

- **Framework**: Vitest (fast, modern)
- **Database**: PostgreSQL + Prisma
- **Factories**: Realistic test data generation
- **Coverage**: Built-in coverage reporting
- **Mocking**: Minimal, focused mocking strategy

### 💡 Why This Approach?

#### ✅ **Integration Tests First**

- Tests real database constraints
- Catches actual SQL issues
- Validates Prisma schema
- Tests transaction behavior
- Higher confidence in production

#### ✅ **Minimal Unit Test Mocking**

- Avoids complex Prisma mocking
- Focuses on pure business logic
- Faster to write and maintain
- Less brittle than heavy mocking

#### ✅ **PostgreSQL as Required**

- Follows assignment specifications
- Demonstrates real-world database skills
- Shows understanding of production requirements

### 🚨 Common Issues & Solutions

#### Database Connection Issues

```bash
# Check PostgreSQL is running
pg_isready

# Check test database exists
psql -l | grep recipe_manager_test

# Reset test database
npm run db:reset:test
```

#### Test Isolation Issues

```bash
# Clear test data
npm run test:clean

# Reset Prisma schema
npx prisma db push --force-reset
```

### 📈 Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# View coverage in browser
open coverage/index.html
```

### 🎯 Take-Home Interview Notes

This testing setup demonstrates:

1. **Senior-Level Testing Skills**: Comprehensive test organization
2. **Real-World Practices**: Integration-first testing strategy  
3. **PostgreSQL Expertise**: Proper database testing setup
4. **Production Readiness**: Enterprise-level test patterns
5. **Practical Judgment**: When to mock vs when to use real dependencies

The focus on integration tests with PostgreSQL shows practical testing skills that translate directly to production environments, which is exactly what senior developers need to demonstrate.
