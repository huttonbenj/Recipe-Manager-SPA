# API Documentation

## Overview

The Recipe Manager API follows RESTful principles and uses JSON for request/response payloads.

Base URL: `http://localhost:3001/api`

## Authentication

### POST /auth/login

Login with email and password.

```typescript
// Request
{
  "email": string,
  "password": string
}

// Response
{
  "token": string,
  "user": {
    "id": string,
    "email": string,
    "name": string
  }
}
```

### POST /auth/register

Register new user.

```typescript
// Request
{
  "email": string,
  "password": string,
  "name": string
}

// Response
{
  "token": string,
  "user": {
    "id": string,
    "email": string,
    "name": string
  }
}
```

## Recipes

### GET /recipes

Get all recipes with optional filtering.

```typescript
// Query Parameters
{
  "page": number,
  "limit": number,
  "search": string,
  "category": string
}

// Response
{
  "data": Array<Recipe>,
  "total": number,
  "page": number,
  "limit": number
}
```

### GET /recipes/:id

Get recipe by ID.

```typescript
// Response
{
  "id": string,
  "title": string,
  "description": string,
  "ingredients": Array<{
    "name": string,
    "amount": number,
    "unit": string
  }>,
  "instructions": Array<string>,
  "author": {
    "id": string,
    "name": string
  },
  "createdAt": string,
  "updatedAt": string
}
```

### POST /recipes

Create new recipe.

```typescript
// Request
{
  "title": string,
  "description": string,
  "ingredients": Array<{
    "name": string,
    "amount": number,
    "unit": string
  }>,
  "instructions": Array<string>
}

// Response
Recipe
```

### PUT /recipes/:id

Update recipe.

```typescript
// Request
{
  "title"?: string,
  "description"?: string,
  "ingredients"?: Array<{
    "name": string,
    "amount": number,
    "unit": string
  }>,
  "instructions"?: Array<string>
}

// Response
Recipe
```

### DELETE /recipes/:id

Delete recipe.

```typescript
// Response
{
  "message": "Recipe deleted successfully"
}
```

## Categories

### GET /categories

Get all categories.

```typescript
// Response
{
  "data": Array<{
    "id": string,
    "name": string,
    "recipeCount": number
  }>
}
```

## User Profile

### GET /users/me

Get current user profile.

```typescript
// Response
{
  "id": string,
  "email": string,
  "name": string,
  "createdAt": string,
  "recipes": Array<Recipe>
}
```

### PUT /users/me

Update user profile.

```typescript
// Request
{
  "name"?: string,
  "email"?: string,
  "password"?: string
}

// Response
{
  "id": string,
  "email": string,
  "name": string
}
```

## Error Responses

All endpoints may return the following errors:

```typescript
// 400 Bad Request
{
  "error": "ValidationError",
  "message": string,
  "details": Array<{
    "field": string,
    "message": string
  }>
}

// 401 Unauthorized
{
  "error": "UnauthorizedError",
  "message": "Invalid or expired token"
}

// 403 Forbidden
{
  "error": "ForbiddenError",
  "message": "Insufficient permissions"
}

// 404 Not Found
{
  "error": "NotFoundError",
  "message": "Resource not found"
}

// 500 Internal Server Error
{
  "error": "InternalServerError",
  "message": "An unexpected error occurred"
}
```

## Rate Limiting

- Rate limit: 100 requests per minute
- Headers:
  - `X-RateLimit-Limit`: Maximum requests per window
  - `X-RateLimit-Remaining`: Remaining requests in window
  - `X-RateLimit-Reset`: Time until window reset (Unix timestamp)

## Pagination

All list endpoints support pagination:

- Default page size: 20
- Maximum page size: 100
- Parameters:
  - `page`: Page number (1-based)
  - `limit`: Items per page

Response includes:
```typescript
{
  "data": Array<T>,
  "total": number,
  "page": number,
  "limit": number,
  "hasMore": boolean
}
```

## Filtering and Sorting

List endpoints support:

- Search: `?search=query`
- Filtering: `?field=value`
- Sorting: `?sort=field&order=asc|desc`

## CORS

- Allowed origins: Configurable
- Allowed methods: GET, POST, PUT, DELETE
- Allowed headers: Content-Type, Authorization
- Credentials: Supported

## Versioning

- Current version: v1
- Version in URL: `/api/v1/`
- Deprecation notice: Header `X-API-Deprecated`
- Sunset date: Header `X-API-Sunset-Date`