/**
 * Home page component
 * Main landing page with hero section, featured recipes, and quick actions
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Clock, Users, Star, TrendingUp } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

// UI Components
import { Card, Button } from '@/components/ui'

// Services
import { recipesApi } from '@/services/api/recipes'

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

const Home: React.FC = () => {
  const { user, isAuthenticated, isLoading, token } = useAuth()

  // Debug auth state
  console.log('Home Auth State:', {
    user,
    isAuthenticated,
    isLoading,
    token: token ? 'present' : 'null'
  })

  // Fetch featured recipes from API
  const { data: recipesData, isLoading: recipesLoading } = useQuery({
    queryKey: ['featured-recipes'],
    queryFn: () => recipesApi.getRecipes({ limit: 3, sortBy: 'createdAt', sortOrder: 'desc' }),
  })

  const featuredRecipes = recipesData?.recipes || []

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
                  <Link to="/recipes/create">
                    <Button
                      size="lg"
                      className="bg-white text-primary-700 hover:bg-gray-100 shadow-lg"
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      Create Recipe
                    </Button>
                  </Link>
                  <Link to="/recipes">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="border-2 border-white text-white hover:bg-white hover:text-primary-700"
                    >
                      <Search className="mr-2 h-5 w-5" />
                      Explore Recipes
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register">
                    <Button
                      size="lg"
                      className="bg-white text-primary-700 hover:bg-gray-100 shadow-lg"
                    >
                      Get Started Free
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="border-2 border-white text-white hover:bg-white hover:text-primary-700"
                    >
                      Sign In
                    </Button>
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

          {/* Loading State */}
          {recipesLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, index) => (
                <Card key={index} className="overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Featured Recipes */}
          {!recipesLoading && (
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
                        src={recipe.imageUrl || '/api/placeholder/300/200'}
                        alt={recipe.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Recipe Details */}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                        {recipe.title}
                      </h3>

                      {/* Recipe Description */}
                      {recipe.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {recipe.description}
                        </p>
                      )}

                      {/* Recipe Meta */}
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-4">
                          {recipe.cookTime && (
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {recipe.cookTime}m
                            </div>
                          )}
                          {recipe.servings && (
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {recipe.servings}
                            </div>
                          )}
                        </div>
                        {recipe.difficulty && (
                          <div className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                            {recipe.difficulty}
                          </div>
                        )}
                      </div>

                      {/* Author */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm font-medium text-gray-900">
                            New
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          by {recipe.author?.name || 'Chef'}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* View All Recipes Button */}
          <div className="text-center mt-12">
            <Link to="/recipes">
              <Button size="lg" className="shadow-lg">
                View All Recipes
              </Button>
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