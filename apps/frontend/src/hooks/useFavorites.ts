/**
 * Favorites and Bookmarks Hook
 * Custom hook for managing favorites and bookmarks state
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { favoritesApi } from '../services/api/favorites'
import { UserFavorite, UserBookmark } from '../types/recipe'
import { useToast } from '../context/ToastContext'

export const useFavorites = () => {
  const queryClient = useQueryClient()
  const { success, error } = useToast()

  // Get user favorites
  const {
    data: favorites = [],
    isLoading: favoritesLoading,
    error: favoritesError
  } = useQuery({
    queryKey: ['favorites'],
    queryFn: favoritesApi.getUserFavorites
  })

  // Get user bookmarks
  const {
    data: bookmarks = [],
    isLoading: bookmarksLoading,
    error: bookmarksError
  } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: favoritesApi.getUserBookmarks
  })

  // Add to favorites mutation
  const addToFavoritesMutation = useMutation({
    mutationFn: (recipeId: string) => favoritesApi.addToFavorites(recipeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      success('Recipe added to favorites!')
    },
    onError: (err: any) => {
      error(err.response?.data?.message || 'Failed to add to favorites')
    }
  })

  // Remove from favorites mutation
  const removeFromFavoritesMutation = useMutation({
    mutationFn: (recipeId: string) => favoritesApi.removeFromFavorites(recipeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      success('Recipe removed from favorites')
    },
    onError: (err: any) => {
      error(err.response?.data?.message || 'Failed to remove from favorites')
    }
  })

  // Add to bookmarks mutation
  const addToBookmarksMutation = useMutation({
    mutationFn: (recipeId: string) => favoritesApi.addToBookmarks(recipeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] })
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      success('Recipe bookmarked!')
    },
    onError: (err: any) => {
      error(err.response?.data?.message || 'Failed to bookmark recipe')
    }
  })

  // Remove from bookmarks mutation
  const removeFromBookmarksMutation = useMutation({
    mutationFn: (recipeId: string) => favoritesApi.removeFromBookmarks(recipeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] })
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      success('Recipe removed from bookmarks')
    },
    onError: (err: any) => {
      error(err.response?.data?.message || 'Failed to remove from bookmarks')
    }
  })

  // Toggle functions
  const toggleFavorite = (recipeId: string, isFavorited: boolean) => {
    if (isFavorited) {
      removeFromFavoritesMutation.mutate(recipeId)
    } else {
      addToFavoritesMutation.mutate(recipeId)
    }
  }

  const toggleBookmark = (recipeId: string, isBookmarked: boolean) => {
    if (isBookmarked) {
      removeFromBookmarksMutation.mutate(recipeId)
    } else {
      addToBookmarksMutation.mutate(recipeId)
    }
  }

  // Helper functions
  const isFavorited = (recipeId: string): boolean => {
    return favorites.some((fav: UserFavorite) => fav.recipeId === recipeId)
  }

  const isBookmarked = (recipeId: string): boolean => {
    return bookmarks.some((bookmark: UserBookmark) => bookmark.recipeId === recipeId)
  }

  return {
    // Data
    favorites,
    bookmarks,
    
    // Loading states
    favoritesLoading,
    bookmarksLoading,
    
    // Error states
    favoritesError,
    bookmarksError,
    
    // Mutation loading states
    isAddingToFavorites: addToFavoritesMutation.isPending,
    isRemovingFromFavorites: removeFromFavoritesMutation.isPending,
    isAddingToBookmarks: addToBookmarksMutation.isPending,
    isRemovingFromBookmarks: removeFromBookmarksMutation.isPending,
    
    // Actions
    toggleFavorite,
    toggleBookmark,
    
    // Helper functions
    isFavorited,
    isBookmarked
  }
}

export default useFavorites 