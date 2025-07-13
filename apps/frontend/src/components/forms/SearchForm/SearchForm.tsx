/**
 * SearchForm component
 * Enhanced search form with debouncing, suggestions, and search history
 */

import React, { useState, useEffect, useRef } from 'react'
import { Search, X, Clock, TrendingUp } from 'lucide-react'

// UI Components
import { Input, Button, Card } from '@/components/ui'

// Hooks
import { useDebounce } from '@/hooks'

export interface SearchFormProps {
    value?: string
    placeholder?: string
    onSearch: (query: string) => void
    onSubmit?: (query: string) => void
    debounceMs?: number
    showSuggestions?: boolean
    showHistory?: boolean
    suggestions?: string[]
    className?: string
}

/**
 * Popular search terms for suggestions
 */
const popularSearches = [
    'chicken recipes',
    'vegetarian meals',
    'quick dinners',
    'pasta dishes',
    'healthy breakfast',
    'dessert recipes',
    'soup recipes',
    'salad ideas'
]

const SearchForm: React.FC<SearchFormProps> = ({
    value = '',
    placeholder = 'Search recipes, ingredients, or cuisines...',
    onSearch,
    onSubmit,
    debounceMs = 300,
    showSuggestions = true,
    showHistory = true,
    suggestions = popularSearches,
    className = ''
}) => {
    const [searchQuery, setSearchQuery] = useState(value)
    const [showDropdown, setShowDropdown] = useState(false)
    const [searchHistory, setSearchHistory] = useState<string[]>([])
    const [isFocused, setIsFocused] = useState(false)

    const searchInputRef = useRef<HTMLInputElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Debounced search value
    const debouncedSearchQuery = useDebounce(searchQuery, debounceMs)

    /**
     * Load search history from localStorage on mount
     */
    useEffect(() => {
        if (showHistory) {
            const savedHistory = localStorage.getItem('recipe-search-history')
            if (savedHistory) {
                try {
                    setSearchHistory(JSON.parse(savedHistory))
                } catch (error) {
                    console.error('Error loading search history:', error)
                }
            }
        }
    }, [showHistory])

    /**
     * Save search history to localStorage
     */
    const saveSearchHistory = (query: string) => {
        if (!showHistory || !query.trim()) return

        const trimmedQuery = query.trim()
        const updatedHistory = [
            trimmedQuery,
            ...searchHistory.filter(item => item !== trimmedQuery)
        ].slice(0, 8) // Keep only last 8 searches

        setSearchHistory(updatedHistory)
        localStorage.setItem('recipe-search-history', JSON.stringify(updatedHistory))
    }

    /**
     * Handle debounced search
     */
    useEffect(() => {
        if (debouncedSearchQuery !== value) {
            onSearch(debouncedSearchQuery)
        }
    }, [debouncedSearchQuery, onSearch, value])

    /**
     * Handle form submission
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const trimmedQuery = searchQuery.trim()

        if (trimmedQuery) {
            saveSearchHistory(trimmedQuery)
            onSubmit?.(trimmedQuery)
            setShowDropdown(false)
            searchInputRef.current?.blur()
        }
    }

    /**
     * Handle input change
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setSearchQuery(newValue)
        setShowDropdown(newValue.length > 0 || isFocused)
    }

    /**
     * Handle input focus
     */
    const handleInputFocus = () => {
        setIsFocused(true)
        setShowDropdown(true)
    }

    /**
     * Handle input blur
     */
    const handleInputBlur = () => {
        // Delay hiding dropdown to allow clicking on items
        setTimeout(() => {
            setIsFocused(false)
            setShowDropdown(false)
        }, 200)
    }

    /**
     * Clear search
     */
    const clearSearch = () => {
        setSearchQuery('')
        onSearch('')
        setShowDropdown(false)
        searchInputRef.current?.focus()
    }

    /**
     * Handle suggestion/history click
     */
    const handleSuggestionClick = (suggestion: string) => {
        setSearchQuery(suggestion)
        onSearch(suggestion)
        saveSearchHistory(suggestion)
        onSubmit?.(suggestion)
        setShowDropdown(false)
        searchInputRef.current?.blur()
    }

    /**
     * Clear search history
     */
    const clearHistory = () => {
        setSearchHistory([])
        localStorage.removeItem('recipe-search-history')
    }

    /**
     * Filter suggestions based on current query
     */
    const getFilteredSuggestions = () => {
        if (!searchQuery.trim()) return suggestions.slice(0, 6)

        return suggestions
            .filter(suggestion =>
                suggestion.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .slice(0, 4)
    }

    /**
     * Get relevant search history
     */
    const getRelevantHistory = () => {
        if (!searchQuery.trim()) return searchHistory.slice(0, 4)

        return searchHistory
            .filter(item =>
                item.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .slice(0, 3)
    }

    /**
     * Handle click outside to close dropdown
     */
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                searchInputRef.current &&
                !searchInputRef.current.contains(event.target as Node)
            ) {
                setShowDropdown(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const filteredSuggestions = getFilteredSuggestions()
    const relevantHistory = getRelevantHistory()

    return (
        <div className={`relative ${className}`}>
            <form onSubmit={handleSubmit} className="flex gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400 dark:text-secondary-500 z-10" />
                    <Input
                        ref={searchInputRef}
                        type="text"
                        placeholder={placeholder}
                        value={searchQuery}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        className="pl-10 pr-10"
                        autoComplete="off"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 dark:text-secondary-500 hover:text-secondary-600 dark:hover:text-secondary-300 z-10"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
                <Button type="submit">
                    Search
                </Button>
            </form>

            {/* Search Dropdown */}
            {showDropdown && (showSuggestions || showHistory) && (
                <div
                    ref={dropdownRef}
                    className="absolute top-full left-0 right-0 mt-2 z-50"
                >
                    <Card className="py-2 shadow-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800">
                        {/* Search History */}
                        {showHistory && relevantHistory.length > 0 && (
                            <div className="mb-2">
                                <div className="flex items-center justify-between px-4 py-2 text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wide">
                                    <div className="flex items-center">
                                        <Clock className="h-3 w-3 mr-1" />
                                        Recent Searches
                                    </div>
                                    {searchHistory.length > 0 && (
                                        <button
                                            onClick={clearHistory}
                                            className="text-secondary-400 dark:text-secondary-500 hover:text-secondary-600 dark:hover:text-secondary-300"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>
                                {relevantHistory.map((item, index) => (
                                    <button
                                        key={`history-${index}`}
                                        onClick={() => handleSuggestionClick(item)}
                                        className="w-full text-left px-4 py-2 hover:bg-secondary-50 dark:hover:bg-secondary-700 flex items-center text-sm text-secondary-700 dark:text-secondary-200"
                                    >
                                        <Clock className="h-4 w-4 mr-3 text-secondary-400 dark:text-secondary-500" />
                                        {item}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Popular Suggestions */}
                        {showSuggestions && filteredSuggestions.length > 0 && (
                            <div>
                                {relevantHistory.length > 0 && (
                                    <div className="border-t border-secondary-100 dark:border-secondary-700 my-2" />
                                )}
                                <div className="px-4 py-2 text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wide">
                                    <div className="flex items-center">
                                        <TrendingUp className="h-3 w-3 mr-1" />
                                        {searchQuery.trim() ? 'Suggestions' : 'Popular Searches'}
                                    </div>
                                </div>
                                {filteredSuggestions.map((suggestion, index) => (
                                    <button
                                        key={`suggestion-${index}`}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="w-full text-left px-4 py-2 hover:bg-secondary-50 dark:hover:bg-secondary-700 flex items-center text-sm text-secondary-700 dark:text-secondary-200"
                                    >
                                        <Search className="h-4 w-4 mr-3 text-secondary-400 dark:text-secondary-500" />
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Empty State */}
                        {(!filteredSuggestions.length && !relevantHistory.length) && (
                            <div className="px-4 py-6 text-center text-secondary-500 dark:text-secondary-400 text-sm">
                                No suggestions available
                            </div>
                        )}
                    </Card>
                </div>
            )}
        </div>
    )
}

export default SearchForm 