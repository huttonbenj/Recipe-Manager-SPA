/* eslint-disable react-refresh/only-export-components */
import { FC, PropsWithChildren, ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../../contexts/AuthProvider';
import { User } from '@recipe-manager/shared';

// Create a test query client
const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
        mutations: {
            retry: false,
        },
    },
});

// Test wrapper component
const TestProviders: FC<PropsWithChildren> = ({ children }) => {
    const queryClient = createTestQueryClient();

    return (
        <BrowserRouter>
            <AuthProvider>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </AuthProvider>
        </BrowserRouter>
    );
};

// Custom render function
const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
    render(ui, { wrapper: TestProviders, ...options });

// Export alias for backward compatibility
export const renderWithProviders = customRender;

// Mock user creation utility
export const createMockUser = (): User => ({
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    created_at: new Date('2024-01-01T00:00:00.000Z'),
    updated_at: new Date('2024-01-01T00:00:00.000Z')
});

// Re-export testing library utilities
export * from '@testing-library/react';
export { customRender as render }; 