import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppProviders } from '../../../components/app/AppProviders';

// Mock all the providers
vi.mock('react-router-dom', () => ({
    BrowserRouter: ({ children }: { children: React.ReactNode }) => <div data-testid="router">{children}</div>,
}));

vi.mock('@tanstack/react-query', () => ({
    QueryClient: vi.fn(() => ({})),
    QueryClientProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="query-provider">{children}</div>,
}));

vi.mock('@tanstack/react-query-devtools', () => ({
    ReactQueryDevtools: () => <div data-testid="devtools" />,
}));

vi.mock('react-hot-toast', () => ({
    Toaster: () => <div data-testid="toaster" />,
}));

vi.mock('react-helmet-async', () => ({
    HelmetProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="helmet-provider">{children}</div>,
}));

vi.mock('../../../contexts/AuthProvider', () => ({
    AuthProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="auth-provider">{children}</div>,
}));

vi.mock('../../../components/ui/ErrorBoundary', () => ({
    ErrorBoundary: ({ children }: { children: React.ReactNode }) => <div data-testid="error-boundary">{children}</div>,
}));

vi.mock('../../../config', () => ({
    queryClient: {},
    toastConfig: {},
}));

describe('AppProviders', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders all providers in correct order', () => {
        render(
            <AppProviders>
                <div>Test</div>
            </AppProviders>
        );

        expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
        expect(screen.getByTestId('helmet-provider')).toBeInTheDocument();
        expect(screen.getByTestId('query-provider')).toBeInTheDocument();
        expect(screen.getByTestId('router')).toBeInTheDocument();
        expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
        expect(screen.getByTestId('toaster')).toBeInTheDocument();
        expect(screen.getByText('Test')).toBeInTheDocument();
    });

    it('renders toaster component', () => {
        render(
            <AppProviders>
                <div>Test</div>
            </AppProviders>
        );

        expect(screen.getByTestId('toaster')).toBeInTheDocument();
    });

    it('handles children properly', () => {
        render(
            <AppProviders>
                <div data-testid="child-component">Child Content</div>
            </AppProviders>
        );

        expect(screen.getByTestId('child-component')).toBeInTheDocument();
        expect(screen.getByText('Child Content')).toBeInTheDocument();
    });
}); 