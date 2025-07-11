import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRecipeFilters } from '../../../../hooks/recipe/useRecipeFilters';

describe('useRecipeFilters', () => {
    it('returns default filter values', () => {
        const { result } = renderHook(() => useRecipeFilters());
        expect(result.current.filters).toEqual({
            searchTerm: '',
            category: '',
            difficulty: '',
            sortBy: 'created_at',
            sortOrder: 'desc',
        });
    });

    it('updates searchTerm', () => {
        const { result } = renderHook(() => useRecipeFilters());
        act(() => {
            result.current.updateSearchTerm('cake');
        });
        expect(result.current.filters.searchTerm).toBe('cake');
    });

    it('updates category', () => {
        const { result } = renderHook(() => useRecipeFilters());
        act(() => {
            result.current.updateCategory('Desserts');
        });
        expect(result.current.filters.category).toBe('Desserts');
    });

    it('updates difficulty', () => {
        const { result } = renderHook(() => useRecipeFilters());
        act(() => {
            result.current.updateDifficulty('Easy');
        });
        expect(result.current.filters.difficulty).toBe('Easy');
    });

    it('updates sortBy', () => {
        const { result } = renderHook(() => useRecipeFilters());
        act(() => {
            result.current.updateSortBy('title');
        });
        expect(result.current.filters.sortBy).toBe('title');
    });

    it('updates sortOrder', () => {
        const { result } = renderHook(() => useRecipeFilters());
        act(() => {
            result.current.updateSortOrder('asc');
        });
        expect(result.current.filters.sortOrder).toBe('asc');
    });

    it('clearFilters resets to default', () => {
        const { result } = renderHook(() => useRecipeFilters({ searchTerm: 'foo', category: 'Desserts' }));
        act(() => {
            result.current.clearFilters();
        });
        expect(result.current.filters).toEqual({
            searchTerm: '',
            category: '',
            difficulty: '',
            sortBy: 'created_at',
            sortOrder: 'desc',
        });
    });

    it('resetFilters resets to initial values', () => {
        const { result } = renderHook(() => useRecipeFilters({ searchTerm: 'foo', category: 'Desserts' }));
        act(() => {
            result.current.updateSearchTerm('bar');
            result.current.resetFilters();
        });
        expect(result.current.filters).toEqual({
            searchTerm: 'foo',
            category: 'Desserts',
            difficulty: '',
            sortBy: 'created_at',
            sortOrder: 'desc',
        });
    });

    it('hasActiveFilters is true when any filter is set', () => {
        const { result } = renderHook(() => useRecipeFilters());
        expect(result.current.hasActiveFilters).toBe(false);
        act(() => {
            result.current.updateSearchTerm('cake');
        });
        expect(result.current.hasActiveFilters).toBe(true);
    });

    it('getQueryParams returns correct params', () => {
        const { result } = renderHook(() => useRecipeFilters({ searchTerm: 'cake', category: 'Desserts', difficulty: 'Easy', sortBy: 'title', sortOrder: 'asc' }));
        expect(result.current.getQueryParams()).toEqual({
            search: 'cake',
            category: 'Desserts',
            difficulty: 'Easy',
            sortBy: 'title',
            sortOrder: 'asc',
        });
    });
}); 