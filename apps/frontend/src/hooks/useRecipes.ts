/**
 * Recipe management hooks using React Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { recipesApi } from '@/services/api/recipes'
import { useToast } from '@/context/ToastContext'
import type { CreateRecipeData, RecipeSearchParams } from '@/types'

// Utility to normalize params for query keys
function normalizeParams(params?: RecipeSearchParams) {
  if (!params) return undefined
  return Object.fromEntries(
    Object.entries(params)
      .filter(([_, v]) => {
        // Filter out undefined, null, empty strings, and empty arrays
        if (v === undefined || v === null) return false
        if (typeof v === 'string' && v.trim() === '') return false
        if (Array.isArray(v) && v.length === 0) return false
        return true
      })
      .sort(([a], [b]) => a.localeCompare(b))
  )
}

// Query keys for React Query
export const recipeKeys = {
  all: ['recipes'],
  lists: () => [...recipeKeys.all, 'list'],
  list: (params?: RecipeSearchParams) => {
    const normalizedParams = normalizeParams(params)
    return [...recipeKeys.lists(), normalizedParams]
  },
  details: () => [...recipeKeys.all, 'detail'],
  detail: (id: string) => [...recipeKeys.details(), id],
  recent: () => [...recipeKeys.all, 'recent'],
}



/**
 * Hook to get recipes with search and pagination
 */
export function useRecipes(params?: RecipeSearchParams) {
  return useQuery({
    queryKey: recipeKeys.list(params),
    queryFn: () => recipesApi.getRecipes(params),
    staleTime: 1 * 60 * 1000, // 1 minute - short enough for development
    refetchOnMount: true, // Ensure we refetch when component mounts
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: true, // Refetch when reconnecting
  })
}

/**
 * Hook to get single recipe by ID
 */
export function useRecipe(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: recipeKeys.detail(id),
    queryFn: () => recipesApi.getRecipe(id),
    enabled: !!id && (options?.enabled !== false),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to get recent recipes
 */
export function useRecentRecipes(limit?: number) {
  return useQuery({
    queryKey: recipeKeys.recent(),
    queryFn: () => recipesApi.getRecentRecipes(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to create new recipe
 */
export function useCreateRecipe() {
  const queryClient = useQueryClient()
  const { success: showToast, error: showError } = useToast()
  
  return useMutation({
    mutationFn: (recipeData: CreateRecipeData) => {
      console.log('📝 useCreateRecipe: Creating recipe:', recipeData.title)
      return recipesApi.createRecipe(recipeData)
    },
    onSuccess: async (newRecipe) => {
      console.log('✅ useCreateRecipe: Recipe created successfully:', newRecipe.id)
      
      // Set the new recipe in the detail cache immediately
      queryClient.setQueryData(recipeKeys.detail(newRecipe.id), newRecipe)
      
      // Clear all recipe list cache more aggressively
      queryClient.removeQueries({ queryKey: recipeKeys.lists() })
      
      // Invalidate all list queries to refetch fresh data
      queryClient.invalidateQueries({ 
        queryKey: recipeKeys.lists(),
        refetchType: 'active'
      })
      
      showToast('Recipe created successfully!')
    },
    onError: (error: any) => {
      console.error('❌ useCreateRecipe: Error creating recipe:', error)
      showError('Failed to create recipe. Please try again.')
    }
  })
}

/**
 * Hook to update existing recipe
 */
export function useUpdateRecipe() {
  const queryClient = useQueryClient()
  const { success: showToast, error: showError } = useToast()
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<CreateRecipeData> }) => {
      console.log('📝 useUpdateRecipe: Updating recipe:', id)
      return recipesApi.updateRecipe(id, updates)
    },
    onSuccess: async (updatedRecipe, { id }) => {
      console.log('✅ useUpdateRecipe: Recipe updated successfully:', id)
      
      // Update the recipe in the detail cache immediately
      queryClient.setQueryData(recipeKeys.detail(id), updatedRecipe)
      
      // Clear all recipe list cache more aggressively
      queryClient.removeQueries({ queryKey: recipeKeys.lists() })
      
      // Invalidate all list queries to refetch fresh data
      queryClient.invalidateQueries({ 
        queryKey: recipeKeys.lists(),
        refetchType: 'active'
      })
      
      showToast('Recipe updated successfully!')
    },
    onError: (error: any) => {
      console.error('❌ useUpdateRecipe: Error updating recipe:', error)
      showError('Failed to update recipe. Please try again.')
    }
  })
}

/**
 * Hook to delete recipe
 */
export function useDeleteRecipe() {
  const queryClient = useQueryClient()
  const { success: showToast, error: showError } = useToast()
  
  return useMutation({
    mutationFn: (id: string) => {
      console.log('🗑️ useDeleteRecipe: Deleting recipe:', id)
      return recipesApi.deleteRecipe(id)
    },
    onSuccess: async (_, deletedId) => {
      console.log('✅ useDeleteRecipe: Recipe deleted successfully:', deletedId)
      
      // Remove the specific recipe from detail cache
      queryClient.removeQueries({ queryKey: recipeKeys.detail(deletedId) })
      
      // Clear all recipe-related cache more aggressively
      queryClient.removeQueries({ queryKey: recipeKeys.lists() })
      
      // Invalidate all list queries to refetch fresh data
      queryClient.invalidateQueries({ 
        queryKey: recipeKeys.lists(),
        refetchType: 'active'
      })
      
      showToast('Recipe deleted successfully!')
    },
    onError: (error: any) => {
      console.error('❌ useDeleteRecipe: Error deleting recipe:', error)
      showError('Failed to delete recipe. Please try again.')
    }
  })
}