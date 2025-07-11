import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { CLIENT_CONFIG } from '@recipe-manager/shared';
import { useAuth } from '../../../hooks/useAuth';
import { AuthProvider } from '../../../contexts/AuthProvider';
import { createMockUser } from '../../utils/test-utils';
import * as apiModule from '../../../services/api';

// Mock the API client
vi.mock('../../../services/api', () => ({
    apiClient: {
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        getCurrentUser: vi.fn(),
        isAuthenticated: vi.fn(),
        getStoredUser: vi.fn(),
        clearAuth: vi.fn(),
        updateProfile: vi.fn(),
        changePassword: vi.fn(),
    },
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-router-dom')>();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe('useAuth Hook', () => {
    let queryClient: QueryClient;
    let mockApiClient: {
        login: ReturnType<typeof vi.fn>;
        register: ReturnType<typeof vi.fn>;
        logout: ReturnType<typeof vi.fn>;
        getCurrentUser: ReturnType<typeof vi.fn>;
        isAuthenticated: ReturnType<typeof vi.fn>;
        getStoredUser: ReturnType<typeof vi.fn>;
        clearAuth: ReturnType<typeof vi.fn>;
        updateProfile: ReturnType<typeof vi.fn>;
        changePassword: ReturnType<typeof vi.fn>;
    };

    const createWrapper = () => {
        const Wrapper = ({ children }: { children: ReactNode }) => (
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
        mockApiClient = apiModule.apiClient as any;
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllTimers();
    });

    describe('Initial State', () => {
        it('should initialize with null user and loading state', async () => {
            mockApiClient.isAuthenticated.mockReturnValue(false);
            mockApiClient.getStoredUser.mockReturnValue(null);

            const { result } = renderHook(() => useAuth(), {
                wrapper: createWrapper(),
            });

            // Initial state might be loading: true, but quickly becomes false due to mocked async calls
            expect(result.current.user).toBeNull();
            expect(result.current.isAuthenticated).toBe(false);

            // Wait for initialization to complete
            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });
        });

        it('should restore user from storage if authenticated', async () => {
            const mockUser = createMockUser();
            mockApiClient.isAuthenticated.mockReturnValue(true);
            mockApiClient.getStoredUser.mockReturnValue(mockUser);
            mockApiClient.getCurrentUser.mockResolvedValue(mockUser);

            const { result } = renderHook(() => useAuth(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.user).toEqual(mockUser);
            expect(result.current.isAuthenticated).toBe(true);
        });

        it('should clear auth if token is invalid', async () => {
            const mockUser = createMockUser();
            mockApiClient.isAuthenticated.mockReturnValue(true);
            mockApiClient.getStoredUser.mockReturnValue(mockUser);
            mockApiClient.getCurrentUser.mockRejectedValue(new Error('Token invalid'));

            const { result } = renderHook(() => useAuth(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.user).toBeNull();
            expect(result.current.isAuthenticated).toBe(false);
            expect(mockApiClient.clearAuth).toHaveBeenCalled();
        });
    });

    describe('Login', () => {
        it('should login successfully and navigate to dashboard', async () => {
            const mockUser = createMockUser();
            const mockResponse = { user: mockUser };
            mockApiClient.isAuthenticated.mockReturnValue(false);
            mockApiClient.getStoredUser.mockReturnValue(null);
            mockApiClient.login.mockResolvedValue(mockResponse);

            const { result } = renderHook(() => useAuth(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            await act(async () => {
                await result.current.login('test@example.com', 'password');
            });

            expect(mockApiClient.login).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password',
            });
            expect(result.current.user).toEqual(mockUser);
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        });

        it('should handle login errors', async () => {
            const mockError = new Error('Invalid credentials');
            mockApiClient.isAuthenticated.mockReturnValue(false);
            mockApiClient.getStoredUser.mockReturnValue(null);
            mockApiClient.login.mockRejectedValue(mockError);

            const { result } = renderHook(() => useAuth(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            await expect(async () => {
                await act(async () => {
                    await result.current.login('test@example.com', 'wrongpassword');
                });
            }).rejects.toThrow('Invalid credentials');

            expect(result.current.user).toBeNull();
            expect(result.current.isAuthenticated).toBe(false);
        });

        it('should set loading state during login', async () => {
            const mockUser = createMockUser();
            mockApiClient.isAuthenticated.mockReturnValue(false);
            mockApiClient.getStoredUser.mockReturnValue(null);

            // Create a promise that we can control
            let resolveLogin: (value: any) => void;
            const loginPromise = new Promise((resolve) => {
                resolveLogin = resolve;
            });

            mockApiClient.login.mockReturnValue(loginPromise);

            const { result } = renderHook(() => useAuth(), {
                wrapper: createWrapper(),
            });

            // Wait for initial loading to complete
            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            // Start login and check loading state
            act(() => {
                result.current.login('test@example.com', 'password');
            });

            // Should be loading now
            expect(result.current.isLoading).toBe(true);

            // Resolve the login
            act(() => {
                resolveLogin({ user: mockUser });
            });

            // Wait for loading to complete
            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.user).toEqual(mockUser);
        });
    });

    describe('Register', () => {
        it('should register successfully and navigate to dashboard', async () => {
            const mockUser = createMockUser();
            const mockResponse = { user: mockUser };
            mockApiClient.isAuthenticated.mockReturnValue(false);
            mockApiClient.getStoredUser.mockReturnValue(null);
            mockApiClient.register.mockResolvedValue(mockResponse);

            const { result } = renderHook(() => useAuth(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            }, { timeout: CLIENT_CONFIG.TOAST_DURATION.SUCCESS });

            await act(async () => {
                await result.current.register({
                    email: 'test@example.com',
                    name: 'Test User',
                    password: 'password',
                });
            });

            expect(mockApiClient.register).toHaveBeenCalledWith({
                email: 'test@example.com',
                name: 'Test User',
                password: 'password',
            });
            expect(result.current.user).toEqual(mockUser);
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        });

        it('should handle registration errors', async () => {
            const mockError = new Error('Email already exists');
            mockApiClient.isAuthenticated.mockReturnValue(false);
            mockApiClient.getStoredUser.mockReturnValue(null);
            mockApiClient.register.mockRejectedValue(mockError);

            const { result } = renderHook(() => useAuth(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            }, { timeout: CLIENT_CONFIG.TOAST_DURATION.SUCCESS });

            await expect(async () => {
                await act(async () => {
                    await result.current.register({
                        email: 'test@example.com',
                        name: 'Test User',
                        password: 'password',
                    });
                });
            }).rejects.toThrow('Email already exists');

            expect(result.current.user).toBeNull();
            expect(result.current.isAuthenticated).toBe(false);
        });
    });

    describe('Logout', () => {
        it('should logout successfully and navigate to login', async () => {
            mockApiClient.isAuthenticated.mockReturnValue(false);
            mockApiClient.getStoredUser.mockReturnValue(null);
            mockApiClient.logout.mockResolvedValue(undefined);

            const { result } = renderHook(() => useAuth(), {
                wrapper: createWrapper(),
            });

            // Wait for initial loading to complete
            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            }, { timeout: CLIENT_CONFIG.TOAST_DURATION.SUCCESS });

            await act(async () => {
                await result.current.logout();
            });

            expect(mockApiClient.logout).toHaveBeenCalled();
            expect(result.current.user).toBeNull();
            expect(result.current.isAuthenticated).toBe(false);
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        });

        it('should handle logout errors gracefully', async () => {
            mockApiClient.isAuthenticated.mockReturnValue(false);
            mockApiClient.getStoredUser.mockReturnValue(null);
            mockApiClient.logout.mockRejectedValue(new Error('Logout failed'));

            const { result } = renderHook(() => useAuth(), {
                wrapper: createWrapper(),
            });

            // Wait for initial loading to complete
            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            }, { timeout: CLIENT_CONFIG.TOAST_DURATION.SUCCESS });

            await act(async () => {
                await result.current.logout();
            });

            // Should clear state even if API call fails
            expect(result.current.user).toBeNull();
            expect(result.current.isAuthenticated).toBe(false);
            expect(mockApiClient.clearAuth).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        });
    });

    describe('Profile Update', () => {
        it('should update profile successfully', async () => {
            const mockUser = createMockUser();
            const updatedUser = { ...mockUser, name: 'Updated Name' };
            mockApiClient.isAuthenticated.mockReturnValue(true);
            mockApiClient.getStoredUser.mockReturnValue(mockUser);
            mockApiClient.getCurrentUser.mockResolvedValue(mockUser);
            mockApiClient.updateProfile.mockResolvedValue(updatedUser);

            const { result } = renderHook(() => useAuth(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.user).toEqual(mockUser);
            });

            await act(async () => {
                await result.current.updateProfile({ name: 'Updated Name' });
            });

            expect(mockApiClient.updateProfile).toHaveBeenCalledWith({ name: 'Updated Name' });
            expect(result.current.user).toEqual(updatedUser);
        });

        it('should handle profile update errors', async () => {
            const mockUser = createMockUser();
            const mockError = new Error('Update failed');
            mockApiClient.isAuthenticated.mockReturnValue(true);
            mockApiClient.getStoredUser.mockReturnValue(mockUser);
            mockApiClient.getCurrentUser.mockResolvedValue(mockUser);
            mockApiClient.updateProfile.mockRejectedValue(mockError);

            const { result } = renderHook(() => useAuth(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.user).toEqual(mockUser);
            });

            await expect(async () => {
                await act(async () => {
                    await result.current.updateProfile({ name: 'Updated Name' });
                });
            }).rejects.toThrow('Update failed');

            // User should remain unchanged
            expect(result.current.user).toEqual(mockUser);
        });
    });

    describe('Password Change', () => {
        it('should change password successfully', async () => {
            const mockUser = createMockUser();
            mockApiClient.isAuthenticated.mockReturnValue(true);
            mockApiClient.getStoredUser.mockReturnValue(mockUser);
            mockApiClient.getCurrentUser.mockResolvedValue(mockUser);
            mockApiClient.changePassword.mockResolvedValue(undefined);

            const { result } = renderHook(() => useAuth(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.user).toEqual(mockUser);
            });

            await act(async () => {
                await result.current.changePassword({
                    currentPassword: 'oldPassword',
                    newPassword: 'newPassword'
                });
            });

            expect(mockApiClient.changePassword).toHaveBeenCalledWith({
                currentPassword: 'oldPassword',
                newPassword: 'newPassword'
            });
        });

        it('should handle password change errors', async () => {
            const mockUser = createMockUser();
            const mockError = new Error('Current password incorrect');
            mockApiClient.isAuthenticated.mockReturnValue(true);
            mockApiClient.getStoredUser.mockReturnValue(mockUser);
            mockApiClient.getCurrentUser.mockResolvedValue(mockUser);
            mockApiClient.changePassword.mockRejectedValue(mockError);

            const { result } = renderHook(() => useAuth(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.user).toEqual(mockUser);
            });

            await expect(async () => {
                await act(async () => {
                    await result.current.changePassword({
                        currentPassword: 'wrongPassword',
                        newPassword: 'newPassword'
                    });
                });
            }).rejects.toThrow('Current password incorrect');
        });
    });

    describe('Refresh User', () => {
        it('should refresh user data successfully', async () => {
            const mockUser = createMockUser();
            const updatedUser = { ...mockUser, name: 'Refreshed Name' };
            mockApiClient.isAuthenticated.mockReturnValue(true);
            mockApiClient.getStoredUser.mockReturnValue(mockUser);
            mockApiClient.getCurrentUser.mockResolvedValue(mockUser);

            const { result } = renderHook(() => useAuth(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.user).toEqual(mockUser);
            });

            // Mock the updated user for refresh
            mockApiClient.getCurrentUser.mockResolvedValue(updatedUser);

            await act(async () => {
                await result.current.refreshUser();
            });

            expect(result.current.user).toEqual(updatedUser);
        });

        it('should handle refresh user errors', async () => {
            const mockUser = createMockUser();
            const mockError = new Error('Refresh failed');
            mockApiClient.isAuthenticated.mockReturnValue(true);
            mockApiClient.getStoredUser.mockReturnValue(mockUser);
            mockApiClient.getCurrentUser.mockResolvedValueOnce(mockUser);

            const { result } = renderHook(() => useAuth(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.user).toEqual(mockUser);
            }, { timeout: CLIENT_CONFIG.TOAST_DURATION.SUCCESS });

            // Mock error for refresh
            mockApiClient.getCurrentUser.mockRejectedValue(mockError);

            await act(async () => {
                await result.current.refreshUser();
            });

            // refreshUser doesn't throw - it handles errors internally by clearing auth
            expect(result.current.user).toBeNull();
            expect(result.current.isAuthenticated).toBe(false);
            expect(mockApiClient.clearAuth).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        });
    });

    describe('Error Handling', () => {
        it('should throw error when used outside AuthProvider', () => {
            // Capture console.error to suppress error output during test
            const originalError = console.error;
            console.error = vi.fn();

            expect(() => {
                renderHook(() => useAuth());
            }).toThrow('useAuth must be used within an AuthProvider');

            // Restore console.error
            console.error = originalError;
        });
    });
}); 