import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen } from '../../../utils/test-utils';
import { fireEvent } from '@testing-library/react';
import { RecipeFilters } from '../../../../components/features/recipes/RecipeList/RecipeFilters';

describe('RecipeFilters Component', () => {
    const defaultProps = {
        searchTerm: '',
        selectedCategory: '',
        selectedDifficulty: '',
        selectedCookTime: '',
        isFavorites: false,
        sortBy: 'created_at',
        sortOrder: 'desc' as 'desc',
        quickFilter: '',
        onSearchChange: vi.fn(),
        onCategoryChange: vi.fn(),
        onDifficultyChange: vi.fn(),
        onCookTimeChange: vi.fn(),
        onFavoritesToggle: vi.fn(),
        onSortByChange: vi.fn(),
        onSortOrderChange: vi.fn(),
        onClearFilters: vi.fn(),
        onSearch: vi.fn(),
    };

    it('renders all filter controls', () => {
        renderWithProviders(<RecipeFilters {...defaultProps} />);
        expect(screen.getByLabelText(/search recipes/i)).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: /category/i })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: /difficulty/i })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: /cook time/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/favorites/i)).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: /sort by/i })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: /sort order/i })).toBeInTheDocument();
    });

    it('calls onClearFilters when clear button is clicked', () => {
        renderWithProviders(<RecipeFilters {...defaultProps} searchTerm="foo" />);
        fireEvent.click(screen.getByRole('button', { name: /clear all filters/i }));
        expect(defaultProps.onClearFilters).toHaveBeenCalled();
    });

    it('calls onSearch when search button is clicked', () => {
        renderWithProviders(<RecipeFilters {...defaultProps} />);
        fireEvent.click(screen.getByRole('button', { name: /apply filters/i }));
        expect(defaultProps.onSearch).toHaveBeenCalled();
    });

    it('calls onFavoritesToggle when favorites checkbox is clicked', () => {
        renderWithProviders(<RecipeFilters {...defaultProps} />);
        fireEvent.click(screen.getByLabelText(/favorites/i));
        expect(defaultProps.onFavoritesToggle).toHaveBeenCalledWith(true);
    });

    it('shows active filter tags when filters are applied', () => {
        renderWithProviders(<RecipeFilters {...defaultProps} selectedCategory="Dessert" selectedDifficulty="Easy" isFavorites={true} />);
        expect(screen.getByText('Dessert')).toBeInTheDocument();
        expect(screen.getAllByText('Easy')[0]).toBeInTheDocument(); // First instance is the filter tag
        expect(screen.getAllByText('Favorites')[0]).toBeInTheDocument(); // First instance is the filter tag
    });

    it('shows smart filter description when smart filters are detected', () => {
        renderWithProviders(<RecipeFilters {...defaultProps} searchTerm="easy chicken" />);
        expect(screen.getByText(/smart filters detected/i)).toBeInTheDocument();
    });
}); 