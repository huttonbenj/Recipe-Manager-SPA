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
        isSaved: false,
        sortBy: 'created_at',
        sortOrder: 'desc' as 'desc',
        quickFilter: '',
        onSearchChange: vi.fn(),
        onCategoryChange: vi.fn(),
        onDifficultyChange: vi.fn(),
        onCookTimeChange: vi.fn(),
        onFavoritesToggle: vi.fn(),
        onSavedToggle: vi.fn(),
        onSortByChange: vi.fn(),
        onSortOrderChange: vi.fn(),
        onQuickFilterChange: vi.fn(),
        onClearFilters: vi.fn(),
        onSearch: vi.fn(),
    };

    it('renders all filter controls', () => {
        renderWithProviders(<RecipeFilters {...defaultProps} />);
        expect(screen.getByLabelText(/search recipes/i)).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: /category/i })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: /difficulty/i })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: /cook time/i })).toBeInTheDocument();
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

    it('calls onQuickFilterChange when quick filter button is clicked', () => {
        renderWithProviders(<RecipeFilters {...defaultProps} />);
        fireEvent.click(screen.getByRole('button', { name: /favorites/i }));
        expect(defaultProps.onQuickFilterChange).toHaveBeenCalledWith('favorites');
    });

    it('calls individual filter removal handlers when filter tag X button is clicked', () => {
        renderWithProviders(<RecipeFilters {...defaultProps} selectedCategory="Dessert" selectedDifficulty="Easy" isFavorites={true} />);

        // Click the X button on the category filter
        const categoryFilter = screen.getByTitle('Remove Dessert filter');
        fireEvent.click(categoryFilter);
        expect(defaultProps.onCategoryChange).toHaveBeenCalledWith('');

        // Click the X button on the difficulty filter
        const difficultyFilter = screen.getByTitle('Remove Easy filter');
        fireEvent.click(difficultyFilter);
        expect(defaultProps.onDifficultyChange).toHaveBeenCalledWith('');

        // Click the X button on the favorites filter
        const favoritesFilter = screen.getByTitle('Remove Favorites filter');
        fireEvent.click(favoritesFilter);
        expect(defaultProps.onFavoritesToggle).toHaveBeenCalledWith(false);
    });

    it('shows quick filter tags in active filters when applied', () => {
        renderWithProviders(<RecipeFilters {...defaultProps} quickFilter="popular" />);

        // Check that Popular filter appears in active filters
        expect(screen.getByText('Popular')).toBeInTheDocument();
        expect(screen.getByTitle('Remove Popular filter')).toBeInTheDocument();
    });

    it('removes quick filters when X button is clicked', () => {
        renderWithProviders(<RecipeFilters {...defaultProps} quickFilter="recent" />);

        // Click the X button on the recent filter
        const recentFilter = screen.getByTitle('Remove Recent filter');
        fireEvent.click(recentFilter);
        expect(defaultProps.onQuickFilterChange).toHaveBeenCalledWith('');
        expect(defaultProps.onSortByChange).toHaveBeenCalledWith('created_at');
        expect(defaultProps.onSortOrderChange).toHaveBeenCalledWith('desc');
    });

    it('shows active filter tags when filters are applied', () => {
        renderWithProviders(<RecipeFilters {...defaultProps} selectedCategory="Dessert" selectedDifficulty="Easy" isFavorites={true} />);
        expect(screen.getByText('Dessert')).toBeInTheDocument();
        expect(screen.getAllByText('Easy')[0]).toBeInTheDocument(); // First instance is the filter tag
        expect(screen.getAllByText('Favorites')[0]).toBeInTheDocument(); // First instance is the filter tag

        // Check that X buttons are present for removing filters
        expect(screen.getByTitle('Remove Dessert filter')).toBeInTheDocument();
        expect(screen.getByTitle('Remove Easy filter')).toBeInTheDocument();
        expect(screen.getByTitle('Remove Favorites filter')).toBeInTheDocument();
    });

    it('shows smart filter description when smart filters are detected', () => {
        renderWithProviders(<RecipeFilters {...defaultProps} searchTerm="easy chicken" />);
        expect(screen.getByText(/smart filters detected/i)).toBeInTheDocument();
    });
}); 