import React from 'react';
import { Grid, List as ListIcon } from 'lucide-react';
import { Recipe } from '@recipe-manager/shared';
import { Button, Card, CardContent, RecipeCardSkeleton, RecipeListItemSkeleton, NoSearchResults } from '../../../ui';
import { RecipeCard } from '../../recipes/RecipeCard';
import { RecipeListItem } from './RecipeListItem';

interface RecipeGridProps {
    recipes: Recipe[];
    viewMode: 'grid' | 'list';
    onViewModeChange: (mode: 'grid' | 'list') => void;
    isLoading?: boolean;
    onClearFilters?: () => void;
}

export const RecipeGrid: React.FC<RecipeGridProps> = ({
    recipes,
    viewMode,
    onViewModeChange,
    isLoading = false,
    onClearFilters,
}) => {
    if (isLoading) {
        const skeletons = Array.from({ length: 10 }).map((_, index) => (
            <div
                key={index}
                className="animate-skeleton-fade-in opacity-0"
                style={{ animationDelay: `${index * 20}ms` }}
            >
                {viewMode === 'grid'
                    ? <RecipeCardSkeleton />
                    : <RecipeListItemSkeleton />
                }
            </div>
        ));

        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between animate-skeleton-fade-in">
                    <div className="h-5 bg-surface-200 dark:bg-surface-700 rounded-md w-24 animate-pulse"></div>
                    <div className="flex items-center gap-1">
                        <div className="h-8 w-8 bg-surface-200 dark:bg-surface-700 rounded-md animate-pulse"></div>
                        <div className="h-8 w-8 bg-surface-200 dark:bg-surface-700 rounded-md animate-pulse"></div>
                    </div>
                </div>
                {viewMode === 'grid'
                    ? <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">{skeletons}</div>
                    : <div className="space-y-4">{skeletons}</div>
                }
            </div>
        );
    }

    if (!recipes.length) {
        return (
            <Card>
                <CardContent className="p-0">
                    <NoSearchResults
                        title="No Recipes Found"
                        description="It seems we couldn't find any recipes that match your filters. Try adjusting your search or create a new culinary masterpiece!"
                        action={{
                            label: "Create New Recipe",
                            href: "/recipes/new",
                            variant: "primary"
                        }}
                        {...(onClearFilters && {
                            secondaryAction: {
                                label: "Clear Filters",
                                onClick: onClearFilters,
                                variant: "outline"
                            }
                        })}
                    />
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header with View Mode Toggle */}
            <div className="flex items-center justify-between">
                <h3 className="text-md font-medium text-gray-600 dark:text-gray-400">
                    Showing {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
                </h3>
                <div className="flex items-center gap-1">
                    <Button
                        variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                        size="sm"
                        iconOnly
                        onClick={() => onViewModeChange('grid')}
                    >
                        <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                        size="sm"
                        iconOnly
                        onClick={() => onViewModeChange('list')}
                    >
                        <ListIcon className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Recipe Display */}
            <div className="w-full">
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {recipes.map((recipe, index) => (
                            <div
                                key={recipe.id}
                                className="animate-fade-in-up opacity-0"
                                style={{ animationDelay: `${index * 30}ms` }}
                            >
                                <RecipeCard recipe={recipe} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recipes.map((recipe, index) => (
                            <div
                                key={recipe.id}
                                className="animate-fade-in-up opacity-0"
                                style={{ animationDelay: `${index * 30}ms` }}
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