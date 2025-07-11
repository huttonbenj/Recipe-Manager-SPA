import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithProviders, screen, fireEvent, waitFor } from '../../../utils/test-utils';
import { RecipeList } from '../../../../components/features/recipes/RecipeList/RecipeList';
import { Recipe } from '@recipe-manager/shared';
import React from 'react';
import * as apiModule from '../../../../services/api';

const mockRecipes: Recipe[] = [
    {
        id: '1',
        title: 'Test Recipe 1',
        instructions: 'Test instructions',
        ingredients: 'Test ingredients',
        cook_time: 30,
        servings: 4,
        difficulty: 'Easy',
        category: 'main',
        image_url: 'https://example.com/image1.jpg',
        user_id: 'user1',
        created_at: new Date('2023-01-01'),
        updated_at: new Date('2023-01-01'),
    },
    {
        id: '2',
        title: 'Test Recipe 2',
        instructions: 'Test instructions 2',
        ingredients: 'Test ingredients 2',
        cook_time: 45,
        servings: 6,
        difficulty: 'Medium',
        category: 'dessert',
        user_id: 'user2',
        created_at: new Date('2023-01-02'),
        updated_at: new Date('2023-01-02'),
    },
];

vi.mock('../../../../services/api', () => ({
    apiClient: {
        getRecipes: vi.fn(() => Promise.resolve({ data: mockRecipes })),
        clearAuth: vi.fn(),
    },
}));

// Mock react-router-dom
const mockSetSearchParams = vi.fn();
const mockSearchParams = new URLSearchParams();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useSearchParams: () => [mockSearchParams, mockSetSearchParams],
        Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
            <a href={to}>{children}</a>
        ),
    };
});

