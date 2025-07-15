/**
 * Main router - combines all route modules
 */

import { Router } from 'express'
import authRoutes from './auth'
import recipeRoutes from './recipes'
import uploadRoutes from './upload'
import favoritesRoutes from './favorites'
import healthRoutes from './health'

const router = Router()

// Health check (no /api prefix needed for Docker health checks)
router.use('/', healthRoutes)

// Mount route modules
router.use('/auth', authRoutes)
router.use('/recipes', recipeRoutes)
router.use('/upload', uploadRoutes)
router.use('/user', favoritesRoutes)

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'Recipe Manager API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      recipes: '/api/recipes',
      upload: '/api/upload',
      favorites: '/api/user/favorites',
      bookmarks: '/api/user/bookmarks',
      health: '/api/health',
    },
  })
})

export default router