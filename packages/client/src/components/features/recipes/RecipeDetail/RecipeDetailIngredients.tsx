import React from 'react';
import { Card, CardContent, CardHeader } from '../../../ui';
import { Recipe } from '@recipe-manager/shared';

interface RecipeDetailIngredientsProps {
    recipe: Recipe;
}

export const RecipeDetailIngredients: React.FC<RecipeDetailIngredientsProps> = ({ recipe }) => {
    return (
        <Card>
            <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Ingredients</h3>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {recipe.ingredients?.split('\n').map((ingredient, index) => (
                        <div key={index} className="flex items-start">
                            <span className="text-blue-600 mr-2">•</span>
                            <span className="text-sm text-gray-700">{ingredient}</span>
                        </div>
                    )) || <p className="text-gray-500 text-sm">No ingredients listed</p>}
                </div>
            </CardContent>
        </Card>
    );
}; 