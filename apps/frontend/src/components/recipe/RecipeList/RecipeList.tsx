/**
 * RecipeList component
 * Displays a list of recipes in grid or list format with pagination
 */

import React from 'react'
import { Grid, List, ChevronLeft, ChevronRight, ChefHat } from 'lucide-react'

// UI Components
import { Button, Card } from '@/components/ui'
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
    onEdit?: (recipeId: string) => void
    onDelete?: (recipeId: string) => void
    currentUserId?: string
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
    onEdit,
    onDelete,
    currentUserId,
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
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-1'
                    }`}>
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className="animate-pulse">
                            <div className="bg-secondary-200 dark:bg-secondary-700 rounded-lg overflow-hidden">
                                <div className="h-48 bg-secondary-300 dark:bg-secondary-600"></div>
                                <div className="p-4 space-y-3">
                                    <div className="h-4 bg-secondary-300 dark:bg-secondary-600 rounded w-3/4"></div>
                                    <div className="h-3 bg-secondary-300 dark:bg-secondary-600 rounded w-1/2"></div>
                                    <div className="flex space-x-4">
                                        <div className="h-3 bg-secondary-300 dark:bg-secondary-600 rounded w-16"></div>
                                        <div className="h-3 bg-secondary-300 dark:bg-secondary-600 rounded w-16"></div>
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
                <Card variant="bordered" className="max-w-md mx-auto p-6">
                    <div className="text-accent-600 dark:text-accent-400 mb-4">
                        <ChefHat className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">Failed to load recipes</p>
                        <p className="text-sm mt-2 text-secondary-600 dark:text-secondary-400">{error}</p>
                    </div>
                    <Button onClick={() => window.location.reload()} variant="primary">
                        Try Again
                    </Button>
                </Card>
            </div>
        )
    }

    // Empty state
    if (!recipes || recipes.length === 0) {
        return (
            <div className={`text-center py-12 ${className}`}>
                <Card variant="bordered" className="max-w-md mx-auto p-6">
                    <ChefHat className="h-16 w-16 text-secondary-400 dark:text-secondary-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-2">
                        {emptyMessage}
                    </h3>
                    <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                        {emptyDescription}
                    </p>
                </Card>
            </div>
        )
    }

    return (
        <div className={`space-y-6 ${className}`}>
            {/* View Controls and Results Count */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-sm text-secondary-600 dark:text-secondary-400">
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
                            aria-label="Grid view"
                            aria-pressed={viewMode === 'grid'}
                        >
                            <Grid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => onViewModeChange('list')}
                            aria-label="List view"
                            aria-pressed={viewMode === 'list'}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>

            {/* Recipe Grid/List */}
            <div
                className={`grid gap-6 ${viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-1'
                    }`}
                role="list"
                aria-label="Recipe list"
            >
                {recipes.map((recipe) => (
                    <div key={recipe.id} role="listitem">
                        <RecipeCard
                            recipe={recipe}
                            viewMode={viewMode}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            currentUserId={currentUserId}
                        />
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <nav
                    className="flex items-center justify-center mt-8"
                    aria-label="Pagination"
                >
                    <ul className="flex items-center space-x-2">
                        {/* Previous Button */}
                        <li>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={!pagination.hasPrev}
                                className="flex items-center"
                                aria-label="Previous page"
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                <span className="hidden sm:inline">Previous</span>
                            </Button>
                        </li>

                        {/* Page Numbers */}
                        {getPageNumbers().map((pageNum, index) => (
                            <li key={index}>
                                {pageNum === '...' ? (
                                    <span className="px-3 py-2 text-secondary-500 dark:text-secondary-400">...</span>
                                ) : (
                                    <Button
                                        variant={pageNum === pagination.page ? 'primary' : 'outline'}
                                        size="sm"
                                        onClick={() => handlePageChange(pageNum as number)}
                                        className="min-w-[2.5rem]"
                                        aria-label={`Page ${pageNum}`}
                                        aria-current={pageNum === pagination.page ? 'page' : undefined}
                                    >
                                        {pageNum}
                                    </Button>
                                )}
                            </li>
                        ))}

                        {/* Next Button */}
                        <li>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={!pagination.hasNext}
                                className="flex items-center"
                                aria-label="Next page"
                            >
                                <span className="hidden sm:inline">Next</span>
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    )
}

export default RecipeList 