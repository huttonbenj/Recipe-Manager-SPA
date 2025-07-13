/**
 * Footer component with navigation links and theme controls
 * Provides consistent footer across all pages with responsive design
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { Github, Heart, Coffee } from 'lucide-react'
import { ThemeToggle } from '@/components/ui'

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
  ]

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand section */}
          <div className="md:col-span-2">
            <Link
              to="/"
              className="text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
            >
              Recipe Manager
            </Link>
            <p className="mt-2 text-sm text-gray-600 max-w-md">
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
                    className="text-gray-400 hover:text-gray-600 transition-colors"
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
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Navigation
            </h3>
            <ul className="mt-4 space-y-2">
              {navigationLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Theme and settings */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Settings
            </h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Theme</span>
                <ThemeToggle variant="icon" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-gray-600">
              © {currentYear} Recipe Manager. All rights reserved.
            </div>

            {/* Legal links */}
            <div className="flex space-x-6">
              <Link
                to="/privacy"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Terms of Service
              </Link>
            </div>

            {/* Made with love */}
            <div className="flex items-center text-sm text-gray-600">
              Made with
              <Heart className="w-4 h-4 mx-1 text-red-500" />
              and
              <Coffee className="w-4 h-4 ml-1 text-amber-600" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer