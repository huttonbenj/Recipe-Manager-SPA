# Troubleshooting Guide

## Overview

This comprehensive troubleshooting guide helps developers and operators resolve common issues encountered with the Recipe Manager SPA. The guide covers development, production, and deployment scenarios.

## Table of Contents

1. [Quick Diagnostics](#quick-diagnostics)
2. [Development Issues](#development-issues)
3. [Backend Issues](#backend-issues)
4. [Frontend Issues](#frontend-issues)
5. [Database Issues](#database-issues)
6. [Authentication Issues](#authentication-issues)
7. [File Upload Issues](#file-upload-issues)
8. [Performance Issues](#performance-issues)
9. [Production Deployment Issues](#production-deployment-issues)
10. [Testing Issues](#testing-issues)
11. [Environment Issues](#environment-issues)
12. [Debugging Tools](#debugging-tools)

## Quick Diagnostics

### Health Check Commands

```bash
# Check application health
curl http://localhost:3001/health

# Check detailed system status
curl http://localhost:3001/health/detailed

# Check if services are running
ps aux | grep node
ps aux | grep postgres

# Check ports
lsof -i :3001  # Backend
lsof -i :5173  # Frontend
lsof -i :5432  # PostgreSQL
```

### Log Locations

```bash
# Backend logs
tail -f apps/backend/logs/combined.log
tail -f apps/backend/logs/error.log

# Frontend console (browser DevTools)
# Docker logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

## Development Issues

### Issue: Port Already in Use

**Symptoms**:

- `Error: listen EADDRINUSE: address already in use :::3001`
- `Port 5173 is in use, trying another one...`

**Solution**:

```bash
# Kill processes on specific ports
lsof -ti:3001 | xargs kill -9
lsof -ti:5173 | xargs kill -9

# Find what's using the port
lsof -i :3001

# Alternative: Use different ports
# Edit .env files to use different ports
PORT=3002  # Backend
VITE_PORT=5174  # Frontend
```

### Issue: Module Not Found Errors

**Symptoms**:

- `Cannot find module '@/components/...'`
- `Module not found: Can't resolve '...'`

**Solution**:

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force

# Verify TypeScript paths (check tsconfig.json)
# Restart TypeScript server in IDE
```

### Issue: Environment Variables Not Loading

**Symptoms**:

- `undefined` values for environment variables
- Application behaves as if configuration is missing

**Solution**:

```bash
# Check .env files exist
ls -la apps/backend/.env
ls -la apps/frontend/.env

# Verify file contents
cat apps/backend/.env

# Ensure proper naming (no spaces, VITE_ prefix for frontend)
# Restart development servers after changes
npm run dev
```

## Backend Issues

### Issue: Database Connection Failed

**Symptoms**:

- `PrismaClientInitializationError: Cannot reach database server`
- `connect ECONNREFUSED 127.0.0.1:5432`

**Solution**:

```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Start PostgreSQL
docker-compose up -d postgres

# Check connection string
echo $DATABASE_URL

# Reset database if corrupted
docker-compose down
docker volume rm recipe-manager-spa_postgres_data
docker-compose up -d postgres

# Run migrations
cd apps/backend
npx prisma migrate dev
```

### Issue: JWT Token Errors

**Symptoms**:

- `JsonWebTokenError: invalid signature`
- `TokenExpiredError: jwt expired`
- `Authentication failed` errors

**Solution**:

```bash
# Check JWT secret configuration
echo $JWT_SECRET

# Ensure consistent secrets across services
# Clear browser localStorage
# Re-login to get fresh tokens

# Debug JWT tokens (backend)
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('Token:', token);
```

### Issue: Rate Limiting Blocking Requests

**Symptoms**:

- `429 Too Many Requests`
- `Rate limit exceeded`

**Solution**:

```bash
# Check rate limit configuration
grep -r "RATE_LIMIT" apps/backend/.env

# Temporary workaround (development)
# Increase limits in .env:
RATE_LIMIT_MAX_REQUESTS=1000
RATE_LIMIT_AUTH_MAX=100

# Or disable rate limiting for development
# Comment out rate limiting middleware

# Clear rate limit cache
# Restart backend server
```

### Issue: Prisma Migration Errors

**Symptoms**:

- `Migration engine error`
- `Schema drift detected`
- `Migration failed to apply`

**Solution**:

```bash
cd apps/backend

# Reset migrations (development only)
npx prisma migrate reset

# Generate client after schema changes
npx prisma generate

# Apply specific migration
npx prisma migrate dev --name migration_name

# Push schema without migration (development)
npx prisma db push

# Check migration status
npx prisma migrate status
```

## Frontend Issues

### Issue: Vite Build Errors

**Symptoms**:

- `Build failed with errors`
- `Rollup error`
- Memory issues during build

**Solution**:

```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Increase Node.js memory (if needed)
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# Check for circular dependencies
npm run build 2>&1 | grep "circular"

# Verify imports and exports
# Check for missing dependencies
npm install
```

### Issue: React Hot Reload Not Working

**Symptoms**:

- Changes not reflected in browser
- Need to manually refresh page

**Solution**:

```bash
# Check file watching limits
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Restart development server
npm run dev

# Check for syntax errors in console
# Verify file is being saved

# Clear browser cache
# Disable browser extensions that might interfere
```

### Issue: Theme Not Applying

**Symptoms**:

- Theme colors not changing
- Dark mode not working
- CSS variables undefined

**Solution**:

```bash
# Check theme context provider wrapping
# Verify CSS custom properties in browser DevTools

# Check localStorage theme value
localStorage.getItem('theme')

# Reset theme to default
localStorage.removeItem('theme')
localStorage.removeItem('colorTheme')

# Verify Tailwind CSS compilation
npm run build
```

### Issue: API Calls Failing (CORS)

**Symptoms**:

- `CORS policy: No 'Access-Control-Allow-Origin' header`
- Network errors in browser console

**Solution**:

```bash
# Check backend CORS configuration
grep -r "cors" apps/backend/src/

# Verify FRONTEND_URL in backend .env
echo $FRONTEND_URL

# Check actual frontend URL
echo "Frontend running on: http://localhost:5173"

# Update CORS origins if needed
ALLOWED_ORIGINS="http://localhost:5173,http://localhost:5174"

# Restart backend server
```

## Database Issues

### Issue: Database Migration Conflicts

**Symptoms**:

- Conflicting migration files
- Schema inconsistencies
- Foreign key constraint errors

**Solution**:

```bash
cd apps/backend

# Check current schema state
npx prisma db pull

# Compare with schema.prisma
npx prisma migrate diff \
  --from-schema-datamodel schema.prisma \
  --to-schema-datasource schema.prisma

# Reset and reapply migrations (development)
npx prisma migrate reset
npx prisma migrate dev

# Generate fresh migration
npx prisma migrate dev --name fresh_migration
```

### Issue: Prisma Client Out of Sync

**Symptoms**:

- `Prisma Client is not ready for connections`
- `Unknown field` errors
- Type mismatches

**Solution**:

```bash
cd apps/backend

# Regenerate Prisma client
npx prisma generate

# Clear node_modules if needed
rm -rf node_modules/@prisma
npm install

# Verify schema changes
npx prisma validate

# Restart development server
npm run dev
```

### Issue: Test Database Conflicts

**Symptoms**:

- Tests failing with database errors
- Data persistence between tests
- Connection pool exhaustion

**Solution**:

```bash
cd apps/backend

# Check test database configuration
cat tests/env-setup.js

# Reset test database
rm -f tests/test.db*

# Run tests with fresh database
npm test

# Check for open database connections
# Ensure proper cleanup in test setup
```

## Authentication Issues

### Issue: Login Failing with Correct Credentials

**Symptoms**:

- `Invalid credentials` with known good password
- Infinite login loops

**Solution**:

```bash
# Check user exists in database
cd apps/backend
npx prisma studio

# Verify password hashing
# Check bcrypt salt rounds configuration

# Test password hash comparison
node -e "
const bcrypt = require('bcrypt');
const stored = 'stored_hash_from_db';
const input = 'password123';
console.log(bcrypt.compareSync(input, stored));
"

# Clear browser cache and localStorage
# Try different browser or incognito mode
```

### Issue: Token Refresh Failing

**Symptoms**:

- Frequent re-login prompts
- `Token expired` errors
- Authentication state inconsistencies

**Solution**:

```bash
# Check token expiration settings
grep JWT_EXPIRES_IN apps/backend/.env

# Verify refresh token implementation
# Check localStorage token storage

# Debug token refresh flow
# Add logging to auth service
console.log('Refreshing token:', refreshToken);
console.log('New access token:', newAccessToken);

# Clear all tokens and re-login
localStorage.clear();
```

### Issue: Protected Routes Accessible

**Symptoms**:

- Unauthenticated users accessing protected content
- Authorization middleware not working

**Solution**:

```bash
# Check middleware order in route files
grep -r "authenticateToken" apps/backend/src/routes/

# Verify token validation logic
# Check for middleware bypass conditions

# Test with curl
curl -H "Authorization: Bearer invalid_token" \
  http://localhost:3001/api/recipes

# Should return 401 Unauthorized
```

## File Upload Issues

### Issue: Image Upload Failing

**Symptoms**:

- `File too large` errors
- Upload hangs indefinitely
- Invalid file type errors

**Solution**:

```bash
# Check file size limits
grep -r "MAX_FILE_SIZE" apps/backend/.env
grep -r "maxFileSize" apps/backend/src/

# Verify upload directory exists and is writable
ls -la apps/backend/uploads/
chmod 755 apps/backend/uploads/

# Check multer configuration
# Verify file type validation

# Test with smaller file
# Check browser network tab for detailed errors
```

### Issue: Image Processing Errors

**Symptoms**:

- Sharp library errors
- WebP conversion failing
- Thumbnail generation issues

**Solution**:

```bash
# Check Sharp installation
npm ls sharp

# Reinstall Sharp with platform-specific binary
cd apps/backend
npm uninstall sharp
npm install sharp

# Verify file permissions
ls -la uploads/

# Check image file integrity
file uploads/original_image.jpg

# Test with different image formats
```

### Issue: File Serving Not Working

**Symptoms**:

- 404 errors for uploaded images
- Images not displaying in frontend

**Solution**:

```bash
# Check static file middleware
grep -r "express.static" apps/backend/src/

# Verify upload URL construction
echo "Image URL: http://localhost:3001/uploads/filename.jpg"

# Test direct file access
curl http://localhost:3001/uploads/test_image.jpg

# Check file permissions
ls -la apps/backend/uploads/

# Verify frontend image URL construction
```

## Performance Issues

### Issue: Slow API Responses

**Symptoms**:

- API calls taking > 2 seconds
- Database query timeouts
- High CPU usage

**Solution**:

```bash
# Enable query logging
export DEBUG=prisma:query

# Check database indexes
cd apps/backend
npx prisma studio

# Analyze slow queries
# Add timing logs
console.time('database-query');
const result = await prisma.recipe.findMany();
console.timeEnd('database-query');

# Check connection pool configuration
grep -r "connection_limit" apps/backend/.env

# Monitor resource usage
top -p $(pgrep node)
```

### Issue: High Memory Usage

**Symptoms**:

- Node.js process using > 1GB RAM
- Out of memory errors
- Application crashes

**Solution**:

```bash
# Monitor memory usage
node --max-old-space-size=2048 server.js

# Check for memory leaks
npm install -g clinic
clinic doctor -- node server.js

# Profile memory usage
node --inspect server.js
# Connect Chrome DevTools

# Check for large objects in memory
# Review caching implementation
# Ensure proper cleanup of event listeners
```

### Issue: Slow Frontend Loading

**Symptoms**:

- Initial page load > 5 seconds
- Large bundle sizes
- Poor Lighthouse scores

**Solution**:

```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist/

# Check network tab in DevTools
# Optimize images and assets

# Enable production optimizations
npm run build
npm run preview

# Use Lighthouse for performance audit
npx lighthouse http://localhost:4173
```

## Production Deployment Issues

### Issue: Docker Build Failures

**Symptoms**:

- `Docker build` command fails
- Missing dependencies in container
- Build context too large

**Solution**:

```bash
# Check Dockerfile syntax
docker build -t recipe-app .

# Review .dockerignore
cat .dockerignore

# Use multi-stage builds
# Ensure all dependencies in package.json

# Check build context size
du -sh .

# Build with verbose output
docker build --no-cache --progress=plain .
```

### Issue: Container Health Checks Failing

**Symptoms**:

- Container marked as unhealthy
- Load balancer removing instances
- Health endpoint returning errors

**Solution**:

```bash
# Test health endpoint directly
curl http://localhost:3001/health

# Check container logs
docker logs container_name

# Verify health check configuration
docker inspect container_name | grep -A 5 "Health"

# Test inside container
docker exec -it container_name curl localhost:3001/health

# Adjust health check timeouts if needed
```

### Issue: Environment Variable Issues in Production

**Symptoms**:

- Application using development values
- Undefined environment variables
- Configuration not loading

**Solution**:

```bash
# Check environment file loading
docker exec -it container_name env | grep DATABASE_URL

# Verify Docker Compose environment
cat docker-compose.prod.yml

# Check for environment file existence
docker exec -it container_name ls -la .env

# Validate environment variable injection
echo $DATABASE_URL

# Use Docker secrets for sensitive values
```

### Issue: SSL/TLS Certificate Problems

**Symptoms**:

- HTTPS not working
- Certificate expired warnings
- Mixed content errors

**Solution**:

```bash
# Check certificate validity
openssl x509 -in certificate.crt -text -noout

# Verify certificate chain
curl -vI https://yourdomain.com

# Check Let's Encrypt renewal
certbot certificates

# Renew certificate
certbot renew

# Update Nginx configuration
nginx -t
systemctl reload nginx
```

## Testing Issues

### Issue: Tests Failing After Code Changes

**Symptoms**:

- Previously passing tests now fail
- Inconsistent test results
- Mock data out of sync

**Solution**:

```bash
# Run specific failing test
npm test -- auth.test.ts

# Check for test isolation issues
# Verify mock data consistency

# Reset test database
cd apps/backend
rm -f tests/test.db
npm test

# Update snapshots if needed (frontend)
npm test -- --update-snapshots

# Check for async timing issues
# Add proper await statements
```

### Issue: Test Coverage Dropping

**Symptoms**:

- Coverage below threshold
- New code not covered
- Tests not finding new files

**Solution**:

```bash
# Generate coverage report
npm run test:coverage

# Check what files are uncovered
open coverage/lcov-report/index.html

# Write tests for uncovered code
# Update coverage thresholds if appropriate

# Ensure test files match new code structure
# Check test file naming conventions
```

### Issue: Mock Service Worker Issues

**Symptoms**:

- API mocks not working
- Real API calls in tests
- MSW handlers not matching

**Solution**:

```bash
# Check MSW setup
cat apps/frontend/src/__tests__/setup.ts

# Verify handler patterns
cat apps/frontend/src/__tests__/mocks/handlers.ts

# Debug request matching
# Add logging to MSW handlers

# Ensure MSW is started before tests
# Check for conflicting request interceptors
```

## Environment Issues

### Issue: Node.js Version Conflicts

**Symptoms**:

- `Unsupported engine` errors
- Package installation failures
- Runtime errors with newer syntax

**Solution**:

```bash
# Check current Node.js version
node --version

# Install correct version
nvm install 20
nvm use 20

# Check package.json engines field
cat package.json | grep -A 3 "engines"

# Clear npm cache if needed
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript Compilation Errors

**Symptoms**:

- `Type 'X' is not assignable to type 'Y'`
- Build failures
- IDE showing type errors

**Solution**:

```bash
# Check TypeScript version
npx tsc --version

# Verify tsconfig.json
cat tsconfig.json

# Run type checking
npx tsc --noEmit

# Clear TypeScript cache
rm -rf node_modules/.cache

# Restart TypeScript language server in IDE
# Check for conflicting type definitions
```

### Issue: Package Dependency Conflicts

**Symptoms**:

- `ERESOLVE unable to resolve dependency tree`
- Version conflicts
- Missing peer dependencies

**Solution**:

```bash
# Check dependency tree
npm ls

# Fix peer dependency warnings
npm install --save-peer missing-peer-dep

# Use legacy peer deps (temporary)
npm install --legacy-peer-deps

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Check for duplicate packages
npm ls --depth=0
```

## Debugging Tools

### Backend Debugging

```bash
# Enable debug logging
export DEBUG=*
npm run dev

# Use Node.js inspector
node --inspect-brk src/server.ts

# Profile performance
node --prof src/server.ts

# Memory heap snapshots
node --inspect src/server.ts
# Connect Chrome DevTools > Memory tab
```

### Frontend Debugging

```bash
# React Developer Tools
# Redux DevTools (if using Redux)

# Vite debugging
export DEBUG=vite:*
npm run dev

# Bundle analysis
npm run build
npx vite-bundle-analyzer dist/

# Performance profiling
# Browser DevTools > Performance tab
```

### Database Debugging

```bash
# Prisma Studio
cd apps/backend
npx prisma studio

# Query logging
export DEBUG=prisma:query
npm run dev

# Database shell
docker exec -it postgres_container psql -U username -d database

# Migration debugging
npx prisma migrate status --verbose
```

### Network Debugging

```bash
# Check API endpoints
curl -v http://localhost:3001/api/health

# WebSocket debugging (if applicable)
wscat -c ws://localhost:3001

# CORS debugging
curl -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: X-Requested-With" \
  -X OPTIONS \
  http://localhost:3001/api/recipes
```

## Error Codes Reference

### Backend Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| `AUTH_001` | Invalid JWT token | Re-login or refresh token |
| `AUTH_002` | Token expired | Use refresh token |
| `DB_001` | Database connection failed | Check PostgreSQL status |
| `DB_002` | Migration failed | Reset and reapply migrations |
| `UPLOAD_001` | File too large | Check size limits |
| `UPLOAD_002` | Invalid file type | Verify allowed types |

### Frontend Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| `NETWORK_001` | API request failed | Check backend status |
| `AUTH_003` | Authentication required | Redirect to login |
| `THEME_001` | Theme not loaded | Reset theme settings |
| `ROUTE_001` | Route not found | Check routing configuration |

## Getting Help

### Community Resources

1. **Documentation**: Check comprehensive docs in `/docs` folder
2. **GitHub Issues**: Search existing issues or create new ones
3. **Health Endpoints**: Use `/health` for system status
4. **Log Files**: Check application logs for detailed errors

### Emergency Procedures

```bash
# Quick system reset (development)
docker-compose down
docker system prune -a
rm -rf node_modules package-lock.json
npm install
docker-compose up -d
npm run dev

# Database emergency reset
cd apps/backend
npx prisma migrate reset --force
npm run db:seed

# Clear all caches
npm cache clean --force
rm -rf node_modules/.cache
rm -rf dist/
```

### Contact Information

- **Documentation**: Check `/docs` folder for detailed guides
- **GitHub**: Create issues for bugs or feature requests  
- **Health Status**: Visit `/health` endpoint for system status
- **Logs**: Check application logs for detailed error information

---

**Remember**: Always backup data before making significant changes in production environments.
