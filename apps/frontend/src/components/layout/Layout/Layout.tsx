/**
 * Main layout component
 * Enhanced layout with responsive design, theme integration, and mobile optimization
 */

import React, { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useTheme } from '@/hooks/useTheme'
import Header from '../Header'
import Footer from '../Footer'
import { ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui'

const Layout: React.FC = () => {
  const location = useLocation()
  useTheme()
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Handle scroll behavior for header visibility and scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Show/hide scroll to top button
      setShowScrollTop(currentScrollY > 300)

      // Auto-hide header on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderVisible(false)
      } else {
        setIsHeaderVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Reset scroll position on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // Get page-specific classes
  const getMainClasses = () => {
    const baseClasses = 'flex-1 transition-all duration-300 ease-in-out'

    // Add specific styling based on route
    switch (location.pathname) {
      case '/':
        return `${baseClasses} pt-0` // Home page with hero section
      case '/login':
      case '/register':
        return `${baseClasses} flex items-center justify-center min-h-[calc(100vh-4rem)]` // Auth pages
      default:
        return `${baseClasses} container mx-auto px-4 py-8 max-w-7xl` // Default pages
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-secondary-50 dark:bg-secondary-900 text-secondary-900 dark:text-secondary-100 transition-colors duration-300">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-md z-50 transition-all duration-200"
      >
        Skip to main content
      </a>

      {/* Header with auto-hide functionality */}
      <div
        className={`
          sticky top-0 z-40 
          transition-transform duration-300 ease-in-out
          ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}
        `}
      >
        <Header />
      </div>

      {/* Main content area */}
      <main
        id="main-content"
        className={getMainClasses()}
        role="main"
        aria-label="Main content"
      >
        <div className="w-full">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Scroll to top button */}
      {showScrollTop && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={scrollToTop}
            variant="primary"
            size="sm"
            className="rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default Layout