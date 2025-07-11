import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen } from '../../../utils/test-utils';
import { fireEvent } from '@testing-library/react';
import { RecipeFilters } from '../../../../components/features/recipes/RecipeList/RecipeFilters';

describe('RecipeFilters Component', () => {
    const defaultProps = {
        searchTerm: '',
        selectedCategory: '',
        selectedDifficulty: '',
        sortBy: 'created_at',
        sortOrder: 'desc' as 'desc',
        onSearchChange: vi.fn(),
        onCategoryChange: vi.fn(),
        onDifficultyChange: vi.fn(),
        onSortByChange: vi.fn(),
        onSortOrderChange: vi.fn(),
        onClearFilters: vi.fn(),
        onSearch: vi.fn(),
    };

    it('renders all filter controls', () => {
        renderWithProviders(<RecipeFilters {...defaultProps} />);
        expect(screen.getByLabelText(/search recipes/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/difficulty/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/sort by/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/order/i)).toBeInTheDocument();
    });

    it('calls onClearFilters when clear button is clicked', () => {
        renderWithProviders(<RecipeFilters {...defaultProps} searchTerm="foo" />);
        fireEvent.click(screen.getByRole('button', { name: /clear filters/i }));
        expect(defaultProps.onClearFilters).toHaveBeenCalled();
    });

    it('calls onSearch when search button is clicked', () => {
        renderWithProviders(<RecipeFilters {...defaultProps} />);
        fireEvent.click(screen.getByRole('button', { name: /search recipes/i }));
        expect(defaultProps.onSearch).toHaveBeenCalled();
    });
}); 