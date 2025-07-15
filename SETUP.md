# Recipe Manager SPA - Setup Guide

## 🚀 Quick Start

This guide will get your Recipe Manager application running locally in **5 minutes**.

### Prerequisites

- **Node.js** (v18 or higher)
- **Docker** (for PostgreSQL database)
- **npm** (comes with Node.js)

## 📋 Step-by-Step Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/huttonbenj/Recipe-Manager-SPA.git
cd Recipe-Manager-SPA

# Install backend dependencies
cd apps/backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
cd ../..
```

### 2. Environment Configuration

```bash
# Copy environment templates
cp apps/backend/env.template apps/backend/.env
cp apps/frontend/env.template apps/frontend/.env
```

**Note**: The default environment values are pre-configured for local development and should work out of the box.

### 3. Setup Database

```bash
# Start PostgreSQL and run migrations (from project root)
npm run db:setup

# Optional: Seed with sample data (12 recipes + 3 demo users)
npm run db:seed
```

**Manual Database Commands:**
```bash
# Start PostgreSQL with Docker
npm run docker:up postgres

# Run migrations manually
npm run db:migrate

# Reset database (if needed)
npm run db:reset
```

### 4. Start Applications

**Terminal 1 - Backend:**

```bash
cd apps/backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd apps/frontend
npm run dev
```

**Or start both with one command from root:**

```bash
npm run dev
```

### 6. Access Application

- **Frontend**: <http://localhost:5173>
- **Backend API**: <http://localhost:3001>
- **Health Check**: <http://localhost:3001/health>

## 🔑 Demo Credentials

**Email**: <demo@recipemanager.com>  
**Password**: password123

## 🛠 Development Commands

### Backend Commands

```bash
cd apps/backend

# Development server
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Database commands
npm run db:migrate    # Run migrations
npm run db:reset      # Reset database
npm run db:seed       # Seed sample data
npm run db:studio     # Open Prisma Studio

# Testing
npm test
npm run test:watch
npm run test:coverage
```

### Frontend Commands

```bash
cd apps/frontend

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Testing
npm test
npm run test:watch
npm run test:coverage
```

## 🔧 Configuration Details

### Backend Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://recipe_user:recipe_password@localhost:5433/recipe_manager?pgbouncer=true&connection_limit=20&pool_timeout=20` | PostgreSQL connection string with pooling |
| `JWT_SECRET` | `your-super-secret-jwt-key-at-least-32-characters-long-for-security` | JWT signing secret |
| `JWT_REFRESH_SECRET` | `your-super-secret-refresh-key-at-least-32-characters-long-for-security` | JWT refresh token secret |
| `PORT` | `3001` | Backend server port |
| `FRONTEND_URL` | `http://localhost:5173` | Frontend URL for CORS |
| `ALLOWED_ORIGINS` | `http://localhost:5173,http://localhost:3000` | Comma-separated allowed origins |
| `NODE_ENV` | `development` | Environment mode |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Rate limit window (15 minutes) |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | Max requests per window |
| `RATE_LIMIT_AUTH_MAX` | `5` | Max auth requests per window |
| `RATE_LIMIT_UPLOAD_MAX` | `10` | Max upload requests per window |
| `CACHE_TTL_SECONDS` | `3600` | Cache TTL in seconds |
| `UPLOAD_MAX_SIZE` | `5242880` | Max file upload size (5MB) |
| `LOG_LEVEL` | `info` | Logging level |
| `ADMIN_WHITELIST_IPS` | `127.0.0.1,::1` | Admin endpoint IP whitelist |

### Frontend Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:3001/api` | Backend API URL |
| `VITE_APP_NAME` | `Recipe Manager` | Application name |
| `VITE_MAX_UPLOAD_SIZE` | `5242880` | Max file upload size (5MB) |
| `VITE_ENABLE_PWA` | `true` | Enable Progressive Web App features |
| `VITE_ENABLE_ANALYTICS` | `false` | Enable analytics tracking |

## 📊 Database Schema

The application uses PostgreSQL with the following main tables:

