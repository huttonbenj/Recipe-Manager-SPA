/**
 * Header component with navigation, search, and user menu
 * Responsive design with mobile menu and theme integration
 */

import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Menu, X, User, Settings, LogOut,
  Heart, Bookmark, Search, Plus, Palette
} from 'lucide-react'
import { useAuth } from '@/hooks'
import { ThemeToggle, ThemeSelector } from '@/components/ui'
import Button from '@/components/ui/Button'

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const themeMenuRef = useRef<HTMLDivElement>(null)

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
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigationItems = [
    { name: 'Recipes', href: '/recipes', icon: Search },
    ...(isAuthenticated ? [
      { name: 'Create Recipe', href: '/recipes/create', icon: Plus },
      { name: 'Favorites', href: '/favorites', icon: Heart },
      { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
    ] : []),
  ]

  const userMenuItems = [
    { name: 'Profile', href: '/profile', icon: Settings },
    { name: 'Favorites', href: '/favorites', icon: Heart },
    { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
  ]

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-effect shadow-md' : 'bg-white dark:bg-secondary-900 border-b border-transparent'}`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-2 text-xl font-bold transition-colors"
              onClick={closeMobileMenu}
            >
              <span className={`text-3xl transition-transform duration-300 ${isScrolled ? 'rotate-0' : 'rotate-12'}`}>🍳</span>
              <span className={`hidden sm:inline ${isScrolled ? 'text-primary-600 dark:text-primary-400' : 'text-secondary-900 dark:text-white'}`}>
                Recipe Manager
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 text-sm font-medium transition-colors ${isScrolled ? 'text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400' : 'text-secondary-700 dark:text-white/80 hover:text-secondary-900 dark:hover:text-white'}`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Desktop User Menu & Auth */}
            <div className="hidden md:flex items-center space-x-2">
              <ThemeToggle
                variant="minimal"
                size="sm"
                className={`${isScrolled ? 'text-secondary-600 dark:text-secondary-400' : 'text-secondary-600 dark:text-white/80 hover:text-secondary-800 dark:hover:text-white'}`}
              />
              <div className="relative" ref={themeMenuRef}>
                <button
                  onClick={toggleThemeMenu}
                  aria-label="Select color theme"
                  className={`p-2 rounded-full transition-colors ${isScrolled ? 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-200 dark:hover:bg-secondary-800' : 'text-secondary-600 dark:text-white/80 hover:text-secondary-800 dark:hover:text-white hover:bg-secondary-100 dark:hover:bg-white/10'}`}
                >
                  <Palette className="w-5 h-5" />
                </button>
                {isThemeMenuOpen && (
                  <div className="absolute right-0 mt-3 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-secondary-800 rounded-lg shadow-xl p-6 z-50 border border-secondary-200 dark:border-secondary-700 animate-in fade-in slide-in-from-top-5 duration-200">
                    <ThemeSelector variant="grid" />
                  </div>
                )}
              </div>
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-2"
                    aria-expanded={isUserMenuOpen}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isScrolled ? 'bg-primary-100 dark:bg-primary-800' : 'bg-secondary-200 dark:bg-white/20'}`}>
                      <User className={`w-5 h-5 ${isScrolled ? 'text-primary-600 dark:text-primary-100' : 'text-secondary-700 dark:text-white'}`} />
                    </div>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-secondary-800 rounded-lg shadow-xl py-2 z-50 border border-secondary-200 dark:border-secondary-700 animate-in fade-in slide-in-from-top-5 duration-200">
                      <div className="px-4 py-3 border-b border-secondary-200 dark:border-secondary-700">
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
                            className="flex items-center px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <item.icon className="w-4 h-4 mr-3 text-secondary-500" />
                            <span>{item.name}</span>
                          </Link>
                        ))}
                      </div>
                      <div className="border-t border-secondary-200 dark:border-secondary-700 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-3 text-secondary-500" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login">
                    <Button variant={isScrolled ? 'outline' : 'ghost'}>
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant={isScrolled ? 'primary' : 'primary'}>
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <ThemeToggle
                variant="minimal"
                className={`${isScrolled ? 'text-secondary-600 dark:text-secondary-400' : 'text-secondary-600 dark:text-white/80 hover:text-secondary-800 dark:hover:text-white'}`}
              />
              <button
                onClick={toggleMobileMenu}
                className={`p-2 rounded-md transition-colors ${isScrolled ? 'text-secondary-700' : 'text-secondary-700 dark:text-white'}`}
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 dark:bg-secondary-900/95 backdrop-blur-lg absolute top-full left-0 right-0 py-4 border-t border-secondary-200 dark:border-secondary-700 animate-in slide-in-from-top duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="flex flex-col space-y-2 mb-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center space-x-3 p-3 text-base font-medium text-secondary-800 dark:text-secondary-200 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-lg transition-colors"
                    onClick={closeMobileMenu}
                  >
                    <item.icon className="w-5 h-5 text-primary-500" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>

              <div className="pt-4 border-t border-secondary-200 dark:border-secondary-700">
                <h3 className="px-3 text-sm font-semibold text-secondary-600 dark:text-secondary-400 mb-3">Theme</h3>
                <div className="px-3">
                  <ThemeSelector variant="grid" />
                </div>
              </div>

              {isAuthenticated ? (
                <div className="pt-4 border-t border-secondary-200 dark:border-secondary-700">
                  <div className="flex items-center space-x-3 p-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary-600 dark:text-primary-100" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-secondary-900 dark:text-white">
                        {user?.name || 'User'}
                      </p>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  {userMenuItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="flex items-center space-x-3 p-3 text-base font-medium text-secondary-800 dark:text-secondary-200 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-lg transition-colors"
                      onClick={closeMobileMenu}
                    >
                      <item.icon className="w-5 h-5 text-primary-500" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                  <button
                    onClick={() => { handleLogout(); closeMobileMenu(); }}
                    className="flex items-center w-full space-x-3 p-3 text-base font-medium text-secondary-800 dark:text-secondary-200 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-lg transition-colors mt-2"
                  >
                    <LogOut className="w-5 h-5 text-primary-500" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 pt-4 border-t border-secondary-200 dark:border-secondary-700">
                  <Link to="/login" className="flex-1">
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link to="/register" className="flex-1">
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  )
}

export default Header