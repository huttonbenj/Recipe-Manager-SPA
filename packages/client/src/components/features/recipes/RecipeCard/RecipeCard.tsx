import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Heart, Star, ChefHat, Sparkles, ArrowRight } from 'lucide-react';
import { Recipe } from '@recipe-manager/shared';
import { Card, CardContent } from '../../../ui/Card';
import { Badge } from '../../../ui/Badge';
import { cn } from '../../../../utils/cn';

interface RecipeCardProps {
    recipe: Recipe;
    isFavorite?: boolean;
    onToggleFavorite?: (id: string) => void;
    className?: string;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
    recipe,
    isFavorite = false,
    onToggleFavorite,
    className,
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [favoriteAnimation, setFavoriteAnimation] = useState(false);

    const {
        id,
        title,
        instructions,
        image_url,
        cook_time = 0,
        category,
        difficulty,
    } = recipe;

    // For demo purposes, extract a description from instructions
    const description = instructions.length > 150
        ? `${instructions.substring(0, 150)}...`
        : instructions;

    // For demo purposes, simulate prep time as 1/3 of cook time
    const prep_time = cook_time ? Math.round(cook_time / 3) : 0;
    const totalTime = prep_time + (cook_time || 0);

    // For demo purposes, simulate a rating
    const rating = 4.5;
    const likes = Math.floor(Math.random() * 50) + 1;

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onToggleFavorite) {
            setFavoriteAnimation(true);
            onToggleFavorite(id);
            setTimeout(() => setFavoriteAnimation(false), 600);
        }
    };

    const getDifficultyColor = () => {
        switch (difficulty?.toLowerCase()) {
            case 'easy':
                return 'bg-gradient-to-r from-success-500 to-success-600 text-white shadow-lg shadow-success-500/25';
            case 'medium':
                return 'bg-gradient-to-r from-warning-500 to-warning-600 text-white shadow-lg shadow-warning-500/25';
            case 'hard':
                return 'bg-gradient-to-r from-error-500 to-error-600 text-white shadow-lg shadow-error-500/25';
            default:
                return 'bg-gradient-to-r from-surface-500 to-surface-600 text-white shadow-lg shadow-surface-500/25';
        }
    };

    const getCategoryColor = () => {
        const colors = [
            'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25',
            'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg shadow-accent-500/25',
            'bg-gradient-to-r from-success-500 to-success-600 text-white shadow-lg shadow-success-500/25',
            'bg-gradient-to-r from-warning-500 to-warning-600 text-white shadow-lg shadow-warning-500/25',
        ];
        return colors[category?.length ? category.length % colors.length : 0];
    };

    return (
        <Link to={`/recipes/${id}`} className="group block h-full">
            <Card className={cn(
                "h-full overflow-hidden transition-all duration-300 glass-card",
                "bg-white/70 dark:bg-surface-900/70 backdrop-blur-sm",
                "border border-surface-200/60 dark:border-surface-800/60",
                "hover:shadow-xl hover:shadow-brand-500/10 hover:scale-[1.02] hover:-translate-y-1",
                "group-hover:border-brand-500/30 dark:group-hover:border-brand-400/30",
                className
            )}>
                {/* Image Container */}
                <div className="relative aspect-video overflow-hidden">
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 z-20" />

                    {image_url ? (
                        <>
                            {/* Loading skeleton */}
                            {!imageLoaded && (
                                <div className="absolute inset-0 bg-gradient-to-br from-surface-100 to-surface-200 dark:from-surface-800 dark:to-surface-700 animate-pulse" />
                            )}
                            <img
                                src={image_url}
                                alt={title}
                                className={cn(
                                    "h-full w-full object-cover transition-all duration-500",
                                    "group-hover:scale-110 group-hover:blur-[0.5px]",
                                    !imageLoaded && "opacity-0"
                                )}
                                onLoad={() => setImageLoaded(true)}
                                loading="lazy"
                            />
                        </>
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface-100 to-surface-200 dark:from-surface-800 dark:to-surface-700 group-hover:from-brand-50 group-hover:to-brand-100 dark:group-hover:from-brand-900/20 dark:group-hover:to-brand-800/20 transition-all duration-300">
                            <div className="text-center">
                                <ChefHat className="h-12 w-12 text-surface-400 dark:text-surface-500 mx-auto mb-2 group-hover:text-brand-500 transition-colors duration-300" />
                                <span className="text-sm font-medium text-surface-500 dark:text-surface-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-300">
                                    No image
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Category badge */}
                    {category && (
                        <Badge
                            className={cn(
                                "absolute left-3 top-3 px-3 py-1.5 text-xs font-medium border-0 backdrop-blur-sm",
                                "transition-all duration-300 hover:scale-105",
                                getCategoryColor()
                            )}
                        >
                            {category}
                        </Badge>
                    )}

                    {/* Favorite button */}
                    {onToggleFavorite && (
                        <button
                            onClick={handleFavoriteClick}
                            className={cn(
                                "absolute right-3 top-3 p-2 rounded-full backdrop-blur-sm transition-all duration-300",
                                "bg-white/80 hover:bg-white dark:bg-surface-900/80 dark:hover:bg-surface-900",
                                "hover:scale-110 active:scale-95 shadow-lg",
                                favoriteAnimation && "animate-pulse",
                                isFavorite && "bg-error-50 hover:bg-error-100 dark:bg-error-900/50 dark:hover:bg-error-900/70"
                            )}
                            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                        >
                            {isFavorite ? (
                                <Heart className={cn(
                                    "h-5 w-5 text-error-500 fill-error-500 transition-all duration-300",
                                    favoriteAnimation && "scale-125"
                                )} />
                            ) : (
                                <Heart className="h-5 w-5 text-surface-600 dark:text-surface-400 hover:text-error-500 dark:hover:text-error-400 transition-colors duration-300" />
                            )}
                        </button>
                    )}

                    {/* Difficulty badge */}
                    {difficulty && (
                        <div className={cn(
                            "absolute bottom-3 right-3 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm",
                            "transition-all duration-300 hover:scale-105",
                            getDifficultyColor()
                        )}>
                            {difficulty}
                        </div>
                    )}

                    {/* Sparkle decorations */}
                    <Sparkles className="absolute bottom-3 left-3 h-4 w-4 text-white/70 opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse" />
                </div>

                <CardContent className="p-5">
                    <div className="mb-3 flex items-start justify-between">
                        <h3 className="font-display text-lg font-semibold text-surface-900 dark:text-surface-50 line-clamp-2 pr-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-300">
                            {title}
                        </h3>

                        {rating > 0 && (
                            <div className="flex items-center gap-1 bg-gradient-to-r from-warning-50 to-warning-100 dark:from-warning-900/20 dark:to-warning-800/20 px-2 py-1 rounded-full">
                                <Star className="h-4 w-4 fill-warning-500 text-warning-500" />
                                <span className="text-sm font-medium text-warning-700 dark:text-warning-400">
                                    {rating.toFixed(1)}
                                </span>
                            </div>
                        )}
                    </div>

                    <p className="mb-4 text-sm text-surface-600 dark:text-surface-400 line-clamp-2 leading-relaxed">
                        {description || "No description provided."}
                    </p>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 text-surface-500 dark:text-surface-400">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm font-medium">{totalTime} min</span>
                            </div>

                            <div className="flex items-center gap-1.5 text-surface-500 dark:text-surface-400">
                                <Heart className="h-4 w-4" />
                                <span className="text-sm font-medium">{likes}</span>
                            </div>
                        </div>

                        <ArrowRight className="h-4 w-4 text-surface-400 dark:text-surface-500 group-hover:text-brand-500 dark:group-hover:text-brand-400 group-hover:translate-x-1 transition-all duration-300" />
                    </div>

                    {/* Progress bar */}
                    <div className="mt-4 h-0.5 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full w-0 group-hover:w-full transition-all duration-500" />
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}; 