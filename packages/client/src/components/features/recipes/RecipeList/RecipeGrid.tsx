import React from 'react';
import { Grid, List as ListIcon, ChefHat, Search, Sparkles } from 'lucide-react';
import { Recipe } from '@recipe-manager/shared';
import { Button } from '../../../ui';
import { RecipeCard } from '../../recipes/RecipeCard/RecipeCard';
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
            <div className="space-y-6">
                {/* Loading Header */}
                <div className="glass-card p-6 animate-pulse">
                    <div className="flex items-center justify-between">
                        <div className="h-6 bg-surface-200 dark:bg-surface-700 rounded w-48"></div>
                        <div className="flex gap-2">
                            <div className="h-9 bg-surface-200 dark:bg-surface-700 rounded w-20"></div>
                            <div className="h-9 bg-surface-200 dark:bg-surface-700 rounded w-20"></div>
                        </div>
                    </div>
                </div>

                {/* Loading Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="glass-card p-6 animate-pulse">
                            <div className="aspect-video bg-surface-200 dark:bg-surface-700 rounded-lg mb-4"></div>
                            <div className="space-y-3">
                                <div className="h-6 bg-surface-200 dark:bg-surface-700 rounded w-3/4"></div>
                                <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-1/2"></div>
                                <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-full"></div>
                                <div className="flex justify-between">
                                    <div className="h-6 bg-surface-200 dark:bg-surface-700 rounded w-16"></div>
                                    <div className="h-6 bg-surface-200 dark:bg-surface-700 rounded w-16"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!recipes.length) {
        return (
            <div className="glass-card p-12 text-center">
                <div className="max-w-md mx-auto">
                    <div className="relative mb-8">
                        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-brand-100 to-accent-100 dark:from-brand-900 dark:to-accent-900 flex items-center justify-center">
                            <Search className="h-12 w-12 text-surface-600 dark:text-surface-400" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-surface-200 dark:bg-surface-700 rounded-full opacity-60"></div>
                        <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-accent-200 dark:bg-accent-800 rounded-full opacity-40"></div>
                    </div>
                    <h3 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-3">
                        No recipes found
                    </h3>
                    <p className="text-surface-600 dark:text-surface-400 mb-6 leading-relaxed">
                        We couldn't find any recipes matching your criteria. Try adjusting your search or create a new recipe to get started!
                    </p>
                    <Button className="btn-gradient">
                        <ChefHat className="h-4 w-4 mr-2" />
                        Create Recipe
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with View Mode Toggle */}
            <div className="glass-card p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-brand-100 dark:bg-brand-900">
                            <Sparkles className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100">
                                Recipe Collection
                            </h2>
                            <p className="text-surface-600 dark:text-surface-400">
                                {recipes.length} delicious recipe{recipes.length !== 1 ? 's' : ''} found
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => onViewModeChange('grid')}
                            className="glass-effect transition-all duration-200 hover:scale-105"
                        >
                            <Grid className="h-4 w-4 mr-2" />
                            Grid
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => onViewModeChange('list')}
                            className="glass-effect transition-all duration-200 hover:scale-105"
                        >
                            <ListIcon className="h-4 w-4 mr-2" />
                            List
                        </Button>
                    </div>
                </div>
            </div>

            {/* Recipe Display */}
            <div className="animate-fade-in">
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recipes.map((recipe, index) => (
                            <div
                                key={recipe.id}
                                className="animate-fade-in"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <RecipeCard
                                    recipe={recipe}
                                    onToggleFavorite={() => { }}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recipes.map((recipe, index) => (
                            <div
                                key={recipe.id}
                                className="animate-fade-in"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <RecipeListItem recipe={recipe} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}; 