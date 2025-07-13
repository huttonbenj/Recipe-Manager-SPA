/**
 * RecipeCard component
 * Displays a recipe in card format with image, title, meta info, and actions
 */

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Users, Star, Heart, BookmarkPlus, Share2 } from 'lucide-react'

// UI Components
import { Card, Badge, Button } from '@/components/ui'

// Utils
import { formatCookTime, formatDifficulty } from '@/utils'

// Types
import type { Recipe } from '@/types'

export interface RecipeCardProps {
    recipe: Recipe
    viewMode?: 'grid' | 'list'
    showActions?: boolean
    onFavorite?: (recipeId: string) => void
    onBookmark?: (recipeId: string) => void
    onShare?: (recipe: Recipe) => void
    className?: string
}

const RecipeCard: React.FC<RecipeCardProps> = ({
    recipe,
    viewMode = 'grid',
    showActions = true,
    onFavorite,
    onBookmark,
    onShare,
    className = ''
}) => {
    const [isFavorited, setIsFavorited] = useState(false)
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [imageLoaded, setImageLoaded] = useState(false)

    /**
     * Handle favorite toggle
     */
    const handleFavorite = (e: React.MouseEvent) => {
        e.preventDefault()
        setIsFavorited(!isFavorited)
        onFavorite?.(recipe.id)
    }

    /**
     * Handle bookmark toggle
     */
    const handleBookmark = (e: React.MouseEvent) => {
        e.preventDefault()
        setIsBookmarked(!isBookmarked)
        onBookmark?.(recipe.id)
    }

    /**
     * Handle share
     */
    const handleShare = (e: React.MouseEvent) => {
        e.preventDefault()
        onShare?.(recipe)
    }

    /**
     * Get image URL with fallback
     */
    const getImageUrl = () => {
        return recipe.imageUrl || '/api/placeholder/300/200'
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

    if (viewMode === 'list') {
        return (
            <Link to={`/recipes/${recipe.id}`} className={`group block ${className}`}>
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="flex">
                        {/* Recipe Image */}
                        <div className="relative w-48 h-32 bg-gray-200 flex-shrink-0">
                            <img
                                src={getImageUrl()}
                                alt={recipe.title}
                                className={`w-full h-full object-cover transition-all duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                                    }`}
                                onLoad={() => setImageLoaded(true)}
                            />
                            {!imageLoaded && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                                </div>
                            )}

                            {/* Actions Overlay */}
                            {showActions && (
                                <div className="absolute top-2 right-2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="p-1.5 bg-white/90 hover:bg-white"
                                        onClick={handleFavorite}
                                    >
                                        <Heart
                                            className={`h-4 w-4 ${isFavorited ? 'text-red-500 fill-current' : 'text-gray-600'
                                                }`}
                                        />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="p-1.5 bg-white/90 hover:bg-white"
                                        onClick={handleBookmark}
                                    >
                                        <BookmarkPlus
                                            className={`h-4 w-4 ${isBookmarked ? 'text-primary-500 fill-current' : 'text-gray-600'
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
                                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                                        {recipe.title}
                                    </h3>

                                    {recipe.description && (
                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
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
                            <div className="flex items-center justify-between text-sm text-gray-500">
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

                                {/* Author */}
                                <div className="text-xs text-gray-500">
                                    by {recipe.author?.name || 'Chef'}
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </Link>
        )
    }

    // Grid view (default)
    return (
        <Link to={`/recipes/${recipe.id}`} className={`group block ${className}`}>
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
                {/* Recipe Image */}
                <div className="relative aspect-w-16 aspect-h-9 bg-gray-200">
                    <img
                        src={getImageUrl()}
                        alt={recipe.title}
                        className={`w-full h-48 object-cover transition-all duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                        onLoad={() => setImageLoaded(true)}
                    />
                    {!imageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                        </div>
                    )}

                    {/* Actions Overlay */}
                    {showActions && (
                        <div className="absolute top-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                size="sm"
                                variant="ghost"
                                className="p-2 bg-white/90 hover:bg-white"
                                onClick={handleFavorite}
                            >
                                <Heart
                                    className={`h-4 w-4 ${isFavorited ? 'text-red-500 fill-current' : 'text-gray-600'
                                        }`}
                                />
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="p-2 bg-white/90 hover:bg-white"
                                onClick={handleBookmark}
                            >
                                <BookmarkPlus
                                    className={`h-4 w-4 ${isBookmarked ? 'text-primary-500 fill-current' : 'text-gray-600'
                                        }`}
                                />
                            </Button>
                            {onShare && (
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="p-2 bg-white/90 hover:bg-white"
                                    onClick={handleShare}
                                >
                                    <Share2 className="h-4 w-4 text-gray-600" />
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                {/* Recipe Details */}
                <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 flex-1">
                            {recipe.title}
                        </h3>
                        {recipe.difficulty && (
                            <Badge variant={getDifficultyVariant(recipe.difficulty)} className="ml-2 flex-shrink-0">
                                {formatDifficulty(recipe.difficulty)}
                            </Badge>
                        )}
                    </div>

                    {recipe.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
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
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
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
                                    {recipe.servings}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Rating and Author */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                            <span className="text-sm font-medium text-gray-900">
                                New
                            </span>
                        </div>
                        <div className="text-xs text-gray-500">
                            by {recipe.author?.name || 'Chef'}
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    )
}

export default RecipeCard 