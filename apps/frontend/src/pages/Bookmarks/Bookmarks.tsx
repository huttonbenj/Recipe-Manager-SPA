/**
 * Bookmarks page component
 * Displays user's bookmarked recipes
 */

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, Grid, List, ArrowLeft } from 'lucide-react'

// UI Components
import { Button, Loading } from '@/components/ui'
import { RecipeCard } from '@/components/recipe'

// Hooks
import { useFavorites } from '@/hooks/useFavorites'
import { useAuth } from '@/hooks/useAuth'

// Types
import type { Recipe } from '@/types/recipe'

const Bookmarks: React.FC = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const { user, isAuthenticated } = useAuth()
    const {
        bookmarks,
        bookmarksLoading,
        bookmarksError
    } = useFavorites()

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-background dark:bg-background-dark py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-md mx-auto text-center">
                        <Bookmark className="w-16 h-16 text-secondary-400 dark:text-secondary-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-foreground dark:text-foreground-dark mb-2">
                            Sign in to view bookmarks
                        </h1>
                        <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                            You need to be signed in to save and view your bookmarked recipes.
                        </p>
                        <Link to="/login">
                            <Button variant="primary">
                                Sign In
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    // Loading state
    if (bookmarksLoading) {
        return (
            <div className="min-h-screen bg-background dark:bg-background-dark py-8">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center items-center h-64">
                        <Loading />
                    </div>
                </div>
            </div>
        )
    }

    // Error state
    if (bookmarksError) {
        return (
            <div className="min-h-screen bg-background dark:bg-background-dark py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-md mx-auto text-center">
                        <h1 className="text-2xl font-bold text-foreground dark:text-foreground-dark mb-2">
                            Error loading bookmarks
                        </h1>
                        <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                            {bookmarksError.message || 'Failed to load your bookmarked recipes'}
                        </p>
                        <Button onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    // Convert bookmarks to recipes
    const bookmarkedRecipes: Recipe[] = bookmarks.map(bookmark => bookmark.recipe)

    return (
        <div className="min-h-screen bg-background dark:bg-background-dark py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Link to="/recipes">
                            <Button variant="ghost" className="flex items-center gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Back to Recipes
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-foreground dark:text-foreground-dark flex items-center gap-2">
                                <Bookmark className="w-8 h-8 text-primary-500 dark:text-primary-400" />
                                My Bookmarks
                            </h1>
                            <p className="text-secondary-600 dark:text-secondary-400">
                                {bookmarks.length} bookmarked recipe{bookmarks.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>

                    {/* View mode toggle */}
                    {bookmarkedRecipes.length > 0 && (
                        <div className="flex items-center gap-2">
                            <Button
                                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                                onClick={() => setViewMode('grid')}
                                className="p-2"
                            >
                                <Grid className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                                onClick={() => setViewMode('list')}
                                className="p-2"
                            >
                                <List className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                </div>

                {/* Content */}
                {bookmarkedRecipes.length === 0 ? (
                    <div className="max-w-md mx-auto text-center py-12">
                        <Bookmark className="w-16 h-16 text-secondary-400 dark:text-secondary-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-foreground dark:text-foreground-dark mb-2">
                            No bookmarks yet
                        </h2>
                        <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                            Start exploring recipes and click the bookmark icon to save them for later.
                        </p>
                        <Link to="/recipes">
                            <Button variant="primary">
                                Discover Recipes
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className={`grid gap-6 ${viewMode === 'grid'
                        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                        : 'grid-cols-1'
                        }`}>
                        {bookmarkedRecipes.map((recipe) => (
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                viewMode={viewMode}
                                currentUserId={user?.id}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Bookmarks 