describe('RecipeList Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockSearchParams.delete('search');
        mockSearchParams.delete('category');
        mockSearchParams.delete('difficulty');
        mockSearchParams.delete('sortBy');
        mockSearchParams.delete('sortOrder');
        mockSearchParams.delete('page');
    });

    it('renders header and create button', () => {
        renderWithProviders(<RecipeList />);
        expect(screen.getByRole('heading', { name: /recipe collection/i })).toBeInTheDocument();
        expect(screen.getByText('Discover and share amazing recipes')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /create recipe/i })).toBeInTheDocument();
    });

    it('renders RecipeFilters component', () => {
        renderWithProviders(<RecipeList />);
        expect(screen.getByPlaceholderText(/search by title/i)).toBeInTheDocument();
    });

    it('renders RecipeGrid component', () => {
        renderWithProviders(<RecipeList />);
        // RecipeGrid should be rendered (we can't test its internals here as it's a separate component)
        expect(screen.getByText(/recipe collection/i)).toBeInTheDocument();
    });

    it('shows error message when API call fails', async () => {
        const mockApiClient = vi.mocked(apiModule.apiClient);
        mockApiClient.getRecipes.mockRejectedValue(new Error('API Error'));

        renderWithProviders(<RecipeList />);

        await waitFor(() => {
            expect(screen.getByText('Error loading recipes')).toBeInTheDocument();
            expect(screen.getByText('Please try again later.')).toBeInTheDocument();
            expect(screen.getByText('⚠️')).toBeInTheDocument();
        });
    });

    it('updates search term and calls API with debounced search', async () => {
        renderWithProviders(<RecipeList />);

        const searchInput = screen.getByPlaceholderText(/search by title/i);
        fireEvent.change(searchInput, { target: { value: 'pasta' } });

        expect(searchInput).toHaveValue('pasta');

        // Wait for debounced search to trigger
        await waitFor(() => {
            const mockApiClient = vi.mocked(apiModule.apiClient);
            expect(mockApiClient.getRecipes).toHaveBeenCalledWith(
                expect.objectContaining({
                    search: 'pasta',
                    page: 1,
                    limit: 12,
                })
            );
        }, { timeout: 1000 });
    });

    it('handles form submission for search', async () => {
        renderWithProviders(<RecipeList />);

        const searchInput = screen.getByPlaceholderText(/search by title/i);
        const searchForm = searchInput.closest('form');

        fireEvent.change(searchInput, { target: { value: 'pizza' } });
        fireEvent.submit(searchForm!);

        await waitFor(() => {
            expect(mockSetSearchParams).toHaveBeenCalled();
        });
    });

    it('initializes state from URL search params', () => {
        mockSearchParams.set('search', 'initial-search');
        mockSearchParams.set('category', 'dessert');
        mockSearchParams.set('difficulty', 'Easy');
        mockSearchParams.set('sortBy', 'title');
        mockSearchParams.set('sortOrder', 'asc');
        mockSearchParams.set('page', '2');

        renderWithProviders(<RecipeList />);

        const searchInput = screen.getByPlaceholderText(/search by title/i);
        expect(searchInput).toHaveValue('initial-search');
    });

    it('clears all filters when clear button is clicked', async () => {
        renderWithProviders(<RecipeList />);

        // First set some filters
        const searchInput = screen.getByPlaceholderText(/search by title/i);
        fireEvent.change(searchInput, { target: { value: 'test' } });

        // Find and click clear filters button
        const clearButton = screen.getByRole('button', { name: /clear filters/i });
        fireEvent.click(clearButton);

        await waitFor(() => {
            expect(searchInput).toHaveValue('');
            expect(mockSetSearchParams).toHaveBeenCalledWith({});
        });
    });

    it('updates URL params when filters change', async () => {
        renderWithProviders(<RecipeList />);

        const searchInput = screen.getByPlaceholderText(/search by title/i);
        const searchForm = searchInput.closest('form');

        fireEvent.change(searchInput, { target: { value: 'pasta' } });
        fireEvent.submit(searchForm!);

        await waitFor(() => {
            expect(mockSetSearchParams).toHaveBeenCalledWith(
                expect.any(URLSearchParams)
            );
        });
    });

    it('calls API with correct parameters including filters', async () => {
        renderWithProviders(<RecipeList />);

        // Wait for initial API call
        await waitFor(() => {
            const mockApiClient = vi.mocked(apiModule.apiClient);
            expect(mockApiClient.getRecipes).toHaveBeenCalledWith({
                page: 1,
                limit: 12,
                sortBy: 'created_at',
                sortOrder: 'desc',
            });
        });
    });

    it('handles pagination correctly', () => {
        mockSearchParams.set('page', '3');

        renderWithProviders(<RecipeList />);

        const mockApiClient = vi.mocked(apiModule.apiClient);
        expect(mockApiClient.getRecipes).toHaveBeenCalledWith(
            expect.objectContaining({
                page: 3,
                limit: 12,
            })
        );
    });

    it('handles all filter parameters when present', () => {
        mockSearchParams.set('search', 'test-search');
        mockSearchParams.set('category', 'main');
        mockSearchParams.set('difficulty', 'Hard');
        mockSearchParams.set('sortBy', 'cook_time');
        mockSearchParams.set('sortOrder', 'desc');

        renderWithProviders(<RecipeList />);

        const mockApiClient = vi.mocked(apiModule.apiClient);
        expect(mockApiClient.getRecipes).toHaveBeenCalledWith({
            page: 1,
            limit: 12,
            search: 'test-search',
            category: 'main',
            difficulty: 'Hard',
            sortBy: 'cook_time',
            sortOrder: 'desc',
        });
    });

    it('resets page to 1 when performing new search', async () => {
        mockSearchParams.set('page', '5');

        renderWithProviders(<RecipeList />);

        const searchInput = screen.getByPlaceholderText(/search by title/i);
        const searchForm = searchInput.closest('form');

        fireEvent.change(searchInput, { target: { value: 'new-search' } });
        fireEvent.submit(searchForm!);

        await waitFor(() => {
            const callArgs = mockSetSearchParams.mock.calls[0]?.[0];
            expect(callArgs?.get('page')).toBe('1');
        });
    });
}); 