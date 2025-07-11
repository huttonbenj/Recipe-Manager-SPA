import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUserProfile } from '../../../../hooks/user/useUserProfile';
import { useAuth } from '../../../../hooks/useAuth';
import { apiClient } from '../../../../services/api';
import toast from 'react-hot-toast';

// Mock dependencies
vi.mock('../../../../hooks/useAuth');
vi.mock('../../../../services/api');
vi.mock('react-hot-toast');

const mockUseAuth = vi.mocked(useAuth);
const mockApiClient = vi.mocked(apiClient);
const mockToast = vi.mocked(toast);

// Mock user data
const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    created_at: new Date('2023-01-01'),
    updated_at: new Date('2023-01-01'),
};

const mockStats = {
    totalRecipes: 10,
    totalLikes: 25,
    totalViews: 150,
    averageRating: 4.5,
    recipesByCategory: [],
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

describe('useUserProfile', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAuth.mockReturnValue({
            user: mockUser,
            updateProfile: vi.fn(),
            isAuthenticated: true,
            isLoading: false,
            login: vi.fn(),
            register: vi.fn(),
            logout: vi.fn(),
            changePassword: vi.fn(),
            refreshUser: vi.fn(),
        });
        mockApiClient.getUserStats.mockResolvedValue(mockStats);
        mockApiClient.updateProfile.mockResolvedValue(mockUser);
    });

    describe('initialization', () => {
        it('should initialize with default values', () => {
            const { result } = renderHook(() => useUserProfile(), {
                wrapper: createWrapper(),
            });

            expect(result.current.user).toEqual(mockUser);
            expect(result.current.isEditing).toBe(false);
            expect(result.current.formData).toEqual({
                name: mockUser.name,
                email: mockUser.email,
            });
            expect(result.current.isLoading).toBe(false);
        });

        it('should initialize with empty form data when user is null', () => {
            mockUseAuth.mockReturnValue({
                user: null,
                updateProfile: vi.fn(),
                isAuthenticated: false,
                isLoading: false,
                login: vi.fn(),
                register: vi.fn(),
                logout: vi.fn(),
                changePassword: vi.fn(),
                refreshUser: vi.fn(),
            });

            const { result } = renderHook(() => useUserProfile(), {
                wrapper: createWrapper(),
            });

            expect(result.current.formData).toEqual({
                name: '',
                email: '',
            });
        });
    });

    describe('stats handling', () => {
        it('should normalize stats data', async () => {
            const { result } = renderHook(() => useUserProfile(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.stats).toEqual({
                    totalRecipes: 10,
                    totalLikes: 25,
                    totalViews: 150,
                    averageRating: 4.5,
                });
            });
        });

        it('should handle missing stats with default values', async () => {
            mockApiClient.getUserStats.mockResolvedValue(undefined as any);

            const { result } = renderHook(() => useUserProfile(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.stats).toEqual({
                    totalRecipes: 0,
                    totalLikes: 0,
                    totalViews: 0,
                    averageRating: 0,
                });
            });
        });

        it('should handle partial stats data', async () => {
            const partialStats = {
                totalRecipes: 5,
                totalLikes: 0,
            };
            mockApiClient.getUserStats.mockResolvedValue(partialStats as any);

            const { result } = renderHook(() => useUserProfile(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.stats).toEqual({
                    totalRecipes: 5,
                    totalLikes: 0,
                    totalViews: 0,
                    averageRating: 0,
                });
            });
        });
    });

    describe('editing functionality', () => {
        it('should handle edit click', () => {
            const { result } = renderHook(() => useUserProfile(), {
                wrapper: createWrapper(),
            });

            act(() => {
                result.current.handleEditClick();
            });

            expect(result.current.isEditing).toBe(true);
        });

        it('should handle form data changes', () => {
            const { result } = renderHook(() => useUserProfile(), {
                wrapper: createWrapper(),
            });

            act(() => {
                result.current.handleFormDataChange('name', 'Jane Doe');
            });

            expect(result.current.formData.name).toBe('Jane Doe');
            expect(result.current.formData.email).toBe(mockUser.email);
        });

        it('should handle cancel editing', () => {
            const { result } = renderHook(() => useUserProfile(), {
                wrapper: createWrapper(),
            });

            // First edit and change data
            act(() => {
                result.current.handleEditClick();
                result.current.handleFormDataChange('name', 'Jane Doe');
            });

            expect(result.current.isEditing).toBe(true);
            expect(result.current.formData.name).toBe('Jane Doe');

            // Then cancel
            act(() => {
                result.current.handleCancel();
            });

            expect(result.current.isEditing).toBe(false);
            expect(result.current.formData).toEqual({
                name: mockUser.name,
                email: mockUser.email,
            });
        });
    });

    describe('form submission', () => {
        it('should handle successful form submission', async () => {
            const mockUpdateProfile = vi.fn();
            mockUseAuth.mockReturnValue({
                user: mockUser,
                updateProfile: mockUpdateProfile,
                isAuthenticated: true,
                isLoading: false,
                login: vi.fn(),
                register: vi.fn(),
                logout: vi.fn(),
                changePassword: vi.fn(),
                refreshUser: vi.fn(),
            });

            const { result } = renderHook(() => useUserProfile(), {
                wrapper: createWrapper(),
            });

            const mockEvent = {
                preventDefault: vi.fn(),
            } as any;

            act(() => {
                result.current.handleEditClick();
                result.current.handleFormDataChange('name', 'Jane Doe');
            });

            await act(async () => {
                result.current.handleSubmit(mockEvent);
            });

            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(mockApiClient.updateProfile).toHaveBeenCalledWith({
                name: 'Jane Doe',
                email: mockUser.email,
            });

            await waitFor(() => {
                expect(mockToast.success).toHaveBeenCalledWith('Profile updated successfully!');
                expect(mockUpdateProfile).toHaveBeenCalledWith({
                    name: 'Jane Doe',
                    email: mockUser.email,
                });
                expect(result.current.isEditing).toBe(false);
            });
        });

        it('should handle failed form submission', async () => {
            const mockError = new Error('Update failed');
            mockApiClient.updateProfile.mockRejectedValue(mockError);

            const { result } = renderHook(() => useUserProfile(), {
                wrapper: createWrapper(),
            });

            const mockEvent = {
                preventDefault: vi.fn(),
            } as any;

            act(() => {
                result.current.handleEditClick();
            });

            await act(async () => {
                result.current.handleSubmit(mockEvent);
            });

            await waitFor(() => {
                expect(mockToast.error).toHaveBeenCalledWith('Failed to update profile');
            });
        });
    });

    describe('loading states', () => {
        it('should return isLoading state from mutation', () => {
            const { result } = renderHook(() => useUserProfile(), {
                wrapper: createWrapper(),
            });

            // Initially should not be loading
            expect(result.current.isLoading).toBe(false);

            // The isLoading state comes from the mutation's isPending state
            // We don't need to test the actual async loading since that's handled by React Query
            expect(typeof result.current.isLoading).toBe('boolean');
        });
    });
}); 