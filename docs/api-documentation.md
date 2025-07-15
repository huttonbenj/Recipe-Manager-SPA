# Recipe Manager API Documentation

## Overview

The Recipe Manager API is a RESTful service built with Node.js, Express, TypeScript, and Prisma ORM. It provides comprehensive recipe management capabilities with authentication, file upload, favorites, bookmarks, and advanced filtering.

**Base URL**: `http://localhost:3001` (development)  
**API Version**: v1  
**Content Type**: `application/json`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication with a 7-day expiration period.

### Headers

All authenticated endpoints require the following header:

```json
Authorization: Bearer <jwt-token>
```

### Token Lifecycle

- **Expiration**: 7 days from issue
- **Storage**: Store securely on client (localStorage/sessionStorage)
- **Refresh**: Re-authenticate when token expires

## Response Format

All API responses follow a consistent structure:

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "message": "Operation completed successfully"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details (optional)"
}
```

### Pagination Response

For paginated endpoints (like `/api/recipes`):

```json
{
  "success": true,
  "data": {
    "recipes": [
      // Recipe objects
    ],
    "total": 25,
    "page": 1,
    "limit": 12,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  },
  "message": "Recipes retrieved successfully"
}
```

## Authentication Endpoints

### Register User

```http
POST /api/auth/register
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "johndoe"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "username": "johndoe",
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    },
    "accessToken": "jwt-token-here"
  },
  "message": "User registered successfully"
}
```

**Status Codes:**

- `201`: User created successfully
- `400`: Validation error or user already exists
- `500`: Internal server error

### Login User

```http
POST /api/auth/login
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "username": "johndoe",
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    },
    "accessToken": "jwt-token-here"
  },
  "message": "Login successful"
}
```

**Status Codes:**

- `200`: Login successful
- `401`: Invalid credentials
- `400`: Validation error
- `500`: Internal server error

### Get Current User

```http
GET /api/auth/me
```

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "username": "johndoe",
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    }
  },
  "message": "User retrieved successfully"
}
```

**Status Codes:**

- `200`: User retrieved successfully
- `401`: Unauthorized or invalid token
- `500`: Internal server error

### Logout User

```http
POST /api/auth/logout
```

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "success": true,
  "data": null,
  "message": "Logout successful"
}
```

**Status Codes:**

- `200`: Logout successful
- `401`: Unauthorized
- `500`: Internal server error

## Recipe Endpoints

### Get All Recipes

```http
GET /api/recipes
```

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | number | Page number (default: 1) | `?page=2` |
| `limit` | number | Items per page (default: 12, max: 50) | `?limit=20` |
| `search` | string | Search in title and description | `?search=pasta` |
| `tags` | string | Comma-separated tags | `?tags=vegetarian,quick` |
| `cuisine` | string | Filter by cuisine | `?cuisine=Italian` |
| `difficulty` | string | Filter by difficulty (EASY/MEDIUM/HARD) | `?difficulty=EASY` |
| `cookTimeMax` | number | Maximum cook time in minutes | `?cookTimeMax=30` |
| `authorId` | string | Filter by recipe author | `?authorId=user-id` |
| `sortBy` | string | Sort field (createdAt/title/cookTime) | `?sortBy=cookTime` |
| `sortOrder` | string | Sort direction (asc/desc) | `?sortOrder=asc` |

**Example URLs:**

```json
GET /api/recipes?search=pasta&cuisine=Italian&difficulty=EASY
GET /api/recipes?sortBy=cookTime&sortOrder=asc&cookTimeMax=30
GET /api/recipes?authorId=user-id&page=2&limit=10
```

**Response:**

```json
{
  "success": true,
  "data": {
    "recipes": [
      {
        "id": "recipe-id",
        "title": "Delicious Pasta",
        "description": "A simple and tasty pasta recipe",
        "instructions": "1. Boil water\n2. Add pasta\n3. Cook for 8 minutes",
        "ingredients": ["pasta", "tomato sauce", "cheese"],
        "tags": ["vegetarian", "quick"],
        "cuisine": "Italian",
        "difficulty": "EASY",
        "prepTime": 10,
        "cookTime": 15,
        "servings": 4,
        "imageUrl": "/uploads/recipe-image.webp",
        "createdAt": "2025-01-15T10:30:00.000Z",
        "updatedAt": "2025-01-15T10:30:00.000Z",
        "author": {
          "id": "author-id",
          "username": "chef123",
          "email": "chef@example.com"
        }
      }
    ],
    "total": 25,
    "page": 1,
    "limit": 12,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  },
  "message": "Recipes retrieved successfully"
}
```

**Status Codes:**

- `200`: Recipes retrieved successfully
- `400`: Invalid query parameters
- `500`: Internal server error

### Get Single Recipe

```http
GET /api/recipes/:id
```

**Path Parameters:**

- `id`: Recipe ID (string)

**Response:**

```json
{
  "success": true,
  "data": {
    "recipe": {
      "id": "recipe-id",
      "title": "Delicious Pasta",
      "description": "A simple and tasty pasta recipe",
      "instructions": "1. Boil water\n2. Add pasta\n3. Cook for 8 minutes",
      "ingredients": ["pasta", "tomato sauce", "cheese"],
      "tags": ["vegetarian", "quick"],
      "cuisine": "Italian",
      "difficulty": "EASY",
      "prepTime": 10,
      "cookTime": 15,
      "servings": 4,
      "imageUrl": "/uploads/recipe-image.webp",
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z",
      "author": {
        "id": "author-id",
        "username": "chef123",
        "email": "chef@example.com"
      }
    }
  },
  "message": "Recipe retrieved successfully"
}
```

**Status Codes:**

- `200`: Recipe retrieved successfully
- `404`: Recipe not found
- `500`: Internal server error

### Create Recipe

```http
POST /api/recipes
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "title": "New Pasta Recipe",
  "description": "A delicious new pasta dish",
  "instructions": "1. Boil water\n2. Add pasta\n3. Cook for 8 minutes\n4. Add sauce",
  "ingredients": ["pasta", "tomato sauce", "basil", "cheese"],
  "tags": ["vegetarian", "italian"],
  "cuisine": "Italian",
  "difficulty": "EASY",
  "prepTime": 15,
  "cookTime": 20,
  "servings": 4,
  "imageUrl": "/uploads/recipe-image.webp"
}
```

**Field Requirements:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Recipe title (3-100 chars) |
| `description` | string | Yes | Recipe description (10-500 chars) |
| `instructions` | string | Yes | Cooking instructions (20+ chars) |
| `ingredients` | string[] | Yes | List of ingredients (1+ items) |
| `tags` | string[] | No | Recipe tags |
| `cuisine` | string | No | Cuisine type |
| `difficulty` | enum | No | EASY, MEDIUM, or HARD |
| `prepTime` | number | No | Prep time in minutes (>= 0) |
| `cookTime` | number | No | Cook time in minutes (>= 0) |
| `servings` | number | No | Number of servings (>= 1) |
| `imageUrl` | string | No | Image URL from upload endpoint |

**Response:**

```json
{
  "success": true,
  "data": {
    "recipe": {
      "id": "new-recipe-id",
      "title": "New Pasta Recipe",
      "description": "A delicious new pasta dish",
      "instructions": "1. Boil water\n2. Add pasta\n3. Cook for 8 minutes\n4. Add sauce",
      "ingredients": ["pasta", "tomato sauce", "basil", "cheese"],
      "tags": ["vegetarian", "italian"],
      "cuisine": "Italian",
      "difficulty": "EASY",
      "prepTime": 15,
      "cookTime": 20,
      "servings": 4,
      "imageUrl": "/uploads/recipe-image.webp",
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z",
      "author": {
        "id": "author-id",
        "username": "chef123",
        "email": "chef@example.com"
      }
    }
  },
  "message": "Recipe created successfully"
}
```

**Status Codes:**

- `201`: Recipe created successfully
- `400`: Validation error
- `401`: Unauthorized
- `500`: Internal server error

### Update Recipe

```http
PUT /api/recipes/:id
```

**Headers:** `Authorization: Bearer <token>`

**Path Parameters:**

- `id`: Recipe ID (string)

**Request Body:** Same as Create Recipe (all fields optional)

**Response:** Same as Create Recipe response

**Status Codes:**

- `200`: Recipe updated successfully
- `400`: Validation error
- `401`: Unauthorized
- `403`: Not recipe owner
- `404`: Recipe not found
- `500`: Internal server error

### Delete Recipe

```http
DELETE /api/recipes/:id
```

**Headers:** `Authorization: Bearer <token>`

**Path Parameters:**

- `id`: Recipe ID (string)

**Response:**

```json
{
  "success": true,
  "data": null,
  "message": "Recipe deleted successfully"
}
```

**Status Codes:**

- `200`: Recipe deleted successfully
- `401`: Unauthorized
- `403`: Not recipe owner
- `404`: Recipe not found
- `500`: Internal server error

## Favorites Endpoints

### Get User Favorites

```http
GET /api/user/favorites
```

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "success": true,
  "data": {
    "favorites": [
      {
        "id": "favorite-id",
        "recipeId": "recipe-id",
        "userId": "user-id",
        "createdAt": "2025-01-15T10:30:00.000Z",
        "recipe": {
          "id": "recipe-id",
          "title": "Favorite Recipe",
          "description": "Description here",
          "imageUrl": "/uploads/image.webp",
          "author": {
            "username": "chef123"
          }
        }
      }
    ]
  },
  "message": "Favorites retrieved successfully"
}
```

**Status Codes:**

- `200`: Favorites retrieved successfully
- `401`: Unauthorized
- `500`: Internal server error

### Add Recipe to Favorites

```http
POST /api/user/favorites/:recipeId
```

**Headers:** `Authorization: Bearer <token>`

**Path Parameters:**

- `recipeId`: Recipe ID to add to favorites

**Response:**

```json
{
  "success": true,
  "data": {
    "favorite": {
      "id": "favorite-id",
      "recipeId": "recipe-id",
      "userId": "user-id",
      "createdAt": "2025-01-15T10:30:00.000Z"
    }
  },
  "message": "Recipe added to favorites"
}
```

**Status Codes:**

- `201`: Added to favorites successfully
- `400`: Recipe already in favorites
- `401`: Unauthorized
- `404`: Recipe not found
- `500`: Internal server error

### Remove Recipe from Favorites

```http
DELETE /api/user/favorites/:recipeId
```

**Headers:** `Authorization: Bearer <token>`

**Path Parameters:**

- `recipeId`: Recipe ID to remove from favorites

**Response:**

```json
{
  "success": true,
  "data": null,
  "message": "Recipe removed from favorites"
}
```

**Status Codes:**

- `200`: Removed from favorites successfully
- `401`: Unauthorized
- `404`: Recipe not in favorites
- `500`: Internal server error

## Bookmarks Endpoints

### Get User Bookmarks

```http
GET /api/user/bookmarks
```

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "success": true,
  "data": {
    "bookmarks": [
      {
        "id": "bookmark-id",
        "recipeId": "recipe-id",
        "userId": "user-id",
        "createdAt": "2025-01-15T10:30:00.000Z",
        "recipe": {
          "id": "recipe-id",
          "title": "Bookmarked Recipe",
          "description": "Description here",
          "imageUrl": "/uploads/image.webp",
          "author": {
            "username": "chef123"
          }
        }
      }
    ]
  },
  "message": "Bookmarks retrieved successfully"
}
```

**Status Codes:**

- `200`: Bookmarks retrieved successfully
- `401`: Unauthorized
- `500`: Internal server error

### Add Recipe to Bookmarks

```http
POST /api/user/bookmarks/:recipeId
```

**Headers:** `Authorization: Bearer <token>`

**Path Parameters:**

- `recipeId`: Recipe ID to add to bookmarks

**Response:**

```json
{
  "success": true,
  "data": {
    "bookmark": {
      "id": "bookmark-id",
      "recipeId": "recipe-id",
      "userId": "user-id",
      "createdAt": "2025-01-15T10:30:00.000Z"
    }
  },
  "message": "Recipe added to bookmarks"
}
```

**Status Codes:**

- `201`: Added to bookmarks successfully
- `400`: Recipe already in bookmarks
- `401`: Unauthorized
- `404`: Recipe not found
- `500`: Internal server error

### Remove Recipe from Bookmarks

```http
DELETE /api/user/bookmarks/:recipeId
```

**Headers:** `Authorization: Bearer <token>`

**Path Parameters:**

- `recipeId`: Recipe ID to remove from bookmarks

**Response:**

```json
{
  "success": true,
  "data": null,
  "message": "Recipe removed from bookmarks"
}
```

**Status Codes:**

- `200`: Removed from bookmarks successfully
- `401`: Unauthorized
- `404`: Recipe not in bookmarks
- `500`: Internal server error

## File Upload Endpoint

### Upload Recipe Image

```http
POST /api/upload
```

**Headers:**

- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Request Body:**

- Form field: `image` (file)

**Supported Formats:**

- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- Maximum size: 5MB

**Response:**

```json
{
  "success": true,
  "data": {
    "url": "/uploads/user-id_timestamp_filename_optimized.webp",
    "originalName": "recipe-photo.jpg",
    "size": 245760,
    "optimized": true
  },
  "message": "Image uploaded successfully"
}
```

**Features:**

- Automatic WebP conversion for optimization
- Image resizing and compression
- Unique filename generation to prevent conflicts
- Secure file validation

**Status Codes:**

- `200`: Image uploaded successfully
- `400`: Invalid file format or size
- `401`: Unauthorized
- `500`: Internal server error

## Health Check Endpoint

### System Health Check

```http
GET /health
```

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "uptime": 3600,
  "environment": "development",
  "database": "connected",
  "version": "1.0.0"
}
```

**Status Codes:**

- `200`: System healthy
- `503`: System unhealthy

## Error Handling

### Common Error Responses

#### Validation Error (400)

