import React, { useState } from 'react';
import { ChefHat, Camera, ImageOff } from 'lucide-react';
import { Recipe } from '@recipe-manager/shared';

interface RecipeDetailImageProps {
    recipe: Recipe;
}

export const RecipeDetailImage: React.FC<RecipeDetailImageProps> = ({ recipe }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    const handleImageError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    return (
        <div className="mb-8 animate-fade-in">
            <div className="glass-card p-4 sm:p-6">
                <div className="relative group">
                    {recipe.image_url && !hasError ? (
                        <div className="relative overflow-hidden rounded-xl">
                            {/* Loading State */}
                            {isLoading && (
                                <div className="absolute inset-0 bg-surface-100 dark:bg-surface-800 animate-pulse rounded-xl flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <Camera className="h-12 w-12 text-surface-400 dark:text-surface-600 animate-bounce" />
                                        <div className="text-surface-600 dark:text-surface-400 text-sm font-medium">
                                            Loading image...
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Main Image */}
                            <img
                                src={recipe.image_url}
                                alt={recipe.title}
                                className={`w-full h-72 sm:h-96 lg:h-[500px] object-cover transition-all duration-500 group-hover:scale-105 ${isLoading ? 'opacity-0' : 'opacity-100'
                                    }`}
                                onLoad={handleImageLoad}
                                onError={handleImageError}
                            />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            {/* Recipe Info Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="text-white">
                                    <h3 className="text-xl font-bold mb-2 truncate">{recipe.title}</h3>
                                    <p className="text-white/90 text-sm">
                                        A delicious recipe to try
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Placeholder for missing image */
                        <div className="w-full h-72 sm:h-96 lg:h-[500px] bg-gradient-to-br from-surface-100 to-surface-200 dark:from-surface-800 dark:to-surface-900 rounded-xl flex flex-col items-center justify-center group hover:scale-[1.02] transition-transform duration-300">
                            <div className="text-center">
                                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center">
                                    {hasError ? (
                                        <ImageOff className="h-10 w-10 text-surface-400 dark:text-surface-600" />
                                    ) : (
                                        <ChefHat className="h-10 w-10 text-surface-400 dark:text-surface-600" />
                                    )}
                                </div>
                                <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">
                                    {hasError ? 'Image not available' : 'No image'}
                                </h3>
                                <p className="text-surface-600 dark:text-surface-400 text-sm max-w-xs">
                                    {hasError
                                        ? 'There was an error loading the recipe image'
                                        : 'This recipe doesn\'t have an image yet'
                                    }
                                </p>
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900 opacity-50 group-hover:opacity-80 transition-opacity"></div>
                            <div className="absolute bottom-4 left-4 w-6 h-6 rounded-full bg-accent-100 dark:bg-accent-900 opacity-30 group-hover:opacity-60 transition-opacity"></div>
                            <div className="absolute top-1/2 right-8 w-4 h-4 rounded-full bg-brand-200 dark:bg-brand-800 opacity-40 group-hover:opacity-70 transition-opacity"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}; 