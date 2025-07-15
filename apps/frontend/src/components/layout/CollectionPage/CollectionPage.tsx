import React, { useState } from 'react';
import { Grid, List, Search, ArrowLeft } from 'lucide-react';

import { Button, Loading } from '@/components/ui';
import LinkButton from '@/components/ui/LinkButton/LinkButton';
import { RecipeCard } from '@/components/recipe';
import type { Recipe } from '@/types/recipe';
import { useAuth } from '@/hooks/useAuth';

interface CollectionPageProps {
    pageTitle: string;
    pageIcon: React.ReactNode;
    recipes: Recipe[];
    isLoading: boolean;
    error: Error | null;
    emptyState: {
        icon: React.ReactNode;
        title: string;
        message: string;
    };
    currentUserId?: string;
}

const CollectionPage: React.FC<CollectionPageProps> = ({
    pageTitle,
    pageIcon,
    recipes,
    isLoading,
    error,
    emptyState,
    currentUserId,
}) => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold mb-2">Authentication Required</h1>
                <p className="text-secondary-700 dark:text-secondary-300 mb-4">
                    Please log in to view this page.
                </p>
                <LinkButton to="/login" variant="primary">
                    Login
                </LinkButton>
            </div>
        );
    }

    if (isLoading) {
        return <Loading variant="spinner" size="lg" text={`Loading ${pageTitle}...`} fullScreen />;
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold text-danger mb-2">Error loading {pageTitle.toLowerCase()}</h1>
                <p className="text-secondary-700 dark:text-secondary-300 mb-4">
                    {error.message || `Failed to load your ${pageTitle.toLowerCase()}.`}
                </p>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <div className="mb-6">
                <LinkButton to="/app/recipes" variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                    Back to Recipes
                </LinkButton>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-extrabold text-secondary-900 dark:text-secondary-100 flex items-center gap-3">
                        {pageIcon}
                        {pageTitle}
                    </h1>
                    <p className="text-secondary-700 dark:text-secondary-300 mt-1">
                        {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} found
                    </p>
                </div>
                {recipes.length > 0 && (
                    <div className="flex items-center border border-secondary-200 dark:border-secondary-700 rounded-lg p-1">
                        <Button
                            variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                            onClick={() => setViewMode('grid')}
                            aria-label="Grid view"
                            size="sm"
                        >
                            <Grid className="w-5 h-5" />
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? 'primary' : 'ghost'}
                            onClick={() => setViewMode('list')}
                            aria-label="List view"
                            size="sm"
                        >
                            <List className="w-5 h-5" />
                        </Button>
                    </div>
                )}
            </div>

            {recipes.length === 0 ? (
                <div className="text-center py-16">
                    <div className="inline-block p-4 bg-secondary-100 dark:bg-secondary-800 rounded-full mb-4">
                        {emptyState.icon}
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{emptyState.title}</h2>
                    <p className="text-secondary-700 dark:text-secondary-300 mb-6 max-w-md mx-auto">{emptyState.message}</p>
                    <LinkButton to="/app/recipes" variant="primary" leftIcon={<Search className="w-4 h-4" />}>
                        Discover Recipes
                    </LinkButton>
                </div>
            ) : (
                <div
                    className={`grid gap-8 ${viewMode === 'grid'
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                        : 'grid-cols-1'
                        }`}
                >
                    {recipes.map((recipe) => (
                        <RecipeCard
                            key={recipe.id}
                            recipe={recipe}
                            viewMode={viewMode}
                            currentUserId={currentUserId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CollectionPage; 