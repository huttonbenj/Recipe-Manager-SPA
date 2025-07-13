/**
 * Mock API handlers for testing
 * Define mock responses for API endpoints
 */

import { rest } from 'msw'
import { API_BASE_URL } from '@/utils/constants'

export const handlers = [
  // Auth endpoints
  rest.post(`${API_BASE_URL}/auth/login`, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
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
    )
  }),

  rest.post(`${API_BASE_URL}/auth/register`, (_req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
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
      })
    )
  }),

  // Recipe endpoints
  rest.get(`${API_BASE_URL}/recipes`, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          recipes: [
            {
              id: 'recipe-1',
              title: 'Test Recipe',
              description: 'A test recipe',
              ingredients: ['ingredient 1', 'ingredient 2'],
              instructions: 'Test instructions',
              cookTime: 30,
              difficulty: 'EASY',
              tags: ['test'],
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z',
            },
          ],
          pagination: {
            total: 1,
            page: 1,
            limit: 12,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
          },
        },
      })
    )
  }),

  rest.get(`${API_BASE_URL}/recipes/:id`, (req, res, ctx) => {
    const { id } = req.params
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          id,
          title: 'Test Recipe Detail',
          description: 'A detailed test recipe',
          ingredients: ['ingredient 1', 'ingredient 2'],
          instructions: 'Detailed test instructions',
          cookTime: 45,
          difficulty: 'MEDIUM',
          tags: ['test', 'detailed'],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      })
    )
  }),

  // Upload endpoints
  rest.post(`${API_BASE_URL}/upload/image`, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          url: 'https://example.com/test-image.jpg',
          filename: 'test-image.jpg',
          size: 1024,
          mimetype: 'image/jpeg',
        },
      })
    )
  }),
]