import React from 'react';
import { Card, CardContent, CardHeader, Badge } from '../../../ui';
import { Recipe } from '@recipe-manager/shared';

interface RecipeDetailTagsProps {
    recipe: Recipe;
}

export const RecipeDetailTags: React.FC<RecipeDetailTagsProps> = ({ recipe }) => {
    return (
        <Card>
            <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2">
                    {recipe.tags?.split(',').map((tag, index) => (
                        <Badge
                            key={index}
                            variant="secondary"
                            className="text-sm"
                        >
                            {tag.trim()}
                        </Badge>
                    )) || <p className="text-gray-500 text-sm">No tags</p>}
                </div>
            </CardContent>
        </Card>
    );
}; 