import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '../../../utils/test-utils';
import { DashboardCommunityRecipes } from '../../../../components/features/dashboard/DashboardCommunityRecipes';

describe('DashboardCommunityRecipes', () => {
    const baseRecipe = {
        id: '1',
        user_id: 'user-id',
        title: 'Community Recipe',
        image_url: '',
        cook_time: 25,
        difficulty: 'Medium' as const,
        category: 'Dessert',
        servings: 2,
        created_at: new Date(),
        updated_at: new Date(),
        user: { id: 'user-id', name: 'Bob', email: 'bob@example.com' },
        ingredients: '[]',
        instructions: '[]',
        tags: '[]',
    };

    it('shows loading skeletons when loading', () => {
        renderWithProviders(<DashboardCommunityRecipes recentRecipes={[]} recentRecipesLoading={true} />);
        expect(screen.getAllByText('', { selector: '.animate-pulse' }).length).toBeGreaterThan(0);
    });

    it('renders community recipes when present', () => {
        renderWithProviders(<DashboardCommunityRecipes recentRecipes={[baseRecipe]} recentRecipesLoading={false} />);
        expect(screen.getByText('Community Recipe')).toBeInTheDocument();
        expect(screen.getByText(/bob/i)).toBeInTheDocument();
        expect(screen.getByText(/25 mins/i)).toBeInTheDocument();
    });

    it('shows empty state when no recipes', () => {
        renderWithProviders(<DashboardCommunityRecipes recentRecipes={[]} recentRecipesLoading={false} />);
        expect(screen.getByText(/no recent recipes/i)).toBeInTheDocument();
    });
}); 