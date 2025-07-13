/**
 * RecipeList component
 * Displays a list of recipes in grid or list format with pagination
 */

import React from 'react'
import { Grid, List, ChevronLeft, ChevronRight, ChefHat } from 'lucide-react'

// UI Components
import { Button } from '@/components/ui'
import RecipeCard from '../RecipeCard'

// Types
import type { Recipe, PaginationInfo } from '@/types'

export interface RecipeListProps {
    recipes: Recipe[]
    loading?: boolean
    error?: string | null
    viewMode?: 'grid' | 'list'
    onViewModeChange?: (mode: 'grid' | 'list') => void
    pagination?: PaginationInfo
    onPageChange?: (page: number) => void
    onFavorite?: (recipeId: string) => void
    onBookmark?: (recipeId: string) => void
    onShare?: (recipe: Recipe) => void
    emptyMessage?: string
    emptyDescription?: string
    className?: string
}

const RecipeList: React.FC<RecipeListProps> = ({
    recipes,
    loading = false,
    error = null,
    viewMode = 'grid',
    onViewModeChange,
    pagination,
    onPageChange,
    onFavorite,
    onBookmark,
    onShare,
    emptyMessage = 'No recipes found',
    emptyDescription = 'Try adjusting your search or filters to find more recipes.',
    className = ''
}) => {
    /**
     * Handle page navigation
     */
    const handlePageChange = (newPage: number) => {
        if (pagination && newPage >= 1 && newPage <= pagination.totalPages) {
            onPageChange?.(newPage)

            // Scroll to top of results
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    /**
     * Generate page numbers for pagination
     */
    const getPageNumbers = () => {
        if (!pagination) return []

        const { page, totalPages } = pagination
        const pages: (number | string)[] = []
        const maxVisiblePages = 7

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            // Smart pagination with ellipsis
            if (page <= 4) {
                // Near beginning
                for (let i = 1; i <= 5; i++) pages.push(i)
                pages.push('...')
                pages.push(totalPages)
            } else if (page >= totalPages - 3) {
                // Near end
                pages.push(1)
                pages.push('...')
                for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i)
            } else {
                // Middle
                pages.push(1)
                pages.push('...')
                for (let i = page - 1; i <= page + 1; i++) pages.push(i)
                pages.push('...')
                pages.push(totalPages)
            }
        }

        return pages
    }

    // Loading state
    if (loading) {
        return (
            <div className={`space-y-6 ${className}`}>
                {/* Loading skeletons */}
                <div className={`grid gap-6 ${viewMode === 'grid'
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-1'
                    }`}>
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className="animate-pulse">
                            <div className="bg-gray-200 rounded-lg overflow-hidden">
                                <div className="h-48 bg-gray-300"></div>
                                <div className="p-4 space-y-3">
                                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                                    <div className="flex space-x-4">
                                        <div className="h-3 bg-gray-300 rounded w-16"></div>
                                        <div className="h-3 bg-gray-300 rounded w-16"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    // Error state
    if (error) {
        return (
            <div className={`text-center py-12 ${className}`}>
                <div className="text-red-600 mb-4">
                    <ChefHat className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Failed to load recipes</p>
                    <p className="text-sm mt-2">{error}</p>
                </div>
                <Button onClick={() => window.location.reload()}>
                    Try Again
                </Button>
            </div>
        )
    }

    // Empty state
    if (!recipes || recipes.length === 0) {
        return (
            <div className={`text-center py-12 ${className}`}>
                <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {emptyMessage}
                </h3>
                <p className="text-gray-600 mb-4">
                    {emptyDescription}
                </p>
            </div>
        )
    }

    return (
        <div className={`space-y-6 ${className}`}>
            {/* View Controls and Results Count */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                    {pagination ? (
                        <>
                            Showing {((pagination.page - 1) * pagination.limit) + 1}-
                            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                            {pagination.total.toLocaleString()} recipes
                        </>
                    ) : (
                        `${recipes.length} recipe${recipes.length !== 1 ? 's' : ''}`
                    )}
                </div>

                {onViewModeChange && (
                    <div className="flex items-center gap-2">
                        <Button
                            variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => onViewModeChange('grid')}
                        >
                            <Grid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => onViewModeChange('list')}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>

            {/* Recipe Grid/List */}
            <div className={`grid gap-6 ${viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
                }`}>
                {recipes.map((recipe) => (
                    <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        viewMode={viewMode}
                        onFavorite={onFavorite}
                        onBookmark={onBookmark}
                        onShare={onShare}
                    />
                ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-8">
                    {/* Previous Button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={!pagination.hasPrev}
                        className="flex items-center"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                    </Button>

                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1">
                        {getPageNumbers().map((pageNum, index) => (
                            <React.Fragment key={index}>
                                {pageNum === '...' ? (
                                    <span className="px-3 py-2 text-gray-500">...</span>
                                ) : (
                                    <Button
                                        variant={pageNum === pagination.page ? 'primary' : 'ghost'}
                                        size="sm"
                                        onClick={() => handlePageChange(pageNum as number)}
                                        className="min-w-[2.5rem]"
                                    >
                                        {pageNum}
                                    </Button>
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Next Button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={!pagination.hasNext}
                        className="flex items-center"
                    >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            )}

            {/* Quick Page Jump (for large datasets) */}
            {pagination && pagination.totalPages > 10 && (
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <span>Go to page:</span>
                    <input
                        type="number"
                        min={1}
                        max={pagination.totalPages}
                        defaultValue={pagination.page}
                        className="w-16 px-2 py-1 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                const value = parseInt((e.target as HTMLInputElement).value)
                                if (value && value >= 1 && value <= pagination.totalPages) {
                                    handlePageChange(value)
                                }
                            }
                        }}
                    />
                    <span>of {pagination.totalPages}</span>
                </div>
            )}
        </div>
    )
}

export default RecipeList 