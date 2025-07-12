import { memo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Clock, Star, Users, ImageOff, Heart } from 'lucide-react';
import { Recipe } from '@recipe-manager/shared';
import { Card, Badge, Button } from '../../../ui';
import { cn } from '../../../../utils/cn';
import { recipeService } from '../../../../services';
import { useAuth } from '../../../../hooks';

interface RecipeListItemProps {
    recipe: Recipe;
}

export const RecipeListItem = memo<RecipeListItemProps>(({ recipe }) => {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [hasImageError, setHasImageError] = useState(false);
    const [isFavorite, setIsFavorite] = useState((recipe as any).liked ?? false);

    const getDifficultyBadgeClass = (difficulty?: string) => {
        switch (difficulty?.toLowerCase()) {
            case 'easy':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'hard':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const handleImageLoad = () => {
        setIsImageLoading(false);
    };

    const handleImageError = () => {
        setIsImageLoading(false);
        setHasImageError(true);
    };

    const likeMutation = useMutation({
        mutationFn: () => recipeService.likeRecipe(recipe.id),
        onSuccess: () => {
            setIsFavorite(true);
            // Invalidate stats cache to refresh the like count
            if (user) {
                queryClient.invalidateQueries({ queryKey: ['userStats', user.id] });
            }
        },
        onError: (error) => {
            console.error('RecipeListItem: Like mutation failed:', error);
        },
    });

    const unlikeMutation = useMutation({
        mutationFn: () => recipeService.unlikeRecipe(recipe.id),
        onSuccess: () => {
            setIsFavorite(false);
            // Invalidate stats cache to refresh the like count
            if (user) {
                queryClient.invalidateQueries({ queryKey: ['userStats', user.id] });
            }
        },
        onError: (error) => {
            console.error('RecipeListItem: Unlike mutation failed:', error);
        },
    });

    const toggleFavorite = () => {
        if (isFavorite) {
            unlikeMutation.mutate();
        } else {
            likeMutation.mutate();
        }
    };

    return (
        <Card className="transition-all duration-300 group overflow-hidden hover:shadow-lg bg-white dark:bg-gray-800">
            <div className="flex items-start gap-4 p-4">
                {/* Recipe Image */}
                <Link to={`/recipes/${recipe.id}`} className="flex-shrink-0">
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                        {recipe.image_url && !hasImageError ? (
                            <>
                                {isImageLoading && (
                                    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                                )}
                                <img
                                    src={recipe.image_url}
                                    alt={recipe.title}
                                    className={cn(
                                        "w-full h-full object-cover transition-opacity duration-300",
                                        isImageLoading ? 'opacity-0' : 'opacity-100'
                                    )}
                                    onLoad={handleImageLoad}
                                    onError={handleImageError}
                                />
                            </>
                        ) : (
                            <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                <ImageOff className="h-8 w-8 text-gray-400 dark:text-gray-600" />
                            </div>
                        )}
                    </div>
                </Link>

                {/* Recipe Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                        <Link to={`/recipes/${recipe.id}`} className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                {recipe.title}
                            </h3>
                        </Link>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleFavorite}
                            className={cn(isFavorite ? 'text-red-500' : 'text-gray-500 hover:text-red-500')}
                        >
                            <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
                        </Button>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {recipe.instructions.substring(0, 150)}...
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            <span>{recipe.cook_time ? `${recipe.cook_time} min` : 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Users className="h-4 w-4" />
                            <span>{recipe.servings ? `${recipe.servings} servings` : 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-yellow-500">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="font-medium">4.8</span>
                        </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                        {recipe.difficulty && (
                            <Badge className={cn("text-xs", getDifficultyBadgeClass(recipe.difficulty))}>
                                {recipe.difficulty}
                            </Badge>
                        )}
                        {recipe.category && (
                            <Badge variant="secondary" className="text-xs">
                                {recipe.category}
                            </Badge>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
});

RecipeListItem.displayName = 'RecipeListItem';

export const RecipeListItemSkeleton = () => (
    <Card>
        <div className="flex items-start gap-4 p-4">
            <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0 space-y-3">
                <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-4">
                    <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                    <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                </div>
            </div>
        </div>
    </Card>
); 