/**
 * Favorites and Bookmarks Controller
 * Handles HTTP requests for user favorites and bookmarks
 */

import { Response } from 'express'
import { RequestWithUser, ApiResponse } from '../types'
import FavoritesService from '../services/favoritesService'

export class FavoritesController {
  // Favorites endpoints
  static async addToFavorites(req: RequestWithUser, res: Response): Promise<void> {
    try {
      const { recipeId } = req.params
      const userId = req.user?.userId

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        } as ApiResponse)
        return
      }

      const favorite = await FavoritesService.addToFavorites(userId, recipeId)

      res.status(201).json({
        success: true,
        data: favorite,
        message: 'Recipe added to favorites'
      } as ApiResponse)
    } catch (error: any) {
      console.error('Error adding to favorites:', error)
      
      if (error.message === 'Recipe is already in favorites') {
        res.status(409).json({
          success: false,
          message: error.message
        } as ApiResponse)
        return
      }

      res.status(500).json({
        success: false,
        message: 'Failed to add recipe to favorites'
      } as ApiResponse)
    }
  }

  static async removeFromFavorites(req: RequestWithUser, res: Response): Promise<void> {
    try {
      const { recipeId } = req.params
      const userId = req.user?.userId

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        } as ApiResponse)
        return
      }

      await FavoritesService.removeFromFavorites(userId, recipeId)

      res.status(200).json({
        success: true,
        message: 'Recipe removed from favorites'
      } as ApiResponse)
    } catch (error: any) {
      console.error('Error removing from favorites:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to remove recipe from favorites'
      } as ApiResponse)
    }
  }

  static async getUserFavorites(req: RequestWithUser, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        } as ApiResponse)
        return
      }

      const favorites = await FavoritesService.getUserFavorites(userId)

      res.status(200).json({
        success: true,
        data: favorites,
        message: 'Favorites retrieved successfully'
      } as ApiResponse)
    } catch (error: any) {
      console.error('Error getting user favorites:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to get user favorites'
      } as ApiResponse)
    }
  }

  // Bookmarks endpoints
  static async addToBookmarks(req: RequestWithUser, res: Response): Promise<void> {
    try {
      const { recipeId } = req.params
      const userId = req.user?.userId

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        } as ApiResponse)
        return
      }

      const bookmark = await FavoritesService.addToBookmarks(userId, recipeId)

      res.status(201).json({
        success: true,
        data: bookmark,
        message: 'Recipe bookmarked'
      } as ApiResponse)
    } catch (error: any) {
      console.error('Error adding to bookmarks:', error)
      
      if (error.message === 'Recipe is already bookmarked') {
        res.status(409).json({
          success: false,
          message: error.message
        } as ApiResponse)
        return
      }

      res.status(500).json({
        success: false,
        message: 'Failed to bookmark recipe'
      } as ApiResponse)
    }
  }

  static async removeFromBookmarks(req: RequestWithUser, res: Response): Promise<void> {
    try {
      const { recipeId } = req.params
      const userId = req.user?.userId

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        } as ApiResponse)
        return
      }

      await FavoritesService.removeFromBookmarks(userId, recipeId)

      res.status(200).json({
        success: true,
        message: 'Recipe removed from bookmarks'
      } as ApiResponse)
    } catch (error: any) {
      console.error('Error removing from bookmarks:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to remove recipe from bookmarks'
      } as ApiResponse)
    }
  }

  static async getUserBookmarks(req: RequestWithUser, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        } as ApiResponse)
        return
      }

      const bookmarks = await FavoritesService.getUserBookmarks(userId)

      res.status(200).json({
        success: true,
        data: bookmarks,
        message: 'Bookmarks retrieved successfully'
      } as ApiResponse)
    } catch (error: any) {
      console.error('Error getting user bookmarks:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to get user bookmarks'
      } as ApiResponse)
    }
  }

  // Status check endpoints
  static async checkFavoriteStatus(req: RequestWithUser, res: Response): Promise<void> {
    try {
      const { recipeId } = req.params
      const userId = req.user?.userId

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        } as ApiResponse)
        return
      }

      const isFavorited = await FavoritesService.checkFavoriteStatus(userId, recipeId)

      res.status(200).json({
        success: true,
        data: { isFavorited },
        message: 'Favorite status retrieved'
      } as ApiResponse)
    } catch (error: any) {
      console.error('Error checking favorite status:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to check favorite status'
      } as ApiResponse)
    }
  }

  static async checkBookmarkStatus(req: RequestWithUser, res: Response): Promise<void> {
    try {
      const { recipeId } = req.params
      const userId = req.user?.userId

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        } as ApiResponse)
        return
      }

      const isBookmarked = await FavoritesService.checkBookmarkStatus(userId, recipeId)

      res.status(200).json({
        success: true,
        data: { isBookmarked },
        message: 'Bookmark status retrieved'
      } as ApiResponse)
    } catch (error: any) {
      console.error('Error checking bookmark status:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to check bookmark status'
      } as ApiResponse)
    }
  }

  // Get interaction counts
  static async getInteractionCounts(req: RequestWithUser, res: Response): Promise<void> {
    try {
      const { recipeId } = req.params

      const [favoritesCount, bookmarksCount] = await Promise.all([
        FavoritesService.getFavoritesCount(recipeId),
        FavoritesService.getBookmarksCount(recipeId)
      ])

      res.status(200).json({
        success: true,
        data: {
          favoritesCount,
          bookmarksCount
        },
        message: 'Interaction counts retrieved'
      } as ApiResponse)
    } catch (error: any) {
      console.error('Error getting interaction counts:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to get interaction counts'
      } as ApiResponse)
    }
  }
}

export default FavoritesController 