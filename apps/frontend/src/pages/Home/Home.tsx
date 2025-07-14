/**
 * Home page component
 * Main landing page with hero section, featured recipes, and quick actions
 */

import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Clock, TrendingUp, ChefHat, Heart, Bookmark, ArrowRight, Sparkles, Utensils, Users, User } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

// UI Components
import { Card, Button, ThemeSelector } from '@/components/ui'
import { RecipeCard } from '@/components/recipe'

// Services
import { recipesApi } from '@/services/api/recipes'

// Hooks
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'

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
    color: 'from-emerald-500 to-emerald-600'
  },
  {
    title: 'Quick Recipes',
    description: 'Ready in 30 minutes',
    icon: Clock,
    href: '/recipes?filter=quick',
    color: 'from-amber-500 to-amber-600'
  },
  {
    title: 'Popular',
    description: 'Community favorites',
    icon: TrendingUp,
    href: '/recipes?filter=popular',
    color: 'from-purple-500 to-purple-600'
  }
]

const Home: React.FC = () => {
  const { user, isAuthenticated } = useAuth()
  const { theme } = useTheme()
  const [showThemeAnimation, setShowThemeAnimation] = useState(false)
  const [isPageLoaded, setIsPageLoaded] = useState(false)

  // Debug authentication state changes
  useEffect(() => {
    console.log('[Home] Auth state changed:', { isAuthenticated, hasUser: !!user })
  }, [isAuthenticated, user])

  // Refs for scroll animations
  const quickActionsRef = useRef<HTMLDivElement>(null)
  const themeShowcaseRef = useRef<HTMLDivElement>(null)
  const featuredRecipesRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  // Fade in elements on load
  useEffect(() => {
    const pageLoadTimer = setTimeout(() => {
      setIsPageLoaded(true)
    }, 100) // Small delay to prevent initial animation glitches

    const timer = setTimeout(() => {
      setShowThemeAnimation(true)
    }, 500)

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    const sections = [quickActionsRef, themeShowcaseRef, featuredRecipesRef, featuresRef, ctaRef]
    sections.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current)
      }
    })

    return () => {
      clearTimeout(pageLoadTimer)
      clearTimeout(timer)
      sections.forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current)
        }
      })
    }
  }, [])

  // Fetch featured recipes from API
  const { data: recipesData, isLoading: recipesLoading } = useQuery({
    queryKey: ['featured-recipes'],
    queryFn: () => recipesApi.getRecipes({ limit: 3, sortBy: 'createdAt', sortOrder: 'desc' }),
  })

  const featuredRecipes = recipesData?.recipes || []

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      {/* Hero Section V3: Elegant Gradient Waves */}
      <section className={`relative h-screen flex items-center overflow-hidden transition-opacity duration-500 ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-primary-700 to-secondary-900 dark:from-primary-800 dark:via-primary-900 dark:to-secondary-950"></div>

        {/* Floating Icons & Texture */}
        <div className="absolute inset-0 z-10 opacity-10">
          <div className={`absolute inset-0 ${isPageLoaded ? 'animate-slow-pan' : ''}`} style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            backgroundSize: '40px 40px',
          }}></div>
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          <div className={`absolute top-1/4 left-[10%] opacity-20 hidden sm:block ${isPageLoaded ? 'animate-float-slow' : ''}`}>
            <Utensils className="w-16 h-16 md:w-24 md:h-24 text-white" />
          </div>
          <div className={`absolute top-1/3 right-[15%] opacity-20 hidden sm:block ${isPageLoaded ? 'animate-float-medium' : ''}`}>
            <ChefHat className="w-12 h-12 md:w-16 md:h-16 text-white" />
          </div>
          <div className={`absolute bottom-1/4 left-[20%] opacity-20 hidden sm:block ${isPageLoaded ? 'animate-float-fast' : ''}`}>
            <Heart className="w-8 h-8 md:w-12 md:h-12 text-white" />
          </div>
          <div className={`absolute top-[15%] right-[30%] opacity-15 hidden md:block ${isPageLoaded ? 'animate-float-medium' : ''}`}>
            <Search className="w-14 h-14 lg:w-20 lg:h-20 text-white" />
          </div>
          <div className={`absolute bottom-[30%] right-[25%] opacity-15 hidden md:block ${isPageLoaded ? 'animate-float-slow' : ''}`}>
            <Bookmark className="w-10 h-10 lg:w-14 lg:h-14 text-white" />
          </div>
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
          <div className="text-center md:text-left">
            <div className={`inline-flex items-center mb-4 sm:mb-6 bg-white/10 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-primary-50 ${isPageLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
              <span className="text-xs sm:text-sm font-medium">{isAuthenticated ? 'Welcome back to your kitchen' : 'Discover, Cook, Share'}</span>
            </div>

            <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 sm:mb-6 text-white drop-shadow-md ${isPageLoaded ? 'animate-slide-up' : 'opacity-0'}`}>
              {isAuthenticated ? (
                <>Welcome back, {user?.name?.split(' ')[0] || 'Chef'}!</>
              ) : (
                <>Craft Culinary<br />Masterpieces</>
              )}
            </h1>
            <p className={`text-base sm:text-lg md:text-xl lg:text-2xl text-primary-100 mb-6 sm:mb-8 max-w-3xl ${isPageLoaded ? 'animate-slide-up-delay' : 'opacity-0'}`}>
              {isAuthenticated ? (
                'Your personal cookbook is ready. Explore new recipes or add your own creations.'
              ) : (
                'Join a vibrant community of food lovers. Find inspiration for your next meal and share your favorite recipes.'
              )}
            </p>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start ${isPageLoaded ? 'animate-slide-up-delay-2' : 'opacity-0'}`}>
              {isAuthenticated ? (
                <>
                  <Link to="/recipes/create">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto"
                      leftIcon={<Plus className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />}>
                      Create Recipe
                    </Button>
                  </Link>
                  <Link to="/recipes">
                    <Button
                      variant="outline-white"
                      size="lg"
                      className="w-full sm:w-auto mt-2 sm:mt-0"
                      leftIcon={<Search className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />}>
                      Explore Recipes
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto"
                      leftIcon={<User className="mr-2 h-4 w-4" />}>
                      Get Started For Free
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button
                      variant="outline-white"
                      size="lg"
                      className="w-full sm:w-auto mt-2 sm:mt-0"
                      leftIcon={<Search className="mr-2 h-4 w-4" />}>
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Animated Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full h-48 sm:h-64 md:h-96 pointer-events-none">
          <svg className="absolute bottom-0 left-0 w-full h-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="var(--color-secondary-50)" fillOpacity="0.2" d="M0,160L48,170.7C96,181,192,203,288,208C384,213,480,203,576,176C672,149,768,107,864,112C960,117,1056,171,1152,192C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
          <svg className="absolute bottom-0 left-0 w-full h-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="var(--color-secondary-50)" fillOpacity="0.5" d="M0,224L48,208C96,192,192,160,288,165.3C384,171,480,213,576,240C672,267,768,277,864,256C960,235,1056,181,1152,160C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
          <svg className="absolute bottom-0 left-0 w-full h-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path className="fill-secondary-50 dark:fill-secondary-900" d="M0,288L48,272C96,256,192,224,288,218.7C384,213,480,235,576,245.3C672,256,768,256,864,240C960,224,1056,192,1152,186.7C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Content sections with auth-based re-rendering */}
      <div>
        {/* Quick Actions Section - Only for authenticated users */}
        {isAuthenticated && (
          <>
            {console.log('[Home] Rendering Quick Actions section')}
            <section ref={quickActionsRef} className="section-reveal py-10 sm:py-12 md:py-16 bg-white dark:bg-secondary-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8 sm:mb-12">
                  <div className="inline-flex items-center justify-center mb-3 sm:mb-4 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border badge-theme-section">
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                    <span className="text-xs sm:text-sm font-medium">Quick Actions</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-2 sm:mb-4">
                    What would you like to do today?
                  </h2>
                  <p className="text-sm sm:text-base text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
                    Jump right into your favorite activities with these quick shortcuts
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {quickActions.map((action, index) => (
                    <Link
                      key={action.title}
                      to={action.href}
                      className="group"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <Card
                        className="p-4 sm:p-6 text-center h-full hover:shadow-lg border border-secondary-200 dark:border-secondary-700 hover:border-primary-200 dark:hover:border-primary-800 transition-all transform hover:translate-y-[-8px] duration-300"
                        variant="default"
                      >
                        <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br ${action.color} text-white mb-3 sm:mb-4 group-hover:scale-110 transition-transform shadow-md`}>
                          <action.icon className="h-5 w-5 sm:h-7 sm:w-7" />
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-1 sm:mb-2">
                          {action.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400">
                          {action.description}
                        </p>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {/* Theme Showcase Section - Only for unauthenticated users */}
        {!isAuthenticated && (
          <>
            {console.log('[Home] Rendering Theme Showcase section')}
            <section ref={themeShowcaseRef} className="section-reveal py-10 sm:py-12 md:py-16 bg-secondary-50 dark:bg-secondary-900 overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
                  <div className="md:w-1/2 space-y-4 sm:space-y-6">
                    <div className="inline-flex items-center backdrop-blur-sm px-3 py-1 rounded-full border badge-theme-section">
                      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                      <span className="text-xs sm:text-sm font-medium">Personalization</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-secondary-100">
                      Make the app your own
                    </h2>
                    <p className="text-sm sm:text-base text-secondary-600 dark:text-secondary-400">
                      Customize your experience with different color themes that match your style and preferences.
                    </p>
                    <div className="pt-2 sm:pt-4">
                      <ThemeSelector variant="grid" />
                    </div>
                  </div>

                  <div className="md:w-1/2 relative">
                    <div className={`
                      transform transition-all duration-700 ease-in-out
                      ${showThemeAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
                    `}>
                      <div className="relative mx-auto max-w-xs sm:max-w-sm">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-primary-300/20 dark:from-primary-500/10 dark:to-primary-700/10 rounded-2xl transform -rotate-6"></div>
                        <Card className="relative p-4 sm:p-6 shadow-xl border-2 border-primary-200 dark:border-primary-800">
                          <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <h3 className="font-semibold text-sm sm:text-base text-primary-700 dark:text-primary-300">Current Theme</h3>
                            <div className="px-2 sm:px-3 py-0.5 sm:py-1 bg-primary-100 dark:bg-primary-900/30 rounded-full text-xs font-medium text-primary-700 dark:text-primary-300">
                              {theme.colorTheme.charAt(0).toUpperCase() + theme.colorTheme.slice(1)}
                            </div>
                          </div>
                          <div className="space-y-2 sm:space-y-4">
                            <div className="h-3 sm:h-4 bg-primary-200 dark:bg-primary-700 rounded-full w-3/4"></div>
                            <div className="h-3 sm:h-4 bg-primary-200 dark:bg-primary-700 rounded-full"></div>
                            <div className="h-3 sm:h-4 bg-primary-200 dark:bg-primary-700 rounded-full w-5/6"></div>
                          </div>
                          <div className="mt-4 sm:mt-6 flex gap-2 sm:gap-3">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary-500"></div>
                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-secondary-500"></div>
                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-accent-500"></div>
                          </div>
                        </Card>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Featured Recipes Section */}
        <section ref={featuredRecipesRef} className={`section-reveal py-10 sm:py-12 md:py-16 ${!isAuthenticated ? 'bg-white dark:bg-secondary-800' : 'bg-secondary-50 dark:bg-secondary-900'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 sm:mb-12">
              <div className="text-center sm:text-left mb-4 sm:mb-0">
                <div className="inline-flex items-center mb-3 sm:mb-4 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border badge-theme-section">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  <span className="text-xs sm:text-sm font-medium">Popular Recipes</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
                  Featured Recipes
                </h2>
                <p className="text-sm sm:text-base text-secondary-600 dark:text-secondary-400">
                  Discover popular recipes loved by our community
                </p>
              </div>
              <Link to="/recipes" className="group flex items-center justify-center sm:justify-start gap-1 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors font-medium text-sm sm:text-base">
                View all recipes
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Loading State */}
            {recipesLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {[...Array(3)].map((_, index) => (
                  <Card key={index} className="overflow-hidden animate-pulse" variant="bordered" padding="none">
                    <div className="skeleton-image h-40 sm:h-48"></div>
                    <div className="p-4 sm:p-6">
                      <div className="skeleton-title mb-2"></div>
                      <div className="skeleton-text w-3/4 mb-4"></div>
                      <div className="flex justify-between">
                        <div className="skeleton-text w-1/4"></div>
                        <div className="skeleton-text w-1/4"></div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Featured Recipes */}
            {!recipesLoading && featuredRecipes.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {featuredRecipes.map((recipe, index) => (
                  <div key={recipe.id} className="transform transition-all duration-500 hover:translate-y-[-8px]" style={{ animationDelay: `${index * 150}ms` }}>
                    <RecipeCard recipe={recipe} />
                  </div>
                ))}
              </div>
            )}

            {/* No recipes state */}
            {!recipesLoading && featuredRecipes.length === 0 && (
              <Card className="text-center p-6 sm:p-8 max-w-md mx-auto border border-secondary-200 dark:border-secondary-700 shadow-lg">
                <div className="mb-4 sm:mb-6 text-primary-500 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 rounded-full p-3 sm:p-4 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto">
                  <ChefHat className="h-8 w-8 sm:h-10 sm:w-10" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2 sm:mb-3">
                  No recipes yet
                </h3>
                <p className="text-sm sm:text-base text-secondary-600 dark:text-secondary-400 mb-4 sm:mb-6">
                  Be the first to create and share a delicious recipe with our community!
                </p>
                <Link to="/recipes/create">
                  <Button className="shadow-md" leftIcon={<Plus className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />}>Create Recipe</Button>
                </Link>
              </Card>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} className={`section-reveal py-10 sm:py-12 md:py-16 ${!isAuthenticated ? 'bg-secondary-50 dark:bg-secondary-900' : 'bg-white dark:bg-secondary-800'} relative overflow-hidden`}>
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary-100 dark:bg-primary-900/20 rounded-bl-full opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary-100 dark:bg-primary-900/20 rounded-tr-full opacity-50"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-10 sm:mb-16">
              <div className="inline-flex items-center justify-center mb-3 sm:mb-4 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border badge-theme-section">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                <span className="text-xs sm:text-sm font-medium">Why Choose Us</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-2 sm:mb-4">
                Why Use Recipe Manager
              </h2>
              <p className="text-sm sm:text-base text-secondary-600 dark:text-secondary-400 max-w-3xl mx-auto">
                Our platform makes it easy to discover, create, and share recipes with a community of food lovers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <Card className="p-6 sm:p-8 border border-secondary-200 dark:border-secondary-700 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-4px]">
                <div className="bg-gradient-to-br from-primary-400 to-primary-600 dark:from-primary-500 dark:to-primary-700 text-white rounded-xl w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center mb-4 sm:mb-6 shadow-md">
                  <ChefHat className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2 sm:mb-3">
                  Create & Share
                </h3>
                <p className="text-sm sm:text-base text-secondary-600 dark:text-secondary-400">
                  Easily create and share your favorite recipes with detailed instructions and beautiful photos.
                </p>
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-secondary-200 dark:border-secondary-700">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary-500 dark:text-primary-400 mr-2" />
                    <span className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400">Join a community of food enthusiasts</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 sm:p-8 border border-secondary-200 dark:border-secondary-700 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-4px]">
                <div className="bg-gradient-to-br from-primary-400 to-primary-600 dark:from-primary-500 dark:to-primary-700 text-white rounded-xl w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center mb-4 sm:mb-6 shadow-md">
                  <Heart className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2 sm:mb-3">
                  Save Favorites
                </h3>
                <p className="text-sm sm:text-base text-secondary-600 dark:text-secondary-400">
                  Keep a special collection of your most-loved recipes for quick access, so you can revisit your go-to meals anytime.
                </p>
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-secondary-200 dark:border-secondary-700">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary-500 dark:text-primary-400 mr-2" />
                    <span className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400">Never lose track of recipes you love</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 sm:p-8 border border-secondary-200 dark:border-secondary-700 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-4px]">
                <div className="bg-gradient-to-br from-primary-400 to-primary-600 dark:from-primary-500 dark:to-primary-700 text-white rounded-xl w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center mb-4 sm:mb-6 shadow-md">
                  <Bookmark className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2 sm:mb-3">
                  Bookmark Recipes
                </h3>
                <p className="text-sm sm:text-base text-secondary-600 dark:text-secondary-400">
                  Save recipes you want to try later. Build a personal collection of culinary adventures and create your cooking bucket list.
                </p>
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-secondary-200 dark:border-secondary-700">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary-500 dark:text-primary-400 mr-2" />
                    <span className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400">Create your cooking bucket list</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section ref={ctaRef} className={`section-reveal py-10 sm:py-12 md:py-16 ${!isAuthenticated ? 'bg-white dark:bg-secondary-800' : 'bg-secondary-50 dark:bg-secondary-900'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-700 dark:to-primary-900 rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
              <div className="relative px-5 py-8 sm:px-6 md:p-12 lg:p-16 text-center">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-white/10 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-16 sm:w-24 h-16 sm:h-24 bg-white/10 rounded-tr-full"></div>

                <div className="inline-flex items-center justify-center mb-4 sm:mb-6 bg-white/20 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-white" />
                  <span className="text-xs sm:text-sm font-medium text-white">{isAuthenticated ? 'Ready to cook?' : 'Join today'}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
                  {isAuthenticated ? 'Ready to cook something amazing?' : 'Join our community today!'}
                </h2>
                <p className="text-sm sm:text-base text-primary-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
                  {isAuthenticated
                    ? 'Explore our recipes or share your own culinary creations with the community.'
                    : 'Create an account to save recipes, share your own, and connect with other food enthusiasts.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  {isAuthenticated ? (
                    <>
                      <Link to="/recipes/create">
                        <Button
                          size="lg"
                          className="w-full sm:w-auto"
                          leftIcon={<Plus className="mr-2 h-4 w-4" />}>
                          Create Recipe
                        </Button>
                      </Link>
                      <Link to="/recipes">
                        <Button
                          variant="outline-white"
                          size="lg"
                          className="w-full sm:w-auto mt-2 sm:mt-0"
                          leftIcon={<Search className="mr-2 h-4 w-4" />}>
                          Browse Recipes
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/register">
                        <Button
                          size="lg"
                          className="w-full sm:w-auto"
                          leftIcon={<User className="mr-2 h-4 w-4" />}>
                          Sign Up Free
                        </Button>
                      </Link>
                      <Link to="/recipes">
                        <Button
                          variant="outline-white"
                          size="lg"
                          className="w-full sm:w-auto mt-2 sm:mt-0"
                          leftIcon={<Search className="mr-2 h-4 w-4" />}>
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
    </div>
  )
}

export default Home