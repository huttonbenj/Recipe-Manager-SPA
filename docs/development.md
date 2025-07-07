# Development Guide

This guide covers development practices, workflows, and guidelines for the Recipe Manager SPA.

## Development Workflow

### 1. Status Check System

The status check system is integrated into your workflow to prevent common issues:

```bash
npm run status
```

Output includes:

- 🟦 Current branch name
- 🟨 Staged changes
- 🟥 Unstaged changes
- 🟪 Unpushed commits
- ✅ Clean working directory status

### 2. Branch Management

```bash
# Create/checkout feature branch
npm run branch:checkout feature/your-feature-name

# Update current branch
npm run branch:update

# Push changes with checks
npm run push

# Create pull request
npm run pr
```

### 3. Code Quality Tools

- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **TypeScript**: Static type checking
- **Jest**: Unit testing
- **Cypress**: E2E testing

```bash
# Run all quality checks
npm run lint
npm run test

# Fix linting issues
npm run lint -- --fix
```

## Project Structure

### Monorepo Organization

```plaintext
packages/
├── client/               # Frontend application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── utils/       # Utility functions
│   └── package.json
│
├── server/              # Backend application
│   ├── src/
│   │   ├── controllers/ # Route controllers
│   │   ├── middleware/  # Express middleware
│   │   ├── models/      # Data models
│   │   ├── routes/      # API routes
│   │   └── services/    # Business logic
│   └── package.json
│
├── shared/              # Shared code
│   ├── src/
│   │   ├── types/      # TypeScript types
│   │   └── utils/      # Shared utilities
│   └── package.json
│
└── e2e/                # End-to-end tests
    ├── cypress/
    │   └── integration/ # Test suites
    └── package.json
```

## Development Guidelines

### 1. TypeScript

- Use strict mode
- Define explicit types
- Avoid `any` type
- Use shared types from `@recipe-manager/shared`

### 2. React Components

- Use functional components
- Implement proper prop types
- Use custom hooks for logic
- Follow component organization:

  ```typescript
  // Component structure
  import { type FC } from 'react';
  import { styled } from '@mui/material';
  
  interface Props {
    // Props interface
  }
  
  export const ComponentName: FC<Props> = ({ prop1, prop2 }) => {
    // Component logic
    return (
      // JSX
    );
  };
  ```

### 3. API Development

- Use TypeScript decorators for routes
- Implement proper error handling
- Follow RESTful conventions
- Document with OpenAPI/Swagger

### 4. Testing

- Write unit tests for utilities
- Write integration tests for API
- Write E2E tests for critical flows
- Follow test naming convention:

  ```typescript
  describe('ComponentName', () => {
    describe('functionName', () => {
      it('should do something when condition', () => {
        // Test
      });
    });
  });
  ```

### 5. Git Commits

- Use conventional commits
- Include ticket number
- Keep commits focused
- Format: `type(scope): description [ticket]`

Example:

```bash
feat(auth): implement user login [RECIPE-123]
fix(ui): correct recipe card layout [RECIPE-124]
docs(api): update authentication docs [RECIPE-125]
```

## Performance Guidelines

1. **Frontend**
   - Implement code splitting
   - Use React.memo for expensive renders
   - Optimize images and assets
   - Use proper bundle analysis

2. **Backend**
   - Implement proper caching
   - Use database indexes
   - Optimize queries
   - Handle proper pagination

## Security Guidelines

1. **Frontend**
   - Sanitize user input
   - Implement proper CSRF protection
   - Use secure HTTP headers
   - Follow OWASP guidelines

2. **Backend**
   - Use proper authentication
   - Implement rate limiting
   - Validate all input
   - Use secure sessions

## Debugging

1. **Frontend Debugging**
   - Use React DevTools
   - Implement proper error boundaries
   - Use console.debug for development
   - Implement proper error tracking

2. **Backend Debugging**
   - Use proper logging levels
   - Implement request tracking
   - Use debugging middleware
   - Monitor performance metrics

## Documentation

- Document all public APIs
- Include JSDoc comments
- Update README files
- Maintain changelog
