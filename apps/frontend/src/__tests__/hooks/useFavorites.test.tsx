/**
 * Tests for useFavorites hook
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import { useFavorites } from '@/hooks/useFavorites'
import { favoritesApi } from '@/services/api/favorites'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastProvider } from '@/context/ToastContext'
import React from 'react'
import { vi } from 'vitest'

// Mock the favorites API
vi.mock('@/services/api/favorites', () => ({
    favoritesApi: {
        getUserFavorites: vi.fn(),
        getUserBookmarks: vi.fn(),
        addToFavorites: vi.fn(),
        removeFromFavorites: vi.fn(),
        addToBookmarks: vi.fn(),
        removeFromBookmarks: vi.fn(),
    }
}))

// Mock the toast context
vi.mock('@/context/ToastContext', () => ({
    useToast: () => ({
        success: vi.fn(),
        error: vi.fn(),
    }),
    ToastProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

// Mock the useAuth hook to return authenticated state
vi.mock('@/hooks/useAuth', () => ({
    useAuth: () => ({
        isAuthenticated: true,
        user: { id: 'user1', email: 'test@example.com' },
        token: 'mock-token',
    }),
}))

describe('useFavorites hook', () => {
    let queryClient: QueryClient

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                },
            },
        })

        // Reset mocks
        vi.clearAllMocks()

        // Mock API responses
        const mockFavorites = [
            { id: '1', userId: 'user1', recipeId: 'recipe1', recipe: { id: 'recipe1', title: 'Test Recipe 1' } },
            { id: '2', userId: 'user1', recipeId: 'recipe2', recipe: { id: 'recipe2', title: 'Test Recipe 2' } },
        ]

        const mockBookmarks = [
            { id: '3', userId: 'user1', recipeId: 'recipe3', recipe: { id: 'recipe3', title: 'Test Recipe 3' } },
        ]

            // Setup mock implementations
            ; (favoritesApi.getUserFavorites as any).mockResolvedValue(mockFavorites)
            ; (favoritesApi.getUserBookmarks as any).mockResolvedValue(mockBookmarks)
            ; (favoritesApi.addToFavorites as any).mockResolvedValue({ id: '4', userId: 'user1', recipeId: 'recipe4' })
            ; (favoritesApi.removeFromFavorites as any).mockResolvedValue(undefined)
            ; (favoritesApi.addToBookmarks as any).mockResolvedValue({ id: '5', userId: 'user1', recipeId: 'recipe5' })
            ; (favoritesApi.removeFromBookmarks as any).mockResolvedValue(undefined)
    })

    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            <ToastProvider>{children}</ToastProvider>
        </QueryClientProvider>
    )

    it('should fetch favorites and bookmarks on mount', async () => {
        const { result } = renderHook(() => useFavorites(), { wrapper })

        // Initially should be loading
        expect(result.current.favoritesLoading).toBe(true)
        expect(result.current.bookmarksLoading).toBe(true)

        // Wait for data to load
        await waitFor(() => {
            expect(result.current.favoritesLoading).toBe(false)
            expect(result.current.bookmarksLoading).toBe(false)
        })

        // Check if data is loaded correctly
        expect(result.current.favorites).toHaveLength(2)
        expect(result.current.bookmarks).toHaveLength(1)
    })

    it('should toggle favorite status correctly', async () => {
        const { result } = renderHook(() => useFavorites(), { wrapper })

        // Wait for initial data to load
        await waitFor(() => {
            expect(result.current.favoritesLoading).toBe(false)
        })

        // Test adding to favorites
        await act(async () => {
            result.current.toggleFavorite('recipe4', false)
        })

        expect(favoritesApi.addToFavorites).toHaveBeenCalledWith('recipe4')

        // Test removing from favorites
        await act(async () => {
            result.current.toggleFavorite('recipe1', true)
        })

        expect(favoritesApi.removeFromFavorites).toHaveBeenCalledWith('recipe1')
    })

    it('should toggle bookmark status correctly', async () => {
        const { result } = renderHook(() => useFavorites(), { wrapper })

        // Wait for initial data to load
        await waitFor(() => {
            expect(result.current.bookmarksLoading).toBe(false)
        })

        // Test adding to bookmarks
        await act(async () => {
            result.current.toggleBookmark('recipe5', false)
        })

        expect(favoritesApi.addToBookmarks).toHaveBeenCalledWith('recipe5')

        // Test removing from bookmarks
        await act(async () => {
            result.current.toggleBookmark('recipe3', true)
        })

        expect(favoritesApi.removeFromBookmarks).toHaveBeenCalledWith('recipe3')
    })

    it('should check if recipe is favorited correctly', async () => {
        const { result } = renderHook(() => useFavorites(), { wrapper })

        // Wait for initial data to load
        await waitFor(() => {
            expect(result.current.favoritesLoading).toBe(false)
        })

        // Check if recipe is favorited
        expect(result.current.isFavorited('recipe1')).toBe(true)
        expect(result.current.isFavorited('recipe3')).toBe(false)
    })

    it('should check if recipe is bookmarked correctly', async () => {
        const { result } = renderHook(() => useFavorites(), { wrapper })

        // Wait for initial data to load
        await waitFor(() => {
            expect(result.current.bookmarksLoading).toBe(false)
        })

        // Check if recipe is bookmarked
        expect(result.current.isBookmarked('recipe3')).toBe(true)
        expect(result.current.isBookmarked('recipe1')).toBe(false)
    })
}) 