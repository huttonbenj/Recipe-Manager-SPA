# Recipe Manager SPA - Complete Implementation Plan

## Project Overview

A full-stack Recipe Manager application built with React, Node.js, Express, and PostgreSQL. This project demonstrates senior-level development practices with emphasis on scalability, maintainability, and clean architecture.

## Tech Stack & Architecture Decisions

### Frontend Stack

- **React 18 + TypeScript + Vite** - Modern development with type safety and fast HMR
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **React Router v6** - Latest routing with improved developer experience
- **React Hook Form + Zod** - Performant forms with TypeScript-first validation
- **Axios + React Query** - HTTP client with intelligent caching and error handling
- **React Context API** - State management (sufficient for project scope)

### Backend Stack

- **Node.js + Express + TypeScript** - Type-safe server development
- **Prisma ORM** - Modern, type-safe database access with migrations
- **PostgreSQL** - Robust relational database with full-text search
- **JWT + bcrypt** - Secure authentication and password hashing
- **Multer + Sharp** - Image upload with optimization capabilities
- **Joi** - Server-side validation library
- **Winston** - Professional logging solution

### Database Design

- **PostgreSQL with tsvector** - Native full-text search optimization
- **UUID primary keys** - Better for distributed systems and security
- **Proper indexing** - Performance optimization for search operations
- **Flexible schema** - Extensible for future enhancements

## Complete Project Structure

