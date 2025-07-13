/**
 * Main Application Component
 * Routes are already wrapped in providers via main.tsx
 */
import { AppRoutes } from '@/components/layout/AppRoutes'
import ErrorBoundary from '@/components/ui/ErrorBoundary/ErrorBoundary'

/**
 * Main App Component
 * Provides error boundary and routing structure
 * All providers are configured in main.tsx
 */
function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen transition-theme duration-300">
        <AppRoutes />
      </div>
    </ErrorBoundary>
  )
}

export default App