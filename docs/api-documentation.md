# Recipe Manager API Documentation

## Overview

The Recipe Manager API is a RESTful service built with Node.js, Express, and TypeScript. It provides comprehensive functionality for managing recipes, user authentication, and file uploads.

**Base URL:** `http://localhost:3001/api`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Token Lifecycle

- **Access Token:** Expires in 15 minutes
- **Refresh Token:** Expires in 7 days

## Standard Response Format

All API responses follow this standard format:

```json
{
  "success": boolean,
  "data": object | null,
  "error": string | null,
  "message": string,
  "pagination": {
    "total": number,
    "page": number,
    "limit": number,
    "totalPages": number,
    "hasNext": boolean,
    "hasPrev": boolean
  }
}
```

## Authentication Endpoints

### Register User

**POST** `/api/auth/register`

Register a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe" // optional
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clr123...",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "User registered successfully"
}
```

### Login User

**POST** `/api/auth/login`

Authenticate user and get tokens.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clr123...",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Login successful"
}
```

### Refresh Token

**POST** `/api/auth/refresh`

Get new access token using refresh token.

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Token refreshed successfully"
}
```

### Get Current User Profile

**GET** `/api/auth/me`

Get authenticated user's profile. Requires authentication.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clr123...",
      "email": "user@example.com",
      "name": "John Doe",
      "avatar": "/uploads/avatar.jpg",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  },
  "message": "Profile retrieved successfully"
}
```

### Logout

**DELETE** `/api/auth/logout`

Logout user (client-side token removal).

**Response (200):**

```json
{
  "success": true,
  "data": null,
  "message": "Logout successful"
}
```

## Recipe Endpoints

### Get All Recipes

**GET** `/api/recipes`

Get recipes with optional search, filtering, and pagination. Supports full-text search.

**Query Parameters:**

- `search` (string): Full-text search query
- `tags` (string): Comma-separated tags (e.g., "italian,vegetarian")
- `cuisine` (string): Filter by cuisine
- `difficulty` (string): EASY | MEDIUM | HARD
- `cookTimeMax` (number): Maximum cook time in minutes
- `prepTimeMax` (number): Maximum prep time in minutes
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)
- `sortBy` (string): title | createdAt | cookTime | prepTime | difficulty | relevance
- `sortOrder` (string): asc | desc

**Examples:**

```
GET /api/recipes?search=chicken&tags=asian,quick&sortBy=relevance
GET /api/recipes?cuisine=italian&difficulty=EASY&page=2&limit=10
GET /api/recipes?cookTimeMax=30&sortBy=cookTime&sortOrder=asc
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "recipes": [
      {
        "id": "clr123...",
        "title": "Chicken Pad Thai",
        "description": "Authentic Thai stir-fried noodles",
        "ingredients": ["rice noodles", "chicken breast", "fish sauce"],
        "instructions": "1. Soak noodles...",
        "imageUrl": "/uploads/recipe_123.jpg",
        "cookTime": 15,
        "prepTime": 30,
        "servings": 3,
        "difficulty": "MEDIUM",
        "tags": ["thai", "asian", "noodles"],
        "cuisine": "thai",
        "author": {
          "id": "clr456...",
          "name": "Chef Kenji",
          "email": "kenji@chef.com"
        },
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 20,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  },
  "message": "Recipes retrieved successfully"
}
```

### Get Recipe by ID

**GET** `/api/recipes/:id`

Get a specific recipe by ID.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "recipe": {
      "id": "clr123...",
      "title": "Chicken Pad Thai",
      "description": "Authentic Thai stir-fried noodles",
      "ingredients": ["rice noodles", "chicken breast", "fish sauce"],
      "instructions": "1. Soak noodles...",
      "imageUrl": "/uploads/recipe_123.jpg",
      "cookTime": 15,
      "prepTime": 30,
      "servings": 3,
      "difficulty": "MEDIUM",
      "tags": ["thai", "asian", "noodles"],
      "cuisine": "thai",
      "author": {
        "id": "clr456...",
        "name": "Chef Kenji",
        "email": "kenji@chef.com"
      },
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  },
  "message": "Recipe retrieved successfully"
}
```

### Create Recipe

**POST** `/api/recipes`

Create a new recipe. Requires authentication.

**Request Body:**

```json
{
  "title": "Chicken Pad Thai",
  "description": "Authentic Thai stir-fried noodles",
  "ingredients": ["rice noodles", "chicken breast", "fish sauce"],
  "instructions": "1. Soak noodles in warm water...",
  "imageUrl": "/uploads/recipe_123.jpg",
  "cookTime": 15,
  "prepTime": 30,
  "servings": 3,
  "difficulty": "MEDIUM",
  "tags": ["thai", "asian", "noodles"],
  "cuisine": "thai"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "recipe": {
      "id": "clr789...",
      "title": "Chicken Pad Thai",
      // ... full recipe object
    }
  },
  "message": "Recipe created successfully"
}
```

### Update Recipe

**PUT** `/api/recipes/:id`

Update an existing recipe. Requires authentication. Only recipe owner can update.

**Request Body:** (partial update supported)

```json
{
  "title": "Updated Chicken Pad Thai",
  "cookTime": 20,
  "tags": ["thai", "asian", "noodles", "updated"]
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "recipe": {
      // ... updated recipe object
    }
  },
  "message": "Recipe updated successfully"
}
```

### Delete Recipe

**DELETE** `/api/recipes/:id`

Delete a recipe. Requires authentication. Only recipe owner can delete.

**Response (200):**

```json
{
  "success": true,
  "data": null,
  "message": "Recipe deleted successfully"
}
```

### Get Popular Recipes

**GET** `/api/recipes/popular`

Get popular recipes (most recent).

**Query Parameters:**

- `limit` (number): Number of recipes to return (default: 10)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "recipes": [
      // ... array of recipe objects
    ]
  },
  "message": "Popular recipes retrieved successfully"
}
```

### Get Recipe Statistics

**GET** `/api/recipes/stats`

Get recipe statistics.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "stats": {
      "totalRecipes": 150,
      "totalAuthors": 25,
      "avgCookTime": 35,
      "mostPopularCuisines": [
        {"cuisine": "italian", "count": 30},
        {"cuisine": "asian", "count": 25}
      ],
      "mostPopularTags": [
        {"tag": "quick", "count": 45},
        {"tag": "vegetarian", "count": 38}
      ]
    }
  },
  "message": "Recipe statistics retrieved successfully"
}
```

### Get My Recipes

**GET** `/api/recipes/my`

Get current user's recipes. Requires authentication.

**Query Parameters:**

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `sortBy` (string): createdAt | title | cookTime
- `sortOrder` (string): asc | desc

**Response (200):**

```json
{
  "success": true,
  "data": {
    "recipes": [
      // ... array of user's recipes
    ],
    "total": 5,
    "page": 1,
    "limit": 20,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  },
  "message": "User recipes retrieved successfully"
}
```

## Upload Endpoints

### Upload Image

**POST** `/api/upload/image`

Upload and process an image file. Optional authentication (better file naming if authenticated).

**Request:** `multipart/form-data`

- `image` (file): Image file (JPEG, PNG, WebP, max 10MB)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "image": {
      "originalUrl": "/uploads/user123_1642234567_abc123_original.webp",
      "thumbnailUrl": "/uploads/user123_1642234567_abc123_thumb.webp",
      "webpUrl": "/uploads/user123_1642234567_abc123_optimized.webp",
      "metadata": {
        "width": 1920,
        "height": 1080,
        "size": 2048576,
        "format": "jpeg"
      }
    }
  },
  "message": "Image uploaded and processed successfully"
}
```

### Delete Image

**DELETE** `/api/upload/image`

Delete an uploaded image. Requires authentication.

**Request Body:**

```json
{
  "imageUrl": "/uploads/user123_1642234567_abc123_original.webp"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": null,
  "message": "Image deleted successfully"
}
```

### Get Image Info

**GET** `/api/upload/image/info`

Get information about an uploaded image.

**Query Parameters:**

- `imageUrl` (string): URL of the image

**Response (200):**

```json
{
  "success": true,
  "data": {
    "imageInfo": {
      "exists": true,
      "size": 2048576,
      "metadata": {
        "width": 1920,
        "height": 1080,
        "format": "webp"
      }
    }
  },
  "message": "Image information retrieved successfully"
}
```

## Error Responses

### Validation Error (400)

```json
{
  "success": false,
  "error": "Validation error",
  "message": "Title must be at least 3 characters long"
}
```

### Unauthorized (401)

```json
{
  "success": false,
  "error": "Access denied",
  "message": "No token provided"
}
```

### Forbidden (403)

```json
{
  "success": false,
  "error": "Forbidden",
  "message": "You can only update your own recipes"
}
```

### Not Found (404)

```json
{
  "success": false,
  "error": "Not found",
  "message": "Recipe not found"
}
```

### Conflict (409)

```json
{
  "success": false,
  "error": "User already exists",
  "message": "User already exists with this email"
}
```

### Internal Server Error (500)

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Failed to create recipe"
}
```

## Data Models

### User

```typescript
interface User {
  id: string
  email: string
  name: string | null
  avatar: string | null
  createdAt: Date
  updatedAt: Date
}
```

### Recipe

```typescript
interface Recipe {
  id: string
  title: string
  description: string | null
  ingredients: string[]
  instructions: string
  imageUrl: string | null
  cookTime: number | null
  prepTime: number | null
  servings: number | null
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | null
  tags: string[]
  cuisine: string | null
  authorId: string | null
  author?: {
    id: string
    name: string
    email: string
  }
  createdAt: Date
  updatedAt: Date
}
```

## Features

### Full-Text Search

The API implements PostgreSQL's full-text search using `tsvector` for optimized recipe searching. When a search query is provided, the system:

1. Uses `plainto_tsquery` for intelligent query parsing
2. Searches across title, description, ingredients, tags, and cuisine
3. Returns results ranked by relevance using `ts_rank`
4. Supports sorting by relevance score

### Image Processing

Uploaded images are automatically processed to create three optimized versions:

- **Original**: Resized to max 1200x1200px, WebP format, 90% quality
- **Thumbnail**: 300x300px crop, WebP format, 80% quality  
- **Optimized**: Resized to max 800x800px, WebP format, 85% quality

### Security Features

- JWT authentication with access and refresh tokens
- Password hashing with bcrypt (12 rounds)
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet security headers
- Input validation with Joi
- File upload restrictions (type, size)

### Performance Optimizations

- Database indexing on search fields
- Efficient pagination
- Image optimization with Sharp
- Response compression
- Database connection pooling

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Window:** 15 minutes
- **Max Requests:** 100 per IP
- **Scope:** All `/api/*` endpoints

When rate limit is exceeded, the API returns:

```json
{
  "error": "Too many requests from this IP, please try again later."
}
```

## Health Check Endpoints

The API provides comprehensive health check endpoints for monitoring and alerting.

### Basic Health Check

**GET** `/health`

Simple health check to verify the API is running.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-15T10:30:00Z",
    "uptime": 3600.5
  },
  "message": "API is healthy"
}
```

### Detailed Health Check

**GET** `/health/detailed`

Comprehensive health information including system metrics and dependencies.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-15T10:30:00Z",
    "uptime": 3600.5,
    "system": {
      "platform": "linux",
      "nodeVersion": "18.17.0",
      "memory": {
        "used": 52428800,
        "total": 134217728,
        "percentage": 39.06
      },
      "cpu": {
        "usage": 15.2,
        "loadAverage": [0.5, 0.8, 0.6]
      }
    },
    "database": {
      "status": "connected",
      "connectionPool": {
        "active": 3,
        "idle": 7,
        "total": 10
      },
      "latency": 5.2
    },
    "cache": {
      "status": "connected",
      "hitRate": 0.85,
      "memoryUsage": 1048576
    }
  },
  "message": "Detailed health check completed"
}
```

### Readiness Probe

**GET** `/health/ready`

Kubernetes/Docker readiness probe to check if the API is ready to serve requests.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "status": "ready",
    "checks": {
      "database": "connected",
      "cache": "connected",
      "migrations": "up-to-date"
    }
  },
  "message": "API is ready"
}
```

### Liveness Probe

**GET** `/health/live`

Kubernetes/Docker liveness probe to check if the API is running.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "status": "alive",
    "timestamp": "2024-01-15T10:30:00Z"
  },
  "message": "API is alive"
}
```

### Metrics Endpoint

**GET** `/health/metrics`

Application metrics for monitoring and alerting.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "requests": {
      "total": 15420,
      "success": 14830,
      "error": 590,
      "successRate": 0.962
    },
    "performance": {
      "averageResponseTime": 45.2,
      "p95ResponseTime": 120.5,
      "p99ResponseTime": 250.8
    },
    "database": {
      "totalQueries": 8952,
      "averageQueryTime": 8.5,
      "slowQueries": 12,
      "connectionPool": {
        "active": 3,
        "idle": 7,
        "total": 10,
        "waitingClients": 0
      }
    },
    "cache": {
      "hits": 4520,
      "misses": 1105,
      "hitRate": 0.804,
      "memoryUsage": 2097152,
      "evictions": 45
    },
    "security": {
      "rateLimitHits": 127,
      "blockedRequests": 23,
      "suspiciousActivity": 5
    }
  },
  "message": "Metrics retrieved successfully"
}
```

## Security Features

### Rate Limiting

The API implements comprehensive rate limiting to prevent abuse:

**Authentication Endpoints** (`/api/auth/login`, `/api/auth/register`):
- 5 requests per 15 minutes per IP
- Returns 429 status when exceeded

**API Endpoints** (all `/api/*` except auth):
- 100 requests per 15 minutes per IP
- Returns 429 status when exceeded

**Upload Endpoints** (`/api/upload/*`):
- 10 requests per 15 minutes per IP
- Returns 429 status when exceeded

### Content Security Policy

The API sets comprehensive CSP headers:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.yourdomain.com;
```

### Security Headers

All responses include security headers:

- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `Referrer-Policy: strict-origin-when-cross-origin`

### Request Sanitization

All user inputs are sanitized to prevent XSS attacks:

- HTML tags are escaped
- Script tags are removed
- SQL injection patterns are blocked
- File upload validation

### IP Whitelisting

Admin endpoints support IP whitelisting:

- Configure allowed IPs in `ADMIN_WHITELIST_IPS` environment variable
- Comma-separated list of IPs
- Returns 403 for unauthorized IPs

## Caching

### API Response Caching

GET requests are cached for improved performance:

- Cache TTL: 1 hour (configurable)
- Cache key: Request URL + query parameters
- Cache headers: `Cache-Control`, `ETag`, `Last-Modified`
- Cache invalidation: On data mutations

### Static Asset Caching

Static assets are cached with long TTL:

- Images: 1 year
- CSS/JS: 1 year with versioning
- API responses: 1 hour

## Performance Optimizations

### Database Optimizations

- Connection pooling with 20 connections
- Query optimization with proper indexing
- Prepared statements for security
- Connection timeout: 20 seconds

### Bundle Optimization

- Code splitting for reduced bundle size
- Tree shaking to remove unused code
- Compression with gzip/brotli
- Lazy loading for components

### Service Worker

- Offline support with cache-first strategy
- Background sync for API requests
- Push notifications support
- Cache versioning for updates

## Environment Variables

### Required Variables

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@host:5432/database?pgbouncer=true&connection_limit=20&pool_timeout=20

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-at-least-32-characters-long
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-at-least-32-characters-long

# Server Configuration
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com

# CORS Configuration
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Optional Variables

```env
# Security Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_AUTH_MAX=5
RATE_LIMIT_UPLOAD_MAX=10
ADMIN_WHITELIST_IPS=127.0.0.1,::1

# File Upload Configuration
UPLOAD_MAX_SIZE=5242880
UPLOAD_DIR=/app/uploads

# Caching Configuration
CACHE_TTL_SECONDS=3600
REDIS_URL=redis://localhost:6379

# Monitoring Configuration
ENABLE_MONITORING=true
METRICS_ENDPOINT_ENABLED=true
HEALTH_CHECK_INTERVAL=30000

# Logging Configuration
LOG_LEVEL=info
LOG_FORMAT=json
LOG_FILE=/app/logs/app.log
```

## Error Handling

### Standard Error Format

```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Human-readable error message",
  "details": {
    "field": "validation error details"
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR` - Request validation failed
- `AUTHENTICATION_ERROR` - Authentication required or failed
- `AUTHORIZATION_ERROR` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `UPLOAD_ERROR` - File upload failed
- `DATABASE_ERROR` - Database operation failed
- `CACHE_ERROR` - Cache operation failed

## Testing

### API Testing

Run the test suite:

```bash
cd apps/backend
npm test
```

### Test Coverage

```bash
npm run test:coverage
```

### Integration Testing

```bash
npm run test:integration
```

## Monitoring and Alerting

### Metrics Collection

Use the `/health/metrics` endpoint to collect:

- Request metrics (total, success rate, response times)
- Database performance (query times, connection pool)
- Cache performance (hit rates, memory usage)
- Security metrics (rate limit hits, blocked requests)

### Alerting Rules

Set up alerts for:

- High error rates (>5%)
- Slow response times (>500ms p95)
- Database connection issues
- High memory usage (>80%)
- Rate limit violations
- Security incidents

### Log Analysis

Monitor logs for:

- Error patterns
- Performance degradation
- Security threats
- Unusual traffic patterns

## API Versioning

Current API version: `v1`

All endpoints are prefixed with `/api/v1/` for future versioning support.

## Support

For API support and documentation updates:

1. **GitHub Issues**: Report bugs and feature requests
2. **Documentation**: Check this document for latest API changes
3. **Health Checks**: Use health endpoints for monitoring
4. **Logs**: Review application logs for detailed error information
