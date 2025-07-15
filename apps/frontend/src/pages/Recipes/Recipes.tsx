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
  LayoutGrid, LayoutList, Zap, Check, Frown
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
    { value: 'easy', label: 'Easy', color: '#22c55e' },
    { value: 'medium', label: 'Medium', color: '#f59e0b' },
    { value: 'hard', label: 'Hard', color: '#ef4444' }
  ],
  cookTime: [
    { value: '15', label: 'Under 15 min', icon: Zap, color: '#f59e0b' },
    { value: '30', label: 'Under 30 min', icon: Timer, color: '#3b82f6' },
    { value: '60', label: 'Under 1 hour', icon: Clock, color: '#8b5cf6' },
    { value: '120', label: 'Under 2 hours', icon: Clock, color: '#ef4444' }
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
  { key: 'trending', label: 'Trending', icon: TrendingUp, color: '#ef4444' },
  { key: 'quick', label: 'Quick & Easy', icon: Zap, color: '#f59e0b' },
  { key: 'healthy', label: 'Healthy', icon: Heart, color: '#22c55e' },
  { key: 'vegetarian', label: 'Vegetarian', icon: '🥬' },
  { key: 'desserts', label: 'Desserts', icon: '🍰' },
  { key: 'comfort', label: 'Comfort Food', icon: Utensils, color: '#f97316' }
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
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Enhanced Header */}
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 dark:text-secondary-100 flex items-center gap-3">
                <ChefHat className="text-primary h-10 w-10" />
                <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                  Discover Recipes
                </span>
              </h1>
              <p className="mt-2 text-lg text-secondary-700 dark:text-secondary-300">
                Explore {totalCount.toLocaleString()} delicious recipes from our community.
              </p>
            </div>

            {isAuthenticated && (
              <Link to="/app/recipes/create">
                <Button
                  size="lg"
                  className="w-full md:w-auto"
                  leftIcon={<Plus className="w-5 h-5" />}
                >
                  Create Recipe
                </Button>
              </Link>
            )}
          </div>

          {/* Quick Stats - Responsive Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <Card className="p-4 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <h3 className="text-3xl font-bold text-primary-500">
                {totalCount.toLocaleString()}
              </h3>
              <p className="text-sm text-secondary-700 dark:text-secondary-300 mt-1">Total Recipes</p>
            </Card>
            <Card className="p-4 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <h3 className="text-3xl font-bold text-green-500">
                {Math.floor(totalCount * 0.3).toLocaleString()}
              </h3>
              <p className="text-sm text-secondary-700 dark:text-secondary-300 mt-1">Quick & Easy</p>
            </Card>
            <Card className="p-4 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <h3 className="text-3xl font-bold text-amber-500">
                {Math.floor(totalCount * 0.4).toLocaleString()}
              </h3>
              <p className="text-sm text-secondary-700 dark:text-secondary-300 mt-1">Popular</p>
            </Card>
            <Card className="p-4 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <h3 className="text-3xl font-bold text-violet-500">
                {Math.floor(totalCount * 0.25).toLocaleString()}
              </h3>
              <p className="text-sm text-secondary-700 dark:text-secondary-300 mt-1">Trending</p>
            </Card>
          </div>
        </div>

        {/* Enhanced Search and Filtering Section */}
        <Card className="p-4 sm:p-6 mb-8 md:mb-12">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-700 dark:text-secondary-300" />
              <Input
                type="text"
                placeholder="Search recipes, ingredients, or techniques..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5"
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
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 rounded-full"
                  aria-label="Clear search"
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
              <h3 className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                Quick Filters
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {quickFilters.map((filter) => {
                const isSelected = filters.quickFilters.includes(filter.key)
                return (
                  <Button
                    key={filter.key}
                    variant={isSelected ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleQuickFilter(filter.key)}
                    className="transition-all duration-200"
                    leftIcon={
                      isSelected ? (
                        <Check className="h-4 w-4" />
                      ) : typeof filter.icon === 'string' ? (
                        <span className="text-base">{filter.icon}</span>
                      ) : (
                        <filter.icon className="h-4 w-4" style={{ color: filter.color }} />
                      )
                    }
                  >
                    {filter.label}
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Left Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant={showFilters ? 'primary' : 'outline'}
                onClick={() => setShowFilters(!showFilters)}
                leftIcon={<SlidersHorizontal className="h-4 w-4" />}
              >
                Advanced Filters
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
              {isAuthenticated && (
                <Button
                  variant={filters.myRecipes ? 'danger' : 'outline'}
                  onClick={() => handleFilterChange('myRecipes', String(!filters.myRecipes))}
                  leftIcon={<Heart className="h-4 w-4" />}
                >
                  My Recipes
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                className="text-white bg-accent-600 hover:bg-accent-700 disabled:opacity-50"
                leftIcon={<X className="h-4 w-4" />}
              >
                Clear
              </Button>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="min-w-[160px]"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <div className="flex items-center border rounded-lg p-1 bg-background">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                  onClick={() => setViewMode('grid')}
                  className="p-2"
                  aria-label="Grid View"
                >
                  <LayoutGrid className="h-5 w-5" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'ghost'}
                  onClick={() => setViewMode('list')}
                  className="p-2"
                  aria-label="List View"
                >
                  <LayoutList className="h-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <Card className="p-6 mb-8 md:mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-primary-500" />
                <span>Advanced Filters</span>
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(false)}
                className="h-8 w-8 p-0 rounded-full"
                aria-label="Close filters"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">
                  <ChefHat className="h-4 w-4 inline mr-2" />
                  Difficulty Level
                </label>
                <div className="flex flex-col gap-2">
                  {filterOptions.difficulty.map((option) => (
                    <Button
                      key={option.value}
                      variant={filters.difficulty === option.value ? 'primary' : 'outline'}
                      onClick={() => handleFilterChange('difficulty', option.value)}
                      className="w-full justify-start"
                      style={filters.difficulty !== option.value ? { color: option.color } : {}}
                    >
                      {option.label}
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
                <div className="flex flex-col gap-2">
                  {filterOptions.cookTime.map((option) => (
                    <Button
                      key={option.value}
                      variant={filters.cookTime === option.value ? 'primary' : 'outline'}
                      onClick={() => handleFilterChange('cookTime', option.value)}
                      className="w-full justify-start"
                      leftIcon={<option.icon className="h-4 w-4" style={filters.cookTime !== option.value ? { color: option.color } : {}} />}
                    >
                      {option.label}
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
                <div className="flex flex-col gap-2">
                  {filterOptions.category.map((option) => (
                    <Button
                      key={option.value}
                      variant={filters.category === option.value ? 'primary' : 'outline'}
                      onClick={() => handleFilterChange('category', option.value)}
                      className="w-full justify-start"
                    >
                      <span className="text-base mr-2">{option.icon}</span>
                      {option.label}
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
                <div className="flex flex-col gap-2">
                  {filterOptions.cuisine.map((option) => (
                    <Button
                      key={option.value}
                      variant={filters.cuisine === option.value ? 'primary' : 'outline'}
                      onClick={() => handleFilterChange('cuisine', option.value)}
                      className="w-full justify-start"
                    >
                      <span className="text-base mr-2">{option.flag}</span>
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="text-secondary-700 dark:text-secondary-300">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loading variant="spinner" size="sm" />
                Searching recipes...
              </span>
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
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16">
            <Loading variant="spinner" size="lg" text="Discovering delicious recipes..." />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-16">
            <Card className="max-w-md mx-auto p-8">
              <Frown className="w-16 h-16 text-accent-500 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-3">
                Oops! Something went wrong
              </h2>
              <p className="text-secondary-700 dark:text-secondary-300 mb-8">
                We couldn&apos;t load the recipes. Please try again later.
              </p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </Card>
          </div>
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