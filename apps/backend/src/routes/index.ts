/**
 * Main router - combines all route modules
 */

import { Router } from 'express'
import authRoutes from './auth'
import recipeRoutes from './recipes'
import uploadRoutes from './upload'
import favoritesRoutes from './favorites'

const router = Router()

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
    },
  })
})

export default router