import React from 'react';
import { Clock, Users, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, Badge } from '../../../ui';
import { Recipe } from '@recipe-manager/shared';

interface RecipeDetailInfoProps {
    recipe: Recipe;
}

export const RecipeDetailInfo: React.FC<RecipeDetailInfoProps> = ({ recipe }) => {
    const getDifficultyColor = (difficulty?: string) => {
        switch (difficulty) {
            case 'Easy':
                return 'success';
            case 'Medium':
                return 'warning';
            case 'Hard':
                return 'danger';
            default:
                return 'primary';
        }
    };

    return (
        <Card>
            <CardHeader className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recipe Info</h3>
                <div className="flex items-center text-yellow-500">
                    <Star className="h-5 w-5 fill-current" />
                    <span className="ml-1 text-sm font-medium">4.5</span>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="text-sm">Cook Time</span>
                    </div>
                    <span className="text-sm font-medium">
                        {recipe.cook_time || 'N/A'} {recipe.cook_time ? 'minutes' : ''}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        <span className="text-sm">Servings</span>
                    </div>
                    <span className="text-sm font-medium">
                        {recipe.servings || 'N/A'} {recipe.servings ? 'servings' : ''}
                    </span>
                </div>

                {recipe.difficulty && (
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Difficulty</span>
                        <Badge variant={getDifficultyColor(recipe.difficulty)}>
                            {recipe.difficulty}
                        </Badge>
                    </div>
                )}

                {recipe.category && (
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Category</span>
                        <Badge variant="primary">{recipe.category}</Badge>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}; 