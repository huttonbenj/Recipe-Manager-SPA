import React from 'react'
import { Toaster } from 'react-hot-toast'
import { AppRoutes } from '@/components/layout'
import { AuthProvider, ThemeProvider, ToastProvider } from '@/context'
import { ErrorBoundary } from '@/components/ui'
// import { registerServiceWorker } from '@/utils/serviceWorker'

// Initialize service worker
// registerServiceWorker({
//   onUpdate: (registration) => {
//     if (registration.waiting) {
//       // Automatically trigger the update
//       registration.waiting.postMessage({ type: 'SKIP_WAITING' })
//     }
//   }
// })

function App() {
    return (
        <ThemeProvider>
            <ErrorBoundary>
                <AuthProvider>
                    <ToastProvider>
                        <Toaster />
                        <AppRoutes />
                    </ToastProvider>
                </AuthProvider>
            </ErrorBoundary>
        </ThemeProvider>
    )
}

export default App 