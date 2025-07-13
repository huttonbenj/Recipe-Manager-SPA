/**
 * Home page component
 * Main landing page with hero section, featured recipes, and quick actions
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Clock, Users, Star, TrendingUp } from 'lucide-react'

// UI Components
import Card from '@/components/ui/Card'

// Hooks
import { useAuth } from '@/hooks/useAuth'

/**
 * Quick action items configuration
 */
const quickActions = [
  {
    title: 'Create Recipe',
    description: 'Share your culinary creation',
    icon: Plus,
    href: '/recipes/create',
    color: 'bg-primary-500 hover:bg-primary-600'
  },
  {
    title: 'Discover Recipes',
    description: 'Explore new flavors',
    icon: Search,
    href: '/recipes',
    color: 'bg-green-500 hover:bg-green-600'
  },
  {
    title: 'Quick Recipes',
    description: 'Ready in 30 minutes',
    icon: Clock,
    href: '/recipes?filter=quick',
    color: 'bg-orange-500 hover:bg-orange-600'
  },
  {
    title: 'Popular',
    description: 'Community favorites',
    icon: TrendingUp,
    href: '/recipes?filter=popular',
    color: 'bg-purple-500 hover:bg-purple-600'
  }
]

/**
 * Sample featured recipes (in real app, these would come from API)
 */
const featuredRecipes = [
  {
    id: 1,
    title: 'Classic Beef Tacos',
    image: '/api/placeholder/300/200',
    cookTime: '25 min',
    difficulty: 'Easy',
    rating: 4.8,
    reviews: 156
  },
  {
    id: 2,
    title: 'Mediterranean Quinoa Bowl',
    image: '/api/placeholder/300/200',
    cookTime: '20 min',
    difficulty: 'Easy',
    rating: 4.6,
    reviews: 89
  },
  {
    id: 3,
    title: 'Chocolate Chip Cookies',
    image: '/api/placeholder/300/200',
    cookTime: '15 min',
    difficulty: 'Easy',
    rating: 4.9,
    reviews: 234
  }
]

const Home: React.FC = () => {
  const { user, isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
              {isAuthenticated ? (
                <>Welcome back, {user?.name?.split(' ')[0] || 'Chef'}!</>
              ) : (
                <>Discover Amazing Recipes</>
              )}
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              {isAuthenticated ? (
                'Ready to create something delicious? Explore new recipes, share your favorites, and connect with fellow food enthusiasts.'
              ) : (
                'Join our community of food lovers. Create, discover, and share recipes that bring people together around great food.'
              )}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/recipes/create"
                    className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium rounded-lg bg-white text-primary-700 hover:bg-gray-100 shadow-lg transition-colors"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Create Recipe
                  </Link>
                  <Link
                    to="/recipes"
                    className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium rounded-lg border-2 border-white text-white hover:bg-white hover:text-primary-700 transition-colors"
                  >
                    <Search className="mr-2 h-5 w-5" />
                    Explore Recipes
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium rounded-lg bg-white text-primary-700 hover:bg-gray-100 shadow-lg transition-colors"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium rounded-lg border-2 border-white text-white hover:bg-white hover:text-primary-700 transition-colors"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Section - Only for authenticated users */}
      {isAuthenticated && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <p className="text-gray-600">
                What would you like to do today?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action) => (
                <Link
                  key={action.title}
                  to={action.href}
                  className="group transition-transform hover:scale-105"
                >
                  <Card className="p-6 text-center hover:shadow-lg border-2 border-transparent hover:border-primary-200 transition-all">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${action.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                      <action.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {action.description}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Recipes Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Recipes
            </h2>
            <p className="text-gray-600">
              Discover popular recipes loved by our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRecipes.map((recipe) => (
              <Link
                key={recipe.id}
                to={`/recipes/${recipe.id}`}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  {/* Recipe Image */}
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Recipe Details */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {recipe.title}
                    </h3>

                    {/* Recipe Meta */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {recipe.cookTime}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {recipe.difficulty}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-sm font-medium text-gray-900">
                          {recipe.rating}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">
                          ({recipe.reviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* View All Recipes Button */}
          <div className="text-center mt-12">
            <Link
              to="/recipes"
              className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors shadow-lg"
            >
              View All Recipes
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section - Only for non-authenticated users */}
      {!isAuthenticated && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Join Our Growing Community
              </h2>
              <p className="text-gray-600">
                Thousands of home cooks sharing their favorite recipes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  10,000+
                </div>
                <div className="text-gray-600">
                  Recipes Shared
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  5,000+
                </div>
                <div className="text-gray-600">
                  Active Cooks
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  50,000+
                </div>
                <div className="text-gray-600">
                  Recipe Reviews
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default Home