```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

#### Unauthorized (401)

```json
{
  "success": false,
  "error": "Unauthorized",
  "details": "Invalid or expired token"
}
```

#### Forbidden (403)

```json
{
  "success": false,
  "error": "Forbidden",
  "details": "You don't have permission to perform this action"
}
```

#### Not Found (404)

```json
{
  "success": false,
  "error": "Not found",
  "details": "Recipe not found"
}
```

#### Internal Server Error (500)

```json
{
  "success": false,
  "error": "Internal server error",
  "details": "An unexpected error occurred"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Authentication endpoints**: 5 requests per 15 minutes per IP
- **General API endpoints**: 100 requests per 15 minutes per IP
- **Upload endpoint**: 10 requests per 15 minutes per authenticated user

When rate limit is exceeded:

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "details": "Too many requests, please try again later"
}
```

## API Usage Examples

### JavaScript/TypeScript

```typescript
// Login and get token
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { data } = await loginResponse.json();
const token = data.accessToken;

// Get recipes with filtering
const recipesResponse = await fetch('/api/recipes?search=pasta&cuisine=Italian&page=1&limit=12', {
  headers: { 'Authorization': `Bearer ${token}` }
});

const recipes = await recipesResponse.json();

// Create a new recipe
const createResponse = await fetch('/api/recipes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'My New Recipe',
    description: 'A delicious recipe',
    instructions: 'Step 1...\nStep 2...',
    ingredients: ['ingredient1', 'ingredient2'],
    difficulty: 'EASY',
    cookTime: 30
  })
});
```

### cURL Examples

```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get recipes with filtering
curl -X GET "http://localhost:3001/api/recipes?search=pasta&sortBy=cookTime&sortOrder=asc" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Upload image
curl -X POST http://localhost:3001/api/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/image.jpg"

# Create recipe
curl -X POST http://localhost:3001/api/recipes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "New Recipe",
    "description": "Recipe description",
    "instructions": "Cook it well",
    "ingredients": ["salt", "pepper"],
    "difficulty": "EASY"
  }'
```

## Data Models

### User Model

```typescript
interface User {
  id: string;
  email: string;
  username: string;
  password: string; // hashed, never returned in responses
  createdAt: Date;
  updatedAt: Date;
}
```

### Recipe Model

```typescript
interface Recipe {
  id: string;
  title: string;
  description: string;
  instructions: string;
  ingredients: string[];
  tags: string[];
  cuisine?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  imageUrl?: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  author: User;
}
```

### Favorite Model

```typescript
interface Favorite {
  id: string;
  userId: string;
  recipeId: string;
  createdAt: Date;
  user: User;
  recipe: Recipe;
}
```

### Bookmark Model

```typescript
interface Bookmark {
  id: string;
  userId: string;
  recipeId: string;
  createdAt: Date;
  user: User;
  recipe: Recipe;
}
```

## Security Considerations

1. **Authentication**: All sensitive endpoints require valid JWT tokens
2. **Authorization**: Users can only modify their own recipes, favorites, and bookmarks
3. **Input Validation**: All inputs are validated and sanitized
4. **File Upload Security**: File type validation, size limits, and secure storage
5. **Rate Limiting**: Protects against abuse and spam
6. **CORS**: Configured to allow only trusted origins
7. **SQL Injection Protection**: Prisma ORM provides automatic protection
8. **Password Security**: Bcrypt hashing with salt rounds

## Database Schema

The API uses Prisma ORM with the following main entities:

- **Users**: Authentication and user management
- **Recipes**: Recipe data and relationships
- **Favorites**: User favorite recipes (many-to-many)
- **Bookmarks**: User bookmarked recipes (many-to-many)

For detailed schema information, see `apps/backend/src/prisma/schema.prisma`.

## Testing

The API includes comprehensive test coverage:

- **54 Backend Tests**: Authentication, recipes, favorites, bookmarks, health checks
- **Integration Tests**: Full request/response cycle testing
- **Database Tests**: SQLite test database with automatic cleanup
- **Error Handling Tests**: Various error scenarios

Run tests:

```bash
cd apps/backend
npm test
```

## Changelog

### Version 1.0.0 (Current)

- ✅ Complete authentication system with JWT
- ✅ Full CRUD operations for recipes
- ✅ Advanced filtering and sorting
- ✅ Favorites and bookmarks functionality
- ✅ File upload with image optimization
- ✅ Comprehensive error handling
- ✅ Rate limiting and security measures
- ✅ Health monitoring endpoints
- ✅ Complete test coverage (54 tests)
- ✅ Consistent API response structure
- ✅ Fixed pagination metadata structure

## Support

For API issues or questions:

1. Check this documentation
2. Review the test files for usage examples
3. Check the health endpoint for system status
4. Review server logs for detailed error information

## Related Documentation

- [Development Setup](./development-setup.md) - Local development guide
- [Deployment Guide](./deployment-guide.md) - Production deployment
- [Favorites & Bookmarks](./favorites-bookmarks.md) - Feature details
