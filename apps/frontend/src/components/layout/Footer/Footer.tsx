/**
 * Footer component with navigation links and theme controls
 * Provides consistent footer across all pages with responsive design
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { Github, Heart, Coffee, Mail } from 'lucide-react'
import { ThemeToggle, ThemeSelector } from '@/components/ui'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  const navigationLinks = [
    { name: 'Home', href: '/' },
    { name: 'Recipes', href: '/recipes' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/recipe-manager',
      icon: Github,
    },
    {
      name: 'Email',
      href: 'mailto:contact@recipemanager.com',
      icon: Mail,
    },
  ]

  return (
    <footer className="bg-white dark:bg-secondary-800 border-t border-secondary-200 dark:border-secondary-700 mt-auto">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Brand section */}
          <div className="col-span-1 sm:col-span-2">
            <Link
              to="/"
              className="text-lg sm:text-xl font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl">🍳</span>
                <span>Recipe Manager</span>
              </span>
            </Link>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm lg:text-base text-secondary-600 dark:text-secondary-400 max-w-md">
              Discover, create, and share amazing recipes. Your personal culinary companion for
              cooking adventures and recipe management.
            </p>

            {/* Social links */}
            <div className="flex space-x-3 sm:space-x-4 mt-3 sm:mt-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary-500 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors p-1 rounded-md hover:bg-secondary-100 dark:hover:bg-secondary-700"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Navigation links */}
          <div className="col-span-1">
            <h3 className="text-xs sm:text-sm font-semibold text-secondary-900 dark:text-secondary-100 uppercase tracking-wider mb-2 sm:mb-3 lg:mb-4">
              Navigation
            </h3>
            <ul className="space-y-1 sm:space-y-2 lg:space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors block py-0.5 sm:py-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Theme and settings */}
          <div className="hidden sm:block col-span-1">
            <h3 className="text-xs sm:text-sm font-semibold text-secondary-900 dark:text-secondary-100 uppercase tracking-wider mb-2 sm:mb-3 lg:mb-4">
              Settings
            </h3>
            <div className="space-y-3 sm:space-y-3 lg:space-y-4">
              <div>
                <p className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400 mb-2">Display Mode</p>
                <ThemeToggle
                  variant="button"
                  size="xs"
                  className="w-full sm:w-auto px-3 py-2 text-xs gap-1.5 bg-secondary-100/60 hover:bg-secondary-100/80 dark:bg-white/10 dark:hover:bg-white/20 justify-center sm:justify-start"
                />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400 mb-2">Color Theme</p>
                <div className="flex justify-center sm:justify-start">
                  <ThemeSelector compact />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile settings bar - better placement for mobile */}
        <div className="sm:hidden mt-6 pt-6 border-t border-secondary-200 dark:border-secondary-700">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-xs text-secondary-600 dark:text-secondary-400 mb-2">Display Mode</p>
              <ThemeToggle
                variant="button"
                size="sm"
                className="w-full px-3 py-2.5 text-xs gap-2 bg-secondary-100/60 hover:bg-secondary-100/80 dark:bg-white/10 dark:hover:bg-white/20 justify-center"
              />
            </div>
            <div className="text-center">
              <p className="text-xs text-secondary-600 dark:text-secondary-400 mb-2">Color Theme</p>
              <div className="flex justify-center">
                <ThemeSelector compact />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-secondary-200 dark:border-secondary-700">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 gap-4">
            {/* Copyright */}
            <div className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400 text-center sm:text-left">
              © {currentYear} Recipe Manager. All rights reserved.
            </div>

            {/* Legal links */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 items-center">
              <Link
                to="/privacy"
                className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center py-1"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center py-1"
              >
                Terms of Service
              </Link>
            </div>

            {/* Made with love */}
            <div className="flex items-center text-xs sm:text-sm text-secondary-600 dark:text-secondary-400">
              <span className="hidden sm:inline">Made with</span>
              <span className="sm:hidden">Made with</span>
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 mx-1 text-red-500 animate-pulse" />
              <span className="hidden sm:inline">and</span>
              <Coffee className="w-3 h-3 sm:w-4 sm:h-4 ml-1 text-amber-600 dark:text-amber-500" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer