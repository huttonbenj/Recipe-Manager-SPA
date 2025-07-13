/**
 * Recipes list page
 * Main recipe discovery interface with search, filters, and pagination
 */

import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, Filter, Clock, Heart, ChefHat, Grid, List, TrendingUp } from 'lucide-react'

// UI Components
import { Button, Input, Card, Loading, Select } from '@/components/ui'
import { RecipeList } from '@/components/recipe'

// Services
import { recipesApi } from '@/services/api/recipes'

// Hooks
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/context/ToastContext'

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
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const { success, error: showError } = useToast()

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
      page: currentPage,
      limit: pageSize
    }

    if (searchQuery.trim()) {
      params.search = searchQuery.trim()
    }

    if (filters.difficulty) {
      // Convert difficulty to uppercase to match backend enum
      params.difficulty = filters.difficulty.toUpperCase()
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
          // Convert difficulty to uppercase to match backend enum
          params.difficulty = 'EASY'
          break
        case 'favorites':
          // Will handle on frontend for now
          break
      }
    }

    return params
  }

  // Fetch recipes data
  const {
    data: recipesData,
    isLoading,
    isError,
    error: queryError
  } = useQuery({
    queryKey: ['recipes', searchQuery, filters, currentPage],
    queryFn: () => recipesApi.getRecipes(buildSearchParams())
  })

  /**
   * Delete recipe mutation
   */
  const deleteMutation = useMutation({
    mutationFn: (recipeId: string) => recipesApi.deleteRecipe(recipeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      success('Recipe deleted successfully')
    },
    onError: () => {
      showError('Failed to delete recipe. Please try again.')
    }
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
   * Handle recipe edit
   */
  const handleRecipeEdit = (recipeId: string) => {
    navigate(`/recipes/${recipeId}/edit`)
  }

  /**
   * Handle recipe delete
   */
  const handleRecipeDelete = (recipeId: string) => {
    if (window.confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
      deleteMutation.mutate(recipeId)
    }
  }



  const recipes: Recipe[] = recipesData?.recipes || []
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
                <Select
                  options={[
                    { value: '', label: 'Any difficulty' },
                    ...filterOptions.difficulty
                  ]}
                  value={filters.difficulty}
                  onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Cook Time Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cook Time
                </label>
                <Select
                  options={[
                    { value: '', label: 'Any time' },
                    ...filterOptions.cookTime
                  ]}
                  value={filters.cookTime}
                  onChange={(e) => handleFilterChange('cookTime', e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <Select
                  options={[
                    { value: '', label: 'Any category' },
                    ...filterOptions.category
                  ]}
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full"
                />
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
          <Loading />
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">
              Failed to load recipes: {queryError?.message || 'Unknown error'}
            </p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        )}

        {/* Recipe List */}
        <RecipeList
          recipes={recipes}
          loading={isLoading}
          error={isError ? queryError?.message || 'Failed to load recipes' : null}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
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
          emptyMessage="No recipes found"
          emptyDescription="Try adjusting your search or filters to find more recipes."
        />
      </div>
    </div>
  )
}

export default Recipes