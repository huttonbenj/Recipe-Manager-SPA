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
      <div className="container mx-auto px-4 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand section */}
          <div className="md:col-span-2">
            <Link
              to="/"
              className="text-xl font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="text-2xl">🍳</span>
                <span>Recipe Manager</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-secondary-600 dark:text-secondary-400 max-w-md">
              Discover, create, and share amazing recipes. Your personal culinary companion for
              cooking adventures and recipe management.
            </p>

            {/* Social links */}
            <div className="flex space-x-4 mt-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary-500 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Navigation links */}
          <div>
            <h3 className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Theme and settings */}
          <div>
            <h3 className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 uppercase tracking-wider mb-4">
              Settings
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-2">Display Mode</p>
                <ThemeToggle variant="button" size="sm" />
              </div>
              <div>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-2">Color Theme</p>
                <ThemeSelector compact />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-secondary-200 dark:border-secondary-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-secondary-600 dark:text-secondary-400">
              © {currentYear} Recipe Manager. All rights reserved.
            </div>

            {/* Legal links */}
            <div className="flex space-x-6">
              <Link
                to="/privacy"
                className="text-sm text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-sm text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center"
              >
                Terms of Service
              </Link>
            </div>

            {/* Made with love */}
            <div className="flex items-center text-sm text-secondary-600 dark:text-secondary-400">
              Made with
              <Heart className="w-4 h-4 mx-1 text-accent-500 animate-pulse" />
              and
              <Coffee className="w-4 h-4 ml-1 text-amber-600 dark:text-amber-500" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer