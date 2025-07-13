/**
 * Application entry point
 * Sets up React app with providers and routing
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import App from './App'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { ToastProvider } from '@/context/ToastContext'
import '@/styles/globals.css'

// Configure React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime in v4)
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false
        }
        return failureCount < 3
      },
    },
  },
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
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
  </React.StrictMode>,
)