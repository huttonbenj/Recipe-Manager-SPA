/**
 * Home page component
 * Main landing page with hero section, featured recipes, and quick actions
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Clock, TrendingUp, ChefHat, Heart, Bookmark, ArrowRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

// UI Components
import { Card, Button } from '@/components/ui'
import { RecipeCard } from '@/components/recipe'

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
    color: 'from-primary-500 to-primary-600'
  },
  {
    title: 'Discover Recipes',
    description: 'Explore new flavors',
    icon: Search,
    href: '/recipes',
    color: 'from-emerald-500 to-green-600'
  },
  {
    title: 'Quick Recipes',
    description: 'Ready in 30 minutes',
    icon: Clock,
    href: '/recipes?filter=quick',
    color: 'from-amber-500 to-orange-600'
  },
  {
    title: 'Popular',
    description: 'Community favorites',
    icon: TrendingUp,
    href: '/recipes?filter=popular',
    color: 'from-purple-500 to-violet-600'
  }
]

const Home: React.FC = () => {
  const { user, isAuthenticated } = useAuth()

  // Fetch featured recipes from API
  const { data: recipesData, isLoading: recipesLoading } = useQuery({
    queryKey: ['featured-recipes'],
    queryFn: () => recipesApi.getRecipes({ limit: 3, sortBy: 'createdAt', sortOrder: 'desc' }),
  })

  const featuredRecipes = recipesData?.recipes || []

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-800 dark:to-primary-950"></div>

        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            backgroundSize: '30px 30px'
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-white drop-shadow-md">
              {isAuthenticated ? (
                <>Welcome back, {user?.name?.split(' ')[0] || 'Chef'}!</>
              ) : (
                <>Discover Amazing Recipes</>
              )}
            </h1>
            <p className="text-xl md:text-2xl text-primary-50 mb-8 max-w-3xl mx-auto">
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
                      className="bg-white text-primary-700 hover:bg-primary-50 shadow-lg"
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      Create Recipe
                    </Button>
                  </Link>
                  <Link to="/recipes">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-2 border-white text-white hover:bg-white/10"
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
                      className="bg-white text-primary-700 hover:bg-primary-50 shadow-lg"
                    >
                      Get Started Free
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-2 border-white text-white hover:bg-white/10"
                    >
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Wave shape divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto fill-secondary-50 dark:fill-secondary-900">
            <path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Quick Actions Section - Only for authenticated users */}
      {isAuthenticated && (
        <section className="py-16 bg-white dark:bg-secondary-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
                Quick Actions
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400">
                What would you like to do today?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action) => (
                <Link
                  key={action.title}
                  to={action.href}
                  className="group"
                >
                  <Card
                    className="p-6 text-center h-full hover:shadow-lg border border-secondary-200 dark:border-secondary-700 hover:border-primary-200 dark:hover:border-primary-800 transition-all transform hover:translate-y-[-4px]"
                    variant="default"
                  >
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${action.color} text-white mb-4 group-hover:scale-110 transition-transform shadow-md`}>
                      <action.icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                      {action.title}
                    </h3>
                    <p className="text-secondary-600 dark:text-secondary-400 text-sm">
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
      <section className="py-16 bg-secondary-50 dark:bg-secondary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
                Featured Recipes
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400">
                Discover popular recipes loved by our community
              </p>
            </div>
            <Link to="/recipes" className="flex items-center justify-center sm:justify-start gap-1 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors font-medium">
              View all recipes
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Loading State */}
          {recipesLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, index) => (
                <Card key={index} className="overflow-hidden animate-pulse" variant="bordered" padding="none">
                  <div className="h-48 bg-secondary-300 dark:bg-secondary-700"></div>
                  <div className="p-6">
                    <div className="h-6 bg-secondary-300 dark:bg-secondary-700 rounded mb-2"></div>
                    <div className="h-4 bg-secondary-300 dark:bg-secondary-700 rounded w-3/4 mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-secondary-300 dark:bg-secondary-700 rounded w-1/4"></div>
                      <div className="h-4 bg-secondary-300 dark:bg-secondary-700 rounded w-1/4"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Featured Recipes */}
          {!recipesLoading && featuredRecipes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}

          {/* No recipes state */}
          {!recipesLoading && featuredRecipes.length === 0 && (
            <Card className="text-center p-8 max-w-lg mx-auto">
              <div className="mb-4 text-primary-500 dark:text-primary-400">
                <ChefHat className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                No recipes yet
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                Be the first to create and share a delicious recipe with our community!
              </p>
              <Link to="/recipes/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Recipe
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Why Use Recipe Manager
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400 max-w-3xl mx-auto">
              Our platform makes it easy to discover, create, and share recipes with a community of food lovers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 border border-secondary-200 dark:border-secondary-700">
              <div className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <ChefHat className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                Create & Share
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400">
                Easily create and share your favorite recipes with detailed instructions and beautiful photos.
              </p>
            </Card>

            <Card className="p-6 border border-secondary-200 dark:border-secondary-700">
              <div className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                Save Favorites
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400">
                Bookmark recipes you love and organize them for easy access whenever you need inspiration.
              </p>
            </Card>

            <Card className="p-6 border border-secondary-200 dark:border-secondary-700">
              <div className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Bookmark className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                Save for Later
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400">
                Bookmark recipes to try later and build your personal collection of culinary adventures.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary-50 dark:bg-secondary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-700 dark:to-primary-900 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-12 md:p-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                {isAuthenticated ? 'Ready to cook something amazing?' : 'Join our community today!'}
              </h2>
              <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
                {isAuthenticated
                  ? 'Explore our recipes or share your own culinary creations with the community.'
                  : 'Create an account to save recipes, share your own, and connect with other food enthusiasts.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {isAuthenticated ? (
                  <>
                    <Link to="/recipes/create">
                      <Button
                        size="lg"
                        className="bg-white text-primary-700 hover:bg-primary-50"
                      >
                        Create Recipe
                      </Button>
                    </Link>
                    <Link to="/recipes">
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-2 border-white text-white hover:bg-white/10"
                      >
                        Browse Recipes
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/register">
                      <Button
                        size="lg"
                        className="bg-white text-primary-700 hover:bg-primary-50"
                      >
                        Sign Up Free
                      </Button>
                    </Link>
                    <Link to="/recipes">
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-2 border-white text-white hover:bg-white/10"
                      >
                        Browse Recipes
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home