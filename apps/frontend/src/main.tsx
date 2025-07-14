/**
 * Application entry point
 * Sets up React app with providers and routing
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import App from '@/App'
import { ToastProvider } from '@/context/ToastContext'
import { ThemeProvider } from '@/context/ThemeContext'
import AuthProvider from '@/context/AuthContext'
import { ErrorBoundary } from '@/components/ui'
import '@/styles/globals.css'

// Configure React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1 * 60 * 1000, // 1 minute - short enough for development
      gcTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false, // Disable refetch on window focus
      refetchOnMount: true, // Enable refetch on component mount - IMPORTANT for cache invalidation
      refetchOnReconnect: true, // Enable refetch on reconnect
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false
        }
        return failureCount < 3
      },
    },
    mutations: {
      retry: false, // Don't retry mutations by default
    },
  },
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {/* Enable future flags to silence React Router deprecation warnings */}
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ToastProvider>
            <AuthProvider>
              <ThemeProvider>
                <App />
              </ThemeProvider>
            </AuthProvider>
          </ToastProvider>
        </BrowserRouter>
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)