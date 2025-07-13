/**
 * Favorites and Bookmarks Service
 * Handles user favorites and bookmarks for recipes
 */

import { PrismaClient } from '@prisma/client'
import { 
  UserFavoriteWithRecipe, 
  UserBookmarkWithRecipe, 
  RecipeWithInteractions,
  NotFoundError,
  ValidationError 
} from '../types'

const prisma = new PrismaClient()

export class FavoritesService {
  // Favorites methods
  static async addToFavorites(userId: string, recipeId: string): Promise<UserFavoriteWithRecipe> {
    try {
      // Check if recipe exists
      const recipe = await prisma.recipe.findUnique({
        where: { id: recipeId },
        include: { author: true }
      })

      if (!recipe) {
        throw new NotFoundError('Recipe', recipeId)
      }

      // Check if already favorited
      const existingFavorite = await prisma.userFavorite.findUnique({
        where: {
          userId_recipeId: {
            userId,
            recipeId
          }
        }
      })

      if (existingFavorite) {
        throw new ValidationError('Recipe is already in favorites')
      }

      // Create favorite
      const favorite = await prisma.userFavorite.create({
        data: {
          userId,
          recipeId
        },
        include: {
          recipe: {
            include: {
              author: {
                select: {
                  id: true,
                  email: true,
                  name: true,
                  avatar: true,
                  createdAt: true,
                  updatedAt: true
                }
              }
            }
          }
        }
      })

      return favorite
    } catch (error) {
      console.error('Error adding to favorites:', error)
      throw error
    }
  }

  static async removeFromFavorites(userId: string, recipeId: string): Promise<void> {
    try {
      const favorite = await prisma.userFavorite.findUnique({
        where: {
          userId_recipeId: {
            userId,
            recipeId
          }
        }
      })

      if (!favorite) {
        throw new NotFoundError('Favorite')
      }

      await prisma.userFavorite.delete({
        where: {
          userId_recipeId: {
            userId,
            recipeId
          }
        }
      })
    } catch (error) {
      console.error('Error removing from favorites:', error)
      throw error
    }
  }

  static async getUserFavorites(userId: string): Promise<UserFavoriteWithRecipe[]> {
    try {
      const favorites = await prisma.userFavorite.findMany({
        where: { userId },
        include: {
          recipe: {
            include: {
              author: {
                select: {
                  id: true,
                  email: true,
                  name: true,
                  avatar: true,
                  createdAt: true,
                  updatedAt: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      return favorites
    } catch (error) {
      console.error('Error getting user favorites:', error)
      throw error
    }
  }

  // Bookmarks methods
  static async addToBookmarks(userId: string, recipeId: string): Promise<UserBookmarkWithRecipe> {
    try {
      // Check if recipe exists
      const recipe = await prisma.recipe.findUnique({
        where: { id: recipeId },
        include: { author: true }
      })

      if (!recipe) {
        throw new NotFoundError('Recipe', recipeId)
      }

      // Check if already bookmarked
      const existingBookmark = await prisma.userBookmark.findUnique({
        where: {
          userId_recipeId: {
            userId,
            recipeId
          }
        }
      })

      if (existingBookmark) {
        throw new ValidationError('Recipe is already bookmarked')
      }

      // Create bookmark
      const bookmark = await prisma.userBookmark.create({
        data: {
          userId,
          recipeId
        },
        include: {
          recipe: {
            include: {
              author: {
                select: {
                  id: true,
                  email: true,
                  name: true,
                  avatar: true,
                  createdAt: true,
                  updatedAt: true
                }
              }
            }
          }
        }
      })

      return bookmark
    } catch (error) {
      console.error('Error adding to bookmarks:', error)
      throw error
    }
  }

  static async removeFromBookmarks(userId: string, recipeId: string): Promise<void> {
    try {
      const bookmark = await prisma.userBookmark.findUnique({
        where: {
          userId_recipeId: {
            userId,
            recipeId
          }
        }
      })

      if (!bookmark) {
        throw new NotFoundError('Bookmark')
      }

      await prisma.userBookmark.delete({
        where: {
          userId_recipeId: {
            userId,
            recipeId
          }
        }
      })
    } catch (error) {
      console.error('Error removing from bookmarks:', error)
      throw error
    }
  }

  static async getUserBookmarks(userId: string): Promise<UserBookmarkWithRecipe[]> {
    try {
      const bookmarks = await prisma.userBookmark.findMany({
        where: { userId },
        include: {
          recipe: {
            include: {
              author: {
                select: {
                  id: true,
                  email: true,
                  name: true,
                  avatar: true,
                  createdAt: true,
                  updatedAt: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      return bookmarks
    } catch (error) {
      console.error('Error getting user bookmarks:', error)
      throw error
    }
  }

  // Check status methods
  static async checkFavoriteStatus(userId: string, recipeId: string): Promise<boolean> {
    try {
      const favorite = await prisma.userFavorite.findUnique({
        where: {
          userId_recipeId: {
            userId,
            recipeId
          }
        }
      })

      return !!favorite
    } catch (error) {
      console.error('Error checking favorite status:', error)
      return false
    }
  }

  static async checkBookmarkStatus(userId: string, recipeId: string): Promise<boolean> {
    try {
      const bookmark = await prisma.userBookmark.findUnique({
        where: {
          userId_recipeId: {
            userId,
            recipeId
          }
        }
      })

      return !!bookmark
    } catch (error) {
      console.error('Error checking bookmark status:', error)
      return false
    }
  }

  // Get counts
  static async getFavoritesCount(recipeId: string): Promise<number> {
    try {
      const count = await prisma.userFavorite.count({
        where: { recipeId }
      })

      return count
    } catch (error) {
      console.error('Error getting favorites count:', error)
      return 0
    }
  }

  static async getBookmarksCount(recipeId: string): Promise<number> {
    try {
      const count = await prisma.userBookmark.count({
        where: { recipeId }
      })

      return count
    } catch (error) {
      console.error('Error getting bookmarks count:', error)
      return 0
    }
  }

  // Enhanced recipe with interaction data
  static async getRecipeWithInteractions(
    recipeId: string, 
    userId?: string
  ): Promise<RecipeWithInteractions | null> {
    try {
      const recipe = await prisma.recipe.findUnique({
        where: { id: recipeId },
        include: {
          author: {
            select: {
              id: true,
              email: true,
              name: true,
              avatar: true,
              createdAt: true,
              updatedAt: true
            }
          }
        }
      })

      if (!recipe) {
        return null
      }

      // Get counts
      const [favoritesCount, bookmarksCount, isFavorited, isBookmarked] = await Promise.all([
        this.getFavoritesCount(recipeId),
        this.getBookmarksCount(recipeId),
        userId ? this.checkFavoriteStatus(userId, recipeId) : false,
        userId ? this.checkBookmarkStatus(userId, recipeId) : false
      ])

      return {
        ...recipe,
        isFavorited,
        isBookmarked,
        favoritesCount,
        bookmarksCount
      }
    } catch (error) {
      console.error('Error getting recipe with interactions:', error)
      throw error
    }
  }
}

export default FavoritesService 