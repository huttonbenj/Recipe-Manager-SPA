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
    const key = [...recipeKeys.lists(), normalizedParams]
    console.log('[QUERY KEY] recipeKeys.list:', key)
    return key
  },
  details: () => [...recipeKeys.all, 'detail'],
  detail: (id: string) => [...recipeKeys.details(), id],
  recent: () => [...recipeKeys.all, 'recent'],
}

// Debug function to log cache state
function debugCache(queryClient: any, action: string) {
  const cache = queryClient.getQueryCache()
  const allQueries = cache.getAll()
  const recipeQueries = allQueries.filter((q: any) => q.queryKey[0] === 'recipes')
  
  console.log(`[CACHE DEBUG] ${action} - Recipe queries in cache:`, recipeQueries.length)
  recipeQueries.forEach((q: any) => {
    console.log(`  - ${JSON.stringify(q.queryKey)}: ${q.state.status} (${q.state.dataUpdatedAt})`)
  })
}

/**
 * Hook to get recipes with search and pagination
 */
export function useRecipes(params?: RecipeSearchParams) {
  const queryClient = useQueryClient()
  
  // Debug cache state before query
  debugCache(queryClient, 'BEFORE useRecipes query')
  
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
export function useRecipe(id: string) {
  return useQuery({
    queryKey: recipeKeys.detail(id),
    queryFn: () => recipesApi.getRecipe(id),
    enabled: !!id,
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
      
      // Debug cache state before clearing
      debugCache(queryClient, 'BEFORE create cache clear')
      
      // Aggressively clear all recipe-related cache
      queryClient.removeQueries({ queryKey: recipeKeys.all })
      
      // Force refetch all recipe queries that might be active
      queryClient.invalidateQueries({ 
        queryKey: recipeKeys.all,
        refetchType: 'all'
      })
      
      // Set the new recipe in the detail cache immediately
      queryClient.setQueryData(recipeKeys.detail(newRecipe.id), newRecipe)
      
      // Debug cache state after clearing
      debugCache(queryClient, 'AFTER create cache clear')
      
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
      
      // Debug cache state before clearing
      debugCache(queryClient, 'BEFORE update cache clear')
      
      // Aggressively clear all recipe-related cache
      queryClient.removeQueries({ queryKey: recipeKeys.all })
      
      // Force refetch all recipe queries that might be active
      queryClient.invalidateQueries({ 
        queryKey: recipeKeys.all,
        refetchType: 'all'
      })
      
      // Update the recipe in the detail cache immediately
      queryClient.setQueryData(recipeKeys.detail(id), updatedRecipe)
      
      // Debug cache state after clearing
      debugCache(queryClient, 'AFTER update cache clear')
      
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
      
      // Debug cache state before clearing
      debugCache(queryClient, 'BEFORE delete cache clear')
      
      // Aggressively clear all recipe-related cache
      queryClient.removeQueries({ queryKey: recipeKeys.all })
      
      // Force refetch all recipe queries that might be active
      queryClient.invalidateQueries({ 
        queryKey: recipeKeys.all,
        refetchType: 'all'
      })
      
      // Debug cache state after clearing
      debugCache(queryClient, 'AFTER delete cache clear')
      
      showToast('Recipe deleted successfully!')
    },
    onError: (error: any) => {
      console.error('❌ useDeleteRecipe: Error deleting recipe:', error)
      showError('Failed to delete recipe. Please try again.')
    }
  })
}