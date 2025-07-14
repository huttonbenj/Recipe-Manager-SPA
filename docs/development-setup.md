# Development Setup Guide

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 15+
- Docker and Docker Compose
- Git

## Quick Start

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd recipe-manager
   ```

2. **Install dependencies:**

   ```bash
   # Install all dependencies
   npm install
   
   # Or install individually
   cd apps/frontend && npm install
   cd ../backend && npm install
   ```

3. **Set up environment variables:**

   ```bash
   # Copy example files
   cp apps/frontend/.env.example apps/frontend/.env
   cp apps/backend/.env.example apps/backend/.env
   
   # Edit the .env files with your configuration
   ```

4. **Set up database:**

   ```bash
   # Start PostgreSQL (using Docker)
   docker-compose up -d postgres
   
   # Run migrations
   cd apps/backend
   npx prisma migrate dev
   
   # Seed the database
   npm run db:seed
   ```

5. **Start development servers:**

   ```bash
   # Terminal 1 - Backend
   cd apps/backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd apps/frontend
   npm run dev
   ```

## Architecture Overview

### Backend Architecture

The backend has been optimized for production with the following components:

- **Database Layer**: Singleton Prisma client with connection pooling
- **Caching Layer**: In-memory caching middleware with TTL support
- **Security Layer**: Rate limiting, CSP, security headers, IP whitelisting
- **Monitoring**: Health checks, metrics collection, performance monitoring
- **Logging**: Structured logging with Winston

### Frontend Architecture

The frontend includes production-ready features:

- **Service Worker**: Offline support, caching strategies, background sync
- **Bundle Optimization**: Code splitting, lazy loading, tree shaking
- **Performance**: Image optimization, debounced search, virtual scrolling
- **Monitoring**: Error boundaries, performance metrics

## Available Scripts

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run type-check` - TypeScript type checking

