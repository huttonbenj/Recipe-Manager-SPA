import React, { useState } from 'react';
import { Clock, Users, ImageOff, Heart, Bookmark, TrendingUp } from 'lucide-react';
import { Recipe } from '@recipe-manager/shared';
import { Card, Button } from '../../../ui';
import { cn } from '../../../../utils/cn';
import { useTheme } from '../../../../contexts/ThemeContext';
import { getThemeBadgeClasses, getThemeColors } from '../../../../utils/theme';

interface RecipeListItemProps {
    recipe: Recipe;
    isFavorite: boolean;
    isSaved: boolean;
    onToggleFavorite: (recipeId: string) => void;
    onToggleSaved: (recipeId: string) => void;
}

export const RecipeListItem: React.FC<RecipeListItemProps> = ({
    recipe,
    isFavorite,
    isSaved,
    onToggleFavorite,
    onToggleSaved,
}) => {
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [hasImageError, setHasImageError] = useState(false);
    const { theme } = useTheme();
    const themeColors = getThemeColors(theme.color);

    const getCategoryColor = (category: string): string => {
        // Use the theme utility function for badge colors
        return getThemeBadgeClasses(theme.color, category.toLowerCase() === 'dessert' ? 'secondary' : 'primary');
    };

    const handleImageLoad = () => {
        setIsImageLoading(false);
    };

    const handleImageError = () => {
        setHasImageError(true);
        setIsImageLoading(false);
    };

    const toggleFavorite = () => {
        onToggleFavorite(recipe.id);
    };

    const toggleSaved = () => {
        onToggleSaved(recipe.id);
    };

    return (
        <Card className="transition-all duration-300 group overflow-hidden hover:shadow-lg bg-white dark:bg-surface-800">
            <div className="relative">
                <div className="aspect-video w-full overflow-hidden">
                    {isImageLoading && (
                        <div className="absolute inset-0 bg-surface-200 dark:bg-surface-700 animate-pulse" />
                    )}
                    {recipe.image_url && !hasImageError ? (
                        <img
                            src={recipe.image_url}
                            alt={recipe.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                        />
                    ) : (
                        <div className="w-full h-full bg-surface-100 dark:bg-surface-700 flex items-center justify-center">
                            <ImageOff className="h-8 w-8 text-surface-400 dark:text-surface-600" />
                        </div>
                    )}
                </div>
            </div>

            <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className={cn(
                        "text-lg font-bold text-surface-900 dark:text-white transition-colors",
                        `group-hover:${themeColors.primary} dark:group-hover:${themeColors.primary.replace('600', '400')}`
                    )}>
                        {recipe.title}
                    </h3>
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleFavorite}
                            className={cn(isFavorite ? 'text-error-500' : 'text-surface-500 hover:text-error-500')}
                            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        >
                            <Heart className="h-5 w-5" fill={isFavorite ? 'currentColor' : 'none'} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleSaved}
                            className={cn(isSaved ? 'text-warning-500' : 'text-surface-500 hover:text-warning-500')}
                            aria-label={isSaved ? 'Remove from saved' : 'Save recipe'}
                        >
                            <Bookmark className="h-5 w-5" fill={isSaved ? 'currentColor' : 'none'} />
                        </Button>
                    </div>
                </div>

                <p className="text-sm text-surface-600 dark:text-surface-400 mb-3 line-clamp-2">
                    {recipe.instructions.substring(0, 150)}...
                </p>

                <div className="flex items-center gap-4 text-sm text-surface-500 dark:text-surface-400">
                    <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{recipe.cook_time} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>Serves {recipe.servings}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>{recipe.difficulty}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                        <span className={cn(
                            'px-2 py-1 rounded-full text-xs font-medium',
                            getCategoryColor(recipe.category || 'other')
                        )}>
                            {recipe.category}
                        </span>
                    </div>
                    <div className="text-xs text-surface-500 dark:text-surface-400">
                        by {recipe.user?.name || 'Unknown'}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export const RecipeListItemSkeleton = () => (
    <Card>
        <div className="flex items-start gap-4 p-4">
            <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-lg bg-surface-200 dark:bg-surface-700 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0 space-y-3">
                <div className="h-6 w-3/4 bg-surface-200 dark:bg-surface-700 rounded animate-pulse" />
                <div className="space-y-2">
                    <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded animate-pulse" />
                    <div className="h-4 w-5/6 bg-surface-200 dark:bg-surface-700 rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-4">
                    <div className="h-5 w-16 bg-surface-200 dark:bg-surface-700 rounded animate-pulse" />
                    <div className="h-5 w-16 bg-surface-200 dark:bg-surface-700 rounded animate-pulse" />
                    <div className="h-5 w-16 bg-surface-200 dark:bg-surface-700 rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-5 w-12 bg-surface-200 dark:bg-surface-700 rounded-full animate-pulse" />
                    <div className="h-5 w-16 bg-surface-200 dark:bg-surface-700 rounded-full animate-pulse" />
                </div>
            </div>
        </div>
    </Card>
); 