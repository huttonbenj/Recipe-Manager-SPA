# Client Test Organization

This directory contains all tests for the client package, organized by test type and functionality.

## Test Structure

```plaintext
__tests__/
├── unit/                    # Unit tests for pure functions and utilities
│   ├── utils/              # Utility function tests
│   ├── hooks/              # Custom hook tests (isolated)
│   └── services/           # Service layer tests (mocked)
├── integration/            # Integration tests for connected components
│   ├── auth/               # Authentication flow tests
│   ├── recipes/            # Recipe management tests
│   └── user/               # User profile tests
├── components/             # Component tests (UI and behavior)
│   ├── ui/                 # UI component tests
│   ├── features/           # Feature component tests
│   └── app/                # App-level component tests
├── pages/                  # Page-level component tests
├── setup/                  # Test setup and configuration
├── mocks/                  # Test mocks and fixtures
└── utils/                  # Test utilities and helpers
```

## Test Categories

### Unit Tests

- **Purpose**: Test individual functions, utilities, and isolated components
- **Scope**: Single responsibility, no external dependencies
- **Mocking**: Minimal, only for external dependencies
- **Coverage Target**: 90%+

### Integration Tests

- **Purpose**: Test component interactions and data flow
- **Scope**: Multiple components working together
- **Mocking**: API calls, external services
- **Coverage Target**: 80%+

### Component Tests

- **Purpose**: Test component rendering, props, and user interactions
- **Scope**: Individual components and their behavior
- **Mocking**: External dependencies, API calls
- **Coverage Target**: 85%+

### Page Tests

- **Purpose**: Test full page functionality and routing
- **Scope**: Complete page components with routing
- **Mocking**: API calls, authentication
- **Coverage Target**: 80%+

## Test Naming Convention

- **File naming**: `ComponentName.test.tsx` or `functionName.test.ts`
- **Test suites**: `describe('ComponentName', () => {})`
- **Test cases**: `it('should do something when condition', () => {})`
- **Test IDs**: Use `data-testid` for reliable element selection

## Coverage Goals

| Type | Statements | Branches | Functions | Lines |
|------|------------|----------|-----------|-------|
| Unit | 95% | 90% | 95% | 95% |
| Integration | 85% | 80% | 85% | 85% |
| Components | 90% | 85% | 90% | 90% |
| Pages | 80% | 75% | 80% | 80% |
| **Overall** | **80%** | **75%** | **80%** | **80%** |

## Running Tests

```bash
# Run all tests
npm test

# Run specific test categories
npm run test:unit
npm run test:integration
npm run test:components

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```