- **users** - User accounts with authentication
- **recipes** - Recipe data with full-text search
- **favorites** - User favorite recipes
- **bookmarks** - User bookmarked recipes
- **Enums** - Difficulty levels (EASY, MEDIUM, HARD)

Key features:

- UUID primary keys for security
- Full-text search with tsvector
- Optimized indexes for performance
- Foreign key relationships
- Connection pooling for production

## 🌐 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/me` - Get current user profile
- `DELETE /api/auth/logout` - User logout

### Recipes

- `GET /api/recipes` - List recipes (with filtering/search)
- `GET /api/recipes/:id` - Get single recipe
- `POST /api/recipes` - Create new recipe (auth required)
- `PUT /api/recipes/:id` - Update recipe (auth required)
- `DELETE /api/recipes/:id` - Delete recipe (auth required)

### Favorites & Bookmarks

- `GET /api/favorites` - List user's favorites
- `POST /api/favorites` - Add/remove favorite
- `GET /api/bookmarks` - List user's bookmarks
- `POST /api/bookmarks` - Add/remove bookmark

### File Upload

- `POST /api/upload/image` - Upload recipe image

### Health & Monitoring

- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed system information
- `GET /health/ready` - Readiness probe
- `GET /health/live` - Liveness probe
- `GET /health/metrics` - Application metrics

### Search Parameters

- `?search=query` - Full-text search
- `?tags=tag1,tag2` - Filter by tags
- `?cuisine=italian` - Filter by cuisine
- `?difficulty=easy` - Filter by difficulty
- `?sortBy=title&sortOrder=asc` - Sorting options
- `?authorId=userId` - Filter by author ("My Recipes")
- `?cookTimeMax=30` - Maximum cook time filter
- `?limit=20&page=1` - Pagination

## 🎨 Frontend Features

### Core Components

- **RecipeCard** - Grid/list recipe display
- **RecipeList** - Paginated recipe browsing
- **RecipeFilters** - Advanced search and filtering
- **SearchForm** - Debounced search with suggestions
- **Theme System** - 12 color themes + light/dark mode

### Pages

- **Home** - Landing page with featured recipes
- **Recipes** - Main recipe browsing with filters
- **Recipe Detail** - Interactive recipe viewing
- **Create Recipe** - Comprehensive recipe creation
- **Edit Recipe** - Recipe editing with validation
- **Favorites** - User's favorite recipes
- **Bookmarks** - User's bookmarked recipes
- **Login/Register** - Authentication forms

### Performance Features

- **Service Worker** - Offline support and caching
- **Code Splitting** - Optimized bundle loading
- **Lazy Loading** - Images and components
- **Caching** - API responses and static assets
- **PWA Support** - Progressive Web App features

## 🔒 Security Features

### Rate Limiting

- **Authentication**: 5 requests per 15 minutes
- **API Endpoints**: 100 requests per 15 minutes
- **Upload Endpoints**: 10 requests per 15 minutes

### Security Headers

- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options, X-Content-Type-Options
- X-XSS-Protection, Referrer-Policy

### Input Validation

- Client-side validation with React Hook Form + Zod
- Server-side validation with Joi
- XSS prevention with request sanitization
- SQL injection prevention with parameterized queries

## 📈 Performance Features

### Database Optimizations

- Connection pooling with 20 connections
- Query optimization with proper indexing
- Full-text search capabilities
- Singleton Prisma client

### Caching System

- In-memory API response caching
- TTL-based cache invalidation
- Static asset caching headers
- Service worker caching

### Bundle Optimization

- Code splitting and tree shaking
- Lazy loading for components
- WebP image optimization

## 🚨 Troubleshooting

### Common Issues

**Database Connection Failed:**

```bash
# Ensure Docker is running
docker ps

# Restart database
docker-compose down
docker-compose up -d postgres

# Check logs
docker-compose logs postgres
```

**Port Already in Use:**

```bash
# Kill processes on ports 3001 or 5173
lsof -ti:3001 | xargs kill
lsof -ti:5173 | xargs kill

# Or use different ports in .env files
```

