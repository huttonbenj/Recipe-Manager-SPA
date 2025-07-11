import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useNavigation } from '../../../../hooks/ui/useNavigation';
import { useAuth } from '../../../../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';

// Mock dependencies
vi.mock('../../../../hooks/useAuth');
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useLocation: vi.fn(),
        useNavigate: vi.fn(),
    };
});

const mockUseAuth = vi.mocked(useAuth);
const mockUseLocation = vi.mocked(useLocation);
const mockUseNavigate = vi.mocked(useNavigate);

// Mock user data
const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    created_at: new Date('2023-01-01'),
    updated_at: new Date('2023-01-01'),
};

// Test wrapper with Router
const createWrapper = () => {
    return ({ children }: { children: React.ReactNode }) => (
        <BrowserRouter>{children}</BrowserRouter>
    );
};

describe('useNavigation', () => {
    const mockNavigate = vi.fn();
    const mockLogout = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseNavigate.mockReturnValue(mockNavigate);
        mockUseAuth.mockReturnValue({
            user: mockUser,
            logout: mockLogout,
            isAuthenticated: true,
            isLoading: false,
            login: vi.fn(),
            register: vi.fn(),
            updateProfile: vi.fn(),
            changePassword: vi.fn(),
            refreshUser: vi.fn(),
        });
        mockUseLocation.mockReturnValue({
            pathname: '/dashboard',
            search: '',
            hash: '',
            state: null,
            key: 'default',
        });
    });

    describe('initialization', () => {
        it('should initialize with default values', () => {
            const { result } = renderHook(() => useNavigation(), {
                wrapper: createWrapper(),
            });

            expect(result.current.user).toEqual(mockUser);
            expect(result.current.isMenuOpen).toBe(false);
            expect(result.current.isUserMenuOpen).toBe(false);
        });

        it('should initialize with null user when not authenticated', () => {
            mockUseAuth.mockReturnValue({
                user: null,
                logout: mockLogout,
                isAuthenticated: false,
                isLoading: false,
                login: vi.fn(),
                register: vi.fn(),
                updateProfile: vi.fn(),
                changePassword: vi.fn(),
                refreshUser: vi.fn(),
            });

            const { result } = renderHook(() => useNavigation(), {
                wrapper: createWrapper(),
            });

            expect(result.current.user).toBeNull();
        });
    });

    describe('menu state management', () => {
        it('should toggle menu state', () => {
            const { result } = renderHook(() => useNavigation(), {
                wrapper: createWrapper(),
            });

            expect(result.current.isMenuOpen).toBe(false);

            act(() => {
                result.current.toggleMenu();
            });

            expect(result.current.isMenuOpen).toBe(true);

            act(() => {
                result.current.toggleMenu();
            });

            expect(result.current.isMenuOpen).toBe(false);
        });

        it('should close menu', () => {
            const { result } = renderHook(() => useNavigation(), {
                wrapper: createWrapper(),
            });

            // First open the menu
            act(() => {
                result.current.toggleMenu();
            });

            expect(result.current.isMenuOpen).toBe(true);

            // Then close it
            act(() => {
                result.current.closeMenu();
            });

            expect(result.current.isMenuOpen).toBe(false);
        });

        it('should toggle user menu state', () => {
            const { result } = renderHook(() => useNavigation(), {
                wrapper: createWrapper(),
            });

            expect(result.current.isUserMenuOpen).toBe(false);

            act(() => {
                result.current.toggleUserMenu();
            });

            expect(result.current.isUserMenuOpen).toBe(true);

            act(() => {
                result.current.toggleUserMenu();
            });

            expect(result.current.isUserMenuOpen).toBe(false);
        });

        it('should close user menu', () => {
            const { result } = renderHook(() => useNavigation(), {
                wrapper: createWrapper(),
            });

            // First open the user menu
            act(() => {
                result.current.toggleUserMenu();
            });

            expect(result.current.isUserMenuOpen).toBe(true);

            // Then close it
            act(() => {
                result.current.closeUserMenu();
            });

            expect(result.current.isUserMenuOpen).toBe(false);
        });
    });

    describe('navigation functionality', () => {
        it('should correctly identify active path', () => {
            mockUseLocation.mockReturnValue({
                pathname: '/recipes',
                search: '',
                hash: '',
                state: null,
                key: 'default',
            });

            const { result } = renderHook(() => useNavigation(), {
                wrapper: createWrapper(),
            });

            expect(result.current.isActive('/recipes')).toBe(true);
            expect(result.current.isActive('/dashboard')).toBe(false);
            expect(result.current.isActive('/profile')).toBe(false);
        });

        it('should handle different active paths', () => {
            mockUseLocation.mockReturnValue({
                pathname: '/profile',
                search: '',
                hash: '',
                state: null,
                key: 'default',
            });

            const { result } = renderHook(() => useNavigation(), {
                wrapper: createWrapper(),
            });

            expect(result.current.isActive('/profile')).toBe(true);
            expect(result.current.isActive('/dashboard')).toBe(false);
            expect(result.current.isActive('/recipes')).toBe(false);
        });
    });

    describe('logout functionality', () => {
        it('should handle successful logout', async () => {
            mockLogout.mockResolvedValue(undefined);

            const { result } = renderHook(() => useNavigation(), {
                wrapper: createWrapper(),
            });

            await act(async () => {
                await result.current.handleLogout();
            });

            expect(mockLogout).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        });

        it('should handle logout failure', async () => {
            const mockError = new Error('Logout failed');
            mockLogout.mockRejectedValue(mockError);
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

            const { result } = renderHook(() => useNavigation(), {
                wrapper: createWrapper(),
            });

            await act(async () => {
                await result.current.handleLogout();
            });

            expect(mockLogout).toHaveBeenCalled();
            expect(consoleSpy).toHaveBeenCalledWith('Logout failed:', mockError);
            expect(mockNavigate).not.toHaveBeenCalled();

            consoleSpy.mockRestore();
        });
    });

    describe('return values', () => {
        it('should return all expected functions and values', () => {
            const { result } = renderHook(() => useNavigation(), {
                wrapper: createWrapper(),
            });

            expect(typeof result.current.user).toBe('object');
            expect(typeof result.current.isMenuOpen).toBe('boolean');
            expect(typeof result.current.isUserMenuOpen).toBe('boolean');
            expect(typeof result.current.isActive).toBe('function');
            expect(typeof result.current.handleLogout).toBe('function');
            expect(typeof result.current.toggleMenu).toBe('function');
            expect(typeof result.current.closeMenu).toBe('function');
            expect(typeof result.current.toggleUserMenu).toBe('function');
            expect(typeof result.current.closeUserMenu).toBe('function');
        });
    });
}); 