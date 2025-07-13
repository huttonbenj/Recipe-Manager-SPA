/**
 * RecipeCard component
 * Displays a recipe in card format with image, title, meta info, and actions
 */

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Users, Star, Heart, BookmarkPlus, Edit3, Trash2 } from 'lucide-react'

// UI Components
import { Card, Badge, Button } from '@/components/ui'

// Hooks
import { useFavorites } from '@/hooks'

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
            <Link
                to={`/recipes/${recipe.id}`}
                className={`block ${className}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Card
                    variant="bordered"
                    padding="none"
                    className="overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                    <div className="flex flex-col sm:flex-row">
                        {/* Recipe Image */}
                        <div className="relative w-full sm:w-48 h-48 sm:h-32 bg-secondary-200 dark:bg-secondary-700 flex-shrink-0">
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

                            {/* Actions Overlay */}
                            {showActions && (
                                <div className="absolute top-2 right-2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {/* Owner actions */}
                                    {isOwner && (
                                        <>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="p-1.5 bg-white/90 dark:bg-secondary-800/90 hover:bg-white dark:hover:bg-secondary-700"
                                                onClick={handleEdit}
                                                title="Edit recipe"
                                            >
                                                <Edit3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="p-1.5 bg-white/90 dark:bg-secondary-800/90 hover:bg-white dark:hover:bg-secondary-700"
                                                onClick={handleDelete}
                                                title="Delete recipe"
                                            >
                                                <Trash2 className="h-4 w-4 text-accent-600 dark:text-accent-400" />
                                            </Button>
                                        </>
                                    )}

                                    {/* General actions */}
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="p-1.5 bg-white/90 dark:bg-secondary-800/90 hover:bg-white dark:hover:bg-secondary-700"
                                        onClick={handleFavorite}
                                        title={isFavorited(recipe.id) ? "Remove from favorites" : "Add to favorites"}
                                    >
                                        <Heart
                                            className={`h-4 w-4 ${isFavorited(recipe.id) ? 'text-accent-500 fill-current' : 'text-secondary-600 dark:text-secondary-400'
                                                }`}
                                        />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="p-1.5 bg-white/90 dark:bg-secondary-800/90 hover:bg-white dark:hover:bg-secondary-700"
                                        onClick={handleBookmark}
                                        title={isBookmarked(recipe.id) ? "Remove bookmark" : "Bookmark recipe"}
                                    >
                                        <BookmarkPlus
                                            className={`h-4 w-4 ${isBookmarked(recipe.id) ? 'text-primary-500 fill-current' : 'text-secondary-600 dark:text-secondary-400'
                                                }`}
                                        />
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Recipe Details */}
                        <div className="flex-1 p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
                                        {recipe.title}
                                    </h3>

                                    {recipe.description && (
                                        <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1 line-clamp-2">
                                            {recipe.description}
                                        </p>
                                    )}
                                </div>

                                {recipe.difficulty && (
                                    <Badge variant={getDifficultyVariant(recipe.difficulty)} className="ml-2">
                                        {formatDifficulty(recipe.difficulty)}
                                    </Badge>
                                )}
                            </div>

                            {/* Tags */}
                            {recipe.tags && recipe.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {recipe.tags.slice(0, 3).map((tag) => (
                                        <Badge key={tag} variant="secondary" className="text-xs">
                                            {tag}
                                        </Badge>
                                    ))}
                                    {recipe.tags.length > 3 && (
                                        <Badge variant="secondary" className="text-xs">
                                            +{recipe.tags.length - 3}
                                        </Badge>
                                    )}
                                </div>
                            )}

                            {/* Recipe Meta */}
                            <div className="flex items-center justify-between text-sm text-secondary-500 dark:text-secondary-400">
                                <div className="flex items-center space-x-4">
                                    {recipe.cookTime && (
                                        <div className="flex items-center">
                                            <Clock className="h-4 w-4 mr-1" />
                                            {formatCookTime(recipe.cookTime)}
                                        </div>
                                    )}
                                    {recipe.servings && (
                                        <div className="flex items-center">
                                            <Users className="h-4 w-4 mr-1" />
                                            {recipe.servings} servings
                                        </div>
                                    )}
                                </div>

                                {/* Rating */}
                                {recipe.rating !== undefined && (
                                    <div className="flex items-center">
                                        <Star className={`h-4 w-4 mr-1 ${recipe.rating >= 4 ? 'text-yellow-500 fill-current' : ''}`} />
                                        <span>{recipe.rating.toFixed(1)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>
            </Link>
        )
    }

    // Grid view (default)
    return (
        <Link
            to={`/recipes/${recipe.id}`}
            className={`block ${className}`}
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
                        <div className="absolute top-2 left-2">
                            <Badge variant={getDifficultyVariant(recipe.difficulty)}>
                                {formatDifficulty(recipe.difficulty)}
                            </Badge>
                        </div>
                    )}

                    {/* Actions */}
                    {showActions && (
                        <div className={`absolute top-2 right-2 flex space-x-1 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                            {isOwner && (
                                <>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="p-1.5 bg-white/90 dark:bg-secondary-800/90 hover:bg-white dark:hover:bg-secondary-700"
                                        onClick={handleEdit}
                                        title="Edit recipe"
                                    >
                                        <Edit3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="p-1.5 bg-white/90 dark:bg-secondary-800/90 hover:bg-white dark:hover:bg-secondary-700"
                                        onClick={handleDelete}
                                        title="Delete recipe"
                                    >
                                        <Trash2 className="h-4 w-4 text-accent-600 dark:text-accent-400" />
                                    </Button>
                                </>
                            )}
                            <Button
                                size="sm"
                                variant="ghost"
                                className="p-1.5 bg-white/90 dark:bg-secondary-800/90 hover:bg-white dark:hover:bg-secondary-700"
                                onClick={handleFavorite}
                                title={isFavorited(recipe.id) ? "Remove from favorites" : "Add to favorites"}
                            >
                                <Heart
                                    className={`h-4 w-4 ${isFavorited(recipe.id) ? 'text-accent-500 fill-current' : 'text-secondary-600 dark:text-secondary-400'
                                        }`}
                                />
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="p-1.5 bg-white/90 dark:bg-secondary-800/90 hover:bg-white dark:hover:bg-secondary-700"
                                onClick={handleBookmark}
                                title={isBookmarked(recipe.id) ? "Remove bookmark" : "Bookmark recipe"}
                            >
                                <BookmarkPlus
                                    className={`h-4 w-4 ${isBookmarked(recipe.id) ? 'text-primary-500 fill-current' : 'text-secondary-600 dark:text-secondary-400'
                                        }`}
                                />
                            </Button>
                        </div>
                    )}
                </div>

                {/* Recipe Details */}
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2 line-clamp-1 transition-colors">
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
                                    <Clock className="h-4 w-4 mr-1" />
                                    {formatCookTime(recipe.cookTime)}
                                </div>
                            )}
                            {recipe.servings && (
                                <div className="flex items-center">
                                    <Users className="h-4 w-4 mr-1" />
                                    {recipe.servings}
                                </div>
                            )}
                        </div>

                        {/* Rating */}
                        {recipe.rating !== undefined && (
                            <div className="flex items-center">
                                <Star className={`h-4 w-4 mr-1 ${recipe.rating >= 4 ? 'text-yellow-500 fill-current' : ''}`} />
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