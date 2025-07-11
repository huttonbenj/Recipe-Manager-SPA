import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '../../../utils/test-utils';
import { RecipeCard } from '../../../../components/features/recipes/RecipeList/RecipeCard';
import { Recipe } from '@recipe-manager/shared';

// Utility to create a minimal recipe object for tests
const createRecipe = (overrides: Partial<Recipe> = {}): Recipe => ({
    id: 'recipe-id',
    user_id: 'user-id',
    title: 'Test Recipe',
    image_url: '',
    cook_time: 30,
    difficulty: 'Easy',
    category: 'Main Course',
    servings: 4,
    created_at: new Date(),
    updated_at: new Date(),
    user: { id: 'user-id', name: 'Alice', email: 'alice@example.com' },
    ingredients: '[]',
    instructions: '[]',
    tags: '[]',
    ...overrides,
});

describe('RecipeCard Component', () => {
    it('renders recipe title and user name', () => {
        const recipe = createRecipe();

        renderWithProviders(<RecipeCard recipe={recipe} />);

        expect(screen.getByRole('heading', { name: /test recipe/i })).toBeInTheDocument();
        expect(screen.getByText(/by alice/i)).toBeInTheDocument();
    });

    it('displays difficulty and category badges', () => {
        const recipe = createRecipe();
        renderWithProviders(<RecipeCard recipe={recipe} />);

        expect(screen.getByText('Easy')).toBeInTheDocument();
        expect(screen.getByText('Main Course')).toBeInTheDocument();
    });
}); 