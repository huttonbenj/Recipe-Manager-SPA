/**
 * Recipe management hooks using React Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { recipesApi } from '@/services'
import type { Recipe, CreateRecipeData, RecipeSearchParams, QueryResult, MutationResult } from '@/types'

// Query keys for React Query
export const recipeKeys = {
  all: ['recipes'] as const,
  lists: () => [...recipeKeys.all, 'list'] as const,
  list: (params?: RecipeSearchParams) => [...recipeKeys.lists(), params] as const,
  details: () => [...recipeKeys.all, 'detail'] as const,
  detail: (id: string) => [...recipeKeys.details(), id] as const,
  popular: () => [...recipeKeys.all, 'popular'] as const,
  recent: () => [...recipeKeys.all, 'recent'] as const,
}

/**
 * Hook to get recipes with filtering and pagination
 */
export function useRecipes(params?: RecipeSearchParams) {
  return useQuery({
    queryKey: recipeKeys.list(params),
    queryFn: () => recipesApi.getRecipes(params),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
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
    staleTime: 10 * 60 * 1000, // 10 minutes
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
  
  return useMutation({
    mutationFn: (recipeData: CreateRecipeData) => recipesApi.createRecipe(recipeData),
    onSuccess: () => {
      // Invalidate and refetch recipes list
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() })
      queryClient.invalidateQueries({ queryKey: recipeKeys.recent() })
    },
  })
}

/**
 * Hook to update existing recipe
 */
export function useUpdateRecipe() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<CreateRecipeData> }) =>
      recipesApi.updateRecipe(id, updates),
    onSuccess: (updatedRecipe, { id }) => {
      // Update specific recipe in cache
      queryClient.setQueryData(recipeKeys.detail(id), updatedRecipe)
      // Invalidate lists to reflect changes
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() })
    },
  })
}

/**
 * Hook to delete recipe
 */
export function useDeleteRecipe() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => recipesApi.deleteRecipe(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: recipeKeys.detail(deletedId) })
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() })
    },
  })
}