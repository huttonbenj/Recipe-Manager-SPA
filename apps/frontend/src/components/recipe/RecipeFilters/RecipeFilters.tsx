/**
 * RecipeFilters component
 * Comprehensive filtering interface for recipe discovery
 */

import React, { useState, useEffect } from 'react'
import { Search, Filter, X, TrendingUp, Clock, ChefHat, Heart, Utensils, ChevronDown } from 'lucide-react'

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
        { value: 'easy', label: 'Easy', color: 'success' as const },
        { value: 'medium', label: 'Medium', color: 'warning' as const },
        { value: 'hard', label: 'Hard', color: 'danger' as const }
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
        color: 'from-purple-500 to-pink-500',
        description: 'Most loved recipes'
    },
    {
        key: 'quick',
        label: 'Quick & Easy',
        icon: Clock,
        color: 'from-green-500 to-teal-500',
        description: 'Ready in 30 minutes'
    },
    {
        key: 'easy',
        label: 'Beginner Friendly',
        icon: ChefHat,
        color: 'from-blue-500 to-cyan-500',
        description: 'Perfect for new cooks'
    },
    {
        key: 'favorites',
        label: 'Community Favorites',
        icon: Heart,
        color: 'from-red-500 to-pink-500',
        description: 'Highly rated recipes'
    },
    {
        key: 'healthy',
        label: 'Healthy Options',
        icon: Utensils,
        color: 'from-emerald-500 to-green-500',
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
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400 dark:text-secondary-500" />
                    <Input
                        type="text"
                        placeholder="Search recipes, ingredients, or cuisines..."
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        className="pl-10 pr-4"
                        disabled={loading}
                        aria-label="Search recipes"
                    />
                    {localSearch && (
                        <button
                            type="button"
                            onClick={() => setLocalSearch('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600 dark:text-secondary-500 dark:hover:text-secondary-300 transition-colors"
                            aria-label="Clear search"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
                <div className="flex gap-2">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="whitespace-nowrap"
                    >
                        Search
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        className="relative whitespace-nowrap"
                        aria-expanded={showAdvancedFilters}
                        aria-controls="advanced-filters"
                    >
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                        <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${showAdvancedFilters ? 'rotate-180' : ''}`} />
                        {getActiveFilterCount() > 0 && (
                            <Badge
                                variant="primary"
                                className="absolute -top-2 -right-2 min-w-[1.25rem] h-5 text-xs flex items-center justify-center"
                            >
                                {getActiveFilterCount()}
                            </Badge>
                        )}
                    </Button>
                </div>
            </form>

            {/* Quick Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {quickFilters.map((filter) => {
                    const isActive = filters.quickFilter === filter.key
                    const Icon = filter.icon
                    return (
                        <button
                            key={filter.key}
                            onClick={() => handleQuickFilter(filter.key)}
                            className={`
                                relative overflow-hidden rounded-lg p-4 text-left transition-all duration-300
                                ${isActive
                                    ? `bg-gradient-to-r ${filter.color} text-white shadow-md transform scale-[1.02]`
                                    : 'bg-white dark:bg-secondary-800 hover:bg-secondary-50 dark:hover:bg-secondary-700 border border-secondary-200 dark:border-secondary-700'
                                }
                            `}
                            aria-pressed={isActive}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`
                                    rounded-full p-2
                                    ${isActive
                                        ? 'bg-white/20'
                                        : 'bg-gradient-to-r ' + filter.color + ' text-white'
                                    }
                                `}>
                                    <Icon className="h-4 w-4" />
                                </div>
                                <div>
                                    <div className={`font-medium ${isActive ? 'text-white' : 'text-secondary-900 dark:text-secondary-100'}`}>
                                        {filter.label}
                                    </div>
                                    <div className={`text-xs ${isActive ? 'text-white/80' : 'text-secondary-500 dark:text-secondary-400'}`}>
                                        {filter.description}
                                    </div>
                                </div>
                            </div>
                        </button>
                    )
                })}
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
                <Card
                    id="advanced-filters"
                    className="animate-in fade-in slide-in-from-top-5 duration-300"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Difficulty Filter */}
                        <div>
                            <h3 className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-3">
                                Difficulty
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {filterOptions.difficulty.map((option) => (
                                    <Badge
                                        key={option.value}
                                        variant={filters.difficulty === option.value ? option.color : 'outline'}
                                        className={`
                                            cursor-pointer px-3 py-1 text-sm transition-all duration-200
                                            ${filters.difficulty === option.value ? 'shadow-sm' : ''}
                                        `}
                                        onClick={() => updateFilter('difficulty', filters.difficulty === option.value ? '' : option.value)}
                                    >
                                        {option.label}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Cook Time Filter */}
                        <div>
                            <h3 className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-3">
                                Cook Time
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {filterOptions.cookTime.map((option) => {
                                    const Icon = option.icon
                                    return (
                                        <Badge
                                            key={option.value}
                                            variant={filters.cookTime === option.value ? 'primary' : 'outline'}
                                            className={`
                                                cursor-pointer px-3 py-1 text-sm transition-all duration-200
                                                ${filters.cookTime === option.value ? 'shadow-sm' : ''}
                                            `}
                                            onClick={() => updateFilter('cookTime', filters.cookTime === option.value ? '' : option.value)}
                                        >
                                            <Icon className="h-3 w-3 mr-1" />
                                            {option.label}
                                        </Badge>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Cuisine Filter */}
                        <div>
                            <h3 className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-3">
                                Cuisine
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                {filterOptions.cuisine.slice(0, 6).map((option) => (
                                    <Badge
                                        key={option.value}
                                        variant={filters.cuisine === option.value ? 'primary' : 'outline'}
                                        className={`
                                            cursor-pointer px-3 py-1 text-sm transition-all duration-200
                                            ${filters.cuisine === option.value ? 'shadow-sm' : ''}
                                        `}
                                        onClick={() => updateFilter('cuisine', filters.cuisine === option.value ? '' : option.value)}
                                    >
                                        <span className="mr-1">{option.flag}</span>
                                        {option.label}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Active Filters & Clear All */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                                    Active Filters
                                </h3>
                                {hasActiveFilters() && (
                                    <Button
                                        variant="link"
                                        size="sm"
                                        onClick={clearAllFilters}
                                        className="text-xs h-auto p-0"
                                    >
                                        Clear All
                                    </Button>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {filters.search && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        <span>Search: {filters.search}</span>
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() => {
                                                setLocalSearch('')
                                                updateFilter('search', '')
                                            }}
                                        />
                                    </Badge>
                                )}

                                {filters.difficulty && (
                                    <Badge
                                        variant="secondary"
                                        className="flex items-center gap-1"
                                    >
                                        <span>Difficulty: {filterOptions.difficulty.find(d => d.value === filters.difficulty)?.label}</span>
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() => updateFilter('difficulty', '')}
                                        />
                                    </Badge>
                                )}

                                {filters.cookTime && (
                                    <Badge
                                        variant="secondary"
                                        className="flex items-center gap-1"
                                    >
                                        <span>Time: {filterOptions.cookTime.find(t => t.value === filters.cookTime)?.label}</span>
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() => updateFilter('cookTime', '')}
                                        />
                                    </Badge>
                                )}

                                {filters.cuisine && (
                                    <Badge
                                        variant="secondary"
                                        className="flex items-center gap-1"
                                    >
                                        <span>Cuisine: {filterOptions.cuisine.find(c => c.value === filters.cuisine)?.label}</span>
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() => updateFilter('cuisine', '')}
                                        />
                                    </Badge>
                                )}

                                {filters.quickFilter && (
                                    <Badge
                                        variant="secondary"
                                        className="flex items-center gap-1"
                                    >
                                        <span>Filter: {quickFilters.find(f => f.key === filters.quickFilter)?.label}</span>
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() => updateFilter('quickFilter', '')}
                                        />
                                    </Badge>
                                )}

                                {filters.tags.map(tag => (
                                    <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="flex items-center gap-1"
                                    >
                                        <span>Tag: {tag}</span>
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() => updateFilter('tags', filters.tags.filter(t => t !== tag))}
                                        />
                                    </Badge>
                                ))}

                                {!hasActiveFilters() && (
                                    <span className="text-sm text-secondary-500 dark:text-secondary-400">
                                        No active filters
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    )
}

export default RecipeFilters 