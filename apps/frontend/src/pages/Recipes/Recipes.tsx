/**
 * Enhanced Recipes Discovery Page
 * Modern, feature-rich recipe discovery interface with advanced search, filters, and sorting
 */

import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import {
  Search, Clock, Heart, ChefHat, TrendingUp,
  SlidersHorizontal, X, Plus, Sparkles,
  ArrowUpDown, Calendar, Utensils, Globe, Timer,
  LayoutGrid, LayoutList, Zap, Check
} from 'lucide-react'

// UI Components
import { Button, Input, Card, Loading, Select, Badge } from '@/components/ui'
import { RecipeList } from '@/components/recipe'

// Hooks
import { useAuth } from '@/hooks/useAuth'
import { useDebounce } from '@/hooks/useDebounce'
import { useRecipes, useDeleteRecipe } from '@/hooks/useRecipes'
import { useLocalStorage } from '@/hooks/useLocalStorage'

// Types
import type { Recipe, RecipeSearchParams } from '@/types'

/**
 * View mode type
 */
type ViewMode = 'grid' | 'list'

/**
 * Sort options
 */
const sortOptions = [
  { value: 'newest', label: 'Newest First', icon: Calendar },
  { value: 'oldest', label: 'Oldest First', icon: Calendar },
  { value: 'popular', label: 'Most Popular', icon: TrendingUp },
  { value: 'quickest', label: 'Quickest to Make', icon: Timer },
  { value: 'alphabetical', label: 'A to Z', icon: ArrowUpDown }
]

/**
 * Enhanced filter options
 */
const filterOptions = {
  difficulty: [
    { value: 'easy', label: 'Easy', color: 'success' },
    { value: 'medium', label: 'Medium', color: 'warning' },
    { value: 'hard', label: 'Hard', color: 'danger' }
  ],
  cookTime: [
    { value: '15', label: 'Under 15 min', icon: Zap },
    { value: '30', label: 'Under 30 min', icon: Timer },
    { value: '60', label: 'Under 1 hour', icon: Clock },
    { value: '120', label: 'Under 2 hours', icon: Clock }
  ],
  category: [
    { value: 'breakfast', label: 'Breakfast', icon: '🌅' },
    { value: 'lunch', label: 'Lunch', icon: '🌞' },
    { value: 'dinner', label: 'Dinner', icon: '🌙' },
    { value: 'snack', label: 'Snack', icon: '🍿' },
    { value: 'dessert', label: 'Dessert', icon: '🍰' },
    { value: 'appetizer', label: 'Appetizer', icon: '🥗' },
    { value: 'beverage', label: 'Beverage', icon: '🥤' }
  ],
  cuisine: [
    { value: 'american', label: 'American', flag: '🇺🇸' },
    { value: 'italian', label: 'Italian', flag: '🇮🇹' },
    { value: 'chinese', label: 'Chinese', flag: '🇨🇳' },
    { value: 'mexican', label: 'Mexican', flag: '🇲🇽' },
    { value: 'indian', label: 'Indian', flag: '🇮🇳' },
    { value: 'japanese', label: 'Japanese', flag: '🇯🇵' },
    { value: 'french', label: 'French', flag: '🇫🇷' },
    { value: 'thai', label: 'Thai', flag: '🇹🇭' }
  ]
}

/**
 * Enhanced quick filter buttons
 */
const quickFilters = [
  { key: 'trending', label: 'Trending', icon: TrendingUp, color: 'from-pink-500 to-red-500' },
  { key: 'quick', label: 'Quick & Easy', icon: Zap, color: 'from-yellow-500 to-orange-500' },
  { key: 'healthy', label: 'Healthy', icon: Heart, color: 'from-green-500 to-emerald-500' },
  { key: 'vegetarian', label: 'Vegetarian', icon: '🥬', color: 'from-green-400 to-green-600' },
  { key: 'desserts', label: 'Desserts', icon: '🍰', color: 'from-purple-500 to-pink-500' },
  { key: 'comfort', label: 'Comfort Food', icon: Utensils, color: 'from-orange-500 to-red-500' }
]

