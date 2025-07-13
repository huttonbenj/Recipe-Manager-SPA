# Recipe Manager API Documentation

## Overview

The Recipe Manager API provides endpoints for managing recipes, user authentication, and file uploads.

## Base URL

```text
http://localhost:3001/api
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```text
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### POST /auth/login

Login with email and password.

#### POST /auth/register

Register a new user account.

#### DELETE /auth/logout

Logout the current user.

#### POST /auth/refresh

Refresh the authentication token.

### Recipes

#### GET /recipes

Get all recipes with optional filtering and pagination.

#### GET /recipes/:id

Get a specific recipe by ID.

#### POST /recipes

Create a new recipe (requires authentication).

#### PUT /recipes/:id

Update an existing recipe (requires authentication and ownership).

#### DELETE /recipes/:id

Delete a recipe (requires authentication and ownership).

### File Upload

#### POST /upload/image

Upload an image file for recipes.

## Response Format

All API responses follow this format:

```json
{
  "success": boolean,
  "data": any,
  "error": string,
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

## Error Handling

The API returns appropriate HTTP status codes and error messages for different scenarios.

## Rate Limiting

API endpoints are rate-limited to prevent abuse. The default limit is 100 requests per 15-minute window.
