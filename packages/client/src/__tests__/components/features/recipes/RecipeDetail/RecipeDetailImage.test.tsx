import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RecipeDetailImage } from '../../../../../components/features/recipes/RecipeDetail/RecipeDetailImage';
import { Recipe } from '@recipe-manager/shared';

const mockRecipeWithImage: Recipe = {
    id: '1',
    title: 'Test Recipe',
    instructions: 'Step 1\nStep 2',
    ingredients: 'Ingredient 1\nIngredient 2',
    cook_time: 45,
    servings: 4,
    difficulty: 'Medium',
    category: 'main',
    image_url: 'https://example.com/test-image.jpg',
    user_id: 'user1',
    created_at: new Date('2023-01-01'),
    updated_at: new Date('2023-01-01'),
};

const mockRecipeWithoutImage: Recipe = {
    ...mockRecipeWithImage,
    image_url: undefined,
};

describe('RecipeDetailImage', () => {
    it('renders recipe image when image_url is provided', () => {
        render(<RecipeDetailImage recipe={mockRecipeWithImage} />);

        const image = screen.getByRole('img');
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', 'https://example.com/test-image.jpg');
        expect(image).toHaveAttribute('alt', 'Test Recipe');
        expect(image).toHaveClass('w-full', 'h-64', 'md:h-96', 'object-cover', 'rounded-lg', 'shadow-lg');
    });

    it('renders placeholder with ChefHat icon when image_url is null', () => {
        render(<RecipeDetailImage recipe={mockRecipeWithoutImage} />);

        // Should not render an img element
        expect(screen.queryByRole('img')).not.toBeInTheDocument();

        // Should render placeholder div with proper styling
        const placeholder = screen.getByText('', { selector: 'div.w-full.h-64.md\\:h-96.bg-gray-200.rounded-lg.flex.items-center.justify-center' });
        expect(placeholder).toBeInTheDocument();

        // Should contain ChefHat icon (lucide-react renders as svg)
        const chefHatIcon = placeholder.querySelector('svg');
        expect(chefHatIcon).toBeInTheDocument();
        expect(chefHatIcon).toHaveClass('h-16', 'w-16', 'text-gray-400');
    });

    it('renders placeholder with ChefHat icon when image_url is empty string', () => {
        const recipeWithEmptyImage = { ...mockRecipeWithImage, image_url: '' };
        render(<RecipeDetailImage recipe={recipeWithEmptyImage} />);

        // Should not render an img element
        expect(screen.queryByRole('img')).not.toBeInTheDocument();

        // Should render placeholder div
        const placeholder = screen.getByText('', { selector: 'div.w-full.h-64.md\\:h-96.bg-gray-200.rounded-lg.flex.items-center.justify-center' });
        expect(placeholder).toBeInTheDocument();
    });

    it('renders wrapper div with proper styling', () => {
        const { container } = render(<RecipeDetailImage recipe={mockRecipeWithImage} />);

        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper).toHaveClass('mb-8');
    });
}); 