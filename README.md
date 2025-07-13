# Recipe Manager SPA

A comprehensive full-stack Recipe Manager application demonstrating senior-level development practices with React, Node.js, Express, and PostgreSQL.

## 🎯 Project Overview

This Recipe Manager SPA showcases modern web development with enterprise-grade architecture, comprehensive testing, and polished user experience. Built as a take-home interview project demonstrating senior-level technical skills.

## 🚀 Features

### Core Features

- **Recipe Management**: Full CRUD operations for recipes
- **Advanced Search**: Multi-criteria search with filters
- **Image Upload**: Recipe photo management with optimization
- **User Authentication**: Secure login and registration
- **Responsive Design**: Mobile-first, works on all devices
- **Real-time Validation**: Client and server-side validation
- **Favorites & Bookmarks**: Save recipes as favorites or bookmark them for later
  - Heart icon to favorite recipes you love
  - Bookmark icon to save recipes for future reference
  - Dedicated pages for viewing favorites and bookmarks
  - Intuitive UI with filled/unfilled icons to show status

### Bonus Features

- **Context API State Management**: Centralized application state
- **Full-text Search**: PostgreSQL-powered search capabilities
- **Advanced Filtering**: Filter by cuisine, difficulty, cook time, ingredients
- **Recipe Categories**: Organize recipes by type and cuisine
- **User Profiles**: Personalized recipe collections
- **Performance Optimization**: Image compression and lazy loading
- **Theme System**: Light/dark mode with multiple color themes
  - 6 beautiful color themes (Ocean Blue, Emerald Forest, Royal Blue, Purple Haze, Rose Garden, Sunset Orange)
  - Smart system theme detection and manual toggle
  - Persistent theme preferences
  - Smooth transitions and accessibility-compliant design

## 🛠 Tech Stack

### Frontend Architecture

- **React 18 + TypeScript + Vite** - Modern development with type safety and fast HMR
- **Tailwind CSS** - Utility-first CSS framework with custom theme system
- **React Router v6** - Latest routing with improved developer experience
- **React Hook Form + Zod** - Performant forms with TypeScript-first validation
- **Axios + React Query** - HTTP client with intelligent caching and error handling
- **React Context API** - State management for auth, recipes, and themes

### Backend Architecture

- **Node.js + Express + TypeScript** - Type-safe server development
- **Prisma ORM** - Modern, type-safe database access with migrations
- **PostgreSQL** - Robust relational database with full-text search
- **JWT + bcrypt** - Secure authentication and password hashing
- **Multer + Sharp** - Image upload with optimization capabilities
- **Joi** - Server-side validation library
- **Winston** - Professional logging solution

### Development & Testing

- **Vitest + React Testing Library** - Comprehensive frontend testing
- **Jest + Supertest** - Backend API testing
- **MSW** - API mocking for frontend tests
- **ESLint + Prettier** - Code quality and formatting
- **TypeScript** - Full type coverage across frontend and backend

## 📁 Project Structure

```text
📁 recipe-manager/
├── 📁 apps/
│   ├── 📁 frontend/                # React SPA
│   │   ├── 📁 public/
│   │   ├── 📁 src/
│   │   │   ├── 📁 components/      # React components
│   │   │   │   ├── 📁 ui/          # Reusable UI components
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   ├── Input.tsx
│   │   │   │   │   ├── Modal.tsx
│   │   │   │   │   ├── Card.tsx
│   │   │   │   │   ├── LoadingSpinner.tsx
│   │   │   │   │   ├── ErrorBoundary.tsx
│   │   │   │   │   ├── ThemeToggle.tsx      # Light/dark mode toggle
│   │   │   │   │   ├── ThemeSelector.tsx    # Color theme selector
│   │   │   │   │   └── index.ts        # Component exports
│   │   │   │   ├── 📁 forms/           # Form components
│   │   │   │   │   ├── RecipeForm.tsx
│   │   │   │   │   ├── AuthForm.tsx
│   │   │   │   │   └── SearchForm.tsx
│   │   │   │   ├── 📁 layout/          # Layout components
│   │   │   │   │   ├── Header.tsx
│   │   │   │   │   ├── Navigation.tsx
│   │   │   │   │   ├── Footer.tsx
│   │   │   │   │   ├── Sidebar.tsx
│   │   │   │   │   └── AppRoutes.tsx
│   │   │   │   └── 📁 recipe/          # Recipe-specific components
│   │   │   │       ├── RecipeCard.tsx
│   │   │   │       ├── RecipeList.tsx
│   │   │   │       ├── RecipeDetail.tsx
│   │   │   │       ├── RecipeFilters.tsx
│   │   │   │       └── ImageUpload.tsx
│   │   │   ├── 📁 pages/               # Page components
│   │   │   │   ├── Home.tsx
│   │   │   │   ├── Recipes.tsx
│   │   │   │   ├── RecipeDetail.tsx
│   │   │   │   ├── CreateRecipe.tsx
│   │   │   │   ├── EditRecipe.tsx
│   │   │   │   ├── Favorites.tsx     # User's favorite recipes
│   │   │   │   ├── Bookmarks.tsx     # User's bookmarked recipes
│   │   │   │   ├── Login.tsx
│   │   │   │   ├── Register.tsx
│   │   │   │   └── NotFound.tsx
│   │   │   ├── 📁 hooks/               # Custom React hooks
│   │   │   │   ├── useAuth.ts         # Authentication hook
│   │   │   │   ├── useRecipes.ts      # Recipe data fetching
│   │   │   │   ├── useFavorites.ts    # Favorites and bookmarks management
│   │   │   │   ├── useLocalStorage.ts # localStorage utility
│   │   │   │   ├── useDebounce.ts     # Input debouncing
│   │   │   │   └── useTheme.ts        # Theme management hook
│   │   │   ├── 📁 context/             # React context providers
│   │   │   │   ├── AuthContext.tsx    # Authentication state management
│   │   │   │   └── ThemeContext.tsx   # Theme and appearance management
│   │   │   ├── 📁 services/            # API integration
│   │   │   │   ├── api/
│   │   │   │   │   ├── client.ts      # Axios configuration
│   │   │   │   │   ├── auth.ts        # Auth endpoints
│   │   │   │   │   ├── recipes.ts     # Recipe endpoints
│   │   │   │   │   ├── favorites.ts   # Favorites and bookmarks endpoints
│   │   │   │   │   └── upload.ts      # Upload endpoints
│   │   │   ├── 📁 types/               # TypeScript definitions
│   │   │   │   ├── auth.ts
│   │   │   │   ├── recipe.ts
│   │   │   │   └── api.ts
│   │   │   ├── 📁 utils/               # Utility functions
│   │   │   │   ├── constants.ts
│   │   │   │   ├── helpers.ts
│   │   │   │   └── validation.ts
│   │   │   ├── 📁 styles/              # Global styles
│   │   │   │   └── globals.css        # Tailwind + custom styles
│   │   │   ├── 📁 __tests__/           # Test files
│   │   │   │   ├── 📁 components/      # Component tests
│   │   │   │   │   ├── ThemeToggle.test.tsx
│   │   │   │   │   └── ...
│   │   │   │   ├── 📁 hooks/           # Hook tests
│   │   │   │   │   ├── useTheme.test.tsx
│   │   │   │   │   └── ...
│   │   │   │   ├── 📁 utils/           # Utility tests
│   │   │   │   ├── setup.ts           # Test environment setup
│   │   │   │   └── mocks/             # Test mocks and fixtures
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   └── vite-env.d.ts
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── vitest.config.ts           # Testing configuration
│   │   ├── tailwind.config.js         # Tailwind + theme configuration
│   │   ├── tsconfig.json
│   │   └── .env.example
│   │
│   └── 📁 backend/                     # Express API Server
│       ├── 📁 src/
│       │   ├── 📁 controllers/         # Route controllers
│       │   │   ├── authController.ts
│       │   │   ├── recipeController.ts
│       │   │   ├── favoritesController.ts # Favorites and bookmarks controller
│       │   │   └── uploadController.ts
│       │   ├── 📁 middleware/          # Express middleware
│       │   ├── 📁 routes/              # API routes
│       │   │   ├── auth.ts
│       │   │   ├── recipes.ts
│       │   │   ├── favorites.ts       # Favorites and bookmarks routes
│       │   │   └── upload.ts
│       │   ├── 📁 services/            # Business logic
│       │   │   ├── authService.ts
│       │   │   ├── recipeService.ts
│       │   │   ├── favoritesService.ts # Favorites and bookmarks service
│       │   │   └── uploadService.ts
│       │   ├── 📁 utils/               # Utilities
│       │   ├── 📁 types/               # TypeScript definitions
│       │   ├── 📁 config/              # Configuration
│       │   ├── 📁 prisma/              # Database schema and migrations
│       │   │   ├── schema.prisma       # Database schema with favorites and bookmarks models
│       │   │   └── migrations/         # Database migrations
│       │   ├── app.ts
│       │   └── server.ts
│       ├── 📁 tests/                   # Backend tests
│       ├── package.json
│       ├── tsconfig.json
│       ├── jest.config.js              # Testing configuration
│       └── .env.example
│
├── 📁 packages/                        # Shared packages
│   ├── 📁 shared-types/                # Common TypeScript interfaces
│   └── 📁 validation/                  # Shared validation schemas
│
├── 📁 docs/                           # Documentation
│   ├── api-documentation.md
│   ├── deployment-guide.md
│   ├── development-setup.md
│   └── favorites-bookmarks.md        # Favorites and bookmarks documentation
│
├── README.md
├── PROJECT_PLAN.md                    # Detailed implementation plan
├── docker-compose.yml                 # Development database
├── .env.example
└── .gitignore
```

## 🚦 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Development Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd recipe-manager
   ```

2. **Install dependencies**

   ```bash
   # Install all dependencies (frontend + backend)
   npm install
   
   # Or install separately
   cd apps/frontend && npm install
   cd ../backend && npm install
   ```

3. **Set up environment variables**

   ```bash
   # Copy environment templates
   cp apps/frontend/.env.example apps/frontend/.env
   cp apps/backend/.env.example apps/backend/.env
   
   # Edit the .env files with your database credentials
   ```

4. **Start PostgreSQL database**

   ```bash
   # Using Docker (recommended)
   docker-compose up -d postgres
   
   # Or use your local PostgreSQL instance
   ```

5. **Set up the database**

   ```bash
   cd apps/backend
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

6. **Start development servers**

   ```bash
   # From project root - starts both frontend and backend
   npm run dev
   
   # Or start separately:
   # Frontend (http://localhost:5173)
   cd apps/frontend && npm run dev
   
   # Backend (http://localhost:3001)
   cd apps/backend && npm run dev
   ```

## 🎨 Theme System

Our advanced theme system includes:

### Color Themes

- **Ocean Blue** (default) - Professional blue palette
- **Emerald Forest** - Nature-inspired green tones  
- **Royal Blue** - Deep blue with purple accents
- **Purple Haze** - Rich purple with orange highlights
- **Rose Garden** - Warm pink with green accents
- **Sunset Orange** - Vibrant orange with yellow touches

### Display Modes

- **Light Mode** - Clean, bright interface
- **Dark Mode** - Easy on the eyes for low-light use
- **System Mode** - Automatically follows OS preference

### Features

- Smooth transitions between themes and modes
- Persistent preferences via localStorage
- Accessibility-compliant contrast ratios
- Professional theme toggle and selector components

## 🧪 Testing

### Frontend Testing

```bash
cd apps/frontend
npm run test              # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

### Backend Testing

```bash
cd apps/backend
npm run test              # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

### Test Coverage

- **Frontend**: Components, hooks, utilities, integration tests
- **Backend**: Controllers, services, database operations, API endpoints
- **E2E**: Critical user flows and scenarios

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `DELETE /api/auth/logout` - User logout

### Recipe Endpoints

- `GET /api/recipes` - List recipes with filtering/search
- `GET /api/recipes/:id` - Get single recipe
- `POST /api/recipes` - Create new recipe
- `PUT /api/recipes/:id` - Update recipe
- `DELETE /api/recipes/:id` - Delete recipe

### Upload Endpoints

- `POST /api/upload/image` - Upload recipe image

See [API Documentation](docs/api-documentation.md) for detailed specifications.

## 🚀 Deployment

### Production Architecture

- **Frontend**: Vercel (optimal for React apps)
- **Backend**: Railway or Render (Node.js hosting)
- **Database**: Neon or Supabase (managed PostgreSQL)
- **Images**: Cloudinary or S3 (cloud storage)

### Environment Setup

```bash
# Build for production
npm run build

# Start production server
npm run start
```

See [Deployment Guide](docs/deployment-guide.md) for detailed instructions.

## 🏗 Architecture Highlights

### Frontend Architecture

- **Component-Driven Development** - Reusable, composable UI components
- **Custom Hooks Pattern** - Encapsulated logic for reusability
- **Context API** - Centralized state management
- **Type-Safe Development** - Comprehensive TypeScript coverage
- **Performance Optimization** - Code splitting, lazy loading, caching

### Backend Architecture

- **Layered Architecture** - Controllers, services, data access layers
- **Middleware Chain** - Authentication, validation, error handling
- **Type-Safe Database** - Prisma ORM with generated types
- **Security First** - JWT authentication, input validation, rate limiting
- **Professional Logging** - Structured logging with Winston

### Database Design

- **Relational Model** - Normalized schema with proper relationships
- **Full-Text Search** - PostgreSQL tsvector for advanced search
- **Performance Optimization** - Strategic indexing and query optimization
- **Data Integrity** - Constraints, validations, and proper typing

## 🎯 Development Practices

- **Clean Code** - Readable, maintainable, well-documented
- **SOLID Principles** - Object-oriented design principles
- **DRY (Don't Repeat Yourself)** - Reusable components and functions
- **Error Handling** - Comprehensive error boundaries and validation
- **Security** - Input sanitization, authentication, authorization
- **Performance** - Optimized queries, caching, lazy loading
- **Accessibility** - WCAG 2.1 compliance, keyboard navigation
- **Responsive Design** - Mobile-first, cross-device compatibility

## 📖 Documentation

- [📋 PROJECT_PLAN.md](PROJECT_PLAN.md) - Comprehensive implementation plan
- [🔌 API Documentation](docs/api-documentation.md) - Complete API reference
- [🚀 Deployment Guide](docs/deployment-guide.md) - Production deployment
- [⚙️ Development Setup](docs/development-setup.md) - Local development guide

## 🤝 Contributing

This project demonstrates senior-level development practices and architectural thinking. Key areas of focus:

1. **Code Quality** - Comprehensive linting, formatting, and type checking
2. **Testing Strategy** - Unit, integration, and E2E test coverage
3. **Documentation** - Clear, comprehensive, and up-to-date
4. **Architecture** - Scalable, maintainable, and performance-optimized
5. **User Experience** - Intuitive, accessible, and responsive design

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Built with ❤️ to demonstrate senior-level full-stack development capabilities**