**Environment Variables Not Loading:**

```bash
# Verify .env files exist
ls -la apps/backend/.env
ls -la apps/frontend/.env

# Check file contents
cat apps/backend/.env
```

**Migration Issues:**

```bash
# Reset database and migrations
cd apps/backend
npx prisma migrate reset

# Push schema without migration
npx prisma db push
```

**Build Failures:**

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
npm run build:clean
```

**Security Issues:**

```bash
# Check for vulnerabilities
npm audit
npm audit fix

# Update dependencies
npm update
```

## 🐳 Production Deployment

### Docker Production Setup

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production services
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy

# Check service status
docker-compose -f docker-compose.prod.yml ps
```

### Production Environment Variables

Create production `.env` files with:

- Strong JWT secrets (minimum 32 characters)
- Production database URL with connection pooling
- HTTPS URLs for frontend and allowed origins
- Appropriate rate limiting values
- Security configurations

## 📊 Monitoring & Health Checks

### Health Endpoints

- **Basic Health**: `GET /health`
- **Detailed Health**: `GET /health/detailed`
- **Readiness Probe**: `GET /health/ready`
- **Liveness Probe**: `GET /health/live`
- **Metrics**: `GET /health/metrics`

### Performance Monitoring

- Request/response times
- Database query performance
- Memory and CPU usage
- Cache hit rates
- Error rates

## 🧪 Testing

### Run Tests

```bash
# All tests (82 tests total)
npm test

# Frontend tests (28 tests)
cd apps/frontend
npm test

# Backend tests (54 tests)
cd apps/backend
npm test

# Test coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Test Configuration

- **Frontend**: Vitest + React Testing Library + MSW
- **Backend**: Jest + Supertest + Test Database
- **Mocking**: MSW for API mocking
- **Coverage**: Comprehensive test coverage reporting

## 📚 Documentation

### Core Documentation

- **[Development Setup](./docs/development-setup.md)** - Detailed development guide
- **[API Documentation](./docs/api-documentation.md)** - Complete API reference
- **[Architecture Guide](./docs/architecture.md)** - System architecture and design
- **[Deployment Guide](./docs/deployment-guide.md)** - Production deployment
- **[Favorites & Bookmarks](./docs/favorites-bookmarks.md)** - Feature implementation details

### Technical Specifications

- **[Technical Requirements](./docs/technical-requirements.md)** - Comprehensive requirements specification
- **[Testing Strategy](./docs/testing-strategy.md)** - Complete testing methodology and practices
- **[Troubleshooting Guide](./docs/troubleshooting.md)** - Common issues and solutions
- **System Architecture**: High-level system design with visual diagrams
- **Database Schema**: Entity relationships and data flow
- **API Design**: RESTful endpoints with request/response examples
- **Security Implementation**: Authentication flow and security measures
- **Performance Optimizations**: Caching, database indexing, bundle optimization

## 🎯 Production Ready Features

✅ **82 tests passing** - Comprehensive test coverage (54 backend + 28 frontend)  
✅ **Security hardened** - Rate limiting, CSP, input validation  
✅ **Performance optimized** - Caching, connection pooling, bundle optimization  
✅ **Docker production ready** - Multi-stage builds, health checks  
✅ **Monitoring integrated** - Health checks, metrics, logging  
✅ **Documentation complete** - API, setup, deployment, architecture guides  
✅ **12 Color Themes** - Beautiful themes with dark mode by default  
✅ **Fully Responsive** - Mobile-first design with perfect scaling  
✅ **Advanced Filtering** - Search, sort, and filter with pagination  

## 🤝 Getting Help

1. **Documentation**: Check the docs/ folder for detailed guides
2. **Health Checks**: Use `/health` endpoints for system status
3. **Logs**: Check browser console and server logs
4. **GitHub Issues**: Report bugs and request features
5. **Architecture Guide**: Review system design in docs/architecture.md

---

**🎉 Happy coding! Your Recipe Manager SPA is ready for development and production deployment.**
