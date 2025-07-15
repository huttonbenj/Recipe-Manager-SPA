/**
 * Landing page component
 * Public landing page for unauthenticated users to showcase the app
 */

import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Heart,
  Bookmark,
  Star,
  Users,
  ChefHat,
  Clock,
  ArrowRight,
  Check,
  Sparkles,
  Sun,
  Moon,
  Monitor,
  Palette,
  Trophy,
  Utensils,
  User
} from 'lucide-react'
import { Button } from '../../components/ui'
import { useTheme, type ColorTheme, type DisplayMode } from '../../hooks/useTheme'

// UI Components
import { Card } from '@/components/ui'
import { RecipeCard } from '@/components/recipe'


/**
 * Feature highlights for the landing page
 */
const features = [
  {
    title: 'Discover Amazing Recipes',
    description: 'Browse thousands of recipes from our community of passionate home cooks',
    icon: Search,
    color: 'from-primary-500 to-primary-600'
  },
  {
    title: 'Quick & Easy Cooking',
    description: 'Find recipes that fit your schedule with our time-based filters',
    icon: Clock,
    color: 'from-accent-500 to-accent-600'
  },
  {
    title: 'Community Favorites',
    description: 'Discover what other food lovers are cooking and sharing',
    icon: Heart,
    color: 'from-primary-600 to-primary-700'
  },
  {
    title: 'Save & Organize',
    description: 'Keep your favorite recipes organized and easily accessible',
    icon: Bookmark,
    color: 'from-primary-400 to-primary-500'
  }
]

/**
 * App statistics to showcase community
 */
const stats = [
  { label: 'Recipes Shared', value: '10,000+', icon: ChefHat },
  { label: 'Home Cooks', value: '2,500+', icon: Users },
  { label: 'Five Star Recipes', value: '1,200+', icon: Star },
  { label: 'Countries', value: '50+', icon: Trophy }
]

// Theme showcase data
const THEME_SHOWCASE = [
  {
    name: 'Ocean Blue',
    key: 'default' as ColorTheme,
    colors: ['#0ea5e9', '#64748b', '#ef4444'],
    primaryColor: '#0ea5e9',
  },
  {
    name: 'Emerald Forest',
    key: 'emerald' as ColorTheme,
    colors: ['#10b981', '#64748b', '#f59e0b'],
    primaryColor: '#10b981',
  },
  {
    name: 'Royal Blue',
    key: 'blue' as ColorTheme,
    colors: ['#3b82f6', '#64748b', '#d946ef'],
    primaryColor: '#3b82f6',
  },
  {
    name: 'Purple Haze',
    key: 'purple' as ColorTheme,
    colors: ['#a855f7', '#64748b', '#f97316'],
    primaryColor: '#a855f7',
  },
  {
    name: 'Rose Garden',
    key: 'rose' as ColorTheme,
    colors: ['#f43f5e', '#64748b', '#22c55e'],
    primaryColor: '#f43f5e',
  },
  {
    name: 'Sunset Orange',
    key: 'orange' as ColorTheme,
    colors: ['#f97316', '#64748b', '#eab308'],
    primaryColor: '#f97316',
  },
  {
    name: 'Amber Sunset',
    key: 'sunset' as ColorTheme,
    colors: ['#f59e0b', '#475569', '#0ea5e9'],
    primaryColor: '#f59e0b',
  },
  {
    name: 'Deep Teal',
    key: 'teal' as ColorTheme,
    colors: ['#14b8a6', '#475569', '#06b6d4'],
    primaryColor: '#14b8a6',
  },
  {
    name: 'Crimson Red',
    key: 'crimson' as ColorTheme,
    colors: ['#ef4444', '#475569', '#f43f5e'],
    primaryColor: '#ef4444',
  },
  {
    name: 'Lush Violet',
    key: 'violet' as ColorTheme,
    colors: ['#8b5cf6', '#475569', '#ec4899'],
    primaryColor: '#8b5cf6',
  },
  {
    name: 'Forest Green',
    key: 'green' as ColorTheme,
    colors: ['#22c55e', '#475569', '#16a34a'],
    primaryColor: '#22c55e',
  },
  {
    name: 'Cotton Candy',
    key: 'pink' as ColorTheme,
    colors: ['#ec4899', '#475569', '#f472b6'],
    primaryColor: '#ec4899',
  },
]

