import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRecipeForm } from '../../../../hooks/form/useRecipeForm';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../../../../services/api';
import { useFormValidation } from '../../../../hooks/form/useFormValidation';
import toast from 'react-hot-toast';

// Mock dependencies
vi.mock('react-router-dom');
vi.mock('../../../../services/api');
vi.mock('../../../../hooks/form/useFormValidation');
vi.mock('react-hot-toast');

const mockUseNavigate = vi.mocked(useNavigate);
const mockUseParams = vi.mocked(useParams);
const mockApiClient = vi.mocked(apiClient);
const mockUseFormValidation = vi.mocked(useFormValidation);
const mockToast = vi.mocked(toast);

// Mock recipe data
const mockRecipe = {
    id: '1',
    title: 'Test Recipe',
    ingredients: 'Test ingredients',
    instructions: 'Test instructions',
    cook_time: 45,
    servings: 6,
    difficulty: 'Hard' as const,
    category: 'Dinner',
    tags: 'test, recipe',
    image_url: 'https://example.com/image.jpg',
    user_id: '1',
    created_at: new Date('2023-01-01'),
    updated_at: new Date('2023-01-01'),
};

// Test wrapper with QueryClient
const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe('useRecipeForm', () => {
    const mockNavigate = vi.fn();
    const mockValidateForm = vi.fn();
    const mockFormEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseNavigate.mockReturnValue(mockNavigate);
        mockUseParams.mockReturnValue({});
        mockUseFormValidation.mockReturnValue({
            errors: {},
            validateForm: mockValidateForm,
            validateField: vi.fn(),
            clearErrors: vi.fn(),
            clearFieldError: vi.fn(),
            hasErrors: false,
        });
        mockApiClient.getRecipe.mockResolvedValue(mockRecipe);
        mockApiClient.createRecipe.mockResolvedValue(mockRecipe);
        mockApiClient.updateRecipe.mockResolvedValue(mockRecipe);
        mockValidateForm.mockReturnValue(true);
    });

    describe('initialization', () => {
        it('returns initial form state', () => {
            const { result } = renderHook(() => useRecipeForm(), {
                wrapper: createWrapper(),
            });

            expect(result.current.formData).toEqual({
                title: '',
                ingredients: '',
                instructions: '',
                cook_time: 30,
                servings: 4,
                difficulty: 'Medium',
                category: '',
                tags: '',
            });
            expect(result.current.isEditing).toBe(false);
            expect(result.current.imagePreview).toBe(null);
            expect(result.current.isSubmitting).toBe(false);
            expect(result.current.isLoading).toBe(false);
        });

        it('isEditing is true if id param exists', () => {
            mockUseParams.mockReturnValue({ id: '123' });

            const { result } = renderHook(() => useRecipeForm(), {
                wrapper: createWrapper(),
            });

            expect(result.current.isEditing).toBe(true);
        });

        it('loads existing recipe data when editing', async () => {
            mockUseParams.mockReturnValue({ id: '1' });

            const { result } = renderHook(() => useRecipeForm(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.formData).toEqual({
                    title: 'Test Recipe',
                    ingredients: 'Test ingredients',
                    instructions: 'Test instructions',
                    cook_time: 45,
                    servings: 6,
                    difficulty: 'Hard',
                    category: 'Dinner',
                    tags: 'test, recipe',
                });
                expect(result.current.imagePreview).toBe('https://example.com/image.jpg');
            });
        });

        it('handles missing recipe data gracefully', async () => {
            mockUseParams.mockReturnValue({ id: '1' });
            mockApiClient.getRecipe.mockResolvedValue(null as any);

            const { result } = renderHook(() => useRecipeForm(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.formData).toEqual({
                    title: '',
                    ingredients: '',
                    instructions: '',
                    cook_time: 30,
                    servings: 4,
                    difficulty: 'Medium',
                    category: '',
                    tags: '',
                });
            });
        });
    });

    describe('form data updates', () => {
        it('updates form data', () => {
            const { result } = renderHook(() => useRecipeForm(), {
                wrapper: createWrapper(),
            });

            act(() => {
                result.current.updateFormData('title', 'New Recipe Title');
            });

            expect(result.current.formData.title).toBe('New Recipe Title');
        });

        it('updates multiple form fields', () => {
            const { result } = renderHook(() => useRecipeForm(), {
                wrapper: createWrapper(),
            });

            act(() => {
                result.current.updateFormData('title', 'New Recipe');
                result.current.updateFormData('cook_time', 60);
                result.current.updateFormData('servings', 8);
            });

            expect(result.current.formData.title).toBe('New Recipe');
            expect(result.current.formData.cook_time).toBe(60);
            expect(result.current.formData.servings).toBe(8);
        });
    });

    describe('image handling', () => {
        it('sets image preview on handleImageChange', () => {
            const { result } = renderHook(() => useRecipeForm(), {
                wrapper: createWrapper(),
            });

            const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
            const mockEvent = {
                target: {
                    files: [mockFile],
                },
            } as any;

            // Mock FileReader
            const mockFileReader = {
                readAsDataURL: vi.fn(),
                onload: null as any,
                result: 'data:image/jpeg;base64,test',
            };

            Object.defineProperty(window, 'FileReader', {
                value: vi.fn(() => mockFileReader),
                writable: true,
            });

            act(() => {
                result.current.handleImageChange(mockEvent);
                // Simulate FileReader onload
                mockFileReader.onload({ target: { result: 'data:image/jpeg;base64,test' } } as any);
            });

            expect(result.current.imagePreview).toBe('data:image/jpeg;base64,test');
        });

        it('handles image change with no files', () => {
            const { result } = renderHook(() => useRecipeForm(), {
                wrapper: createWrapper(),
            });

            const mockEvent = {
                target: {
                    files: [],
                },
            } as any;

            act(() => {
                result.current.handleImageChange(mockEvent);
            });

            expect(result.current.imagePreview).toBe(null);
        });

        it('removes image preview', () => {
            const { result } = renderHook(() => useRecipeForm(), {
                wrapper: createWrapper(),
            });

            // First set an image
            act(() => {
                result.current.updateFormData('title', 'Test');
            });

            // Then remove it
            act(() => {
                result.current.removeImage();
            });

            expect(result.current.imagePreview).toBe(null);
        });
    });

    describe('form submission', () => {
        it('handles successful recipe creation', async () => {
            const { result } = renderHook(() => useRecipeForm(), {
                wrapper: createWrapper(),
            });

            act(() => {
                result.current.updateFormData('title', 'New Recipe');
            });

            await act(async () => {
                await result.current.handleSubmit(mockFormEvent);
            });

            expect(mockApiClient.createRecipe).toHaveBeenCalledWith({
                title: 'New Recipe',
                ingredients: '',
                instructions: '',
                cook_time: 30,
                servings: 4,
                difficulty: 'Medium',
                category: '',
                tags: '',
            });

            await waitFor(() => {
                expect(mockToast.success).toHaveBeenCalledWith('Recipe created successfully!');
                expect(mockNavigate).toHaveBeenCalledWith('/recipes');
            });
        });

        it('handles successful recipe update', async () => {
            mockUseParams.mockReturnValue({ id: '1' });

            const { result } = renderHook(() => useRecipeForm(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isEditing).toBe(true);
            });

            await act(async () => {
                await result.current.handleSubmit();
            });

            expect(mockApiClient.updateRecipe).toHaveBeenCalledWith('1', expect.any(Object));

            await waitFor(() => {
                expect(mockToast.success).toHaveBeenCalledWith('Recipe updated successfully!');
                expect(mockNavigate).toHaveBeenCalledWith('/recipes');
            });
        });

        it('handles validation failure', async () => {
            mockValidateForm.mockReturnValue(false);

            const { result } = renderHook(() => useRecipeForm(), {
                wrapper: createWrapper(),
            });

            await act(async () => {
                await result.current.handleSubmit();
            });

            expect(mockApiClient.createRecipe).not.toHaveBeenCalled();
            expect(mockNavigate).not.toHaveBeenCalled();
        });

        it('handles creation error', async () => {
            const mockError = {
                response: {
                    data: {
                        error: 'Creation failed',
                    },
                },
            };
            mockApiClient.createRecipe.mockRejectedValue(mockError);

            const { result } = renderHook(() => useRecipeForm(), {
                wrapper: createWrapper(),
            });

            await act(async () => {
                await result.current.handleSubmit();
            });

            await waitFor(() => {
                expect(mockToast.error).toHaveBeenCalledWith('Creation failed');
            });
        });

        it('handles update error', async () => {
            mockUseParams.mockReturnValue({ id: '1' });
            const mockError = {
                response: {
                    data: {
                        error: 'Update failed',
                    },
                },
            };
            mockApiClient.updateRecipe.mockRejectedValue(mockError);

            const { result } = renderHook(() => useRecipeForm(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isEditing).toBe(true);
            });

            await act(async () => {
                await result.current.handleSubmit();
            });

            await waitFor(() => {
                expect(mockToast.error).toHaveBeenCalledWith('Update failed');
            });
        });

        it('handles generic error without response', async () => {
            const mockError = new Error('Network error');
            mockApiClient.createRecipe.mockRejectedValue(mockError);

            const { result } = renderHook(() => useRecipeForm(), {
                wrapper: createWrapper(),
            });

            await act(async () => {
                await result.current.handleSubmit();
            });

            await waitFor(() => {
                expect(mockToast.error).toHaveBeenCalledWith('Failed to create recipe');
            });
        });
    });

    describe('navigation', () => {
        it('handles cancel navigation', () => {
            const { result } = renderHook(() => useRecipeForm(), {
                wrapper: createWrapper(),
            });

            act(() => {
                result.current.handleCancel();
            });

            expect(mockNavigate).toHaveBeenCalledWith('/recipes');
        });
    });

    describe('error handling', () => {
        it('returns validation errors', () => {
            const mockErrors = {
                title: 'Title is required',
                ingredients: 'Ingredients are required',
            };
            mockUseFormValidation.mockReturnValue({
                errors: mockErrors,
                validateForm: mockValidateForm,
                validateField: vi.fn(),
                clearErrors: vi.fn(),
                clearFieldError: vi.fn(),
                hasErrors: true,
            });

            const { result } = renderHook(() => useRecipeForm(), {
                wrapper: createWrapper(),
            });

            expect(result.current.errors).toEqual(mockErrors);
        });
    });
}); 