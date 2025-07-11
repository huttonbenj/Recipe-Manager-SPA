import React from 'react';
import { ChefHat } from 'lucide-react';
import { Recipe } from '@recipe-manager/shared';

interface RecipeDetailImageProps {
    recipe: Recipe;
}

export const RecipeDetailImage: React.FC<RecipeDetailImageProps> = ({ recipe }) => {
    return (
        <div className="mb-8">
            {recipe.image_url ? (
                <img
                    src={recipe.image_url}
                    alt={recipe.title}
                    className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                />
            ) : (
                <div className="w-full h-64 md:h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                    <ChefHat className="h-16 w-16 text-gray-400" />
                </div>
            )}
        </div>
    );
}; 