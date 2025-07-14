/**
 * Service Worker Registration
 * Handles service worker registration and management
 */

const SW_URL = '/sw.js'
const SW_SCOPE = '/'

export interface ServiceWorkerConfig {
  onSuccess?: (registration: ServiceWorkerRegistration) => void
  onUpdate?: (registration: ServiceWorkerRegistration) => void
  onOffline?: () => void
  onOnline?: () => void
}

/**
 * Check if service worker is supported
 */
function isServiceWorkerSupported(): boolean {
  return 'serviceWorker' in navigator && 
         'caches' in window && 
         'fetch' in window
}

/**
 * Register service worker
 */
export async function registerServiceWorker(config: ServiceWorkerConfig = {}): Promise<void> {
  if (!isServiceWorkerSupported()) {
    console.log('Service Worker not supported')
    return
  }

  // Only register in production
  if (import.meta.env.DEV) {
    console.log('Service Worker registration skipped in development')
    return
  }

  try {
    const registration = await navigator.serviceWorker.register(SW_URL, {
      scope: SW_SCOPE
    })

    console.log('Service Worker registered successfully:', registration.scope)

    // Handle service worker updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // New content is available
              console.log('New content available, please refresh')
              config.onUpdate?.(registration)
            } else {
              // Content is cached for offline use
              console.log('Content is cached for offline use')
              config.onSuccess?.(registration)
            }
          }
        })
      }
    })

    // Check for existing service worker
    if (registration.active) {
      config.onSuccess?.(registration)
    }

  } catch (error) {
    console.error('Service Worker registration failed:', error)
  }
}

/**
 * Unregister service worker
 */
export async function unregisterServiceWorker(): Promise<void> {
  if (!isServiceWorkerSupported()) {
    return
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration()
    if (registration) {
      await registration.unregister()
      console.log('Service Worker unregistered')
    }
  } catch (error) {
    console.error('Service Worker unregistration failed:', error)
  }
}

/**
 * Check if app is running in standalone mode (PWA)
 */
export function isStandalone(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches ||
         'standalone' in window.navigator ||
         document.referrer.includes('android-app://')
}

/**
 * Setup offline/online event listeners
 */
export function setupConnectionListeners(config: ServiceWorkerConfig): () => void {
  const handleOnline = () => {
    console.log('App is online')
    config.onOnline?.()
  }

  const handleOffline = () => {
    console.log('App is offline')
    config.onOffline?.()
  }

  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)

  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  }
}

/**
 * Force service worker to skip waiting and reload
 */
export async function skipWaitingAndReload(): Promise<void> {
  if (!isServiceWorkerSupported()) {
    return
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration()
    if (registration && registration.waiting) {
      // Send message to waiting service worker to skip waiting
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      
      // Reload the page once the new service worker takes control
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload()
      })
    }
  } catch (error) {
    console.error('Failed to skip waiting:', error)
  }
}

/**
 * Clear all caches
 */
export async function clearAllCaches(): Promise<void> {
  if (!('caches' in window)) {
    return
  }

  try {
    const cacheNames = await caches.keys()
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    )
    console.log('All caches cleared')
  } catch (error) {
    console.error('Failed to clear caches:', error)
  }
}

/**
 * Get cache usage information
 */
export async function getCacheUsage(): Promise<{
  cacheNames: string[]
  totalSize: number
}> {
  if (!('caches' in window)) {
    return { cacheNames: [], totalSize: 0 }
  }

  try {
    const cacheNames = await caches.keys()
    let totalSize = 0

    // Note: Getting exact cache sizes requires Storage API
    // which might not be available in all browsers
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate()
      totalSize = estimate.usage || 0
    }

    return { cacheNames, totalSize }
  } catch (error) {
    console.error('Failed to get cache usage:', error)
    return { cacheNames: [], totalSize: 0 }
  }
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied'
  }

  if (Notification.permission === 'granted') {
    return 'granted'
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission
  }

  return 'denied'
}

/**
 * Show notification
 */
export function showNotification(title: string, options: NotificationOptions = {}): void {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      ...options
    })
  }
} 