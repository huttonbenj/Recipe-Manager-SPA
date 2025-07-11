import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { RecipeForm } from '../../../../components/features/recipes/RecipeForm';
import { AuthProvider } from '../../../../contexts/AuthProvider';
import { apiClient } from '../../../../services/api';
import toast from 'react-hot-toast';

// Mock the API client
vi.mock('../../../../services/api', () => ({
    apiClient: {
        createRecipe: vi.fn(),
        updateRecipe: vi.fn(),
        getRecipe: vi.fn(),
        uploadImage: vi.fn(),
        getRecipeCategories: vi.fn(),
        clearAuth: vi.fn(),
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        getCurrentUser: vi.fn(),
        isAuthenticated: vi.fn(),
        getStoredUser: vi.fn(),
        updateProfile: vi.fn(),
        changePassword: vi.fn(),
    },
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-router-dom')>();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => ({ id: undefined }),
    };
});

describe('RecipeForm Component', () => {
    let queryClient: QueryClient;
    let user: ReturnType<typeof userEvent.setup>;

    const createWrapper = () => {
        const Wrapper = ({ children }: { children: React.ReactNode }) => (
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </BrowserRouter>
            </QueryClientProvider>
        );
        return Wrapper;
    };

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false, refetchOnWindowFocus: false },
                mutations: { retry: false },
            },
        });
        user = userEvent.setup();
        vi.clearAllMocks();
    });

    describe('Form Rendering', () => {
        it('should render form with all required fields', () => {
            render(<RecipeForm />, { wrapper: createWrapper() });

            expect(screen.getByPlaceholderText(/enter recipe title/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/enter each ingredient/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/enter cooking instructions/i)).toBeInTheDocument();
            expect(screen.getByDisplayValue('30')).toBeInTheDocument(); // cook time
            expect(screen.getByDisplayValue('4')).toBeInTheDocument(); // servings
        });

        it('should render create mode by default', () => {
            render(<RecipeForm />, { wrapper: createWrapper() });

            expect(screen.getByText(/create new recipe/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /create recipe/i })).toBeInTheDocument();
        });

        it('should render back button', () => {
            render(<RecipeForm />, { wrapper: createWrapper() });

            expect(screen.getByText(/back to recipes/i)).toBeInTheDocument();
        });

        it('should render cancel button', () => {
            render(<RecipeForm />, { wrapper: createWrapper() });

            expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
        });
    });

    describe('Form Interaction', () => {
        it('should update form fields when user types', async () => {
            render(<RecipeForm />, { wrapper: createWrapper() });

            const titleInput = screen.getByPlaceholderText(/enter recipe title/i);
            await user.type(titleInput, 'Test Recipe');

            expect(titleInput).toHaveValue('Test Recipe');
        });

        it('should update ingredients field', async () => {
            render(<RecipeForm />, { wrapper: createWrapper() });

            const ingredientsInput = screen.getByPlaceholderText(/enter each ingredient/i);
            await user.type(ingredientsInput, '2 cups flour{enter}1 cup sugar');

            expect(ingredientsInput).toHaveValue('2 cups flour\n1 cup sugar');
        });

        it('should update instructions field', async () => {
            render(<RecipeForm />, { wrapper: createWrapper() });

            const instructionsInput = screen.getByPlaceholderText(/enter cooking instructions/i);
            await user.type(instructionsInput, 'Step 1: Mix ingredients{enter}Step 2: Bake');

            expect(instructionsInput).toHaveValue('Step 1: Mix ingredients\nStep 2: Bake');
        });

        it('should update numeric fields', async () => {
            render(<RecipeForm />, { wrapper: createWrapper() });

            const cookTimeInput = screen.getByDisplayValue('30');
            await user.clear(cookTimeInput);
            await user.type(cookTimeInput, '45');

            expect(cookTimeInput).toHaveValue(45);

            const servingsInput = screen.getByDisplayValue('4');
            await user.clear(servingsInput);
            await user.type(servingsInput, '6');

            expect(servingsInput).toHaveValue(6);
        });
    });

    describe('Form Submission', () => {
        it('should submit form with valid data', async () => {
            const mockCreateRecipe = vi.fn().mockResolvedValue({ id: '1', title: 'Test Recipe' });
            vi.mocked(apiClient.createRecipe).mockImplementation(mockCreateRecipe);

            render(<RecipeForm />, { wrapper: createWrapper() });

            // Fill out the form
            await user.type(screen.getByPlaceholderText(/enter recipe title/i), 'Test Recipe');
            await user.type(screen.getByPlaceholderText(/enter each ingredient/i), '2 cups flour{enter}1 cup sugar');
            await user.type(screen.getByPlaceholderText(/enter cooking instructions/i), 'Step 1: Mix{enter}Step 2: Bake');

            // Submit the form
            await user.click(screen.getByRole('button', { name: /create recipe/i }));

            await waitFor(() => {
                expect(mockCreateRecipe).toHaveBeenCalledWith(
                    expect.objectContaining({
                        title: 'Test Recipe',
                        ingredients: '2 cups flour\n1 cup sugar',
                        instructions: 'Step 1: Mix\nStep 2: Bake',
                    })
                );
            });
        });

        it('should show loading state during submission', async () => {
            const mockCreateRecipe = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));
            vi.mocked(apiClient.createRecipe).mockImplementation(mockCreateRecipe);

            render(<RecipeForm />, { wrapper: createWrapper() });

            // Fill out the form with minimum required data
            await user.type(screen.getByPlaceholderText(/enter recipe title/i), 'Test Recipe');
            await user.type(screen.getByPlaceholderText(/enter each ingredient/i), '2 cups flour');
            await user.type(screen.getByPlaceholderText(/enter cooking instructions/i), 'Step 1: Mix');

            // Submit the form
            await user.click(screen.getByRole('button', { name: /create recipe/i }));

            expect(screen.getByText(/creating recipe/i)).toBeInTheDocument();
        });

        it('should handle submission error', async () => {
            const mockCreateRecipe = vi.fn().mockRejectedValue(new Error('Server error'));
            vi.mocked(apiClient.createRecipe).mockImplementation(mockCreateRecipe);

            render(<RecipeForm />, { wrapper: createWrapper() });

            // Fill out the form with minimum required data
            await user.type(screen.getByPlaceholderText(/enter recipe title/i), 'Test Recipe');
            await user.type(screen.getByPlaceholderText(/enter each ingredient/i), '2 cups flour');
            await user.type(screen.getByPlaceholderText(/enter cooking instructions/i), 'Step 1: Mix');

            // Submit the form
            await user.click(screen.getByRole('button', { name: /create recipe/i }));

            await waitFor(() => {
                expect(toast.error).toHaveBeenCalledWith('Failed to create recipe');
            });
        });
    });

    describe('Navigation', () => {
        it('should navigate back when back button is clicked', async () => {
            render(<RecipeForm />, { wrapper: createWrapper() });

            const backButton = screen.getByText(/back to recipes/i);
            await user.click(backButton);

            expect(mockNavigate).toHaveBeenCalledWith('/recipes');
        });

        it('should navigate to recipes list when cancel button is clicked', async () => {
            render(<RecipeForm />, { wrapper: createWrapper() });

            const cancelButton = screen.getByRole('button', { name: /cancel/i });
            await user.click(cancelButton);

            expect(mockNavigate).toHaveBeenCalledWith('/recipes');
        });

        it('should navigate to recipe detail after successful creation', async () => {
            const mockCreateRecipe = vi.fn().mockResolvedValue({ id: '123', title: 'Test Recipe' });
            vi.mocked(apiClient.createRecipe).mockImplementation(mockCreateRecipe);

            render(<RecipeForm />, { wrapper: createWrapper() });

            // Fill out and submit the form
            await user.type(screen.getByPlaceholderText(/enter recipe title/i), 'Test Recipe');
            await user.type(screen.getByPlaceholderText(/enter each ingredient/i), '2 cups flour');
            await user.type(screen.getByPlaceholderText(/enter cooking instructions/i), 'Step 1: Mix');
            await user.click(screen.getByRole('button', { name: /create recipe/i }));

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/recipes');
            });
        });
    });

    describe('Image Upload', () => {
        it('should render image upload section', () => {
            render(<RecipeForm />, { wrapper: createWrapper() });

            expect(screen.getByText(/recipe image/i)).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('should have proper form elements', () => {
            render(<RecipeForm />, { wrapper: createWrapper() });

            const form = screen.getByRole('form');
            expect(form).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/enter recipe title/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/enter each ingredient/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/enter cooking instructions/i)).toBeInTheDocument();
        });

        it('should have proper button roles', () => {
            render(<RecipeForm />, { wrapper: createWrapper() });

            expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /create recipe/i })).toBeInTheDocument();
        });
    });
}); 