```text
recipe-manager/
├── README.md
├── PROJECT_PLAN.md
├── docker-compose.yml
├── .env.example
├── .gitignore
│
├── apps/
│   ├── frontend/
│   │   ├── public/
│   │   │   ├── index.html
│   │   │   └── favicon.ico
│   │   ├── src/
│   │   │   ├── __tests__/
│   │   │   │   ├── setup.ts
│   │   │   │   ├── utils.tsx
│   │   │   │   ├── components/
│   │   │   │   │   ├── ThemeToggle.test.tsx
│   │   │   │   │   └── ...
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── useTheme.test.tsx
│   │   │   │   │   └── ...
│   │   │   │   └── mocks/
│   │   │   │       ├── server.ts
│   │   │   │       └── handlers.ts
│   │   │   ├── components/
│   │   │   │   ├── ui/
│   │   │   │   │   ├── Button/
│   │   │   │   │   │   ├── Button.tsx
│   │   │   │   │   │   ├── Button.test.tsx
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── Input/
│   │   │   │   │   ├── Modal/
│   │   │   │   │   ├── Card/
│   │   │   │   │   ├── Loading/
│   │   │   │   │   ├── ThemeToggle.tsx
│   │   │   │   │   ├── ThemeSelector.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── forms/
│   │   │   │   │   ├── RecipeForm/
│   │   │   │   │   │   ├── RecipeForm.tsx
│   │   │   │   │   │   ├── RecipeForm.test.tsx
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── SearchForm/
│   │   │   │   │   └── index.ts
│   │   │   │   ├── layout/
│   │   │   │   │   ├── Header/
│   │   │   │   │   ├── Footer/
│   │   │   │   │   ├── Navigation/
│   │   │   │   │   ├── Layout/
│   │   │   │   │   └── index.ts
│   │   │   │   └── recipe/
│   │   │   │       ├── RecipeCard/
│   │   │   │       ├── RecipeList/
│   │   │   │       ├── RecipeDetail/
│   │   │   │       ├── RecipeFilters/
│   │   │   │       └── index.ts
│   │   │   ├── pages/
│   │   │   │   ├── Home/
│   │   │   │   │   ├── Home.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── Recipes/
│   │   │   │   ├── RecipeDetail/
│   │   │   │   ├── CreateRecipe/
│   │   │   │   ├── EditRecipe/
│   │   │   │   ├── Login/
│   │   │   │   ├── Register/
│   │   │   │   └── index.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useRecipes.ts
│   │   │   │   ├── useLocalStorage.ts
│   │   │   │   ├── useDebounce.ts
│   │   │   │   ├── useTheme.ts
│   │   │   │   └── index.ts
│   │   │   ├── services/
│   │   │   │   ├── api/
│   │   │   │   │   ├── client.ts
│   │   │   │   │   ├── auth.ts
│   │   │   │   │   ├── recipes.ts
│   │   │   │   │   └── upload.ts
│   │   │   │   └── index.ts
│   │   │   ├── context/
│   │   │   │   ├── AuthContext.tsx
│   │   │   │   ├── RecipeContext.tsx
│   │   │   │   ├── ThemeContext.tsx
│   │   │   │   └── index.ts
│   │   │   ├── utils/
│   │   │   │   ├── constants.ts
│   │   │   │   ├── helpers.ts
│   │   │   │   ├── validation.ts
│   │   │   │   └── index.ts
│   │   │   ├── types/
│   │   │   │   ├── auth.ts
│   │   │   │   ├── recipe.ts
│   │   │   │   ├── api.ts
│   │   │   │   └── index.ts
│   │   │   ├── styles/
│   │   │   │   ├── globals.css
│   │   │   │   └── components.css
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   └── vite-env.d.ts
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── vitest.config.ts
│   │   ├── tailwind.config.js
│   │   ├── tsconfig.json
│   │   └── .env.example
│   │
│   └── backend/
│       ├── src/
│       │   ├── controllers/
│       │   │   ├── authController.ts
│       │   │   ├── recipeController.ts
│       │   │   ├── uploadController.ts
│       │   │   └── index.ts
│       │   ├── middleware/
│       │   │   ├── auth.ts
│       │   │   ├── validation.ts
│       │   │   ├── errorHandler.ts
│       │   │   ├── rateLimit.ts
│       │   │   └── index.ts
│       │   ├── routes/
│       │   │   ├── auth.ts
│       │   │   ├── recipes.ts
│       │   │   ├── upload.ts
│       │   │   └── index.ts
│       │   ├── services/
│       │   │   ├── authService.ts
│       │   │   ├── recipeService.ts
│       │   │   ├── uploadService.ts
│       │   │   └── index.ts
│       │   ├── utils/
│       │   │   ├── logger.ts
│       │   │   ├── jwt.ts
│       │   │   ├── validation.ts
│       │   │   ├── constants.ts
│       │   │   └── index.ts
│       │   ├── types/
│       │   │   ├── auth.ts
│       │   │   ├── recipe.ts
│       │   │   ├── express.ts
│       │   │   └── index.ts
│       │   ├── config/
│       │   │   ├── database.ts
│       │   │   ├── env.ts
│       │   │   └── index.ts
│       │   ├── prisma/
│       │   │   ├── schema.prisma
│       │   │   ├── migrations/
│       │   │   └── seed.ts
│       │   ├── uploads/
│       │   │   └── .gitkeep
│       │   ├── app.ts
│       │   └── server.ts
│       ├── tests/
│       │   ├── auth.test.ts
│       │   ├── recipes.test.ts
│       │   └── setup.ts
│       ├── package.json
│       ├── tsconfig.json
│       ├── jest.config.js
│       └── .env.example
│
├── packages/
│   ├── shared-types/
│   │   ├── src/
│   │   │   ├── auth.ts
│   │   │   ├── recipe.ts
│   │   │   ��── api.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── validation/
│       ├── src/
│       │   ├── auth.ts
│       │   ├── recipe.ts
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
│
└── docs/
    ├── api-documentation.md
    ├── deployment-guide.md
    └── development-setup.md
```

## Database Schema Design

### Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  avatar    String?
  recipes   Recipe[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

model Recipe {
  id           String      @id @default(cuid())
  title        String
  description  String?
  ingredients  String[]
  instructions String
  imageUrl     String?
  cookTime     Int?        // in minutes
  prepTime     Int?        // in minutes
  servings     Int?
  difficulty   Difficulty?
  tags         String[]
  cuisine      String?
  searchVector Unsupported("tsvector")?
  authorId     String?
  author       User?       @relation(fields: [authorId], references: [id], onDelete: SetNull)
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  @@index([searchVector])
  @@index([tags])
  @@index([cuisine])
  @@index([difficulty])
  @@map("recipes")
}

enum Difficulty {
  EASY
  MEDIUM
  HARD
}
```

### Database Features

- **Full-text search** using PostgreSQL tsvector
- **Flexible tagging system** for categorization
- **User-recipe associations** for future multi-user support
- **Optimized indexing** for search performance
- **Soft deletion** capabilities with user relationship handling

## API Endpoint Design

### Authentication Endpoints

```text
POST   /api/auth/register     - User registration
POST   /api/auth/login        - User login
POST   /api/auth/refresh      - Refresh JWT token
DELETE /api/auth/logout       - User logout
```

### Recipe Endpoints

```text
GET    /api/recipes           - List recipes with filtering/search
GET    /api/recipes/:id       - Get single recipe
POST   /api/recipes           - Create new recipe
PUT    /api/recipes/:id       - Update recipe
DELETE /api/recipes/:id       - Delete recipe
```

### Upload Endpoints

```text
POST   /api/upload/image      - Upload recipe image
```

### Query Parameters for Recipe Listing

```text
?search=query           - Full-text search
?tags=tag1,tag2        - Filter by tags
?cuisine=italian       - Filter by cuisine
?difficulty=easy       - Filter by difficulty
?limit=20              - Pagination limit
?offset=0              - Pagination offset
?sortBy=createdAt      - Sort field
?sortOrder=desc        - Sort direction
```

### Standard API Response Format

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

## Component Architecture

### UI Component Principles

- **Compound Components** - Flexible, composable interfaces
- **Render Props / Custom Hooks** - Reusable logic patterns
- **TypeScript First** - Comprehensive type coverage
- **Accessibility** - WCAG 2.1 compliance
- **Responsive Design** - Mobile-first approach

### Key Custom Hooks

```typescript
// Authentication
useAuth() - Authentication state and methods
useAuthGuard() - Route protection

// Recipe Management
useRecipes() - Recipe CRUD operations
useRecipeSearch() - Search and filtering
useRecipeForm() - Form state management

// Theme Management
useTheme() - Theme state and color/mode switching

// Utilities
useDebounce() - Input debouncing
useLocalStorage() - Persistent storage
useInfiniteScroll() - Pagination
useImageUpload() - File upload handling
```

## Step-by-Step Implementation Plan

### Phase 1: Project Setup & Infrastructure (Days 1-2)

#### Day 1: Environment Setup

1. **Initialize Project Structure**

   ```bash
   mkdir recipe-manager && cd recipe-manager
   mkdir -p apps/{frontend,backend} packages/{shared-types,validation} docs
   ```

2. **Backend Setup**

   ```bash
   cd apps/backend
   npm init -y
   npm install express cors helmet morgan compression
   npm install prisma @prisma/client bcryptjs jsonwebtoken
   npm install multer sharp joi winston
   npm install -D typescript @types/node @types/express
   npm install -D @types/bcryptjs @types/jsonwebtoken @types/multer
   npm install -D jest supertest @types/jest @types/supertest
   ```

3. **Frontend Setup**

   ```bash
   cd ../frontend
   npm create vite@latest . -- --template react-ts
   npm install react-router-dom react-hook-form @hookform/resolvers
   npm install zod axios @tanstack/react-query
   npm install tailwindcss autoprefixer postcss
   npm install -D @types/node
   ```

4. **Database Setup**

   ```bash
   # PostgreSQL with Docker
   docker-compose up -d postgres
   npx prisma init
   npx prisma migrate dev --name init
   ```

#### Day 2: Configuration & Tooling

1. **TypeScript Configuration**
   - Configure tsconfig.json for both frontend and backend
   - Set up path aliases and strict mode

2. **Development Tools**
   - ESLint and Prettier setup
   - Husky pre-commit hooks
   - Jest configuration for testing

3. **Environment Configuration**
   - Create .env.example files
   - Set up environment validation

### Phase 2: Backend Foundation (Days 3-5)

#### Day 3: Database & Models

1. **Prisma Schema Design**
   - Define User and Recipe models
   - Set up relationships and indexes
   - Create migration files

2. **Database Seeding**
   - Create seed script with 10+ sample recipes
   - Include diverse recipe data for testing
   - Set up full-text search triggers

#### Day 4: Core API Development

1. **Express App Setup**
   - Middleware configuration (CORS, security, logging)
   - Error handling middleware
   - Request validation middleware

2. **Authentication System**
   - User registration and login
   - JWT token generation and validation
   - Password hashing with bcrypt

3. **Recipe CRUD Operations**
   - Create, read, update, delete recipes
   - Input validation with Joi
   - Database queries with Prisma

#### Day 5: Advanced API Features

1. **Search Implementation**
   - Full-text search with PostgreSQL
   - Advanced filtering (tags, cuisine, difficulty)
   - Pagination and sorting

2. **Image Upload**
   - Multer configuration for file handling
   - Sharp for image optimization
   - File validation and storage

3. **API Testing**
   - Unit tests for services
   - Integration tests for endpoints
   - Test database setup

### Phase 3: Frontend Foundation (Days 6-8)

#### Day 6: React App Setup

1. **Project Configuration**
   - Vite configuration optimization
   - Tailwind CSS setup and customization
   - React Router configuration

2. **Type Definitions**
   - Shared types between frontend/backend
   - API response interfaces
   - Form validation schemas

3. **Base Components**
   - UI component library (Button, Input, Card, etc.)
   - Theme components (ThemeToggle, ThemeSelector)
   - Layout components (Header, Footer, Navigation)
   - Loading and error states

#### Day 7: Core Features Implementation

1. **Authentication Flow**
   - Login and registration forms
   - Protected routes
   - Auth context and hooks

2. **Recipe Management**
   - Recipe list component with pagination
   - Recipe card component
   - Recipe detail view

3. **Theme System Integration**
   - Theme context and provider setup
   - Theme toggle and selector components
   - Dark/light mode with system detection

4. **API Integration**
   - Axios client configuration
   - React Query setup for caching
   - Error handling and retry logic

#### Day 8: Advanced Frontend Features

1. **Recipe Forms**
   - Create/edit recipe forms
   - Form validation with React Hook Form + Zod
   - Image upload with preview

2. **Search & Filtering**
   - Search bar with debouncing
   - Filter components for tags, cuisine, difficulty
   - Real-time search results

3. **Responsive Design**
   - Mobile-first layouts
   - Tablet and desktop optimizations
   - Touch-friendly interactions

### Day 8.5: Advanced Theme System (Bonus Feature) ✅

**Goal**: Implement comprehensive theming system

**Tasks**:

1. ✅ Create ThemeContext with light/dark mode support
2. ✅ Implement 6 beautiful color themes (Ocean Blue, Emerald Forest, Royal Blue, Purple Haze, Rose Garden, Sunset Orange)
3. ✅ Add intelligent system preference detection
4. ✅ Create ThemeToggle and ThemeSelector components with multiple variants
5. ✅ Set up smooth CSS transitions and accessibility compliance
6. ✅ Add theme persistence to localStorage with fallback handling
7. ✅ Update Tailwind configuration for CSS custom properties
8. ✅ Create comprehensive tests for theme components and hooks

**Deliverables**:

- ✅ Complete theming system with 6 professionally designed color themes
- ✅ Smart light/dark mode with system detection and manual override
- ✅ Professional theme toggle (icon/button variants) and selector components
- ✅ Persistent theme preferences with localStorage integration
- ✅ Comprehensive test coverage for theme functionality
- ✅ Smooth transitions and accessibility-compliant design
- ✅ CSS custom properties for dynamic theme switching

## Bonus Features Implementation

### Context API/Redux Alternative ✅

- **Day 8**: Implement Context API for state management
- Global state for authentication, recipes, and UI preferences
- Custom hooks for easy state access

### Advanced Theme System ✅

- **Day 8.5**: Comprehensive theming system implementation
- Light/dark mode with intelligent system preference detection
- 6 beautiful color themes (Ocean Blue, Emerald Forest, Royal Blue, Purple Haze, Rose Garden, Sunset Orange)
- Smooth CSS transitions and accessibility compliance
- Theme persistence with localStorage
- Professional theme toggle and selector components

### Deployment ✅

- **Day 9**: Deploy to cloud platform (Vercel + Supabase/Railway)
- Environment configuration for production
- CI/CD pipeline setup

### Advanced Search ✅

- **Day 10**: Implement full-text search with PostgreSQL
- Search optimization and indexing
- Advanced filtering capabilities

### Phase 4: Polish & Optimization (Days 9-10)

#### Day 9: Performance & UX

1. **Performance Optimization**
   - Code splitting and lazy loading
   - Image optimization and lazy loading
   - Bundle analysis and optimization

2. **User Experience**
   - Loading states and skeletons
   - Error boundaries and error pages
   - Success notifications and feedback

3. **Accessibility**
   - ARIA labels and roles
   - Keyboard navigation
   - Screen reader compatibility

#### Day 10: Testing & Documentation

1. **Frontend Testing**
   - Component unit tests
   - Integration tests for key flows
   - E2E tests for critical paths

2. **Documentation**
   - API documentation
   - Setup and deployment guides
   - Code comments and README

3. **Final Polish**
   - Code review and refactoring
   - Performance auditing
   - Security review

## Testing Strategy

### Backend Testing

- **Unit Tests** - Service layer functions
- **Integration Tests** - API endpoint behavior
- **Database Tests** - Prisma queries and migrations
- **Authentication Tests** - JWT and password handling

### Frontend Testing

- **Component Tests** - React Testing Library (including ThemeToggle, ThemeSelector)
- **Hook Tests** - Custom hook behavior (including useTheme)
- **Integration Tests** - User flow scenarios and theme switching
- **Visual Tests** - Storybook for component documentation

### Testing Tools

- **Jest** - Test runner and assertions
- **Supertest** - API endpoint testing
- **React Testing Library** - Component testing
- **MSW** - API mocking for frontend tests

## Deployment Strategy

### Production Architecture

- **Frontend** - Vercel (optimal for React apps)
- **Backend** - Railway or Render (Node.js hosting)
- **Database** - Neon or Supabase (managed PostgreSQL)
- **Images** - Cloudinary or S3 (cloud storage)

### CI/CD Pipeline

1. **Code Quality** - ESLint, Prettier, TypeScript checks
2. **Testing** - Automated test suite execution
3. **Build** - Production build generation
4. **Deploy** - Automated deployment to staging/production

### Environment Configuration

- **Development** - Local PostgreSQL with Docker
- **Staging** - Cloud database for testing
- **Production** - Managed database with backups

## Key Implementation Notes

### Security Considerations

- **Input Validation** - Server-side validation for all inputs
- **SQL Injection Prevention** - Prisma ORM protection
- **XSS Prevention** - Output sanitization
- **CSRF Protection** - Token-based protection
- **Rate Limiting** - API endpoint protection

### Performance Optimizations

- **Database Indexing** - Optimized for search queries
- **Caching Strategy** - React Query for client-side caching
- **Image Optimization** - Sharp for server-side processing
- **Bundle Optimization** - Code splitting and tree shaking

### Scalability Patterns

- **Service Layer** - Clean separation of concerns
- **Repository Pattern** - Database abstraction
- **Middleware Chain** - Modular request processing
- **Component Composition** - Reusable UI patterns

## Development Workflow

### Daily Workflow

1. **Morning** - Review plan and priorities
2. **Development** - Feature implementation with tests
3. **Testing** - Manual and automated testing
4. **Review** - Code quality and architecture review
5. **Documentation** - Update docs and comments

### Git Strategy

- **Main Branch** - Production-ready code
- **Feature Branches** - Individual feature development
- **Commit Messages** - Conventional commit format
- **Pull Requests** - Code review process

This comprehensive plan provides a roadmap for building a production-quality Recipe Manager application that demonstrates senior-level development practices and architectural thinking.
