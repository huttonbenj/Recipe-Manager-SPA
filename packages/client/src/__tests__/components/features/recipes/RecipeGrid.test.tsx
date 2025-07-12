import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen, fireEvent } from '../../../utils/test-utils';
import { RecipeGrid } from '../../../../components/features/recipes/RecipeList/RecipeGrid';
import { Recipe } from '@recipe-manager/shared';

const createRecipe = (overrides: Partial<Recipe> = {}): Recipe => ({
    id: 'id',
    user_id: 'user-id',
    title: 'Test',
    image_url: '',
    cook_time: 10,
    difficulty: 'Easy',
    category: 'Main Course',
    servings: 2,
    created_at: new Date(),
    updated_at: new Date(),
    user: { id: 'user-id', name: 'Alice', email: 'alice@example.com' },
    ingredients: '[]',
    instructions: '[]',
    tags: '[]',
    ...overrides,
});

describe('RecipeGrid Component', () => {
    it('renders recipes in grid mode', () => {
        const recipes = [createRecipe({ id: '1', title: 'A' }), createRecipe({ id: '2', title: 'B' })];
        renderWithProviders(
            <RecipeGrid recipes={recipes} viewMode="grid" onViewModeChange={() => { }} />
        );
        expect(screen.getByText('A')).toBeInTheDocument();
        expect(screen.getByText('B')).toBeInTheDocument();
    });

    it('renders recipes in list mode', () => {
        const recipes = [createRecipe({ id: '1', title: 'A' })];
        renderWithProviders(
            <RecipeGrid recipes={recipes} viewMode="list" onViewModeChange={() => { }} />
        );
        expect(screen.getByText('A')).toBeInTheDocument();
    });

    it('shows empty state if no recipes', () => {
        renderWithProviders(
            <RecipeGrid recipes={[]} viewMode="grid" onViewModeChange={() => { }} />
        );
        expect(screen.getByText(/no recipes found/i)).toBeInTheDocument();
    });

    it('shows loading skeleton if isLoading', () => {
        renderWithProviders(
            <RecipeGrid recipes={[]} viewMode="grid" onViewModeChange={() => { }} isLoading />
        );
        expect(screen.getAllByText('', { selector: '.animate-pulse' }).length).toBeGreaterThan(0);
    });

    it('calls onClearFilters when clear filters button is clicked in empty state', () => {
        const mockClearFilters = vi.fn();
        renderWithProviders(
            <RecipeGrid recipes={[]} viewMode="grid" onViewModeChange={() => { }} onClearFilters={mockClearFilters} />
        );

        const clearButton = screen.getByRole('button', { name: /clear filters/i });
        fireEvent.click(clearButton);

        expect(mockClearFilters).toHaveBeenCalled();
    });
}); 