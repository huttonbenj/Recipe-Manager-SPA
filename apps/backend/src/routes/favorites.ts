/**
 * Favorites and Bookmarks Routes
 * API endpoints for user favorites and bookmarks
 */

import { Router } from 'express'
import { authenticateToken } from '../middleware/auth'
import FavoritesController from '../controllers/favoritesController'

const router = Router()

// All routes require authentication
router.use(authenticateToken)

// Favorites routes
router.post('/favorites/:recipeId', FavoritesController.addToFavorites)
router.delete('/favorites/:recipeId', FavoritesController.removeFromFavorites)
router.get('/favorites', FavoritesController.getUserFavorites)
router.get('/favorites/:recipeId/status', FavoritesController.checkFavoriteStatus)

// Bookmarks routes
router.post('/bookmarks/:recipeId', FavoritesController.addToBookmarks)
router.delete('/bookmarks/:recipeId', FavoritesController.removeFromBookmarks)
router.get('/bookmarks', FavoritesController.getUserBookmarks)
router.get('/bookmarks/:recipeId/status', FavoritesController.checkBookmarkStatus)

// Interaction counts (public endpoint - no auth required)
router.get('/interactions/:recipeId/counts', FavoritesController.getInteractionCounts)

export default router 