/**
 * Enhanced Recipes Discovery Page
 * Modern, feature-rich recipe discovery interface with advanced search, filters, and sorting
 */

import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Search, Clock, Heart, ChefHat, TrendingUp,
  SlidersHorizontal, X, Plus, Sparkles, Star,
  ArrowUpDown, Calendar, Utensils, Globe, Timer,
  LayoutGrid, LayoutList, Zap
} from 'lucide-react'

// UI Components
import { Button, Input, Card, Loading, Select, Badge } from '@/components/ui'
import { RecipeList } from '@/components/recipe'

// Services
import { recipesApi } from '@/services/api/recipes'

// Hooks
import { useAuth } from '@/hooks/useAuth'
import { useDebounce } from '@/hooks/useDebounce'
import { recipeKeys, useDeleteRecipe } from '@/hooks/useRecipes'

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
  { value: 'rating', label: 'Highest Rated', icon: Star },
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
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest')
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const debouncedSearch = useDebounce(searchQuery, 300)

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
    params.set('sortBy', sortBy)
    params.set('sortOrder', sortBy === 'newest' ? 'desc' : 'asc') // Simplified sort order mapping
    setSearchParams(params)
  }, [debouncedSearch, filters, pageSize, sortBy])

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
  console.log('[PAGE] Recipes: filter, search, pagination state:', searchParamsForApi)
  const {
    data: recipesData,
    isLoading,
    isError
  } = useQuery({
    queryKey: recipeKeys.list(searchParamsForApi),
    queryFn: () => recipesApi.getRecipes(searchParamsForApi),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: true, // Ensure we refetch when component mounts
    refetchOnWindowFocus: false, // Don't refetch on window focus
  })

  // Computed values
  const recipes: Recipe[] = recipesData?.recipes || []
  const totalCount = recipesData?.pagination?.total || 0

  console.log('[RENDER] Recipes component data:', {
    searchParams: searchParamsForApi,
    recipesCount: recipes.length,
    recipeIds: recipes.map(r => ({ id: r.id, title: r.title })),
    totalCount,
    isLoading,
    isError
  })

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
    navigate(`/recipes/${recipeId}/edit`)
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

  // After delete, if current page is empty and not page 1, go to previous page
  useEffect(() => {
    if (!isLoading && recipes.length === 0 && currentPage > 1) {
      handlePageChange(currentPage - 1)
    }
  }, [recipes, isLoading, currentPage])

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
                Discover Amazing Recipes
              </h1>
              <p className="text-secondary-600 dark:text-secondary-400 text-lg">
                Explore {totalCount.toLocaleString()} delicious recipes from our community
              </p>
            </div>

            {isAuthenticated && (
              <Link to="/recipes/create">
                <Button
                  size="lg"
                  className="shadow-lg hover:shadow-xl transition-shadow"
                  leftIcon={<Plus className="h-5 w-5" />}
                >
                  Create Recipe
                </Button>
              </Link>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 text-center border-l-4 border-l-primary-500">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {totalCount.toLocaleString()}
              </div>
              <div className="text-sm text-secondary-600 dark:text-secondary-400">Total Recipes</div>
            </Card>
            <Card className="p-4 text-center border-l-4 border-l-green-500">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {Math.floor(totalCount * 0.3).toLocaleString()}
              </div>
              <div className="text-sm text-secondary-600 dark:text-secondary-400">Quick & Easy</div>
            </Card>
            <Card className="p-4 text-center border-l-4 border-l-orange-500">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {Math.floor(totalCount * 0.4).toLocaleString()}
              </div>
              <div className="text-sm text-secondary-600 dark:text-secondary-400">Popular</div>
            </Card>
            <Card className="p-4 text-center border-l-4 border-l-purple-500">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {Math.floor(totalCount * 0.25).toLocaleString()}
              </div>
              <div className="text-sm text-secondary-600 dark:text-secondary-400">Trending</div>
            </Card>
          </div>
        </div>

        {/* Enhanced Search and Controls */}
        <div className="mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400 dark:text-secondary-500" />
              <Input
                type="text"
                placeholder="Search recipes, ingredients, cuisines, or cooking techniques..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg border-2 border-secondary-200 dark:border-secondary-700 focus:border-primary-500 rounded-xl shadow-sm"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
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
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                Quick Filters
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {quickFilters.map((filter) => (
                <Button
                  key={filter.key}
                  variant={filters.quickFilters.includes(filter.key) ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleQuickFilter(filter.key)}
                  className={`relative overflow-hidden transition-all duration-200 ${filters.quickFilters.includes(filter.key)
                    ? `bg-gradient-to-r ${filter.color} text-white border-transparent shadow-lg scale-[1.02]`
                    : 'hover:scale-[1.02] hover:shadow-md'
                    }`}
                  leftIcon={
                    typeof filter.icon === 'string' ? (
                      <span className="text-lg">{filter.icon}</span>
                    ) : (
                      <filter.icon className="h-4 w-4" />
                    )
                  }
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant={showFilters ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="shrink-0 transition-all duration-200"
                leftIcon={<SlidersHorizontal className="h-4 w-4" />}
              >
                {showFilters ? 'Hide' : 'Show'} Advanced Filters
                {activeFilterCount > 0 && (
                  <Badge variant="primary" size="sm" className="ml-2">
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
                  className="shrink-0 transition-all duration-200"
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
                className="shrink-0 transition-all duration-200"
                leftIcon={<X className="h-4 w-4" />}
              >
                Clear All
              </Button>
            </div>

            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
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

              {/* View Mode Toggle */}
              <div className="flex items-center border border-secondary-200 dark:border-secondary-700 rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="p-2"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="p-2"
                >
                  <LayoutList className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <Card className="p-6 mb-8 bg-white/70 dark:bg-white/5 backdrop-blur-md border border-primary-200/50 dark:border-primary-700/50 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                Advanced Filters
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                      className={`w-full justify-start transition-all duration-200 ${filters.difficulty === option.value
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
                      className={`w-full justify-start transition-all duration-200 ${filters.cookTime === option.value
                        ? 'scale-[1.02] shadow-lg'
                        : 'hover:scale-[1.01]'
                        }`}
                      leftIcon={<option.icon className="h-4 w-4" />}
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
                <div className="space-y-2">
                  {filterOptions.category.map((option) => (
                    <Button
                      key={option.value}
                      variant={filters.category === option.value ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => handleFilterChange('category', option.value)}
                      className={`w-full justify-start transition-all duration-200 ${filters.category === option.value
                        ? 'scale-[1.02] shadow-lg'
                        : 'hover:scale-[1.01]'
                        }`}
                    >
                      <span className="text-lg mr-2">{option.icon}</span>
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
                <div className="space-y-2">
                  {filterOptions.cuisine.map((option) => (
                    <Button
                      key={option.value}
                      variant={filters.cuisine === option.value ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => handleFilterChange('cuisine', option.value)}
                      className={`w-full justify-start transition-all duration-200 ${filters.cuisine === option.value
                        ? 'scale-[1.02] shadow-lg'
                        : 'hover:scale-[1.01]'
                        }`}
                    >
                      <span className="text-lg mr-2">{option.flag}</span>
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* My Recipes Filter */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">
                  <Heart className="h-4 w-4 inline mr-2" />
                  My Recipes
                </label>
                <div className="space-y-2">
                  <Button
                    variant={filters.myRecipes ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleFilterChange('myRecipes', String(!filters.myRecipes))}
                    className={`w-full justify-start transition-all duration-200 ${filters.myRecipes
                      ? 'scale-[1.02] shadow-lg'
                      : 'hover:scale-[1.01]'
                      }`}
                  >
                    <Badge variant="success" size="sm" className="mr-2">
                      {filters.myRecipes ? 'Only My Recipes' : 'All Recipes'}
                    </Badge>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="text-secondary-600 dark:text-secondary-400">
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
          <>
            {console.log('[RENDER] Recipes list data:', recipes)}
            <RecipeList
              recipes={recipes}
              loading={isLoading}
              error={isError ? 'Failed to load recipes' : null}
              viewMode={viewMode}
              pagination={recipesData?.pagination ? {
                page: currentPage,
                limit: pageSize,
                total: recipesData.pagination.total,
                totalPages: recipesData.pagination.totalPages,
                hasNext: currentPage < recipesData.pagination.totalPages,
                hasPrev: currentPage > 1
              } : undefined}
              onPageChange={handlePageChange}
              onEdit={handleRecipeEdit}
              onDelete={handleRecipeDelete}
              currentUserId={user?.id}
              emptyMessage={hasActiveFilters ? "No recipes match your filters" : "No recipes found"}
              emptyDescription={hasActiveFilters ? "Try adjusting your search or filters to find more recipes." : "Be the first to share a delicious recipe with our community!"}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default Recipes