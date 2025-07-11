import type { Recipe } from '@recipe-manager/shared';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../../../../../contexts/AuthProvider';
import { RecipeDetail } from '../../../../../components/features/recipes/RecipeDetail/RecipeDetail';
import { apiClient } from '../../../../../services/api';

const mockRecipe: Recipe = {
    id: '123',
    title: 'Test Recipe',
    user: { id: 'test-user-id', name: 'Test User', email: 'test@example.com' },
    user_id: 'test-user-id',
    image_url: '',
    category: 'Dessert',
    difficulty: 'Easy',
    ingredients: JSON.stringify(['Flour', 'Sugar']),
    instructions: JSON.stringify(['Mix', 'Bake']),
    tags: JSON.stringify(['sweet']),
    created_at: new Date(),
    updated_at: new Date(),
};

const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
    },
});

describe('RecipeDetail', () => {
    beforeEach(() => {
        vi.spyOn(apiClient, 'getRecipe').mockResolvedValue(mockRecipe);
    });

    it('renders main UI when recipe is found', async () => {
        const queryClient = createTestQueryClient();
        render(
            <MemoryRouter initialEntries={["/recipes/123"]}>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        <Routes>
                            <Route path="/recipes/:id" element={<RecipeDetail />} />
                        </Routes>
                    </AuthProvider>
                </QueryClientProvider>
            </MemoryRouter>
        );
        expect(await screen.findByTestId('recipe-detail-root')).toBeInTheDocument();
        expect(screen.getByText('Test Recipe')).toBeInTheDocument();
        expect(screen.getByText('By Test User')).toBeInTheDocument();
        // Subcomponents
        expect(screen.getByText('Recipe Info')).toBeInTheDocument();
        expect(screen.getByText('Ingredients')).toBeInTheDocument();
        expect(screen.getByText('Tags')).toBeInTheDocument();
        expect(screen.getByText('Instructions')).toBeInTheDocument();
        expect(screen.getByText('You might also like')).toBeInTheDocument();
    });

    it('shows loading spinner while loading', async () => {
        vi.spyOn(apiClient, 'getRecipe').mockImplementation(() => new Promise(() => { })); // never resolves
        const queryClient = createTestQueryClient();
        render(
            <MemoryRouter initialEntries={["/recipes/123"]}>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        <Routes>
                            <Route path="/recipes/:id" element={<RecipeDetail />} />
                        </Routes>
                    </AuthProvider>
                </QueryClientProvider>
            </MemoryRouter>
        );
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('shows error state if recipe not found', async () => {
        vi.spyOn(apiClient, 'getRecipe').mockRejectedValue(new Error('Not found'));
        const queryClient = createTestQueryClient();
        render(
            <MemoryRouter initialEntries={["/recipes/123"]}>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        <Routes>
                            <Route path="/recipes/:id" element={<RecipeDetail />} />
                        </Routes>
                    </AuthProvider>
                </QueryClientProvider>
            </MemoryRouter>
        );
        expect(await screen.findByText('Recipe not found')).toBeInTheDocument();
        expect(screen.getByText('Back to Recipes')).toBeInTheDocument();
    });


}); 