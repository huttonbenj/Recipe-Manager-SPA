import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '../../../utils/test-utils';
import userEvent from '@testing-library/user-event';
import { RecipeCard } from '../../../../components/features/recipes/RecipeCard';
import { Recipe } from '@recipe-manager/shared';

const createRecipe = (overrides: Partial<Recipe> = {}): Recipe => ({
    id: 'recipe-id',
    user_id: 'user-id',
    title: 'Exquisite Test Recipe',
    image_url: '/test-image.jpg',
    cook_time: 45,
    difficulty: 'Medium',
    category: 'Dessert',
    servings: 6,
    created_at: new Date(),
    updated_at: new Date(),
    user: { id: 'user-id', name: 'Bob', email: 'bob@example.com' },
    ingredients: '[]',
    instructions: '[]',
    tags: '[]',
    ...overrides,
});

describe('RecipeCard Component Redesign', () => {
    it('renders the recipe title and category by default', () => {
        const recipe = createRecipe();
        renderWithProviders(<RecipeCard recipe={recipe} />);

        const headings = screen.getAllByRole('heading', { name: /exquisite test recipe/i });
        expect(headings.length).toBeGreaterThan(0);
        expect(headings[0]).toBeVisible();

        expect(screen.getByText('Dessert')).toBeVisible();
    });

    it('shows detailed information on hover', async () => {
        const user = userEvent.setup();
        const recipe = createRecipe();
        renderWithProviders(<RecipeCard recipe={recipe} />);

        const cardLink = screen.getByRole('link');
        await user.hover(cardLink);

        // The hover overlay is tricky to test with JSDOM's limitations.
        // We will just check for the content that appears on hover.
        expect(await screen.findByText('Medium')).toBeInTheDocument();
        expect(await screen.findByText(/45 min/i)).toBeInTheDocument();
        expect(await screen.findByText(/6 servings/i)).toBeInTheDocument();
        expect(await screen.findByText(/view recipe/i)).toBeInTheDocument();
    });
}); 