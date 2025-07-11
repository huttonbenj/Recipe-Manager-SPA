import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthContext } from '../../../../../src/contexts/AuthContext';
import { ProtectedRoute } from '../../../../../src/components/features/auth/ProtectedRoute';
import React from 'react';
import { describe, it, expect } from 'vitest';

const TestProviders = (authValue: any) =>
    ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={new QueryClient()}>
            <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
        </QueryClientProvider>
    );

describe('ProtectedRoute', () => {
    it('renders children if authenticated', () => {
        render(
            <MemoryRouter initialEntries={['/private']}>
                <Routes>
                    <Route
                        path="/private"
                        element={
                            <ProtectedRoute>
                                <div>Private Content</div>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </MemoryRouter>,
            { wrapper: TestProviders({ user: { id: '1', name: 'Test', email: 'test@example.com', created_at: new Date(), updated_at: new Date() }, isAuthenticated: true, isLoading: false, login: async () => { }, register: async () => { }, logout: () => { }, updateProfile: async () => { }, changePassword: async () => { }, refreshUser: async () => { } }) }
        );
        expect(screen.getByText('Private Content')).toBeInTheDocument();
    });

    it('redirects to login if not authenticated', () => {
        render(
            <MemoryRouter initialEntries={['/private']}>
                <Routes>
                    <Route
                        path="/private"
                        element={
                            <ProtectedRoute>
                                <div>Private Content</div>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/login" element={<div>Login Page</div>} />
                </Routes>
            </MemoryRouter>,
            { wrapper: TestProviders({ user: null, isAuthenticated: false, isLoading: false, login: async () => { }, register: async () => { }, logout: () => { }, updateProfile: async () => { }, changePassword: async () => { }, refreshUser: async () => { } }) }
        );
        expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('shows loading state when isLoading is true', () => {
        render(
            <MemoryRouter initialEntries={['/private']}>
                <Routes>
                    <Route
                        path="/private"
                        element={
                            <ProtectedRoute>
                                <div>Private Content</div>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </MemoryRouter>,
            { wrapper: TestProviders({ user: null, isAuthenticated: false, isLoading: true, login: async () => { }, register: async () => { }, logout: () => { }, updateProfile: async () => { }, changePassword: async () => { }, refreshUser: async () => { } }) }
        );
        expect(screen.getByText('Loading...')).toBeInTheDocument();
        expect(screen.queryByText('Private Content')).not.toBeInTheDocument();
        expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
    });
}); 