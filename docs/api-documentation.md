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

## Environment Variables

Required environment variables for the API:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/recipe_manager

# JWT
JWT_SECRET=your-super-secret-jwt-key-minimum-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-key-minimum-32-chars

# Server
PORT=3001
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```
