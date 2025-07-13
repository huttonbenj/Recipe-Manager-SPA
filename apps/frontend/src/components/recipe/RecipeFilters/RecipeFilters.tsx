/**
 * RecipeFilters component
 * Comprehensive filtering interface for recipe discovery
 */

import React, { useState, useEffect } from 'react'
import { Search, Filter, X, TrendingUp, Clock, ChefHat, Heart, Utensils } from 'lucide-react'

// UI Components
import { Button, Input, Card, Badge } from '@/components/ui'

// Types
export interface FilterState {
    search: string
    difficulty: string
    cookTime: string
    cuisine: string
    tags: string[]
    quickFilter: string
}

export interface RecipeFiltersProps {
    filters: FilterState
    onFiltersChange: (filters: FilterState) => void
    onSearch: (query: string) => void
    loading?: boolean
    showAdvanced?: boolean
    className?: string
}

/**
 * Filter options configuration
 */
const filterOptions = {
    difficulty: [
        { value: 'easy', label: 'Easy', color: 'green' },
        { value: 'medium', label: 'Medium', color: 'yellow' },
        { value: 'hard', label: 'Hard', color: 'red' }
    ],
    cookTime: [
        { value: '15', label: 'Under 15 min', icon: Clock },
        { value: '30', label: 'Under 30 min', icon: Clock },
        { value: '60', label: 'Under 1 hour', icon: Clock },
        { value: '120', label: 'Under 2 hours', icon: Clock }
    ],
    cuisine: [
        { value: 'italian', label: 'Italian', flag: '🇮🇹' },
        { value: 'mexican', label: 'Mexican', flag: '🇲🇽' },
        { value: 'chinese', label: 'Chinese', flag: '🇨🇳' },
        { value: 'indian', label: 'Indian', flag: '🇮🇳' },
        { value: 'french', label: 'French', flag: '🇫🇷' },
        { value: 'thai', label: 'Thai', flag: '🇹🇭' },
        { value: 'japanese', label: 'Japanese', flag: '🇯🇵' },
        { value: 'mediterranean', label: 'Mediterranean', flag: '🌊' },
        { value: 'american', label: 'American', flag: '🇺🇸' },
        { value: 'korean', label: 'Korean', flag: '🇰🇷' }
    ],
    mealType: [
        { value: 'breakfast', label: 'Breakfast', icon: '🌅' },
        { value: 'lunch', label: 'Lunch', icon: '☀️' },
        { value: 'dinner', label: 'Dinner', icon: '🌙' },
        { value: 'snack', label: 'Snack', icon: '🍿' },
        { value: 'dessert', label: 'Dessert', icon: '🍰' },
        { value: 'appetizer', label: 'Appetizer', icon: '🥗' }
    ]
}

/**
 * Quick filter buttons with enhanced styling
 */
const quickFilters = [
    {
        key: 'popular',
        label: 'Trending',
        icon: TrendingUp,
        color: 'bg-gradient-to-r from-purple-500 to-pink-500',
        description: 'Most loved recipes'
    },
    {
        key: 'quick',
        label: 'Quick & Easy',
        icon: Clock,
        color: 'bg-gradient-to-r from-green-500 to-teal-500',
        description: 'Ready in 30 minutes'
    },
    {
        key: 'easy',
        label: 'Beginner Friendly',
        icon: ChefHat,
        color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
        description: 'Perfect for new cooks'
    },
    {
        key: 'favorites',
        label: 'Community Favorites',
        icon: Heart,
        color: 'bg-gradient-to-r from-red-500 to-pink-500',
        description: 'Highly rated recipes'
    },
    {
        key: 'healthy',
        label: 'Healthy Options',
        icon: Utensils,
        color: 'bg-gradient-to-r from-emerald-500 to-green-500',
        description: 'Nutritious and delicious'
    }
]

