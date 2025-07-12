import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { Recipe } from '@recipe-manager/shared';
import { cn } from '../../../../utils/cn';

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
        <div className="relative w-full aspect-[16/9] overflow-hidden rounded-xl group">
            {isLoading && !hasError && (
                <div className="absolute inset-0 bg-surface-800 animate-pulse" />
            )}

            {(recipe.image_url && !hasError) ? (
                <img
                    src={recipe.image_url}
                    alt={recipe.title}
                    className={cn(
                        "w-full h-full object-cover transition-all duration-300 group-hover:scale-105",
                        isLoading ? 'opacity-0' : 'opacity-100'
                    )}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 bg-surface-800">
                    <ImageOff className="h-12 w-12 text-surface-500 mb-2" />
                    <p className="text-sm text-surface-400 font-medium">No Image Available</p>
                </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

            <div className="absolute bottom-0 left-0 p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white shadow-text">
                    {recipe.title}
                </h2>
            </div>
        </div>
    );
}; 