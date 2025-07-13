/**
 * Main Application Component
 * Routes are already wrapped in providers via main.tsx
 */
import { AppRoutes } from '@/components/layout/AppRoutes'
import ErrorBoundary from '@/components/ui/ErrorBoundary/ErrorBoundary'
import ToastContainer from '@/components/ui/ToastContainer'

/**
 * Main App Component
 * Provides error boundary, routing structure, and toast notifications
 * All providers are configured in main.tsx
 */
function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen transition-theme duration-300">
        <AppRoutes />
        <ToastContainer />
      </div>
    </ErrorBoundary>
  )
}

export default App