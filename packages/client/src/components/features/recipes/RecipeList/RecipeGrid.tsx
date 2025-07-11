import React from 'react';
import { Grid, List as ListIcon } from 'lucide-react';
import { Recipe } from '@recipe-manager/shared';
import { Button } from '../../../ui';
import { RecipeCard } from './RecipeCard';
import { RecipeListItem } from './RecipeListItem';

interface RecipeGridProps {
    recipes: Recipe[];
    viewMode: 'grid' | 'list';
    onViewModeChange: (mode: 'grid' | 'list') => void;
    isLoading?: boolean;
}

export const RecipeGrid: React.FC<RecipeGridProps> = ({
    recipes,
    viewMode,
    onViewModeChange,
    isLoading = false,
}) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                        <div className="h-48 bg-gray-200" />
                        <div className="p-4 space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-3 bg-gray-200 rounded w-1/2" />
                            <div className="h-3 bg-gray-200 rounded w-full" />
                            <div className="flex justify-between">
                                <div className="h-3 bg-gray-200 rounded w-1/4" />
                                <div className="h-3 bg-gray-200 rounded w-1/4" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!recipes.length) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🍳</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No recipes found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or create a new recipe.</p>
            </div>
        );
    }

    return (
        <div>
            {/* View Mode Toggle */}
            <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                    Found {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
                </p>

                <div className="flex items-center space-x-2">
                    <Button
                        variant={viewMode === 'grid' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => onViewModeChange('grid')}
                        leftIcon={<Grid className="h-4 w-4" />}
                    >
                        Grid
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => onViewModeChange('list')}
                        leftIcon={<ListIcon className="h-4 w-4" />}
                    >
                        List
                    </Button>
                </div>
            </div>

            {/* Recipe Display */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {recipes.map((recipe) => (
                        <RecipeListItem key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            )}
        </div>
    );
}; 