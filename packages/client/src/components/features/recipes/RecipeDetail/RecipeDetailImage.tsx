import React, { useState } from 'react';
import { ChefHat, Camera, ImageOff, Utensils, Award } from 'lucide-react';
import { Recipe } from '@recipe-manager/shared';
import { cn } from '../../../../utils/cn';

interface RecipeDetailImageProps {
    recipe: Recipe;
}

export const RecipeDetailImage: React.FC<RecipeDetailImageProps> = ({ recipe }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    const handleImageError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    const toggleZoom = () => {
        setIsZoomed(!isZoomed);
    };

    // Get a short excerpt from instructions to display as description
    const getExcerpt = () => {
        try {
            // Instructions might be stored as JSON string
            const instructionsText = typeof recipe.instructions === 'string'
                ? recipe.instructions
                : JSON.stringify(recipe.instructions);

            // Strip any HTML or markdown and get first 80 chars
            const plainText = instructionsText.replace(/<[^>]*>|#|\*|_|-|`/g, '');
            return plainText.substring(0, 80) + (plainText.length > 80 ? '...' : '');
        } catch (e) {
            return 'A delicious recipe to try';
        }
    };

    return (
        <div className="mb-8 animate-fade-in-up animation-delay-300">
            <div className="modern-card rounded-xl p-4 sm:p-6">
                <div className="relative group">
                    {recipe.image_url && !hasError ? (
                        <div className="relative overflow-hidden rounded-xl">
                            {/* Loading State */}
                            {isLoading && (
                                <div className="absolute inset-0 bg-surface-100/80 dark:bg-surface-800/80 backdrop-blur-sm animate-pulse rounded-xl flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="relative">
                                            <div className="w-16 h-16 rounded-full bg-surface-200/50 dark:bg-surface-700/50 animate-pulse"></div>
                                            <Camera className="h-8 w-8 text-brand-500 dark:text-brand-400 absolute inset-0 m-auto" />
                                        </div>
                                        <div className="text-surface-600 dark:text-surface-400 text-sm font-medium">
                                            Loading image...
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Main Image */}
                            <div
                                className={cn(
                                    "relative cursor-pointer overflow-hidden",
                                    isZoomed ? "fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" : ""
                                )}
                                onClick={toggleZoom}
                            >
                                <img
                                    src={recipe.image_url}
                                    alt={recipe.title}
                                    className={cn(
                                        "w-full h-72 sm:h-96 lg:h-[500px] object-cover transition-all duration-500",
                                        isLoading ? "opacity-0" : "opacity-100",
                                        isZoomed ? "object-contain h-auto max-h-[90vh] rounded-lg" : "group-hover:scale-105"
                                    )}
                                    onLoad={handleImageLoad}
                                    onError={handleImageError}
                                />

                                {!isZoomed && (
                                    <div className="absolute bottom-4 right-4 bg-white/80 dark:bg-black/60 text-xs text-surface-600 dark:text-surface-300 px-2 py-1 rounded-md backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        Click to zoom
                                    </div>
                                )}

                                {isZoomed && (
                                    <div className="absolute top-4 right-4 bg-white/20 text-white px-3 py-1 rounded-md backdrop-blur-sm">
                                        Click anywhere to close
                                    </div>
                                )}
                            </div>

                            {/* Overlay Gradient - Enhanced for better visibility */}
                            {!isZoomed && (
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            )}

                            {/* Recipe Info Overlay - Enhanced with more details */}
                            {!isZoomed && (
                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="text-white">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Award className="h-4 w-4 text-yellow-400" />
                                            <span className="text-sm font-medium text-yellow-200">Premium Recipe</span>
                                        </div>
                                        <h3 className="text-xl font-bold mb-2 truncate">{recipe.title}</h3>
                                        <p className="text-white/90 text-sm">
                                            {getExcerpt()}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Placeholder for missing image - Enhanced with more visual interest */
                        <div className="w-full h-72 sm:h-96 lg:h-[500px] bg-gradient-to-br from-surface-100 to-surface-200 dark:from-surface-800 dark:to-surface-900 rounded-xl flex flex-col items-center justify-center group hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden">
                            {/* Decorative pattern background */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-0 left-0 right-0 h-full w-full">
                                    {[...Array(6)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="absolute rounded-full bg-brand-500/30 dark:bg-brand-700/20"
                                            style={{
                                                width: `${Math.random() * 100 + 50}px`,
                                                height: `${Math.random() * 100 + 50}px`,
                                                top: `${Math.random() * 100}%`,
                                                left: `${Math.random() * 100}%`,
                                                animationDuration: `${Math.random() * 10 + 10}s`,
                                            }}
                                        ></div>
                                    ))}
                                </div>
                            </div>

                            <div className="text-center z-10 px-6">
                                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-surface-200/80 dark:bg-surface-700/80 backdrop-blur-sm flex items-center justify-center shadow-lg">
                                    {hasError ? (
                                        <ImageOff className="h-10 w-10 text-surface-500 dark:text-surface-400" />
                                    ) : (
                                        <Utensils className="h-10 w-10 text-brand-500 dark:text-brand-400" />
                                    )}
                                </div>
                                <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">
                                    {hasError ? 'Image not available' : 'No image yet'}
                                </h3>
                                <p className="text-surface-600 dark:text-surface-400 text-sm max-w-xs">
                                    {hasError
                                        ? 'There was an error loading the recipe image'
                                        : 'This delicious recipe is waiting for a photo to showcase its appeal'
                                    }
                                </p>

                                {!hasError && (
                                    <div className="mt-4 flex justify-center">
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-100/50 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300 rounded-full text-xs font-medium">
                                            <ChefHat className="h-3 w-3" />
                                            <span>Recipe by {recipe.user?.name || 'Anonymous Chef'}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Enhanced Decorative Elements */}
                            <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900 opacity-50 group-hover:opacity-80 transition-opacity animate-pulse-slow"></div>
                            <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-accent-100 dark:bg-accent-900 opacity-30 group-hover:opacity-60 transition-opacity animate-float"></div>
                            <div className="absolute top-1/2 right-8 w-6 h-6 rounded-full bg-brand-200 dark:bg-brand-800 opacity-40 group-hover:opacity-70 transition-opacity animate-bounce-subtle"></div>
                        </div>
                    )}
                </div>

                {/* Image caption */}
                {recipe.image_url && !hasError && !isLoading && (
                    <div className="mt-3 text-center">
                        <p className="text-sm text-surface-600 dark:text-surface-400 italic">
                            {recipe.title} - A delicious recipe by {recipe.user?.name || 'Anonymous Chef'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}; 