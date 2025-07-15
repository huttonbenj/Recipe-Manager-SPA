/**
 * Favorites page component
 * Displays user's favorite recipes
 */

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Grid, List, ArrowLeft, Search } from 'lucide-react'

// UI Components
import { Button, Loading } from '@/components/ui'
import LinkButton from '@/components/ui/LinkButton/LinkButton'
import { RecipeCard } from '@/components/recipe'

// Hooks
import { useFavorites } from '@/hooks/useFavorites'
import { useAuth } from '@/hooks/useAuth'

// Types
import type { Recipe } from '@/types/recipe'

const Favorites: React.FC = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const { user, isAuthenticated } = useAuth()
    const {
        favorites,
        favoritesLoading,
        favoritesError
    } = useFavorites()

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-background dark:bg-background-dark py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-md mx-auto text-center">
                        <Heart className="w-16 h-16 text-secondary-400 dark:text-secondary-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-foreground dark:text-foreground-dark mb-2">
                            Sign in to view favorites
                        </h1>
                        <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                            You need to be signed in to save and view your favorite recipes.
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
    if (favoritesLoading) {
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
    if (favoritesError) {
        return (
            <div className="min-h-screen bg-background dark:bg-background-dark py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-md mx-auto text-center">
                        <h1 className="text-2xl font-bold text-foreground dark:text-foreground-dark mb-2">
                            Error loading favorites
                        </h1>
                        <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                            {favoritesError.message || 'Failed to load your favorite recipes'}
                        </p>
                        <Button onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    // Convert favorites to recipes
    const favoriteRecipes: Recipe[] = favorites.map(fav => fav.recipe)

    return (
        <div className="min-h-screen bg-background dark:bg-background-dark py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-6">
                    <LinkButton
                        to="/app/recipes"
                        variant="ghost"
                        leftIcon={<ArrowLeft className="w-4 h-4" />}
                        className="text-secondary-600 hover:text-secondary-800 dark:text-secondary-300 dark:hover:text-secondary-100"
                    >
                        Back to Recipes
                    </LinkButton>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground dark:text-foreground-dark flex items-center gap-2">
                                <Heart className="w-8 h-8 text-accent-500 dark:text-accent-400" />
                                My Favorites
                            </h1>
                            <p className="text-secondary-600 dark:text-secondary-400">
                                {favorites.length} favorite recipe{favorites.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                        {/* View mode toggle */}
                        {favoriteRecipes.length > 0 && (
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
                </div>

                {/* Content */}
                {favoriteRecipes.length === 0 ? (
                    <div className="max-w-md mx-auto text-center py-12">
                        <Heart className="w-16 h-16 text-secondary-400 dark:text-secondary-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-foreground dark:text-foreground-dark mb-2">
                            No favorites yet
                        </h2>
                        <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                            Start exploring recipes and click the heart icon to add them to your favorites.
                        </p>
                        <Link
                            to="/app/recipes"
                            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                            <Search className="w-4 h-4 mr-2" />
                            Discover Recipes
                        </Link>
                    </div>
                ) : (
                    <div className={`grid gap-6 ${viewMode === 'grid'
                        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                        : 'grid-cols-1'
                        }`}>
                        {favoriteRecipes.map((recipe) => (
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

export default Favorites 