const RecipeFilters: React.FC<RecipeFiltersProps> = ({
    filters,
    onFiltersChange,
    onSearch,
    loading = false,
    showAdvanced = false,
    className = ''
}) => {
    const [localSearch, setLocalSearch] = useState(filters.search)
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(showAdvanced)
    const [searchDebounceTimer, setSearchDebounceTimer] = useState<NodeJS.Timeout | null>(null)

    /**
     * Handle search input with debouncing
     */
    useEffect(() => {
        if (searchDebounceTimer) {
            clearTimeout(searchDebounceTimer)
        }

        const timer = setTimeout(() => {
            if (localSearch !== filters.search) {
                onSearch(localSearch)
            }
        }, 300)

        setSearchDebounceTimer(timer)

        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [localSearch])

    /**
     * Update filters
     */
    const updateFilter = (key: keyof FilterState, value: any) => {
        const newFilters = { ...filters, [key]: value }
        onFiltersChange(newFilters)
    }

    /**
     * Handle quick filter selection
     */
    const handleQuickFilter = (filterKey: string) => {
        const newQuickFilter = filters.quickFilter === filterKey ? '' : filterKey
        updateFilter('quickFilter', newQuickFilter)
    }

    /**
     * Handle search form submission
     */
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSearch(localSearch)
    }

    /**
     * Clear all filters
     */
    const clearAllFilters = () => {
        setLocalSearch('')
        onFiltersChange({
            search: '',
            difficulty: '',
            cookTime: '',
            cuisine: '',
            tags: [],
            quickFilter: ''
        })
    }

    /**
     * Check if any filters are active
     */
    const hasActiveFilters = () => {
        return (
            filters.search ||
            filters.difficulty ||
            filters.cookTime ||
            filters.cuisine ||
            filters.quickFilter ||
            filters.tags.length > 0
        )
    }

    /**
     * Get active filter count
     */
    const getActiveFilterCount = () => {
        let count = 0
        if (filters.search) count++
        if (filters.difficulty) count++
        if (filters.cookTime) count++
        if (filters.cuisine) count++
        if (filters.quickFilter) count++
        count += filters.tags.length
        return count
    }

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="flex gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search recipes, ingredients, or cuisines..."
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        className="pl-10 pr-4"
                        disabled={loading}
                    />
                    {localSearch && (
                        <button
                            type="button"
                            onClick={() => setLocalSearch('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
                <Button type="submit" disabled={loading}>
                    Search
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="relative"
                >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {getActiveFilterCount() > 0 && (
                        <Badge
                            variant="primary"
                            className="absolute -top-2 -right-2 min-w-[1.25rem] h-5 text-xs flex items-center justify-center"
                        >
                            {getActiveFilterCount()}
                        </Badge>
                    )}
                </Button>
            </form>

            {/* Quick Filters */}
            <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700">Quick Filters</h3>
                <div className="flex flex-wrap gap-3">
                    {quickFilters.map((filter) => (
                        <button
                            key={filter.key}
                            onClick={() => handleQuickFilter(filter.key)}
                            className={`group relative overflow-hidden rounded-xl p-4 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg ${filters.quickFilter === filter.key
                                    ? `${filter.color} shadow-lg scale-105`
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <div className="flex items-center space-x-3">
                                <filter.icon className={`h-5 w-5 ${filters.quickFilter === filter.key ? 'text-white' : 'text-gray-600'
                                    }`} />
                                <div className="text-left">
                                    <div className={`font-medium text-sm ${filters.quickFilter === filter.key ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        {filter.label}
                                    </div>
                                    <div className={`text-xs opacity-80 ${filters.quickFilter === filter.key ? 'text-white' : 'text-gray-600'
                                        }`}>
                                        {filter.description}
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters() && (
                <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600">
                        {getActiveFilterCount()} filter{getActiveFilterCount() !== 1 ? 's' : ''} active
                    </span>
                    <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                        Clear All
                    </Button>
                </div>
            )}

            {/* Advanced Filters */}
            {showAdvancedFilters && (
                <Card className="p-6">
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                            Advanced Filters
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Difficulty Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Difficulty Level
                                </label>
                                <div className="space-y-2">
                                    {filterOptions.difficulty.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => updateFilter('difficulty',
                                                filters.difficulty === option.value ? '' : option.value
                                            )}
                                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-colors ${filters.difficulty === option.value
                                                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                                }`}
                                        >
                                            <span>{option.label}</span>
                                            <div className={`w-3 h-3 rounded-full ${option.color === 'green' ? 'bg-green-500' :
                                                    option.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                                                }`} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Cook Time Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Cooking Time
                                </label>
                                <div className="space-y-2">
                                    {filterOptions.cookTime.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => updateFilter('cookTime',
                                                filters.cookTime === option.value ? '' : option.value
                                            )}
                                            className={`w-full flex items-center px-3 py-2 rounded-lg border transition-colors ${filters.cookTime === option.value
                                                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                                }`}
                                        >
                                            <option.icon className="h-4 w-4 mr-2" />
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Cuisine Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Cuisine Type
                                </label>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {filterOptions.cuisine.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => updateFilter('cuisine',
                                                filters.cuisine === option.value ? '' : option.value
                                            )}
                                            className={`w-full flex items-center px-3 py-2 rounded-lg border transition-colors ${filters.cuisine === option.value
                                                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                                }`}
                                        >
                                            <span className="mr-2">{option.flag}</span>
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Meal Type Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Meal Type
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {filterOptions.mealType.map((option) => (
                                    <Button
                                        key={option.value}
                                        variant={filters.tags.includes(option.value) ? 'primary' : 'ghost'}
                                        size="sm"
                                        onClick={() => {
                                            const newTags = filters.tags.includes(option.value)
                                                ? filters.tags.filter(tag => tag !== option.value)
                                                : [...filters.tags, option.value]
                                            updateFilter('tags', newTags)
                                        }}
                                        className="flex items-center"
                                    >
                                        <span className="mr-1">{option.icon}</span>
                                        {option.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    )
}

export default RecipeFilters 