import React from 'react';
import { Card, CardContent, CardHeader } from '../../../ui';
import { Recipe } from '@recipe-manager/shared';

interface RecipeDetailInstructionsProps {
    recipe: Recipe;
}

export const RecipeDetailInstructions: React.FC<RecipeDetailInstructionsProps> = ({ recipe }) => {
    return (
        <Card className="mb-8">
            <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Instructions</h3>
            </CardHeader>
            <CardContent>
                <div className="prose max-w-none">
                    {recipe.instructions?.split('\n').map((step, index) => (
                        <div key={index} className="mb-4">
                            <div className="flex items-start">
                                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-4">
                                    {index + 1}
                                </span>
                                <p className="text-gray-700">{step}</p>
                            </div>
                        </div>
                    )) || <p className="text-gray-500">No instructions provided</p>}
                </div>
            </CardContent>
        </Card>
    );
}; 