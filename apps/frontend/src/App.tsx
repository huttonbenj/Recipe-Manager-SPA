import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AppRoutes } from './components/layout/AppRoutes';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import './styles/globals.css';

/**
 * React Query client configuration
 * Configured for optimal user experience with appropriate caching and retry strategies
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on authentication errors
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
    },
    mutations: {
      retry: 1,
    },
  },
});

/**
 * Main application component
 * Sets up the provider hierarchy and routing for the Recipe Manager SPA
 * 
 * Provider hierarchy (inside to outside):
 * - ThemeProvider: Manages color themes and light/dark mode
 * - AuthProvider: Manages user authentication state
 * - QueryClientProvider: Manages API queries and caching
 * - BrowserRouter: Manages client-side routing
 * - ErrorBoundary: Catches and handles React errors gracefully
 */
function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ThemeProvider>
              <div className="min-h-screen transition-theme duration-300">
                <AppRoutes />
              </div>
              {/* React Query DevTools - only shown in development */}
              <ReactQueryDevtools initialIsOpen={false} />
            </ThemeProvider>
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;