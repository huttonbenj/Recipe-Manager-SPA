/**
 * Header component with navigation, search, and user menu
 * Responsive design with mobile menu and theme integration
 */

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Menu, X, User, Settings, LogOut,
  Heart, Bookmark, ChefHat
} from 'lucide-react'
import { useAuth } from '@/hooks'
import { ThemeToggle, ThemeSelector } from '@/components/ui'

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      setIsUserMenuOpen(false)
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const navigationItems = [
    { name: 'Recipes', href: '/recipes', icon: ChefHat },
    ...(isAuthenticated ? [
      { name: 'Create Recipe', href: '/recipes/create', icon: ChefHat },
      { name: 'Favorites', href: '/favorites', icon: Heart },
      { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
    ] : []),
  ]

  return (
    <header className="bg-white dark:bg-secondary-800 shadow-sm border-b border-secondary-200 dark:border-secondary-700 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-xl font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            onClick={closeMobileMenu}
          >
            <span className="text-2xl">🍳</span>
            <span className="hidden sm:inline">Recipe Manager</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center space-x-1 text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme controls */}
            <div className="relative">
              <ThemeToggle
                variant="minimal"
                size="sm"
                className="mr-2"
                onClick={() => setIsThemeMenuOpen(false)}
              />

              <button
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className="flex items-center space-x-1 text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label="Theme options"
                aria-expanded={isThemeMenuOpen}
              >
                <span className="text-sm font-medium">Theme</span>
              </button>

              {isThemeMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-secondary-800 rounded-lg shadow-lg p-4 z-50 border border-secondary-200 dark:border-secondary-700 animate-in fade-in slide-in-from-top-5 duration-200">
                  <ThemeSelector />
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">{user?.name || user?.email?.split('@')[0]}</span>
                </button>

                {/* User dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-secondary-800 rounded-lg shadow-lg py-1 z-50 border border-secondary-200 dark:border-secondary-700 animate-in fade-in slide-in-from-top-5 duration-200">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-2 text-secondary-500 dark:text-secondary-400" />
                      Profile
                    </Link>
                    <Link
                      to="/favorites"
                      className="flex items-center px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Heart className="w-4 h-4 mr-2 text-accent-500 dark:text-accent-400" />
                      Favorites
                    </Link>
                    <Link
                      to="/bookmarks"
                      className="flex items-center px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Bookmark className="w-4 h-4 mr-2 text-primary-500 dark:text-primary-400" />
                      Bookmarks
                    </Link>
                    <div className="border-t border-secondary-200 dark:border-secondary-700 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2 text-secondary-500 dark:text-secondary-400" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-lg transition-colors shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle variant="minimal" size="sm" />
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-secondary-200 dark:border-secondary-700 animate-in slide-in-from-top duration-300">
            <nav className="flex flex-col space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center space-x-2 p-2 text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors"
                    onClick={closeMobileMenu}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Mobile User Actions */}
            <div className="mt-4 pt-4 border-t border-secondary-200 dark:border-secondary-700">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">Theme</h3>
                <ThemeSelector compact />
              </div>

              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 p-2 text-secondary-700 dark:text-secondary-300">
                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">{user?.name || user?.email?.split('@')[0]}</span>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 p-2 text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors"
                    onClick={closeMobileMenu}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/favorites"
                    className="flex items-center space-x-2 p-2 text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors"
                    onClick={closeMobileMenu}
                  >
                    <Heart className="w-4 h-4" />
                    <span>Favorites</span>
                  </Link>
                  <Link
                    to="/bookmarks"
                    className="flex items-center space-x-2 p-2 text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors"
                    onClick={closeMobileMenu}
                  >
                    <Bookmark className="w-4 h-4" />
                    <span>Bookmarks</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full p-2 text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    to="/login"
                    className="block w-full p-2 text-center text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors"
                    onClick={closeMobileMenu}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full p-2 text-center text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-lg transition-colors shadow-sm"
                    onClick={closeMobileMenu}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header