### Backend

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript
- `npm run start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio
- `npm run db:reset` - Reset database
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage

## Production Features

### Performance Optimizations

1. **Database Performance**:
   - Singleton Prisma client with connection pooling
   - Optimized queries with proper indexing
   - Connection pooling with 20 connection limit

2. **Caching System**:
   - In-memory caching middleware
   - TTL-based cache invalidation
   - API response caching for GET requests
   - Static asset caching headers

3. **Service Worker**:
   - Offline support with cache-first strategy
   - Background sync for API requests
   - Static asset caching with versioning
   - Push notification support

### Security Features

1. **Rate Limiting**:
   - Authentication endpoints: 5 requests/15 minutes
   - API endpoints: 100 requests/15 minutes
   - Upload endpoints: 10 requests/15 minutes

2. **Security Headers**:
   - Content Security Policy (CSP)
   - HSTS (HTTP Strict Transport Security)
   - X-Frame-Options, X-Content-Type-Options
   - Request sanitization for XSS prevention

3. **IP Whitelisting**:
   - Configurable IP whitelist for admin endpoints
   - Security logging and monitoring

### Monitoring and Health Checks

1. **Health Endpoints**:
   - `/health` - Basic health check
   - `/health/detailed` - Detailed system information
   - `/health/ready` - Readiness probe
   - `/health/live` - Liveness probe
   - `/health/metrics` - Application metrics

2. **Monitoring Service**:
   - Real-time metrics collection
   - Database performance monitoring
   - Memory and CPU usage tracking
   - Request performance analytics

### Docker Production Setup

1. **Multi-stage Builds**:
   - Optimized Docker images
   - Security hardening with non-root users
   - Health checks integrated

2. **Production Compose**:
   - Frontend with nginx
   - Backend with health checks
   - PostgreSQL with persistent volumes
   - Redis for caching
   - Nginx reverse proxy with SSL

## Environment Variables

### Backend Environment Variables

Required variables:
- `DATABASE_URL` - PostgreSQL connection string with pooling
- `JWT_SECRET` - JWT signing secret (minimum 32 characters)
- `JWT_REFRESH_SECRET` - JWT refresh token secret
- `FRONTEND_URL` - Frontend URL for CORS
- `PORT` - Backend server port (default: 3001)
- `NODE_ENV` - Environment mode

Optional variables:
- `REDIS_URL` - Redis connection string for caching
- `ALLOWED_ORIGINS` - Comma-separated list of allowed origins
- `RATE_LIMIT_WINDOW_MS` - Rate limit window in milliseconds
- `RATE_LIMIT_MAX_REQUESTS` - Maximum requests per window
- `UPLOAD_MAX_SIZE` - Maximum upload file size in bytes
- `CACHE_TTL_SECONDS` - Cache TTL in seconds
- `ADMIN_WHITELIST_IPS` - Comma-separated list of admin IPs

### Frontend Environment Variables

Required variables:
- `VITE_API_BASE_URL` - Backend API URL
- `VITE_APP_NAME` - Application name

Optional variables:
- `VITE_MAX_UPLOAD_SIZE` - Maximum upload file size
- `VITE_ENABLE_PWA` - Enable Progressive Web App features
- `VITE_ENABLE_ANALYTICS` - Enable analytics tracking
- `VITE_SENTRY_DSN` - Sentry DSN for error tracking

## Development Tools

### Linting and Formatting

- ESLint with TypeScript support
- Prettier for code formatting
- Pre-commit hooks with Husky
- EditorConfig for consistent styling

### Testing

- **Frontend**: Vitest + React Testing Library + MSW
- **Backend**: Jest + Supertest + Test Database
- **Integration**: End-to-end testing with Playwright
- **Coverage**: Comprehensive test coverage reporting

### Database Tools

- **Prisma Studio**: Visual database browser
- **Migrations**: Version-controlled database schema changes
- **Seeding**: Sample data generation for development
- **Backup**: Database backup and restore scripts

## Project Structure

See PROJECT_PLAN.md for detailed project structure information.

## Development Workflow

1. **Feature Development**:
   - Create feature branch from `main`
   - Implement feature with tests
   - Run linting and type checking
   - Submit pull request

2. **Code Quality**:
   - All code must pass TypeScript type checking
   - ESLint rules must be satisfied
   - Test coverage must be maintained
   - Security vulnerabilities must be resolved

3. **Performance**:
   - Bundle size monitored and optimized
   - Database queries optimized
   - API response times measured
   - Memory usage tracked

## Troubleshooting

### Common Issues

1. **Database connection errors:**
   - Check PostgreSQL is running: `docker ps`
   - Verify DATABASE_URL in .env
   - Check connection pooling parameters

2. **Port conflicts:**
   - Default ports: Frontend (5173), Backend (3001)
   - Kill processes: `lsof -ti:3001 | xargs kill`
   - Change ports in configuration if needed

3. **CORS issues:**
   - Ensure FRONTEND_URL is set correctly in backend .env
   - Check ALLOWED_ORIGINS configuration
   - Verify request headers and methods

4. **Cache issues:**
   - Clear browser cache and service worker
   - Reset server-side cache: restart backend
   - Check cache headers in network tab

5. **Build failures:**
   - Clear node_modules and reinstall
   - Check TypeScript errors: `npm run type-check`
   - Verify environment variables are set

6. **Security issues:**
   - Check CSP errors in browser console
   - Verify rate limiting configuration
   - Review security headers in network tab

### Performance Debugging

1. **Database Performance**:
   - Check Prisma logs for slow queries
   - Use `/health/metrics` endpoint for database stats
   - Monitor connection pool usage

2. **Frontend Performance**:
   - Use React DevTools Profiler
   - Check service worker cache hit rates
   - Monitor bundle size with webpack-bundle-analyzer

3. **API Performance**:
   - Check response times in `/health/metrics`
   - Monitor memory usage
   - Review request/response sizes

### Monitoring

1. **Health Checks**:
   - `/health` - Basic server health
   - `/health/detailed` - Comprehensive system info
   - `/health/metrics` - Performance metrics

2. **Logging**:
   - Backend logs: `apps/backend/logs/`
   - Frontend errors: Browser console
   - Docker logs: `docker-compose logs -f`

3. **Metrics**:
   - Database connection pool status
   - Memory and CPU usage
   - Request latency and throughput
   - Cache hit rates

## Production Deployment

For production deployment instructions, see `docs/deployment-guide.md`.

## API Documentation

For complete API documentation, see `docs/api-documentation.md`.

## Security

For security best practices and configuration, see the security section in the deployment guide.
