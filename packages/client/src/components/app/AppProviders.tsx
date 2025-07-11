import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '../../contexts/AuthProvider';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { queryClient } from '../../config/queryClient';
import { toastConfig } from '../../config/toastConfig';
import { FontLoader } from './FontLoader';

interface AppProvidersProps {
    children: React.ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
    return (
        <ErrorBoundary>
            <HelmetProvider>
                <FontLoader />
                <ThemeProvider>
                    <QueryClientProvider client={queryClient}>
                        <Router
                            future={{
                                v7_startTransition: true,
                                v7_relativeSplatPath: true,
                            }}
                        >
                            <AuthProvider>
                                {children}

                                {/* Toast Notifications */}
                                <Toaster
                                    {...toastConfig}
                                    toastOptions={{
                                        ...toastConfig.toastOptions,
                                        className: 'dark:bg-surface-800 dark:text-surface-50',
                                    }}
                                />
                            </AuthProvider>
                        </Router>

                        {/* React Query DevTools */}
                        {(import.meta as any).env?.MODE === 'development' && (
                            <ReactQueryDevtools initialIsOpen={false} />
                        )}
                    </QueryClientProvider>
                </ThemeProvider>
            </HelmetProvider>
        </ErrorBoundary>
    );
}; 