/**
 * Recipes list page
 * Main recipe discovery interface with search, filters, and pagination
 */

import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search, Filter, Clock, Users, Star, Heart, ChefHat, Grid, List, TrendingUp } from 'lucide-react'

// UI Components
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'

// Services
import { recipesApi } from '@/services/api/recipes'

// Types
import type { Recipe, RecipeSearchParams } from '@/types'

/**
 * View mode type
 */
type ViewMode = 'grid' | 'list'

/**
 * Filter options configuration
 */
const filterOptions = {
  difficulty: [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ],
  cookTime: [
    { value: '15', label: 'Under 15 min' },
    { value: '30', label: 'Under 30 min' },
    { value: '60', label: 'Under 1 hour' },
    { value: '120', label: 'Under 2 hours' }
  ],
  category: [
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'snack', label: 'Snack' },
    { value: 'dessert', label: 'Dessert' }
  ]
}

/**
 * Quick filter buttons
 */
const quickFilters = [
  { key: 'popular', label: 'Popular', icon: TrendingUp },
  { key: 'quick', label: 'Quick (< 30min)', icon: Clock },
  { key: 'easy', label: 'Easy', icon: ChefHat },
  { key: 'favorites', label: 'Favorites', icon: Heart }
]

const Recipes: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showFilters, setShowFilters] = useState(false)

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [filters, setFilters] = useState({
    difficulty: searchParams.get('difficulty') || '',
    cookTime: searchParams.get('cookTime') || '',
    category: searchParams.get('category') || '',
    quickFilter: searchParams.get('filter') || ''
  })

  const currentPage = parseInt(searchParams.get('page') || '1')
  const pageSize = 12

  /**
   * Build search parameters for API
   */
  const buildSearchParams = (): RecipeSearchParams => {
    const params: RecipeSearchParams = {
      offset: (currentPage - 1) * pageSize,
      limit: pageSize
    }

    if (searchQuery.trim()) {
      params.search = searchQuery.trim()
    }

    if (filters.difficulty) {
      params.difficulty = filters.difficulty
    }

    if (filters.quickFilter) {
      switch (filters.quickFilter) {
        case 'popular':
          params.sortBy = 'createdAt'
          params.sortOrder = 'desc'
          break
        case 'quick':
          // Will filter on frontend for now since API doesn't support maxCookTime
          break
        case 'easy':
          params.difficulty = 'easy'
          break
        case 'favorites':
          // Will handle on frontend for now
          break
      }
    }

    return params
  }

  /**
   * Fetch recipes with React Query
   */
  const {
    data: recipesData,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['recipes', searchQuery, filters, currentPage],
    queryFn: () => recipesApi.getRecipes(buildSearchParams())
  })

  /**
   * Update URL search params when filters change
   */
  useEffect(() => {
    const params = new URLSearchParams()

    if (searchQuery) params.set('search', searchQuery)
    if (filters.difficulty) params.set('difficulty', filters.difficulty)
    if (filters.cookTime) params.set('cookTime', filters.cookTime)
    if (filters.category) params.set('category', filters.category)
    if (filters.quickFilter) params.set('filter', filters.quickFilter)
    if (currentPage > 1) params.set('page', currentPage.toString())

    setSearchParams(params, { replace: true })
  }, [searchQuery, filters, currentPage, setSearchParams])

  /**
   * Handle search input
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search will be triggered by useQuery when searchQuery changes
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev)
      if (searchQuery.trim()) {
        newParams.set('search', searchQuery.trim())
      } else {
        newParams.delete('search')
      }
      newParams.delete('page') // Reset to first page
      return newParams
    })
  }

  /**
   * Handle filter changes
   */
  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }))
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev)
      if (value) {
        newParams.set(filterType, value)
      } else {
        newParams.delete(filterType)
      }
      newParams.delete('page') // Reset to first page
      return newParams
    })
  }

  /**
   * Handle quick filter selection
   */
  const handleQuickFilter = (filterKey: string) => {
    const newValue = filters.quickFilter === filterKey ? '' : filterKey
    setFilters(prev => ({ ...prev, quickFilter: newValue }))
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev)
      if (newValue) {
        newParams.set('filter', newValue)
      } else {
        newParams.delete('filter')
      }
      newParams.delete('page') // Reset to first page
      return newParams
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
      quickFilter: ''
    })
    setSearchParams({})
  }

  /**
   * Handle pagination
   */
  const handlePageChange = (page: number) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev)
      if (page > 1) {
        newParams.set('page', page.toString())
      } else {
        newParams.delete('page')
      }
      return newParams
    })
  }

  /**
   * Render recipe card
   */
  const renderRecipeCard = (recipe: Recipe) => (
    <Link key={recipe.id} to={`/recipes/${recipe.id}`} className="group">
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
        {/* Recipe Image */}
        <div className="aspect-w-16 aspect-h-9 bg-gray-200">
          <img
            src={recipe.imageUrl || '/api/placeholder/300/200'}
            alt={recipe.title}
            className="w-full h-48 object-cover"
          />
          {/* Favorite Button */}
          <div className="absolute top-3 right-3">
            <button className="p-2 bg-white/80 hover:bg-white rounded-full transition-colors">
              <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
            </button>
          </div>
        </div>

        {/* Recipe Details */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
            {recipe.title}
          </h3>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {recipe.description}
          </p>

          {/* Recipe Meta */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {recipe.cookTime}m
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {recipe.servings}
              </div>
            </div>
            <div className="text-xs bg-gray-100 px-2 py-1 rounded-full">
              {recipe.difficulty}
            </div>
          </div>

          {/* Rating */}
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
  )

  const recipes = recipesData?.recipes || []
  const totalPages = recipesData?.pagination?.totalPages || 1
  const totalCount = recipesData?.pagination?.total || 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Discover Recipes
          </h1>
          <p className="text-gray-600">
            Find your next favorite dish from our collection of {totalCount.toLocaleString()} recipes
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search recipes, ingredients, or cuisines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">
              Search
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </form>
        </div>

        {/* Quick Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {quickFilters.map((filter) => (
              <Button
                key={filter.key}
                variant={filters.quickFilter === filter.key ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => handleQuickFilter(filter.key)}
              >
                <filter.icon className="h-4 w-4 mr-1" />
                {filter.label}
              </Button>
            ))}
            {(searchQuery || Object.values(filters).some(Boolean)) && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <Card className="p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  value={filters.difficulty}
                  onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Any difficulty</option>
                  {filterOptions.difficulty.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cook Time Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cook Time
                </label>
                <select
                  value={filters.cookTime}
                  onChange={(e) => handleFilterChange('cookTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Any time</option>
                  {filterOptions.cookTime.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Any category</option>
                  {filterOptions.category.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>
        )}

        {/* View Controls and Results Count */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-600">
            {isLoading ? (
              'Loading recipes...'
            ) : (
              `Showing ${recipes.length} of ${totalCount.toLocaleString()} recipes`
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-gray-600">Loading delicious recipes...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">
              Failed to load recipes: {error?.message || 'Unknown error'}
            </p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        )}

        {/* Recipes Grid */}
        {!isLoading && !isError && (
          <>
            {recipes.length > 0 ? (
              <div className={`grid gap-6 mb-8 ${viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
                }`}>
                {recipes.map(renderRecipeCard)}
              </div>
            ) : (
              <div className="text-center py-12">
                <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No recipes found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filters to find more recipes.
                </p>
                <Button onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <Button
                  variant="ghost"
                  disabled={currentPage <= 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </Button>

                {/* Page Numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i
                  if (page > totalPages) return null

                  return (
                    <Button
                      key={page}
                      variant={page === currentPage ? 'primary' : 'ghost'}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  )
                })}

                <Button
                  variant="ghost"
                  disabled={currentPage >= totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Recipes