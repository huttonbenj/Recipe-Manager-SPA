import { ReactNode } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '../../contexts/AuthProvider';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { queryClient, toastConfig } from '../../config';

interface AppProvidersProps {
    children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
    return (
        <ErrorBoundary>
            <HelmetProvider>
                <QueryClientProvider client={queryClient}>
                    <Router>
                        <AuthProvider>
                            {children}

                            {/* Toast Notifications */}
                            <Toaster {...toastConfig} />
                        </AuthProvider>
                    </Router>

                    {/* React Query DevTools */}
                    {(import.meta as any).env?.MODE === 'development' && (
                        <ReactQueryDevtools initialIsOpen={false} />
                    )}
                </QueryClientProvider>
            </HelmetProvider>
        </ErrorBoundary>
    );
}; 