/**
 * Footer component with modern design matching the app's dark theme
 * Provides consistent footer across all pages with responsive design
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { Github, Heart, Coffee, Mail, Instagram, Twitter, ChefHat } from 'lucide-react'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  const navigationLinks = [
    { name: 'Home', href: '/' },
    { name: 'Recipes', href: '/app/recipes' },
    { name: 'Favorites', href: '/app/favorites' },
    { name: 'My Recipes', href: '/app/recipes/create' },
  ]

  const resourceLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
    { name: 'Support', href: '/support' },
  ]

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
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
    {
      name: 'Instagram',
      href: 'https://instagram.com/recipemanager',
      icon: Instagram,
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/recipemanager',
      icon: Twitter,
    },
  ]

  return (
    <footer className="mt-auto bg-secondary-900 text-secondary-300">
      {/* Logo and description */}
      <div className="container mx-auto py-12 px-6 text-center">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary-500">
            <ChefHat className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Recipe Manager</span>
        </Link>

        <p className="mt-4 text-sm text-secondary-400 max-w-md mx-auto">
          Your personal culinary companion for discovering, creating, and sharing amazing recipes.
        </p>

        {/* Social links */}
        <div className="flex justify-center space-x-4 mt-6">
          {socialLinks.map((social) => {
            const Icon = social.icon
            return (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-10 w-10 rounded-full bg-secondary-800 text-secondary-400 hover:text-primary-400 hover:bg-secondary-700 transition-colors"
                aria-label={social.name}
              >
                <Icon className="w-4 h-4" />
              </a>
            )
          })}
        </div>
      </div>

      {/* Horizontal line */}
      <div className="border-t border-secondary-800"></div>

      {/* Links section with card-like sections */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Navigation */}
          <div className="overflow-hidden rounded-lg border border-[#2a3749] bg-[#1e293b] text-center">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-primary-400 mb-4">
                Navigation
              </h3>
              <ul className="space-y-3">
                {navigationLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-secondary-300 hover:text-primary-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Resources */}
          <div className="overflow-hidden rounded-lg border border-[#2a3749] bg-[#1e293b] text-center">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-primary-400 mb-4">
                Resources
              </h3>
              <ul className="space-y-3">
                {resourceLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-secondary-300 hover:text-primary-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Legal */}
          <div className="overflow-hidden rounded-lg border border-[#2a3749] bg-[#1e293b] text-center">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-primary-400 mb-4">
                Legal
              </h3>
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-secondary-300 hover:text-primary-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-secondary-800">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            {/* Made with love */}
            <div className="flex items-center text-xs text-secondary-500">
              <span>Made with</span>
              <Heart className="w-3 h-3 mx-1 text-red-500 animate-pulse" />
              <span>and</span>
              <Coffee className="w-3 h-3 ml-1 text-amber-600" />
            </div>

            {/* Copyright */}
            <div className="text-xs text-secondary-500">
              © {currentYear} Recipe Manager. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer