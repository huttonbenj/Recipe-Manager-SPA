import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '../../../utils/test-utils';
import { DashboardUserRecipes } from '../../../../components/features/dashboard/DashboardUserRecipes';

describe('DashboardUserRecipes', () => {
    const baseRecipe = {
        id: '1',
        user_id: 'user-id',
        title: 'Test Recipe',
        image_url: '',
        cook_time: 30,
        difficulty: 'Easy' as const,
        category: 'Main Course',
        servings: 4,
        created_at: new Date(),
        updated_at: new Date(),
        user: { id: 'user-id', name: 'Alice', email: 'alice@example.com' },
        ingredients: '[]',
        instructions: '[]',
        tags: '[]',
    };

    it('shows loading skeletons when loading', () => {
        renderWithProviders(<DashboardUserRecipes userRecipes={[]} userRecipesLoading={true} />);
        expect(screen.getAllByText('', { selector: '.animate-pulse' }).length).toBeGreaterThan(0);
    });

    it('renders user recipes when present', () => {
        renderWithProviders(<DashboardUserRecipes userRecipes={[baseRecipe]} userRecipesLoading={false} />);
        expect(screen.getByText('Test Recipe')).toBeInTheDocument();
        expect(screen.getByText(/easy/i)).toBeInTheDocument();
        expect(screen.getByText(/30 mins/i)).toBeInTheDocument();
    });

    it('shows empty state when no recipes', () => {
        renderWithProviders(<DashboardUserRecipes userRecipes={[]} userRecipesLoading={false} />);
        expect(screen.getByText(/no recipes yet/i)).toBeInTheDocument();
        expect(screen.getByText(/create your first recipe/i)).toBeInTheDocument();
    });
}); 