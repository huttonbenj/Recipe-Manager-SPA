/**
 * RecipeCard component
 * Displays a recipe in card format with image, title, meta info, and actions
 */

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Users, Star, Heart, BookmarkPlus, Edit3, Trash2 } from 'lucide-react'

// UI Components
import { Card, Badge, ImageBadge } from '@/components/ui'

// Hooks
import { useFavorites, useAuth } from '@/hooks'

// Utils
import { formatCookTime, formatDifficulty } from '@/utils'

// Types
import type { Recipe } from '@/types'

export interface RecipeCardProps {
    recipe: Recipe
    viewMode?: 'grid' | 'list'
    showActions?: boolean
    onEdit?: (recipeId: string) => void
    onDelete?: (recipeId: string) => void
    currentUserId?: string
    className?: string
}

const RecipeCard: React.FC<RecipeCardProps> = ({
    recipe,
    viewMode = 'grid',
    showActions = true,
    onEdit,
    onDelete,
    currentUserId,
    className = ''
}) => {
    const [imageLoaded, setImageLoaded] = useState(false)
    const [imageError, setImageError] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    // Use favorites hook
    const {
        toggleFavorite,
        toggleBookmark,
        isFavorited,
        isBookmarked
    } = useFavorites()

    // Use auth hook
    const { isAuthenticated } = useAuth()

    /**
     * Handle favorite toggle
     */
    const handleFavorite = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        toggleFavorite(recipe.id, isFavorited(recipe.id))
    }

    /**
     * Handle bookmark toggle
     */
    const handleBookmark = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        toggleBookmark(recipe.id, isBookmarked(recipe.id))
    }



    /**
     * Handle edit
     */
    const handleEdit = (e: React.MouseEvent) => {
        e.preventDefault()
        onEdit?.(recipe.id)
    }

    /**
     * Handle delete
     */
    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault()
        onDelete?.(recipe.id)
    }

    /**
     * Check if current user owns this recipe
     */
    const isOwner = currentUserId && recipe.authorId && currentUserId === recipe.authorId

    /**
     * Get image URL with fallback
     */
    const getImageUrl = () => {
        if (imageError) {
            return `https://images.unsplash.com/photo-1546548970-71785318a17b?w=400&h=300&fit=crop&crop=center`
        }
        return recipe.imageUrl || `https://images.unsplash.com/photo-1546548970-71785318a17b?w=400&h=300&fit=crop&crop=center`
    }

    /**
     * Handle image error
     */
    const handleImageError = () => {
        setImageError(true)
        setImageLoaded(true) // Set to true to hide loading spinner
    }

    /**
     * Get difficulty badge variant
     */
    const getDifficultyVariant = (difficulty?: string) => {
        switch (difficulty?.toLowerCase()) {
            case 'easy':
                return 'success'
            case 'medium':
                return 'warning'
            case 'hard':
                return 'danger'
            default:
                return 'secondary'
        }
    }

    // List view
    if (viewMode === 'list') {
        return (
            <div
                className={className}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Card
                    variant="bordered"
                    padding="none"
                    className="overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                    <div className="flex flex-col sm:flex-row items-stretch h-36">
                        {/* Recipe Image */}
                        <Link
                            to={`/recipes/${recipe.id}`}
                            className="block group"
                        >
                            <div className="relative w-full sm:w-48 h-full bg-secondary-200 dark:bg-secondary-700 flex-shrink-0">
                                <img
                                    src={getImageUrl()}
                                    alt={recipe.title}
                                    className={`w-full h-full object-cover transition-all duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                                        } ${isHovered ? 'scale-105' : 'scale-100'}`}
                                    onLoad={() => setImageLoaded(true)}
                                    onError={handleImageError}
                                />
                                {!imageLoaded && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-secondary-200 dark:bg-secondary-700">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 dark:border-primary-400"></div>
                                    </div>
                                )}

                                {/* Difficulty Badge - Only on image */}
                                {recipe.difficulty && (
                                    <div className="absolute top-3 left-3 z-10">
                                        <ImageBadge
                                            variant={getDifficultyVariant(recipe.difficulty) as 'success' | 'warning' | 'danger' | 'info' | 'default'}
                                        >
                                            {formatDifficulty(recipe.difficulty)}
                                        </ImageBadge>
                                    </div>
                                )}
                            </div>
                        </Link>

                        {/* Recipe Details */}
                        <div className="flex-1 p-4 flex flex-col justify-between">
                            {/* Header with title and actions */}
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex-1 mr-4">
                                    <Link
                                        to={`/recipes/${recipe.id}`}
                                        className="block group"
                                    >
                                        <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1 mb-1">
                                            {recipe.title}
                                        </h3>
                                    </Link>

                                    {recipe.description && (
                                        <p className="text-sm text-secondary-600 dark:text-secondary-400 line-clamp-2">
                                            {recipe.description}
                                        </p>
                                    )}
                                </div>

                                {/* Action buttons */}
                                {showActions && (
                                    <div className="flex items-center space-x-2 flex-shrink-0">
                                        {/* User actions */}
                                        {isAuthenticated && (
                                            <>
                                                <button
                                                    onClick={handleFavorite}
                                                    title={isFavorited(recipe.id) ? "Remove from favorites" : "Add to favorites"}
                                                    className={`w-8 h-8 rounded-full transition-all duration-200 flex items-center justify-center border ${isFavorited(recipe.id)
                                                        ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400'
                                                        : 'bg-secondary-50 dark:bg-secondary-800 border-secondary-200 dark:border-secondary-700 text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:border-rose-200 dark:hover:border-rose-800'
                                                        }`}
                                                >
                                                    <Heart
                                                        className={`h-4 w-4 transition-all ${isFavorited(recipe.id) ? 'fill-current' : ''}`}
                                                    />
                                                </button>
                                                <button
                                                    onClick={handleBookmark}
                                                    title={isBookmarked(recipe.id) ? "Remove bookmark" : "Bookmark recipe"}
                                                    className={`w-8 h-8 rounded-full transition-all duration-200 flex items-center justify-center border ${isBookmarked(recipe.id)
                                                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
                                                        : 'bg-secondary-50 dark:bg-secondary-800 border-secondary-200 dark:border-secondary-700 text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800'
                                                        }`}
                                                >
                                                    <BookmarkPlus
                                                        className={`h-4 w-4 transition-all ${isBookmarked(recipe.id) ? 'fill-current' : ''}`}
                                                    />
                                                </button>
                                            </>
                                        )}

                                        {/* Admin actions */}
                                        {isOwner && (
                                            <>
                                                <button
                                                    onClick={handleEdit}
                                                    title="Edit recipe"
                                                    className="w-8 h-8 rounded-full transition-all duration-200 flex items-center justify-center border bg-secondary-50 dark:bg-secondary-800 border-secondary-200 dark:border-secondary-700 text-secondary-600 dark:text-secondary-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800 hover:text-blue-600 dark:hover:text-blue-400"
                                                >
                                                    <Edit3 className="h-4 w-4 transition-all" />
                                                </button>
                                                <button
                                                    onClick={handleDelete}
                                                    title="Delete recipe"
                                                    className="w-8 h-8 rounded-full transition-all duration-200 flex items-center justify-center border bg-secondary-50 dark:bg-secondary-800 border-secondary-200 dark:border-secondary-700 text-secondary-600 dark:text-secondary-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800 hover:text-red-600 dark:hover:text-red-400"
                                                >
                                                    <Trash2 className="h-4 w-4 transition-all" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Tags */}
                            {recipe.tags && recipe.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {recipe.tags.slice(0, 4).map((tag) => (
                                        <Badge key={tag} variant="secondary" className="text-xs">
                                            {tag}
                                        </Badge>
                                    ))}
                                    {recipe.tags.length > 4 && (
                                        <Badge variant="secondary" className="text-xs">
                                            +{recipe.tags.length - 4}
                                        </Badge>
                                    )}
                                </div>
                            )}

                            {/* Meta info */}
                            <div className="flex items-center space-x-4 text-sm text-secondary-600 dark:text-secondary-400 mt-auto">
                                <span className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1.5 text-secondary-400 dark:text-secondary-500" />
                                    {formatCookTime(recipe.cookTime)}
                                </span>
                                <span className="flex items-center">
                                    <Users className="w-4 h-4 mr-1.5 text-secondary-400 dark:text-secondary-500" />
                                    {recipe.servings} serving{recipe.servings !== 1 ? 's' : ''}
                                </span>
                                {recipe.rating && recipe.rating > 0 && (
                                    <span className="flex items-center">
                                        <Star className="w-4 h-4 mr-1.5 text-yellow-500" />
                                        {recipe.rating.toFixed(1)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        )
    }

    // Grid view (default)
    return (
        <Link
            to={`/recipes/${recipe.id}`}
            className={`block group ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Card
                variant="bordered"
                padding="none"
                className="h-full overflow-hidden hover:shadow-lg transition-all duration-300"
            >
                {/* Recipe Image */}
                <div className="relative h-48 bg-secondary-200 dark:bg-secondary-700">
                    <img
                        src={getImageUrl()}
                        alt={recipe.title}
                        className={`w-full h-full object-cover transition-all duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                            } ${isHovered ? 'scale-105' : 'scale-100'}`}
                        onLoad={() => setImageLoaded(true)}
                        onError={handleImageError}
                    />
                    {!imageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center bg-secondary-200 dark:bg-secondary-700">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 dark:border-primary-400"></div>
                        </div>
                    )}

                    {/* Difficulty Badge */}
                    {recipe.difficulty && (
                        <div className="absolute top-4 left-4 z-10">
                            <ImageBadge
                                variant={getDifficultyVariant(recipe.difficulty) as 'success' | 'warning' | 'danger' | 'info' | 'default'}
                            >
                                {formatDifficulty(recipe.difficulty)}
                            </ImageBadge>
                        </div>
                    )}

                    {/* User Actions - Top Right */}
                    {showActions && isAuthenticated && (
                        <div className={`absolute top-3 right-3 flex flex-col space-y-1.5 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                            <button
                                onClick={handleFavorite}
                                title={isFavorited(recipe.id) ? "Remove from favorites" : "Add to favorites"}
                                className={`w-8 h-8 rounded-full backdrop-blur-sm transition-all duration-200 flex items-center justify-center shadow-md border ${isFavorited(recipe.id)
                                    ? 'bg-rose-600/90 hover:bg-rose-600 border-rose-500/40 text-white shadow-rose-500/25'
                                    : 'bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-700 border-white/50 dark:border-gray-700/40 text-rose-600 dark:text-rose-400 hover:bg-rose-600/90 hover:border-rose-500/40 hover:text-white hover:shadow-rose-500/25'
                                    }`}
                            >
                                <Heart
                                    className={`h-4 w-4 transition-all ${isFavorited(recipe.id) ? 'fill-current' : ''}`}
                                />
                            </button>
                            <button
                                onClick={handleBookmark}
                                title={isBookmarked(recipe.id) ? "Remove bookmark" : "Bookmark recipe"}
                                className={`w-8 h-8 rounded-full backdrop-blur-sm transition-all duration-200 flex items-center justify-center shadow-md border ${isBookmarked(recipe.id)
                                    ? 'bg-blue-600/90 hover:bg-blue-600 border-blue-500/40 text-white shadow-blue-500/25'
                                    : 'bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-700 border-white/50 dark:border-gray-700/40 text-blue-600 dark:text-blue-400 hover:bg-blue-600/90 hover:border-blue-500/40 hover:text-white hover:shadow-blue-500/25'
                                    }`}
                            >
                                <BookmarkPlus
                                    className={`h-4 w-4 transition-all ${isBookmarked(recipe.id) ? 'fill-current' : ''}`}
                                />
                            </button>
                        </div>
                    )}

                    {/* Admin Actions - Bottom Right */}
                    {showActions && isOwner && (
                        <div className={`absolute bottom-3 right-3 flex space-x-1.5 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                            <button
                                onClick={handleEdit}
                                title="Edit recipe"
                                className="w-7 h-7 rounded-full backdrop-blur-sm transition-all duration-200 flex items-center justify-center shadow-sm border bg-white/70 dark:bg-gray-800/70 border-white/30 dark:border-gray-700/30 text-gray-600 dark:text-gray-400 hover:bg-blue-600/90 hover:border-blue-500/40 hover:text-white hover:shadow-blue-500/25"
                            >
                                <Edit3 className="h-3.5 w-3.5 transition-all" />
                            </button>
                            <button
                                onClick={handleDelete}
                                title="Delete recipe"
                                className="w-7 h-7 rounded-full backdrop-blur-sm transition-all duration-200 flex items-center justify-center shadow-sm border bg-white/70 dark:bg-gray-800/70 border-white/30 dark:border-gray-700/30 text-gray-600 dark:text-gray-400 hover:bg-red-600/90 hover:border-red-500/40 hover:text-white hover:shadow-red-500/25"
                            >
                                <Trash2 className="h-3.5 w-3.5 transition-all" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Recipe Details */}
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 mb-2 line-clamp-1 transition-colors">
                        {recipe.title}
                    </h3>

                    {recipe.description && (
                        <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-3 line-clamp-2">
                            {recipe.description}
                        </p>
                    )}

                    {/* Tags */}
                    {recipe.tags && recipe.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                            {recipe.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                </Badge>
                            ))}
                            {recipe.tags.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                    +{recipe.tags.length - 2}
                                </Badge>
                            )}
                        </div>
                    )}

                    {/* Recipe Meta */}
                    <div className="flex items-center justify-between text-sm text-secondary-500 dark:text-secondary-400 mt-auto">
                        <div className="flex items-center space-x-3">
                            {recipe.cookTime && (
                                <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-2" />
                                    {formatCookTime(recipe.cookTime)}
                                </div>
                            )}
                            {recipe.servings && (
                                <div className="flex items-center">
                                    <Users className="h-4 w-4 mr-2" />
                                    {recipe.servings}
                                </div>
                            )}
                        </div>

                        {/* Rating */}
                        {recipe.rating !== undefined && (
                            <div className="flex items-center">
                                <Star className={`h-4 w-4 mr-2 ${recipe.rating >= 4 ? 'text-yellow-500 fill-current' : ''}`} />
                                <span>{recipe.rating.toFixed(1)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </Link>
    )
}

export default RecipeCard 