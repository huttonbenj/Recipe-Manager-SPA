import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useRecipeFilters } from '../../../hooks/useRecipeFilters';

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

    // TODO: Add tests for filter setters, reset, and edge cases
}); 