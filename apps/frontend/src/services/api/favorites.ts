/**
 * Favorites and Bookmarks API Service
 * Handles all favorites and bookmarks-related API calls
 */

import { apiClient } from './client'
import { UserFavorite, UserBookmark, InteractionCounts } from '../../types/recipe'

export const favoritesApi = {
  // Favorites endpoints
  async addToFavorites(recipeId: string): Promise<UserFavorite> {
    const response = await apiClient.post(`/user/favorites/${recipeId}`)
    return response.data.data
  },

  async removeFromFavorites(recipeId: string): Promise<void> {
    await apiClient.delete(`/user/favorites/${recipeId}`)
  },

  async getUserFavorites(): Promise<UserFavorite[]> {
    const response = await apiClient.get('/user/favorites')
    return response.data.data
  },

  async checkFavoriteStatus(recipeId: string): Promise<boolean> {
    const response = await apiClient.get(`/user/favorites/${recipeId}/status`)
    return response.data.data.isFavorited
  },

  // Bookmarks endpoints
  async addToBookmarks(recipeId: string): Promise<UserBookmark> {
    const response = await apiClient.post(`/user/bookmarks/${recipeId}`)
    return response.data.data
  },

  async removeFromBookmarks(recipeId: string): Promise<void> {
    await apiClient.delete(`/user/bookmarks/${recipeId}`)
  },

  async getUserBookmarks(): Promise<UserBookmark[]> {
    const response = await apiClient.get('/user/bookmarks')
    return response.data.data
  },

  async checkBookmarkStatus(recipeId: string): Promise<boolean> {
    const response = await apiClient.get(`/user/bookmarks/${recipeId}/status`)
    return response.data.data.isBookmarked
  },

  // Interaction counts (public endpoint)
  async getInteractionCounts(recipeId: string): Promise<InteractionCounts> {
    const response = await apiClient.get(`/user/interactions/${recipeId}/counts`)
    return response.data.data
  },

  // Toggle functions for convenience
  async toggleFavorite(recipeId: string, isFavorited: boolean): Promise<UserFavorite | void> {
    if (isFavorited) {
      return this.removeFromFavorites(recipeId)
    } else {
      return this.addToFavorites(recipeId)
    }
  },

  async toggleBookmark(recipeId: string, isBookmarked: boolean): Promise<UserBookmark | void> {
    if (isBookmarked) {
      return this.removeFromBookmarks(recipeId)
    } else {
      return this.addToBookmarks(recipeId)
    }
  }
} 