const Recipes: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>('recipe-view-mode', 'grid')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest')
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const debouncedSearch = useDebounce(searchQuery, 300)
  const [isSearching, setIsSearching] = useState(false)

  const [filters, setFilters] = useState({
    difficulty: searchParams.get('difficulty') || '',
    cookTime: searchParams.get('cookTime') || '',
    category: searchParams.get('category') || '',
    cuisine: searchParams.get('cuisine') || '',
    myRecipes: searchParams.get('myRecipes') === 'true',
    quickFilters: searchParams.get('filter') ? searchParams.get('filter')!.split(',').filter(Boolean) : [] as string[]
  })

  const currentPage = parseInt(searchParams.get('page') || '1')
  const pageSize = 12

  // Update URL when filters/search/sort change
  useEffect(() => {
    const params = new URLSearchParams()
    if (debouncedSearch) params.set('search', debouncedSearch)
    if (filters.difficulty) params.set('difficulty', filters.difficulty)
    if (filters.cookTime) params.set('cookTime', filters.cookTime)
    if (filters.category) params.set('category', filters.category)
    if (filters.cuisine) params.set('cuisine', filters.cuisine)
    if (filters.myRecipes) params.set('myRecipes', '1')
    params.set('page', '1') // Always reset to page 1 when filters/search/sort change
    params.set('limit', pageSize.toString())
    // Handle sorting - map frontend values to backend values
    switch (sortBy) {
      case 'newest':
        params.set('sortBy', 'createdAt')
        params.set('sortOrder', 'desc')
        break
      case 'oldest':
        params.set('sortBy', 'createdAt')
        params.set('sortOrder', 'asc')
        break
      case 'popular':
        params.set('sortBy', 'createdAt')
        params.set('sortOrder', 'desc')
        break

      case 'quickest':
        params.set('sortBy', 'cookTime')
        params.set('sortOrder', 'asc')
        break
      case 'alphabetical':
        params.set('sortBy', 'title')
        params.set('sortOrder', 'asc')
        break
      default:
        params.set('sortBy', 'createdAt')
        params.set('sortOrder', 'desc')
    }
    setSearchParams(params)
  }, [debouncedSearch, filters, pageSize, sortBy])

  // Effect to manage search loading indicator
  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true)
    }
    // When debounced search updates, loading is finished
    // A small delay makes the UX smoother
    const timer = setTimeout(() => {
      if (debouncedSearch === searchQuery) {
        setIsSearching(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [debouncedSearch, searchQuery])

  // Separate useEffect for page changes (when user clicks pagination)
  useEffect(() => {
    if (currentPage !== 1) {
      const params = new URLSearchParams(searchParams)
      params.set('page', currentPage.toString())
      setSearchParams(params)
    }
  }, [currentPage])

  /**
   * Build search parameters for API
   */
  const buildSearchParams = (): RecipeSearchParams => {
    const params: RecipeSearchParams = {
      page: currentPage,
      limit: pageSize
    }

    if (debouncedSearch.trim()) {
      params.search = debouncedSearch.trim()
    }

    if (filters.difficulty) {
      params.difficulty = filters.difficulty.toUpperCase()
    }

    // Include maximum cook time filter
    if (filters.cookTime) {
      params.cookTimeMax = Number(filters.cookTime)
    }

    // Include cuisine filter
    if (filters.cuisine) {
      params.cuisine = filters.cuisine
    }

    // Handle category filter as tags
    if (filters.category) {
      params.tags = filters.category
    }

    // Handle my recipes filter
    if (filters.myRecipes && user?.id) {
      params.authorId = user.id
    }

    // Handle sorting
    switch (sortBy) {
      case 'newest':
        params.sortBy = 'createdAt'
        params.sortOrder = 'desc'
        break
      case 'oldest':
        params.sortBy = 'createdAt'
        params.sortOrder = 'asc'
        break
      case 'popular':
        params.sortBy = 'createdAt'
        params.sortOrder = 'desc'
        break

      case 'quickest':
        params.sortBy = 'cookTime'
        params.sortOrder = 'asc'
        break
      case 'alphabetical':
        params.sortBy = 'title'
        params.sortOrder = 'asc'
        break
      default:
        params.sortBy = 'createdAt'
        params.sortOrder = 'desc'
    }

    // Handle quick filters with improved logic
    if (filters.quickFilters.length > 0) {
      const quickFilterTags: string[] = []

      filters.quickFilters.forEach(qf => {
        switch (qf) {
          case 'quick':
            // Quick recipes: cookTimeMax 30 minutes
            params.cookTimeMax = Math.min(params.cookTimeMax || 30, 30)
            break
          case 'trending':
            // Trending: sort by newest
            params.sortBy = 'createdAt'
            params.sortOrder = 'desc'
            break
          case 'healthy':
            // Healthy recipes: add healthy tag
            quickFilterTags.push('healthy')
            break
          case 'vegetarian':
            // Vegetarian recipes: add vegetarian tag
            quickFilterTags.push('vegetarian')
            break
          case 'desserts':
            // Dessert recipes: add dessert tag
            quickFilterTags.push('dessert')
            break
          case 'comfort':
            // Comfort food: add comfort-food tag
            quickFilterTags.push('comfort-food')
            break
        }
      })

      // Combine quick filter tags with category filter
      if (quickFilterTags.length > 0) {
        const existingTags = params.tags ? params.tags.split(',') : []
        const combinedTags = [...new Set([...existingTags, ...quickFilterTags])]
        params.tags = combinedTags.join(',')
      }
    }

    return params
  }

  // Fetch recipes data
  const searchParamsForApi = buildSearchParams()

  const {
    data: recipesData,
    isLoading,
    isError
  } = useRecipes(searchParamsForApi)

  // Computed values
  const recipes: Recipe[] = recipesData?.recipes || []
  const totalCount = recipesData?.total || 0

  /**
   * Delete recipe mutation
   */
  const deleteMutation = useDeleteRecipe()

  /**
   * Handle filter changes
   */
  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => {
      if (filterType === 'myRecipes') {
        // Handle boolean filter
        return {
          ...prev,
          myRecipes: value === 'true'
        }
      }

      // Handle other filters
      return {
        ...prev,
        [filterType]: prev[filterType as keyof typeof prev] === value ? '' : value
      }
    })
  }

  /**
   * Handle quick filter selection
   */
  const handleQuickFilter = (filterKey: string) => {
    setFilters(prev => {
      const isSelected = prev.quickFilters.includes(filterKey)
      const newQuickFilters = isSelected
        ? prev.quickFilters.filter(f => f !== filterKey)
        : [...prev.quickFilters, filterKey]
      return { ...prev, quickFilters: newQuickFilters }
    })
  }

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    setSearchQuery('')
    setFilters({
      difficulty: '',
      cookTime: '',
      category: '',
      cuisine: '',
      myRecipes: false,
      quickFilters: []
    })
    setSortBy('newest')
    setSearchParams({})
  }

  /**
   * Handle page change
   */
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    if (page > 1) {
      params.set('page', page.toString())
    } else {
      params.delete('page')
    }
    setSearchParams(params)
  }

  /**
   * Handle recipe actions
   */
  const handleRecipeEdit = (recipeId: string) => {
    navigate(`/app/recipes/${recipeId}/edit`)
  }

  const handleRecipeDelete = (recipeId: string) => {
    if (window.confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
      deleteMutation.mutate(recipeId)
    }
  }

  // Computed values - moved to after useQuery
  const hasActiveFilters = debouncedSearch || Object.values(filters).some(val => Array.isArray(val) ? val.length > 0 : Boolean(val)) || sortBy !== 'newest'
  const activeFilterCount = (
    (debouncedSearch ? 1 : 0) +
    (filters.difficulty ? 1 : 0) +
    (filters.cookTime ? 1 : 0) +
    (filters.category ? 1 : 0) +
    (filters.cuisine ? 1 : 0) +
    (filters.myRecipes ? 1 : 0) +
    filters.quickFilters.length
  )
  const [prevFilterCount, setPrevFilterCount] = useState(activeFilterCount)
  const [animateBadge, setAnimateBadge] = useState(false)

  // After delete, if current page is empty and not page 1, go to previous page
  useEffect(() => {
    if (!isLoading && recipes.length === 0 && currentPage > 1) {
      handlePageChange(currentPage - 1)
    }
  }, [recipes, isLoading, currentPage])

  // Effect to animate filter badge
  useEffect(() => {
    if (activeFilterCount !== prevFilterCount) {
      setAnimateBadge(true)
      const timer = setTimeout(() => setAnimateBadge(false), 300) // Animation duration
      setPrevFilterCount(activeFilterCount)
      return () => clearTimeout(timer)
    }
  }, [activeFilterCount, prevFilterCount])

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Enhanced Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
                Discover Amazing Recipes
              </h1>
              <p className="text-secondary-600 dark:text-secondary-400 text-sm sm:text-base lg:text-lg">
                Explore {totalCount.toLocaleString()} delicious recipes from our community
              </p>
            </div>

            {isAuthenticated && (
              <Link to="/app/recipes/create" className="shrink-0">
                <Button
                  className="w-full sm:w-auto shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Create Recipe
                </Button>
              </Link>
            )}
          </div>

          {/* Quick Stats - Responsive Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <Card className="p-3 sm:p-4 text-center border-l-4 border-l-primary-500 hover:shadow-md transition-shadow">
              <div className="text-xl sm:text-2xl font-bold text-primary-600 dark:text-primary-400">
                {totalCount.toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400">Total Recipes</div>
            </Card>
            <Card className="p-3 sm:p-4 text-center border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
              <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                {Math.floor(totalCount * 0.3).toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400">Quick & Easy</div>
            </Card>
            <Card className="p-3 sm:p-4 text-center border-l-4 border-l-orange-500 hover:shadow-md transition-shadow">
              <div className="text-xl sm:text-2xl font-bold text-orange-600 dark:text-orange-400">
                {Math.floor(totalCount * 0.4).toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400">Popular</div>
            </Card>
            <Card className="p-3 sm:p-4 text-center border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
              <div className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400">
                {Math.floor(totalCount * 0.25).toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400">Trending</div>
            </Card>
          </div>
        </div>

        {/* Enhanced Search and Filtering Section */}
        <Card className="p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm border border-secondary-200/50 dark:border-secondary-700/50 shadow-lg">

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400 dark:text-secondary-500" />
              <Input
                type="text"
                placeholder="Search recipes, ingredients, cuisines, or cooking techniques..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-12 py-3 sm:py-4 text-sm sm:text-base border-2 border-secondary-200 dark:border-secondary-700 focus:border-primary-500 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              />
              {isSearching && (
                <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                  <Loading variant="spinner" size="sm" />
                </div>
              )}
              {searchQuery && !isSearching && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Quick Filters */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary-500" />
              <h3 className="text-base sm:text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                Quick Filters
              </h3>
            </div>

            {/* All screen sizes: Responsive flex wrap */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {quickFilters.map((filter) => {
                const isSelected = filters.quickFilters.includes(filter.key)
                return (
                  <Button
                    key={filter.key}
                    variant={isSelected ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleQuickFilter(filter.key)}
                    className={`shrink-0 relative overflow-hidden transition-all duration-200 text-sm ${isSelected
                        ? `bg-gradient-to-r ${filter.color} text-white border-transparent shadow-lg`
                        : 'hover:shadow-md'
                      }`}
                    leftIcon={
                      isSelected ? (
                        <Check className="h-4 w-4" />
                      ) : typeof filter.icon === 'string' ? (
                        <span className="text-base">{filter.icon}</span>
                      ) : (
                        <filter.icon className="h-4 w-4" />
                      )
                    }
                  >
                    <span className="whitespace-nowrap">{filter.label}</span>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            {/* Left Controls */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Button
                variant={showFilters ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="shrink-0 transition-all duration-200 min-h-[44px] text-sm"
                leftIcon={<SlidersHorizontal className="h-4 w-4" />}
              >
                <span className="hidden sm:inline">{showFilters ? 'Hide' : 'Show'} </span>
                <span className="sm:hidden">Filters</span>
                <span className="hidden sm:inline">Advanced Filters</span>
                {activeFilterCount > 0 && (
                  <Badge
                    variant="primary"
                    size="sm"
                    className={`ml-2 ${animateBadge ? 'animate-bounce-gentle' : ''}`}
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>

              {/* My Recipes Toggle */}
              {isAuthenticated && (
                <Button
                  variant={filters.myRecipes ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleFilterChange('myRecipes', String(!filters.myRecipes))}
                  className="shrink-0 transition-all duration-200 min-h-[44px] text-sm"
                  leftIcon={<Heart className="h-4 w-4" />}
                >
                  My Recipes
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                className="shrink-0 transition-all duration-200 min-h-[44px] disabled:opacity-50 text-sm"
                leftIcon={<X className="h-4 w-4" />}
              >
                Clear All
              </Button>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Sort Dropdown */}
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="min-w-[120px] sm:min-w-[160px] h-[44px] text-sm"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>

              {/* View Mode Toggle */}
              <div className="flex items-center border border-secondary-200 dark:border-secondary-700 rounded-lg p-1 bg-secondary-50 dark:bg-secondary-800">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="p-2 h-8 w-8"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="p-2 h-8 w-8"
                >
                  <LayoutList className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <Card className="p-4 sm:p-6 mb-6 sm:mb-8 bg-white/90 dark:bg-secondary-800/90 backdrop-blur-md border border-primary-200/50 dark:border-primary-700/50 shadow-xl">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-secondary-900 dark:text-secondary-100">
                Advanced Filters
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(false)}
                className="h-8 w-8 p-0 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">
                  <ChefHat className="h-4 w-4 inline mr-2" />
                  Difficulty Level
                </label>
                <div className="space-y-2">
                  {filterOptions.difficulty.map((option) => (
                    <Button
                      key={option.value}
                      variant={filters.difficulty === option.value ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => handleFilterChange('difficulty', option.value)}
                      className={`w-full justify-start transition-all duration-200 min-h-[44px] text-sm ${filters.difficulty === option.value
                        ? 'scale-[1.02] shadow-lg'
                        : 'hover:scale-[1.01]'
                        }`}
                    >
                      <Badge variant={option.color as any} size="sm" className="mr-2">
                        {option.label}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Cook Time Filter */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">
                  <Clock className="h-4 w-4 inline mr-2" />
                  Cooking Time
                </label>
                <div className="space-y-2">
                  {filterOptions.cookTime.map((option) => (
                    <Button
                      key={option.value}
                      variant={filters.cookTime === option.value ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => handleFilterChange('cookTime', option.value)}
                      className={`w-full justify-start transition-all duration-200 min-h-[44px] text-sm ${filters.cookTime === option.value
                        ? 'scale-[1.02] shadow-lg'
                        : 'hover:scale-[1.01]'
                        }`}
                      leftIcon={<option.icon className="h-4 w-4" />}
                    >
                      <span className="truncate">{option.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">
                  <Utensils className="h-4 w-4 inline mr-2" />
                  Meal Category
                </label>
                <div className="space-y-2">
                  {filterOptions.category.map((option) => (
                    <Button
                      key={option.value}
                      variant={filters.category === option.value ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => handleFilterChange('category', option.value)}
                      className={`w-full justify-start transition-all duration-200 min-h-[44px] text-sm ${filters.category === option.value
                        ? 'scale-[1.02] shadow-lg'
                        : 'hover:scale-[1.01]'
                        }`}
                    >
                      <span className="text-base mr-2">{option.icon}</span>
                      <span className="truncate">{option.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Cuisine Filter */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">
                  <Globe className="h-4 w-4 inline mr-2" />
                  Cuisine Type
                </label>
                <div className="space-y-2">
                  {filterOptions.cuisine.map((option) => (
                    <Button
                      key={option.value}
                      variant={filters.cuisine === option.value ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => handleFilterChange('cuisine', option.value)}
                      className={`w-full justify-start transition-all duration-200 min-h-[44px] text-sm ${filters.cuisine === option.value
                        ? 'scale-[1.02] shadow-lg'
                        : 'hover:scale-[1.01]'
                        }`}
                    >
                      <span className="text-base mr-2">{option.flag}</span>
                      <span className="truncate">{option.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <div className="text-secondary-600 dark:text-secondary-400 text-sm sm:text-base">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
                  Searching recipes...
                </div>
              ) : (
                <span>
                  Showing <span className="font-semibold text-secondary-900 dark:text-secondary-100">
                    {recipes.length}
                  </span> of <span className="font-semibold text-secondary-900 dark:text-secondary-100">
                    {totalCount.toLocaleString()}
                  </span> recipes
                </span>
              )}
            </div>

            {hasActiveFilters && (
              <div className="flex items-center gap-2">
                <Badge variant="primary" size="sm">
                  {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16">
            <Loading variant="spinner" size="lg" text="Discovering delicious recipes..." />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <Card className="text-center py-12 border-2 border-red-200 dark:border-red-800">
            <div className="text-red-600 dark:text-red-400 mb-4">
              <ChefHat className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Oops! Something went wrong</h3>
              <p className="text-red-500 dark:text-red-400">
                Failed to load recipes
              </p>
            </div>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </Card>
        )}

        {/* Recipe List */}
        {!isLoading && !isError && (
          <RecipeList
            recipes={recipes}
            loading={isLoading}
            error={isError ? 'Failed to load recipes' : null}
            viewMode={viewMode}
            pagination={recipesData ? {
              page: recipesData.page || currentPage,
              limit: recipesData.limit || pageSize,
              total: recipesData.total || 0,
              totalPages: recipesData.totalPages || 1,
              hasNext: recipesData.hasNext || false,
              hasPrev: recipesData.hasPrev || false
            } : undefined}
            onPageChange={handlePageChange}
            onEdit={handleRecipeEdit}
            onDelete={handleRecipeDelete}
            currentUserId={user?.id}
            emptyMessage={hasActiveFilters ? "No recipes match your filters" : "No recipes found"}
            emptyDescription={hasActiveFilters ? "Try adjusting your search or filters to find more recipes." : "Be the first to share a delicious recipe with our community!"}
          />
        )}
      </div>
    </div>
  )
}

export default Recipes