const DISPLAY_MODES = [
  {
    mode: 'light',
    name: 'Light Mode',
    icon: Sun,
    description: 'Clean and bright interface',
    bgColor: 'bg-white',
    textColor: 'text-gray-900',
  },
  {
    mode: 'dark',
    name: 'Dark Mode',
    icon: Moon,
    description: 'Easy on the eyes',
    bgColor: 'bg-gray-900',
    textColor: 'text-white',
  },
  {
    mode: 'system',
    name: 'System Mode',
    icon: Monitor,
    description: 'Follows your system preference',
    bgColor: 'bg-gradient-to-br from-white to-gray-100',
    textColor: 'text-gray-900',
  },
]

export const Home: React.FC = () => {
  const [isPageLoaded, setIsPageLoaded] = useState(false)

  // Refs for scroll animations
  const featuresRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const featuredRecipesRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  // Fade in elements on load
  useEffect(() => {
    const pageLoadTimer = setTimeout(() => {
      setIsPageLoaded(true)
    }, 100)

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

    const sections = [featuresRef, statsRef, featuredRecipesRef, ctaRef]
    sections.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current)
      }
    })

    return () => {
      clearTimeout(pageLoadTimer)
      sections.forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current)
        }
      })
    }
  }, [])

  // Fetch featured recipes to showcase (public endpoint)
  const [featuredRecipes, setFeaturedRecipes] = useState<any[]>([])
  const [recipesLoading, setRecipesLoading] = useState(true)
  const [recipesError, setRecipesError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeaturedRecipes = async () => {
      try {
        setRecipesLoading(true)
        setRecipesError(null)

        console.log('Fetching featured recipes...')

        // Try direct API call first
        const response = await fetch('/api/recipes?limit=3&sortBy=createdAt&sortOrder=desc&_t=' + Date.now())
        console.log('Direct fetch response:', response.status, response.ok)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log('Direct fetch data:', data)

        const recipes = data.data?.recipes || data.recipes || []
        console.log('Extracted recipes:', recipes)

        setFeaturedRecipes(recipes)
      } catch (error) {
        console.error('Error fetching featured recipes:', error)
        setRecipesError(error instanceof Error ? error.message : 'Unknown error')
      } finally {
        setRecipesLoading(false)
      }
    }

    fetchFeaturedRecipes()
  }, [])

  // Debug logging
  console.log('Featured recipes state:', {
    featuredRecipes,
    recipesLoading,
    recipesError,
    featuredRecipesLength: featuredRecipes.length
  })

  // Theme showcase section
  const ThemeShowcase = () => {
    const { theme, setColorTheme, setDisplayMode } = useTheme()

    // Detect system preference
    const getSystemPreference = () => {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }

    const [systemPreference, setSystemPreference] = useState(getSystemPreference())

    useEffect(() => {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => setSystemPreference(getSystemPreference())

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }, [])

    const handleThemeChange = (newTheme: ColorTheme) => {
      setColorTheme(newTheme)
    }

    const handleModeChange = (newMode: DisplayMode) => {
      setDisplayMode(newMode)
    }

    return (
      <section className="py-24 bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900 dark:to-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-900 dark:text-white mb-4">
              <Palette className="inline-block w-8 h-8 mr-3 text-primary-600" />
              Customize Your Experience
            </h2>
            <p className="text-xl text-secondary-600 dark:text-secondary-400 max-w-3xl mx-auto">
              Choose from multiple display modes and beautiful color themes to make the app truly yours
            </p>
          </div>

          {/* Display Mode Showcase */}
          <div className="mb-16">
            <h3 className="text-2xl font-semibold text-secondary-900 dark:text-white mb-8 text-center">
              Display Modes
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {DISPLAY_MODES.map((mode) => {
                const Icon = mode.icon
                const isSelected = theme.displayMode === mode.mode

                // Define mode-specific colors to show what each mode looks like
                const getModeColors = () => {
                  switch (mode.mode) {
                    case 'light':
                      return {
                        cardBg: 'bg-white border-secondary-200',
                        iconBg: 'bg-secondary-100',
                        iconColor: 'text-secondary-700',
                        textColor: 'text-secondary-900',
                        descColor: 'text-secondary-600'
                      }
                    case 'dark':
                      return {
                        cardBg: 'bg-secondary-800 border-secondary-700',
                        iconBg: 'bg-secondary-700',
                        iconColor: 'text-secondary-300',
                        textColor: 'text-white',
                        descColor: 'text-secondary-400'
                      }
                    case 'system':
                      return systemPreference === 'dark' ? {
                        cardBg: 'bg-secondary-800 border-secondary-700',
                        iconBg: 'bg-secondary-700',
                        iconColor: 'text-secondary-300',
                        textColor: 'text-white',
                        descColor: 'text-secondary-400'
                      } : {
                        cardBg: 'bg-white border-secondary-200',
                        iconBg: 'bg-secondary-100',
                        iconColor: 'text-secondary-700',
                        textColor: 'text-secondary-900',
                        descColor: 'text-secondary-600'
                      }
                    default:
                      return {
                        cardBg: 'bg-white border-secondary-200',
                        iconBg: 'bg-secondary-100',
                        iconColor: 'text-secondary-700',
                        textColor: 'text-secondary-900',
                        descColor: 'text-secondary-600'
                      }
                  }
                }

                const colors = getModeColors()

                return (
                  <div
                    key={mode.mode}
                    onClick={() => handleModeChange(mode.mode as DisplayMode)}
                    className={`
                      relative cursor-pointer rounded-xl p-6 transition-all duration-300 border-2
                      ${isSelected
                        ? 'border-primary-500 ring-4 ring-primary-500/20 shadow-lg scale-105'
                        : 'border-transparent hover:border-primary-300 hover:shadow-md hover:scale-102'
                      }
                    `}
                  >
                    {/* Mode preview card */}
                    <div className={`${colors.cardBg} rounded-lg p-4 mb-4 border transition-all duration-300`}>
                      <div className={`${colors.iconBg} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>
                        <Icon className={`w-6 h-6 ${colors.iconColor}`} />
                      </div>
                      <h4 className={`font-semibold ${colors.textColor} mb-1`}>
                        {mode.name}
                        {mode.mode === 'system' && (
                          <span className={`text-sm font-normal ${colors.descColor} ml-2`}>
                            ({systemPreference})
                          </span>
                        )}
                      </h4>
                      <p className={`text-sm ${colors.descColor}`}>
                        {mode.mode === 'system'
                          ? `Currently following ${systemPreference} mode`
                          : mode.description
                        }
                      </p>
                    </div>

                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Color Theme Showcase */}
          <div>
            <h3 className="text-2xl font-semibold text-secondary-900 dark:text-white mb-8 text-center">
              Color Themes
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {THEME_SHOWCASE.map((themeOption) => {
                const isSelected = theme.colorTheme === themeOption.key
                return (
                  <div
                    key={themeOption.name}
                    onClick={() => handleThemeChange(themeOption.key)}
                    className={`
                      relative cursor-pointer rounded-lg p-4 transition-all duration-300 backdrop-blur-sm border-2
                      ${isSelected
                        ? 'border-primary-500 shadow-lg scale-105 bg-primary-50/50 dark:bg-primary-900/20'
                        : 'border-transparent hover:border-primary-300 hover:shadow-md hover:scale-102 bg-secondary-100/50 dark:bg-secondary-800/50'
                      }
                    `}
                  >
                    <div className="flex justify-center gap-1 mb-3">
                      {themeOption.colors.map((color, colorIndex) => (
                        <div
                          key={colorIndex}
                          className={`w-4 h-4 rounded-full shadow-sm border-2 transition-all duration-200
                            ${isSelected
                              ? 'scale-105 border-white dark:border-white/80 shadow-md'
                              : 'border-white/60 dark:border-secondary-600'
                            }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <p className={`text-xs font-medium text-center leading-tight transition-colors
                      ${isSelected
                        ? 'text-primary-600 dark:text-primary-300'
                        : 'text-secondary-700 dark:text-secondary-300'
                      }`}
                      style={isSelected ? { color: themeOption.primaryColor } : {}}
                    >
                      {themeOption.name}
                    </p>
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <div className="bg-primary-500 rounded-full p-0.5">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="text-center mt-8">
              <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                12 beautiful color themes to match your style - try them out above!
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200 font-medium"
              >
                <Sparkles className="w-4 h-4" />
                Get Started to Save Your Preferences
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      {/* Hero Section */}
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

        {/* Floating cooking icons */}
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
          <div className="text-center">
            <div className={`inline-flex items-center mb-4 sm:mb-6 bg-white/10 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-primary-50 ${isPageLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
              <span className="text-xs sm:text-sm font-medium">Join thousands of home cooks</span>
            </div>

            <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 sm:mb-6 text-white drop-shadow-md ${isPageLoaded ? 'animate-slide-up' : 'opacity-0'}`}>
              Cook, Share, Discover
            </h1>
            <p className={`text-base sm:text-lg md:text-xl lg:text-2xl text-primary-100 mb-6 sm:mb-8 max-w-3xl mx-auto ${isPageLoaded ? 'animate-slide-up-delay' : 'opacity-0'}`}>
              Join a vibrant community of food lovers. Find inspiration for your next meal, share your favorite recipes, and discover culinary treasures from around the world.
            </p>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center ${isPageLoaded ? 'animate-slide-up-delay-2' : 'opacity-0'}`}>
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

      {/* Features Section */}
      <section ref={featuresRef} className="section-reveal py-16 md:py-24 bg-white dark:bg-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center mb-4 backdrop-blur-sm px-4 py-2 rounded-full border badge-theme-section">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Why Choose Our Platform</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-secondary-900 dark:text-white">
              Everything You Need to Cook Better
            </h2>
            <p className="text-lg text-secondary-600 dark:text-secondary-300 max-w-2xl mx-auto">
              From discovering new recipes to organizing your favorites, we&apos;ve got everything to make your cooking journey delightful.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow duration-300 border-0 bg-gradient-to-br from-white to-secondary-50 dark:from-secondary-700 dark:to-secondary-800">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r ${feature.color} p-3 flex items-center justify-center`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-secondary-900 dark:text-white">{feature.title}</h3>
                <p className="text-secondary-600 dark:text-secondary-300 text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="section-reveal py-16 bg-gradient-to-r from-primary-500 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Join Our Growing Community
            </h2>
            <p className="text-xl opacity-90">
              Thousands of home cooks are already sharing their passion for food
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl md:text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-primary-100 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section ref={featuredRecipesRef} className="section-reveal py-16 md:py-24 bg-secondary-50 dark:bg-secondary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center mb-4 backdrop-blur-sm px-4 py-2 rounded-full border badge-theme-section">
              <ChefHat className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Community Favorites</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-secondary-900 dark:text-white">
              Recently Shared Recipes
            </h2>
            <p className="text-lg text-secondary-600 dark:text-secondary-300 max-w-2xl mx-auto">
              Discover what our community is cooking and get inspired for your next meal
            </p>
          </div>

          {/* Loading State */}
          {recipesLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-secondary-200 dark:bg-secondary-700 h-48 rounded-lg mb-4"></div>
                  <div className="bg-secondary-200 dark:bg-secondary-700 h-4 rounded mb-2"></div>
                  <div className="bg-secondary-200 dark:bg-secondary-700 h-4 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {recipesError && (
            <div className="text-center py-12">
              <p className="text-red-600 dark:text-red-400 mb-4">
                Error loading recipes: {recipesError}
              </p>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Please try again later or check your connection
              </p>
            </div>
          )}

          {/* Featured Recipes */}
          {!recipesLoading && !recipesError && featuredRecipes.length > 0 && (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>

              <div className="text-center mt-12">
                <Link to="/register">
                  <Button size="lg" leftIcon={<ArrowRight className="w-5 h-5" />}>
                    Join to See More Recipes
                  </Button>
                </Link>
              </div>
            </>
          )}

          {/* No Recipes State */}
          {!recipesLoading && !recipesError && featuredRecipes.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-secondary-200 dark:bg-secondary-700 rounded-full flex items-center justify-center">
                <ChefHat className="w-8 h-8 text-secondary-400 dark:text-secondary-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-secondary-900 dark:text-white">
                No recipes available
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                Be the first to share a delicious recipe with our community!
              </p>
              <Link to="/register">
                <Button size="lg" leftIcon={<ArrowRight className="w-5 h-5" />}>
                  Join to Share Recipes
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Theme Showcase */}
      <ThemeShowcase />

      {/* Final CTA Section */}
      <section ref={ctaRef} className="section-reveal py-16 md:py-24 bg-white dark:bg-secondary-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center mb-4 backdrop-blur-sm px-4 py-2 rounded-full border badge-theme-section">
              <Users className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Ready to Start Cooking?</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-secondary-900 dark:text-white">
              Your Culinary Journey Starts Here
            </h2>
            <p className="text-lg text-secondary-600 dark:text-secondary-300 mb-8">
              Join thousands of home cooks who are already sharing their passion for food. Start exploring, creating, and sharing your favorite recipes today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto" leftIcon={<User className="w-5 h-5" />}>
                Create Free Account
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto" leftIcon={<Search className="w-5 h-5" />}>
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home