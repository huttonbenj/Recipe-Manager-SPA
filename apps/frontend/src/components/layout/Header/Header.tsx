/**
 * Enhanced Header component with modern design and navigation
 * Features improved visual hierarchy, glass effects, and responsive design
 */

import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Menu, X, User, Settings, LogOut,
  Heart, Bookmark, Search, Plus, Palette, ChefHat
} from 'lucide-react'
import { useAuth } from '@/hooks'
import { ThemeToggle, ThemeSelector } from '@/components/ui'
import Button from '@/components/ui/Button'

const Header: React.FC = () => {
  const { isAuthenticated, user, logout, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [stableAuthState, setStableAuthState] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const themeMenuRef = useRef<HTMLDivElement>(null)

  // Effect to lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    try {
      await logout()
      setIsUserMenuOpen(false)
      navigate('/')
    } catch (error: any) {
      console.error('Logout error:', error)
    }
  }

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen)
  const toggleThemeMenu = () => setIsThemeMenuOpen(!isThemeMenuOpen)

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle header style on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Maintain stable auth state to prevent navigation flickering
  useEffect(() => {
    if (!isLoading) {
      setStableAuthState(isAuthenticated)
    }
  }, [isAuthenticated, isLoading])

  const navigationItems = [
    { name: 'Recipes', href: '/app/recipes', icon: Search, requireAuth: false },
    { name: 'Create Recipe', href: '/app/recipes/create', icon: Plus, requireAuth: true },
    { name: 'Favorites', href: '/app/favorites', icon: Heart, requireAuth: true },
    { name: 'Bookmarks', href: '/app/bookmarks', icon: Bookmark, requireAuth: true },
  ]

  const userMenuItems = [
    { name: 'Profile', href: '/app/profile', icon: Settings },
    { name: 'Favorites', href: '/app/favorites', icon: Heart },
    { name: 'Bookmarks', href: '/app/bookmarks', icon: Bookmark },
  ]

  const isActivePath = (path: string) => {
    if (path === '/') return location.pathname === '/'
    // Exact match for specific paths to prevent multiple active states
    if (path === '/app/recipes') return location.pathname === '/app/recipes'
    if (path === '/app/recipes/create') return location.pathname === '/app/recipes/create'
    // For other paths, use exact match
    return location.pathname === path
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${isScrolled
          ? 'backdrop-blur-xl bg-white/80 dark:bg-white/5 shadow-lg'
          : 'bg-gradient-to-r from-white/95 via-white/90 to-white/95 dark:from-secondary-900 dark:via-secondary-900 dark:to-secondary-900 backdrop-blur-md'
          }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Enhanced Logo */}
            <Link
              to="/"
              className="group flex items-center space-x-3 text-xl font-bold transition-all duration-300 hover:scale-105"
              onClick={closeMobileMenu}
            >
              <div className={`relative p-2 rounded-xl transition-all duration-500 transform ${isScrolled
                ? 'bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg'
                : 'bg-gradient-to-br from-primary-400 to-primary-500 group-hover:shadow-xl group-hover:from-primary-500 group-hover:to-primary-600'
                }`}>
                <ChefHat className={`w-6 h-6 text-white transition-transform duration-300 ${isScrolled ? 'rotate-6' : 'group-hover:rotate-12'
                  }`} />
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
              </div>
              <div className="flex flex-col">
                <span className={`text-xl font-bold transition-colors duration-300 ${isScrolled
                  ? 'text-secondary-900 dark:text-white'
                  : 'text-secondary-800 dark:text-white'
                  }`}>
                  Recipe Manager
                </span>
                <span className="text-xs text-primary-500 dark:text-primary-400 font-medium opacity-80">
                  Cook • Share • Discover
                </span>
              </div>
            </Link>

            {/* Enhanced Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems.filter(item => !item.requireAuth || stableAuthState).map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group relative flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-xl overflow-hidden transition-all duration-300 ${isActivePath(item.href)
                    ? 'text-primary-600 dark:text-primary-300'
                    : isScrolled
                      ? 'text-secondary-900 dark:text-secondary-300 hover:bg-black/5 dark:hover:bg-white/10'
                      : 'text-secondary-700 dark:text-secondary-300 hover:bg-black/5 dark:hover:bg-white/10'
                    }`}
                >
                  {isActivePath(item.href) && (
                    <div className="absolute inset-0 rounded-xl nav-active-overlay"></div>
                  )}
                  <item.icon
                    className={`w-4 h-4 transition-all duration-300 relative z-10 ${isActivePath(item.href)
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'group-hover:scale-110'
                      }`}
                  />
                  <span className="whitespace-nowrap relative z-10">{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Enhanced Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Theme Controls Group */}
              <div className="flex items-center space-x-0.5 p-0.5 rounded-xl nav-active-overlay">
                <ThemeToggle
                  variant="minimal"
                  size="sm"
                  className="p-1.5 rounded-lg transition-all duration-300 text-secondary-700 dark:text-secondary-300 hover:bg-black/10 dark:hover:bg-white/20"
                />
                <div className="relative" ref={themeMenuRef}>
                  <button
                    onClick={toggleThemeMenu}
                    aria-label="Select color theme"
                    className={`relative p-2 rounded-lg transition-all duration-300 ${isThemeMenuOpen
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-secondary-700 dark:text-secondary-300 hover:bg-black/10 dark:hover:bg-white/20'
                      }`}
                  >
                    {isThemeMenuOpen && (
                      <div className="absolute inset-0 rounded-lg nav-active-overlay"></div>
                    )}
                    <Palette className="w-4 h-4 relative z-10" />
                  </button>
                  {isThemeMenuOpen && (
                    <div
                      className="absolute top-full right-0 mt-2 w-96 glass-effect rounded-xl shadow-xl animate-scale-in z-50 p-1"
                    >
                      <div className="p-1">
                        <h4 className="text-sm font-semibold text-secondary-600 dark:text-secondary-400 px-2 mb-1">Display Mode</h4>
                        <ThemeToggle variant="button" size="sm" className="w-full" />
                      </div>

                      <div className="border-t border-secondary-200 dark:border-secondary-700 my-1"></div>

                      <div className="p-1">
                        <h3 className="text-sm font-semibold text-secondary-900 dark:text-white mb-2 px-1">Choose Your Theme</h3>
                        <ThemeSelector variant="grid" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Auth Section */}
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={toggleUserMenu}
                    className={`group relative flex items-center space-x-3 p-2 rounded-xl transition-all duration-300 ${!isUserMenuOpen && 'hover:bg-black/5 dark:hover:bg-white/10'
                      }`}
                    aria-expanded={isUserMenuOpen}
                  >
                    {isUserMenuOpen && (
                      <div className="absolute inset-0 rounded-xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/20 backdrop-blur-sm"></div>
                    )}
                    <div className={`relative z-10 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isUserMenuOpen
                      ? 'bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg scale-105'
                      : 'bg-gradient-to-br from-primary-400 to-primary-500 group-hover:shadow-lg group-hover:scale-105'
                      }`}>
                      <User className="w-5 h-5 text-white" />
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
                    </div>
                    <div className="hidden xl:block text-left relative z-10">
                      <p className={`text-sm font-semibold transition-colors duration-300 ${isScrolled ? 'text-secondary-900 dark:text-white' : 'text-secondary-900 dark:text-white'
                        }`}>
                        {user?.name || 'User'}
                      </p>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400">
                        View Profile
                      </p>
                    </div>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-secondary-800 backdrop-blur-xl rounded-2xl shadow-2xl py-2 z-50 border border-secondary-200/60 dark:border-secondary-700 animate-fade-in">
                      <div className="px-4 py-3 border-b border-secondary-200/60 dark:border-secondary-700">
                        <p className="text-sm font-semibold text-secondary-900 dark:text-white">
                          {user?.name || 'User'}
                        </p>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400 truncate">
                          {user?.email}
                        </p>
                      </div>
                      <div className="py-1">
                        {userMenuItems.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="flex items-center px-4 py-2.5 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100/80 dark:hover:bg-secondary-700 transition-all duration-200"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <item.icon className="w-4 h-4 mr-3 text-secondary-500 dark:text-secondary-400" />
                            <span>{item.name}</span>
                          </Link>
                        ))}
                      </div>
                      <div className="border-t border-secondary-200/60 dark:border-secondary-700 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/40 transition-all duration-200"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login">
                  <Button variant="primary" size="sm" className="whitespace-nowrap">Sign In</Button>
                </Link>
              )}
            </div>

            {/* Mobile Actions and Menu Toggle */}
            <div className="lg:hidden flex items-center space-x-2">
              <ThemeToggle
                variant="minimal"
                size="sm"
                className="w-9 h-9 p-1.5 rounded-lg text-secondary-700 dark:text-secondary-300 hover:bg-black/5 dark:hover:bg-white/10"
              />
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-secondary-700 dark:text-secondary-300 hover:bg-black/5 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <X className="block h-7 w-7" aria-hidden="true" />
                ) : (
                  <Menu className="block h-7 w-7" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            id="mobile-menu"
            className="lg:hidden absolute top-full left-0 right-0 w-full bg-white dark:bg-secondary-900 shadow-lg animate-slide-up z-40 max-h-[calc(100vh-5rem)] overflow-y-auto"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigationItems.filter(item => !item.requireAuth || stableAuthState).map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-3 text-base font-medium rounded-md transition-all duration-200 ${isActivePath(item.href)
                    ? 'text-primary-600 dark:text-primary-300 bg-primary-100/50 dark:bg-primary-500/10'
                    : 'text-secondary-800 dark:text-secondary-200 hover:bg-secondary-200/40 dark:hover:bg-secondary-800/60'
                    }`}
                  onClick={closeMobileMenu}
                >
                  <item.icon className={`w-5 h-5 mr-3 transition-all duration-300 ${isActivePath(item.href) ? '' : 'group-hover:scale-110'
                    }`} />
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="pt-4 pb-3 relative">
              {/* Simple visible divider */}
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

              {isAuthenticated ? (
                <>
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-secondary-800 dark:text-white">
                        {user?.name || 'User'}
                      </div>
                      <div className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                        {user?.email}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 px-2 space-y-1">
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="block rounded-md px-3 py-3 text-base font-medium text-secondary-700 dark:text-secondary-300 hover:bg-secondary-200/40 dark:hover:bg-secondary-800/60"
                        onClick={closeMobileMenu}
                      >
                        <div className="flex items-center">
                          <item.icon className="w-5 h-5 mr-3 text-secondary-500 dark:text-secondary-400" />
                          <span>{item.name}</span>
                        </div>
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block rounded-md px-3 py-3 text-base font-medium text-secondary-700 dark:text-secondary-300 hover:bg-secondary-200/40 dark:hover:bg-secondary-800/60"
                    >
                      <div className="flex items-center">
                        <LogOut className="w-5 h-5 mr-3 text-secondary-500 dark:text-secondary-400" />
                        <span>Log Out</span>
                      </div>
                    </button>
                  </div>
                </>
              ) : (
                <div className="px-5">
                  <Link to="/login" onClick={closeMobileMenu}>
                    <Button variant="primary" className="w-full">Sign In</Button>
                  </Link>
                </div>
              )}
            </div>
            <div className="p-4 relative">
              {/* Simple visible divider */}
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

              <h3 className="text-sm font-semibold text-secondary-900 dark:text-white mb-2 px-1">Choose Your Theme</h3>
              <ThemeSelector variant="grid" />
            </div>
          </div>
        )}
      </header>
      <div className="h-20" /> {/* Spacer for the fixed header */}
    </>
  )
}

export default Header