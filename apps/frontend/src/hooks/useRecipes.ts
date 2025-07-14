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
    const key = [...recipeKeys.lists(), normalizedParams] as const
    console.log('[QUERY KEY] recipeKeys.list:', key)
    return key
  },
  detail: (id: string) => {
    const key = [...recipeKeys.all, 'detail', id] as const
    console.log('[QUERY KEY] recipeKeys.detail:', key)
    return key
  },
  popular: () => [...recipeKeys.all, 'popular'] as const,
  recent: () => [...recipeKeys.all, 'recent'] as const,
}

/**
 * Hook to get recipes with filtering and pagination
 */
export function useRecipes(params?: RecipeSearchParams) {
  const key = recipeKeys.list(params)
  console.log('[HOOK] useRecipes queryKey:', key)
  return useQuery({
    queryKey: key,
    queryFn: () => recipesApi.getRecipes(params),
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Hook to get single recipe by ID
 */
export function useRecipe(id: string, options?: { enabled?: boolean }) {
  const key = recipeKeys.detail(id)
  console.log('[HOOK] useRecipe queryKey:', key)
  return useQuery({
    queryKey: key,
    queryFn: () => recipesApi.getRecipe(id),
    enabled: !!id && (options?.enabled !== false),
    staleTime: 10 * 60 * 1000,
  })
}

/**
 * Hook to get popular recipes
 */
export function usePopularRecipes(limit?: number) {
  return useQuery({
    queryKey: recipeKeys.popular(),
    queryFn: () => recipesApi.getPopularRecipes(limit),
    staleTime: 15 * 60 * 1000, // 15 minutes
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
      
      // Invalidate all recipe list queries to ensure fresh data
      await queryClient.invalidateQueries({ 
        queryKey: recipeKeys.all,
        refetchType: 'active'
      })
      
      // Set the new recipe in the detail cache
      queryClient.setQueryData(recipeKeys.detail(newRecipe.id), newRecipe)
      
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
      
      // Invalidate all recipe list queries to ensure fresh data
      await queryClient.invalidateQueries({ 
        queryKey: recipeKeys.all,
        refetchType: 'active'
      })
      
      // Update the recipe in the detail cache
      queryClient.setQueryData(recipeKeys.detail(id), updatedRecipe)
      
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
      
      // Remove the recipe from the detail cache
      queryClient.removeQueries({ queryKey: recipeKeys.detail(deletedId) })
      
      // Invalidate all recipe list queries to ensure fresh data
      await queryClient.invalidateQueries({ 
        queryKey: recipeKeys.all,
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