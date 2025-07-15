/**
 * 404 Not Found page
 * Professional error page with helpful navigation and suggestions
 */

import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Home, Search, ChefHat, ArrowLeft, Frown } from 'lucide-react'

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
    },
    {
      title: 'Search Recipes',
      description: 'Find specific recipes or ingredients',
      icon: Search,
      href: '/recipes?search=',
    },
    {
      title: 'Go Home',
      description: 'Return to the main page',
      icon: Home,
      href: '/',
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50/90 via-secondary-50/90 to-primary-100/90 dark:from-secondary-900/90 dark:via-secondary-800/90 dark:to-primary-900/90 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center space-y-12">
        {/* Error Message */}
        <div className="space-y-4">
          <div className="w-24 h-24 mx-auto bg-white/40 dark:bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
            <Frown className="w-16 h-16 text-primary-500" />
          </div>
          <h1 className="text-6xl md:text-8xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-secondary-700 to-secondary-900 dark:from-secondary-300 dark:to-white">
            404
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white">
            Page Not Found
          </h2>
          <p className="text-lg text-secondary-600 dark:text-secondary-400 max-w-xl mx-auto">
            Oops! The page you are looking for does not exist. It might have been moved or deleted.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap justify-center items-center gap-4">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            size="lg"
            leftIcon={<ArrowLeft className="w-5 h-5" />}
          >
            Go Back
          </Button>
          <Link to="/">
            <Button size="lg" leftIcon={<Home className="w-5 h-5" />}>
              Go to Homepage
            </Button>
          </Link>
        </div>

        {/* Helpful Suggestions */}
        <div className="space-y-6 pt-6 border-t border-secondary-200 dark:border-secondary-700/50">
          <h3 className="text-xl font-semibold text-secondary-800 dark:text-secondary-200">
            Here are some helpful links:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {suggestions.map((suggestion, index) => {
              const Icon = suggestion.icon
              return (
                <Link key={index} to={suggestion.href} className="group">
                  <Card className="p-6 h-full text-center transition-all duration-300 border-transparent hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-xl hover:-translate-y-1 bg-white/60 dark:bg-secondary-800/40">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-secondary-700 dark:to-secondary-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      <Icon className="w-8 h-8 text-primary-600 dark:text-primary-300" />
                    </div>
                    <h4 className="text-lg font-bold text-secondary-900 dark:text-white mb-1">
                      {suggestion.title}
                    </h4>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      {suggestion.description}
                    </p>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Additional Help */}
        <div className="text-center text-secondary-600 dark:text-secondary-400">
          <p className="text-sm">
            Still can&apos;t find what you&apos;re looking for?{' '}
            <Link
              to="/contact"
              className="font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
            >
              Contact Us
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFound