# Recipe Manager SPA

A full-stack Recipe Management application built with React, Node.js, TypeScript, and PostgreSQL. This project demonstrates modern web development practices including monorepo architecture, comprehensive testing, CI/CD, and Docker containerization.

## 🚀 Features

### Core Functionality

- **User Authentication**: Secure JWT-based authentication with registration and login
- **Recipe Management**: Create, read, update, and delete recipes with detailed information
- **Rich Recipe Data**: Support for ingredients, cooking steps, prep time, cook time, difficulty levels, and cuisine types
- **User Profiles**: Manage personal information and account settings
- **Search & Filtering**: Find recipes by title, difficulty, cuisine type, and more
- **Responsive Design**: Mobile-first design that works on all devices

### Technical Features

- **Type Safety**: Full TypeScript implementation across frontend and backend
- **Monorepo Architecture**: Organized codebase with shared types and utilities
- **Comprehensive Testing**: Unit tests with high coverage (94%+ statements, 85%+ branches)
- **CI/CD Pipeline**: GitHub Actions for automated testing and deployment
- **Docker Support**: Full containerization for development and production
- **Security**: Input validation, SQL injection prevention, and secure authentication
- **Performance**: Optimized database queries and efficient React components

## 🏗️ Architecture

### Project Structure

```
recipe-manager-spa/
├── packages/
│   ├── client/          # React frontend application
│   ├── server/          # Node.js backend API
│   └── shared/          # Shared TypeScript types and utilities
├── docker-compose.yml   # Docker development environment
├── .github/workflows/   # CI/CD pipeline configuration
└── docs/               # Additional documentation
```

### Technology Stack

**Frontend:**

- React 18 with TypeScript
- React Router for routing
- Modern CSS with utility classes
- Vite for build tooling
- ESLint + Prettier for code quality

**Backend:**

- Node.js with Express
- TypeScript for type safety
- PostgreSQL with connection pooling
- JWT authentication
- Zod for runtime validation
- Comprehensive logging with Winston

**DevOps:**

- Docker & Docker Compose
- GitHub Actions CI/CD
- Automated testing and linting
- Multi-stage builds for production

## 🛠️ Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 15+ (or use Docker)
- Docker and Docker Compose (optional)

### Option 1: Docker Development (Recommended)

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd recipe-manager-spa
   ```

2. **Start the development environment:**

   ```bash
   docker-compose up
   ```

3. **Access the application:**
   - Frontend: <http://localhost:3000>
   - Backend API: <http://localhost:3001>
   - Database: localhost:5432

### Option 2: Local Development

1. **Clone and install dependencies:**

   ```bash
   git clone <repository-url>
   cd recipe-manager-spa
   npm install
   ```

2. **Set up the database:**

   ```bash
   # Create PostgreSQL database
   createdb recipe_manager
   
   # Run migrations (if available)
   npm run db:migrate
   ```

3. **Configure environment variables:**

   ```bash
   # Copy example environment files
   cp packages/server/.env.example packages/server/.env
   cp packages/client/.env.example packages/client/.env
   
   # Edit the files with your configuration
   ```

4. **Start the development servers:**

   ```bash
   # Terminal 1: Start backend
   npm run dev:server
   
   # Terminal 2: Start frontend
   npm run dev:client
   ```

## 📖 Usage

### Getting Started

1. **Register a new account** or login with existing credentials
2. **Create your first recipe** using the "Add Recipe" button
3. **Browse recipes** in the recipe list with search and filtering
4. **View recipe details** by clicking on any recipe card
5. **Edit or delete** your own recipes using the action buttons

### API Endpoints

The backend provides a RESTful API with the following main endpoints:

```
Authentication:
POST /api/auth/register    # Register new user
POST /api/auth/login       # User login

Recipes:
GET    /api/recipes        # Get all recipes (paginated)
POST   /api/recipes        # Create new recipe
GET    /api/recipes/:id    # Get specific recipe
PUT    /api/recipes/:id    # Update recipe
DELETE /api/recipes/:id    # Delete recipe

User Profile:
GET    /api/users/profile  # Get user profile
PUT    /api/users/profile  # Update user profile
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint

# Run type checking
npm run typecheck
```

### Test Coverage

The project maintains high test coverage:

- **Statements**: 94%+
- **Branches**: 85%+
- **Functions**: 86%+
- **Lines**: 95%+

## 🚀 Deployment

### Production Build

```bash
# Build all packages
npm run build

# Build specific package
npm run build --workspace=@recipe-manager/client
npm run build --workspace=@recipe-manager/server
```

### Docker Production

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables

**Server (.env):**

```env
NODE_ENV=production
DATABASE_URL=postgresql://postgres:password@localhost:5432/recipe_manager
JWT_SECRET=your-super-secret-jwt-key
PORT=3001
```

**Client (.env):**

```env
VITE_API_URL=http://localhost:3001
```

## 🔧 Development

### Code Quality

- **ESLint**: Configured with TypeScript and React rules
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality checks
- **TypeScript**: Strict mode with additional checks

### Database Schema

The application uses PostgreSQL with the following main tables:

- `users`: User accounts and authentication
- `recipes`: Recipe information and metadata
- `recipe_ingredients`: Recipe ingredients with amounts
- `recipe_steps`: Cooking instructions and steps

### Adding New Features

1. **Create feature branch**: `git checkout -b feature/new-feature`
2. **Implement changes** with tests
3. **Run quality checks**: `npm run lint && npm test`
4. **Commit changes**: Follow conventional commit format
5. **Create pull request** with description

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Ensure all tests pass
5. Submit a pull request

### Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Add tests for new functionality
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Follows industry best practices
- Designed for scalability and maintainability
- Comprehensive testing and documentation

---

For more detailed information, see the individual package README files in the `packages/` directory.
