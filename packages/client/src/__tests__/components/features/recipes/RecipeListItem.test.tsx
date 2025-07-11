import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '../../../utils/test-utils';
import { RecipeListItem } from '../../../../components/features/recipes/RecipeList/RecipeListItem';
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
    instructions: 'Some instructions',
    tags: '[]',
    ...overrides,
});

describe('RecipeListItem Component', () => {
    it('renders recipe title and user', () => {
        const recipe = createRecipe();
        renderWithProviders(<RecipeListItem recipe={recipe} />);
        expect(screen.getByRole('heading', { name: /test/i })).toBeInTheDocument();
        expect(screen.getByText(/by alice/i)).toBeInTheDocument();
    });

    it('shows badges for difficulty and category', () => {
        const recipe = createRecipe();
        renderWithProviders(<RecipeListItem recipe={recipe} />);
        expect(screen.getByText('Easy')).toBeInTheDocument();
        expect(screen.getByText('Main Course')).toBeInTheDocument();
    });

    it('shows fallback image if image_url is missing', () => {
        const recipe = createRecipe({ image_url: '' });
        renderWithProviders(<RecipeListItem recipe={recipe} />);
        expect(screen.getByTestId('recipe-fallback-icon')).toBeInTheDocument();
    });
}); 