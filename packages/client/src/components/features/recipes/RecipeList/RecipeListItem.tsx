import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Star, Users, ChefHat, ImageOff, Eye, Heart } from 'lucide-react';
import { Recipe } from '@recipe-manager/shared';
import { Card, Badge, Button } from '../../../ui';

interface RecipeListItemProps {
    recipe: Recipe;
}

export const RecipeListItem = memo<RecipeListItemProps>(({ recipe }) => {
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [hasImageError, setHasImageError] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    const getDifficultyVariant = (difficulty?: string): 'success' | 'warning' | 'error' | 'primary' => {
        switch (difficulty) {
            case 'Easy':
                return 'success';
            case 'Medium':
                return 'warning';
            case 'Hard':
                return 'error';
            default:
                return 'primary';
        }
    };

    const handleImageLoad = () => {
        setIsImageLoading(false);
    };

    const handleImageError = () => {
        setIsImageLoading(false);
        setHasImageError(true);
    };

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    return (
        <Card className="glass-card hover:shadow-glass-lg transition-all duration-300 group overflow-hidden">
            <div className="flex items-start gap-6 p-6">
                {/* Recipe Image */}
                <div className="flex-shrink-0 relative">
                    {recipe.image_url && !hasImageError ? (
                        <div className="relative overflow-hidden rounded-xl">
                            {isImageLoading && (
                                <div className="absolute inset-0 bg-surface-100 dark:bg-surface-800 animate-pulse rounded-xl flex items-center justify-center">
                                    <ChefHat className="h-8 w-8 text-surface-400 dark:text-surface-600" />
                                </div>
                            )}
                            <img
                                src={recipe.image_url}
                                alt={recipe.title}
                                className={`w-24 h-24 object-cover transition-all duration-300 group-hover:scale-105 ${isImageLoading ? 'opacity-0' : 'opacity-100'
                                    }`}
                                onLoad={handleImageLoad}
                                onError={handleImageError}
                            />
                        </div>
                    ) : (
                        <div className="w-24 h-24 bg-gradient-to-br from-surface-100 to-surface-200 dark:from-surface-800 dark:to-surface-900 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                            {hasImageError ? (
                                <ImageOff className="h-8 w-8 text-surface-400 dark:text-surface-600" />
                            ) : (
                                <ChefHat className="h-8 w-8 text-surface-400 dark:text-surface-600" />
                            )}
                        </div>
                    )}
                </div>

                {/* Recipe Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100 mb-2 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                                <Link to={`/recipes/${recipe.id}`} className="hover:underline">
                                    {recipe.title}
                                </Link>
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-xs font-semibold">
                                    {recipe.user?.name?.charAt(0) || '?'}
                                </div>
                                <span>By {recipe.user?.name || 'Anonymous Chef'}</span>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleFavorite}
                            className={`glass-effect transition-all duration-200 ${isFavorite
                                    ? 'text-red-600 dark:text-red-400'
                                    : 'text-surface-600 dark:text-surface-400 hover:text-red-600 dark:hover:text-red-400'
                                }`}
                        >
                            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                        </Button>
                    </div>

                    <p className="text-surface-700 dark:text-surface-300 mb-4 line-clamp-2 leading-relaxed">
                        {recipe.instructions.substring(0, 150)}...
                    </p>

                    <div className="flex items-center justify-between">
                        {/* Recipe Stats */}
                        <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-1 text-surface-600 dark:text-surface-400">
                                <Clock className="h-4 w-4" />
                                <span>{recipe.cook_time ? `${recipe.cook_time} min` : 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-1 text-surface-600 dark:text-surface-400">
                                <Users className="h-4 w-4" />
                                <span>{recipe.servings ? `${recipe.servings} servings` : 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-500">
                                <Star className="h-4 w-4 fill-current" />
                                <span className="font-medium">4.8</span>
                            </div>
                        </div>

                        {/* Tags and Actions */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                {recipe.difficulty && (
                                    <Badge variant={getDifficultyVariant(recipe.difficulty)} className="text-xs">
                                        {recipe.difficulty}
                                    </Badge>
                                )}
                                {recipe.category && (
                                    <Badge variant="primary" className="text-xs">
                                        {recipe.category}
                                    </Badge>
                                )}
                            </div>
                            <Link
                                to={`/recipes/${recipe.id}`}
                                className="btn btn-ghost btn-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                                <Eye className="h-4 w-4" />
                                View
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
});

RecipeListItem.displayName = 'RecipeListItem'; 