/**
 * Mock API handlers for testing
 * Define mock responses for API endpoints
 */

import { http, HttpResponse } from 'msw'
import { API_BASE_URL } from '@/utils/constants'

export const handlers = [
  // Auth endpoints
  http.post(`${API_BASE_URL}/auth/login`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          name: 'Test User',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        token: 'mock-jwt-token',
      },
    })
  }),

  http.post(`${API_BASE_URL}/auth/register`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        user: {
          id: 'new-user-id',
          email: 'newuser@example.com',
          name: 'New User',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        token: 'mock-jwt-token',
      },
    }, { status: 201 })
  }),

  http.delete(`${API_BASE_URL}/auth/logout`, () => {
    return HttpResponse.json({
      success: true,
      message: 'Logged out successfully',
    })
  }),

  // Recipe endpoints
  http.get(`${API_BASE_URL}/recipes`, () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: 'recipe-1',
          title: 'Test Recipe',
          description: 'A test recipe',
          ingredients: ['ingredient 1', 'ingredient 2'],
          instructions: ['step 1', 'step 2'],
          prepTime: 15,
          cookTime: 30,
          servings: 4,
          difficulty: 'easy',
          cuisine: 'american',
          category: 'main',
          tags: ['test'],
          imageUrl: 'https://example.com/image.jpg',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          authorId: 'test-user-id',
        },
      ],
    })
  }),

  http.get(`${API_BASE_URL}/recipes/:id`, ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: {
        id: params.id,
        title: 'Test Recipe',
        description: 'A test recipe',
        ingredients: ['ingredient 1', 'ingredient 2'],
        instructions: ['step 1', 'step 2'],
        prepTime: 15,
        cookTime: 30,
        servings: 4,
        difficulty: 'easy',
        cuisine: 'american',
        category: 'main',
        tags: ['test'],
        imageUrl: 'https://example.com/image.jpg',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        authorId: 'test-user-id',
      },
    })
  }),

  http.post(`${API_BASE_URL}/recipes`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        id: 'new-recipe-id',
        title: 'New Recipe',
        description: 'A new recipe',
        ingredients: ['ingredient 1'],
        instructions: ['step 1'],
        prepTime: 10,
        cookTime: 20,
        servings: 2,
        difficulty: 'easy',
        cuisine: 'american',
        category: 'main',
        tags: ['new'],
        imageUrl: 'https://example.com/image.jpg',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        authorId: 'test-user-id',
      },
    }, { status: 201 })
  }),

  http.put(`${API_BASE_URL}/recipes/:id`, ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: {
        id: params.id,
        title: 'Updated Recipe',
        description: 'An updated recipe',
        ingredients: ['updated ingredient'],
        instructions: ['updated step'],
        prepTime: 15,
        cookTime: 25,
        servings: 3,
        difficulty: 'medium',
        cuisine: 'italian',
        category: 'main',
        tags: ['updated'],
        imageUrl: 'https://example.com/updated-image.jpg',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        authorId: 'test-user-id',
      },
    })
  }),

  http.delete(`${API_BASE_URL}/recipes/:id`, () => {
    return HttpResponse.json({
      success: true,
      message: 'Recipe deleted successfully',
    })
  }),

  // Favorites endpoints
  http.get(`${API_BASE_URL}/favorites`, () => {
    return HttpResponse.json({
      success: true,
      data: ['recipe-1'],
    })
  }),

  http.post(`${API_BASE_URL}/favorites/:id`, ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: {
        recipeId: params.id,
        userId: 'test-user-id',
      },
    })
  }),

  http.delete(`${API_BASE_URL}/favorites/:id`, () => {
    return HttpResponse.json({
      success: true,
      message: 'Favorite removed successfully',
    })
  }),
]