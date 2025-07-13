/**
 * 404 Not Found page
 * Professional error page with helpful navigation and suggestions
 */

import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Home, Search, ChefHat, ArrowLeft, HelpCircle } from 'lucide-react'

// UI Components
import { Card, Button } from '@/components/ui'

const NotFound: React.FC = () => {
  const navigate = useNavigate()

  const suggestions = [
    {
      title: 'Browse Recipes',
      description: 'Discover amazing recipes from our community',
      icon: ChefHat,
      href: '/recipes',
      color: 'text-primary-600 dark:text-primary-400'
    },
    {
      title: 'Search Recipes',
      description: 'Find specific recipes or ingredients',
      icon: Search,
      href: '/recipes?search=',
      color: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      title: 'Go Home',
      description: 'Return to the main page',
      icon: Home,
      href: '/',
      color: 'text-primary-600 dark:text-primary-400'
    }
  ]

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-secondary-200 dark:text-secondary-800 mb-4">404</div>
          <div className="flex items-center justify-center text-secondary-400 dark:text-secondary-600 mb-4">
            <HelpCircle className="w-16 h-16" />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-lg text-secondary-600 dark:text-secondary-400 mb-2">
            The page you're looking for doesn't exist or may have been moved.
          </p>
          <p className="text-secondary-500 dark:text-secondary-500">
            Don't worry, let's help you find what you're looking for!
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Button
              onClick={() => navigate(-1)}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>

            <Link to="/">
              <Button className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Home Page
              </Button>
            </Link>
          </div>
        </div>

        {/* Helpful Suggestions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {suggestions.map((suggestion, index) => {
            const Icon = suggestion.icon
            return (
              <Link key={index} to={suggestion.href}>
                <Card
                  hover
                  clickable
                  className="p-6 h-full transition-all duration-200 hover:scale-105"
                >
                  <div className="flex flex-col items-center text-center">
                    <Icon className={`w-12 h-12 mb-3 ${suggestion.color}`} />
                    <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                      {suggestion.title}
                    </h3>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      {suggestion.description}
                    </p>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Additional Help */}
        <div className="text-center text-secondary-500 dark:text-secondary-500">
          <p className="text-sm">
            Still can't find what you're looking for?{' '}
            <Link
              to="/contact"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
            >
              Contact us
            </Link>{' '}
            for help.
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFound