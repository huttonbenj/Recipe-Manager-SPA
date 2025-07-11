import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';
import { RecipeDetailHeader } from '../../../../../components/features/recipes/RecipeDetail/RecipeDetailHeader';
import type { Recipe } from '@recipe-manager/shared';

const baseRecipe: Recipe = {
    id: '1',
    title: 'Chocolate Cake',
    user: { id: 'user1', name: 'Alice', email: 'alice@example.com' },
    user_id: 'user1',
    image_url: '',
    category: 'Dessert',
    difficulty: 'Easy',
    ingredients: '[]',
    instructions: '[]',
    tags: '[]',
    created_at: new Date(),
    updated_at: new Date(),
};

describe('RecipeDetailHeader', () => {
    it('renders title and author', () => {
        render(
            <MemoryRouter>
                <RecipeDetailHeader
                    recipe={baseRecipe}
                    user={{ id: 'user2' }}
                    isLiked={false}
                    onLikeToggle={vi.fn()}
                    onDelete={vi.fn()}
                />
            </MemoryRouter>
        );
        expect(screen.getByText('Chocolate Cake')).toBeInTheDocument();
        expect(screen.getByText('By Alice')).toBeInTheDocument();
        expect(screen.getByText('Back to Recipes')).toBeInTheDocument();
        expect(screen.getByText('Like')).toBeInTheDocument();
        expect(screen.getByText('Share')).toBeInTheDocument();
        // Should not show edit/delete for non-owner
        expect(screen.queryByText('Edit Recipe')).not.toBeInTheDocument();
        expect(screen.queryByText('Delete Recipe')).not.toBeInTheDocument();
    });

    it('shows edit and delete buttons for owner', () => {
        render(
            <MemoryRouter>
                <RecipeDetailHeader
                    recipe={baseRecipe}
                    user={{ id: 'user1' }}
                    isLiked={false}
                    onLikeToggle={vi.fn()}
                    onDelete={vi.fn()}
                />
            </MemoryRouter>
        );
        expect(screen.getByText('Edit Recipe')).toBeInTheDocument();
        expect(screen.getByText('Delete Recipe')).toBeInTheDocument();
    });

    it('shows "Unlike" aria-label and red style when liked', () => {
        render(
            <MemoryRouter>
                <RecipeDetailHeader
                    recipe={baseRecipe}
                    user={{ id: 'user2' }}
                    isLiked={true}
                    onLikeToggle={vi.fn()}
                    onDelete={vi.fn()}
                />
            </MemoryRouter>
        );
        const likeBtn = screen.getByRole('button', { name: /unlike recipe/i });
        expect(likeBtn).toBeInTheDocument();
        expect(likeBtn.className).toMatch(/text-red-600/);
    });

    it('calls onLikeToggle when like button is clicked', () => {
        const onLikeToggle = vi.fn();
        render(
            <MemoryRouter>
                <RecipeDetailHeader
                    recipe={baseRecipe}
                    user={{ id: 'user2' }}
                    isLiked={false}
                    onLikeToggle={onLikeToggle}
                    onDelete={vi.fn()}
                />
            </MemoryRouter>
        );
        fireEvent.click(screen.getByRole('button', { name: /like recipe/i }));
        expect(onLikeToggle).toHaveBeenCalled();
    });

    it('calls onDelete when delete button is clicked (owner)', () => {
        const onDelete = vi.fn();
        render(
            <MemoryRouter>
                <RecipeDetailHeader
                    recipe={baseRecipe}
                    user={{ id: 'user1' }}
                    isLiked={false}
                    onLikeToggle={vi.fn()}
                    onDelete={onDelete}
                />
            </MemoryRouter>
        );
        fireEvent.click(screen.getByText('Delete Recipe'));
        expect(onDelete).toHaveBeenCalled();
    });

    it('handles missing recipe.user gracefully', () => {
        const recipe = { ...baseRecipe, user: undefined };
        render(
            <MemoryRouter>
                <RecipeDetailHeader
                    recipe={recipe}
                    user={{ id: 'user2' }}
                    isLiked={false}
                    onLikeToggle={vi.fn()}
                    onDelete={vi.fn()}
                />
            </MemoryRouter>
        );
        expect(screen.getByText('By Unknown')).toBeInTheDocument();
    });

    it('handles missing user prop (not logged in)', () => {
        render(
            <MemoryRouter>
                <RecipeDetailHeader
                    recipe={baseRecipe}
                    user={null}
                    isLiked={false}
                    onLikeToggle={vi.fn()}
                    onDelete={vi.fn()}
                />
            </MemoryRouter>
        );
        // Should not show edit/delete
        expect(screen.queryByText('Edit Recipe')).not.toBeInTheDocument();
        expect(screen.queryByText('Delete Recipe')).not.toBeInTheDocument();
    });
}); 