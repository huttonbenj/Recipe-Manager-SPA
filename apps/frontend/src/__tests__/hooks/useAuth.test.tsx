/**
 * Tests for useAuth hook
 * Critical authentication tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useAuth } from '@/hooks/useAuth'
import { AuthProvider } from '@/context/AuthContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { authApi } from '@/services/api/auth'
import React from 'react'

// Mock the auth API
vi.mock('@/services/api/auth', () => ({
    authApi: {
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        refreshToken: vi.fn(),
        getCurrentUser: vi.fn(),
    }
}))

describe('useAuth', () => {
    let queryClient: QueryClient

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false },
            },
        })
        vi.clearAllMocks()
        localStorage.clear()
    })

    const createWrapper = () => {
        return ({ children }: { children: React.ReactNode }) => (
            <QueryClientProvider client={queryClient}>
                <AuthProvider>{children}</AuthProvider>
            </QueryClientProvider>
        )
    }

    it('throws error when used outside AuthProvider', () => {
        // Test that hook throws error when used outside provider
        expect(() => {
            renderHook(() => useAuth())
        }).toThrow('useAuth must be used within an AuthProvider')
    })

    it('provides initial auth state', async () => {
        const wrapper = createWrapper()
        const { result } = renderHook(() => useAuth(), { wrapper })

        await waitFor(() => {
            expect(result.current.user).toBeNull()
            expect(result.current.token).toBeNull()
            expect(result.current.isAuthenticated).toBe(false)
            expect(result.current.isLoading).toBe(false)
            expect(result.current.errors).toEqual({})
        })
    })

    it('handles successful login', async () => {
        const mockAuthResponse = {
            user: { id: '1', email: 'test@example.com', name: 'Test User' },
            token: 'mock-token',
            refreshToken: 'mock-refresh-token',
        }

            ; (authApi.login as any).mockResolvedValue(mockAuthResponse)

        const wrapper = createWrapper()
        const { result } = renderHook(() => useAuth(), { wrapper })

        await act(async () => {
            await result.current.login({
                email: 'test@example.com',
                password: 'password123'
            })
        })

        await waitFor(() => {
            expect(result.current.user).toEqual(mockAuthResponse.user)
            expect(result.current.token).toBe(mockAuthResponse.token)
            expect(result.current.isAuthenticated).toBe(true)
            expect(result.current.errors.login).toBeUndefined()
        })
    })

    it('handles login failure', async () => {
        const wrapper = createWrapper()
        const { result } = renderHook(() => useAuth(), { wrapper })

            ; (authApi.login as any).mockRejectedValue(new Error('Invalid credentials'))

        await act(async () => {
            try {
                await result.current.login({
                    email: 'test@example.com',
                    password: 'wrong-password'
                })
            } catch (error) {
                // Expected to throw
            }
        })

        await waitFor(() => {
            expect(result.current.user).toBeNull()
            expect(result.current.token).toBeNull()
            expect(result.current.isAuthenticated).toBe(false)
            expect(result.current.errors.login).toBe('Invalid credentials')
        })
    })

    it('handles successful registration', async () => {
        const mockAuthResponse = {
            user: { id: '1', email: 'new@example.com', name: 'New User' },
            token: 'mock-token',
            refreshToken: 'mock-refresh-token',
        }

            ; (authApi.register as any).mockResolvedValue(mockAuthResponse)

        const wrapper = createWrapper()
        const { result } = renderHook(() => useAuth(), { wrapper })

        await act(async () => {
            await result.current.register({
                email: 'new@example.com',
                password: 'Password123',
                name: 'New User'
            })
        })

        await waitFor(() => {
            expect(result.current.user).toEqual(mockAuthResponse.user)
            expect(result.current.token).toBe(mockAuthResponse.token)
            expect(result.current.isAuthenticated).toBe(true)
            expect(result.current.errors.register).toBeUndefined()
        })
    })

    it('handles logout', async () => {
        // First login
        const mockAuthResponse = {
            user: { id: '1', email: 'test@example.com', name: 'Test User' },
            token: 'mock-token',
            refreshToken: 'mock-refresh-token',
        }

            ; (authApi.login as any).mockResolvedValue(mockAuthResponse)
            ; (authApi.logout as any).mockResolvedValue(undefined)

        const wrapper = createWrapper()
        const { result } = renderHook(() => useAuth(), { wrapper })

        // Login first
        await act(async () => {
            await result.current.login({
                email: 'test@example.com',
                password: 'password123'
            })
        })

        // Then logout
        await act(async () => {
            await result.current.logout()
        })

        await waitFor(() => {
            expect(result.current.user).toBeNull()
            expect(result.current.token).toBeNull()
            expect(result.current.isAuthenticated).toBe(false)
        })
    })

    it('clears errors when clearErrors is called', async () => {
        const wrapper = createWrapper()
        const { result } = renderHook(() => useAuth(), { wrapper })

            ; (authApi.login as any).mockRejectedValue(new Error('Test error'))

        // Trigger an error
        await act(async () => {
            try {
                await result.current.login({
                    email: 'test@example.com',
                    password: 'wrong-password'
                })
            } catch (error) {
                // Expected to throw
            }
        })

        await waitFor(() => {
            expect(result.current.errors.login).toBe('Test error')
        })

        // Clear errors
        await act(async () => {
            result.current.clearErrors()
        })

        await waitFor(() => {
            expect(result.current.errors).toEqual({})
        })
    })

    it('persists auth state to localStorage', async () => {
        const mockAuthResponse = {
            user: { id: '1', email: 'test@example.com', name: 'Test User' },
            token: 'mock-token',
            refreshToken: 'mock-refresh-token',
        }

            ; (authApi.login as any).mockResolvedValue(mockAuthResponse)

        const wrapper = createWrapper()
        const { result } = renderHook(() => useAuth(), { wrapper })

        await act(async () => {
            await result.current.login({
                email: 'test@example.com',
                password: 'password123'
            })
        })

        await waitFor(() => {
            expect(JSON.parse(localStorage.getItem('recipe_manager_token')!)).toBe(mockAuthResponse.token)
            expect(JSON.parse(localStorage.getItem('recipe_manager_user')!)).toEqual(mockAuthResponse.user)
        })
    })
}) 