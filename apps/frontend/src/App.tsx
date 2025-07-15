/**
 * Main Application Component
 * Routes are already wrapped in providers via main.tsx
 */
import { useEffect } from 'react'
import AppRoutes from '@/components/layout/AppRoutes'
import ErrorBoundary from '@/components/ui/ErrorBoundary/ErrorBoundary'
import ToastContainer from '@/components/ui/ToastContainer'
import ResponsiveTest from '@/components/ui/ResponsiveTest'
import { registerServiceWorker } from '@/utils/serviceWorker'

/**
 * Main App Component
 * Provides error boundary, routing structure, and toast notifications
 * All providers are configured in main.tsx
 */
function App() {
  useEffect(() => {
    // Register service worker for performance optimization
    registerServiceWorker({
      onSuccess: () => {
        console.log('Service Worker registered successfully')
      },
      onUpdate: () => {
        console.log('New app version available')
        // You could show a toast notification here
      },
      onOffline: () => {
        console.log('App is offline')
        // You could show offline indicator here
      },
      onOnline: () => {
        console.log('App is online')
        // You could hide offline indicator here
      }
    })
  }, [])

  return (
    <ErrorBoundary>
      <div className="min-h-screen transition-theme duration-300">
        <AppRoutes />
        <ToastContainer />
        <ResponsiveTest show={import.meta.env.DEV} />
      </div>
    </ErrorBoundary>
  )
}

export default App