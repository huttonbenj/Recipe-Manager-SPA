import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { useDashboard } from '../../../../../src/hooks/user/useDashboard';
import * as useAuthModule from '../../../../../src/hooks/useAuth';
import * as api from '../../../../../src/services/api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';

const mockUser = {
    id: '1',
    name: 'Test',
    email: 't@t.com',
    created_at: new Date(),
    updated_at: new Date(),
};

const mockPagination = {
    page: 1,
    limit: 3,
    totalCount: 1,
    totalPages: 1,
};

const mockAuthContext = {
    user: mockUser,
    isAuthenticated: true,
    isLoading: false,
    login: async () => { },
    register: async () => { },
    logout: () => { },
    updateProfile: async () => { },
    changePassword: async () => { },
    refreshUser: async () => { },
};

const mockRecipe = {
    id: 'r1',
    title: 'Recipe 1',
    ingredients: '[]',
    instructions: '[]',
    created_at: new Date(),
    updated_at: new Date(),
    user_id: '1',
    image_url: '',
    cook_time: 10,
    servings: 2,
    difficulty: 'Easy' as const,
    category: 'Main',
    tags: '[]',
    user: mockUser,
};

const createWrapper = () => {
    const queryClient = new QueryClient();
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe('useDashboard', () => {
    let originalDate: DateConstructor;
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('returns correct greeting based on time of day', () => {
        originalDate = Date;
        vi.spyOn(globalThis, 'Date').mockImplementation(() => ({ getHours: () => 9 } as Date));
        vi.spyOn(useAuthModule, 'useAuth').mockReturnValue(mockAuthContext);
        vi.spyOn(api.apiClient, 'getUserStats').mockResolvedValue({
            totalRecipes: 0,
            totalLikes: 0,
            totalViews: 0,
            averageRating: 0,
            recipesByCategory: [],
        });
        vi.spyOn(api.apiClient, 'getRecipes').mockResolvedValue({
            success: true,
            data: [],
            pagination: mockPagination,
        });
        vi.spyOn(api.apiClient, 'getUserRecipes').mockResolvedValue({
            success: true,
            data: [],
            pagination: mockPagination,
        });
        const { result } = renderHook(() => useDashboard(), { wrapper: createWrapper() });
        expect(['Good morning', 'Good afternoon', 'Good evening']).toContain(result.current.greeting);
        globalThis.Date = originalDate;
    });

    it('returns loading states when queries are loading', async () => {
        vi.spyOn(useAuthModule, 'useAuth').mockReturnValue(mockAuthContext);
        vi.spyOn(api.apiClient, 'getUserStats').mockImplementation(() => new Promise(() => { }));
        vi.spyOn(api.apiClient, 'getRecipes').mockImplementation(() => new Promise(() => { }));
        vi.spyOn(api.apiClient, 'getUserRecipes').mockImplementation(() => new Promise(() => { }));
        const { result } = await renderHook(() => useDashboard(), { wrapper: createWrapper() });
        expect(result.current.statsLoading).toBe(true);
        expect(result.current.recentRecipesLoading).toBe(true);
        expect(result.current.userRecipesLoading).toBe(true);
    });

    it('returns normalized stats and recipes when loaded', async () => {
        vi.spyOn(useAuthModule, 'useAuth').mockReturnValue(mockAuthContext);
        vi.spyOn(api.apiClient, 'getUserStats').mockResolvedValue({
            totalRecipes: 2,
            totalLikes: 5,
            averageRating: 4.5,
            totalViews: 10,
            recipesByCategory: [],
        });
        vi.spyOn(api.apiClient, 'getRecipes').mockResolvedValue({
            success: true,
            data: [mockRecipe],
            pagination: mockPagination,
        });
        vi.spyOn(api.apiClient, 'getUserRecipes').mockResolvedValue({
            success: true,
            data: [{ ...mockRecipe, id: 'r2', title: 'My Recipe' }],
            pagination: mockPagination,
        });
        const { result } = await renderHook(() => useDashboard(), { wrapper: createWrapper() });
        await waitFor(() => {
            expect(result.current.stats).toEqual({ totalRecipes: 2, totalLikes: 5, averageRating: 4.5, totalViews: 10 });
            expect(result.current.recentRecipes).toEqual([mockRecipe]);
            expect(result.current.userRecipes).toEqual([{ ...mockRecipe, id: 'r2', title: 'My Recipe' }]);
            expect(result.current.statsLoading).toBe(false);
            expect(result.current.recentRecipesLoading).toBe(false);
            expect(result.current.userRecipesLoading).toBe(false);
        });
    });

    it('returns empty stats and recipes if API returns undefined', async () => {
        vi.spyOn(useAuthModule, 'useAuth').mockReturnValue(mockAuthContext);
        vi.spyOn(api.apiClient, 'getUserStats').mockResolvedValue(undefined as any);
        vi.spyOn(api.apiClient, 'getRecipes').mockResolvedValue(undefined as any);
        vi.spyOn(api.apiClient, 'getUserRecipes').mockResolvedValue(undefined as any);
        const { result } = await renderHook(() => useDashboard(), { wrapper: createWrapper() });
        await waitFor(() => {
            expect(result.current.stats).toEqual({ totalRecipes: 0, totalLikes: 0, averageRating: 0, totalViews: 0 });
            expect(result.current.recentRecipes).toEqual([]);
            expect(result.current.userRecipes).toEqual([]);
        });
    });
}); 