import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect } from 'vitest';
import { AuthContext } from '../../../src/contexts/AuthContext';
import { AppRoutes } from '../../components/app/AppRoutes';
import React from 'react';

const TestProviders = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={new QueryClient()}>
        <AuthContext.Provider value={{
            user: null,
            isAuthenticated: false,
            isLoading: false,
            login: async () => { },
            register: async () => { },
            logout: () => { },
            updateProfile: async () => { },
            changePassword: async () => { },
            refreshUser: async () => { },
        }}>
            {children}
        </AuthContext.Provider>
    </QueryClientProvider>
);

describe('AppRoutes integration', () => {
    it('renders navigation and login form for unauthenticated user', () => {
        render(
            <MemoryRouter initialEntries={['/login']}>
                <TestProviders>
                    <AppRoutes />
                </TestProviders>
            </MemoryRouter>
        );
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i, { selector: 'input' })).toBeInTheDocument();
    });
}); 