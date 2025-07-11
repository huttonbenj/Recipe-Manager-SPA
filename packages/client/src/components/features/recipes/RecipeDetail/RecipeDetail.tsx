import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../../services/api';
import { useAuth } from '../../../../hooks';
import { RecipeDetailHeader } from './RecipeDetailHeader';
import { RecipeDetailImage } from './RecipeDetailImage';
import { RecipeDetailInfo } from './RecipeDetailInfo';
import { RecipeDetailIngredients } from './RecipeDetailIngredients';
import { RecipeDetailTags } from './RecipeDetailTags';
import { RecipeDetailInstructions } from './RecipeDetailInstructions';
import { RecipeDetailRelated } from './RecipeDetailRelated';
import { Loader2, ChefHat, AlertCircle, Home } from 'lucide-react';

export const RecipeDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [isLiked, setIsLiked] = useState(false);

    // Fetch recipe details
    const { data: recipe, isLoading, error } = useQuery({
        queryKey: ['recipe', id],
        queryFn: () => apiClient.getRecipe(id!),
        enabled: !!id,
    });

    // Delete recipe mutation
    const deleteMutation = useMutation({
        mutationFn: (recipeId: string) => apiClient.deleteRecipe(recipeId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
            navigate('/recipes');
        },
    });

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this recipe?')) {
            deleteMutation.mutate(id!);
        }
    };

    const handleLikeToggle = () => {
        setIsLiked(!isLiked);
    };

    if (isLoading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center p-8">
                <div className="glass-card p-12 max-w-md mx-auto text-center">
                    <div className="relative mb-8">
                        <div className="w-24 h-24 mx-auto rounded-full gradient-brand opacity-20 animate-pulse"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <ChefHat className="h-12 w-12 text-brand-600 dark:text-brand-400 animate-bounce" />
                        </div>
                    </div>
                    <Loader2 className="h-8 w-8 animate-spin text-brand-600 dark:text-brand-400 mx-auto mb-4" data-testid="loading-spinner" />
                    <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">
                        Loading Recipe
                    </h3>
                    <p className="text-surface-600 dark:text-surface-400 animate-pulse">
                        Preparing something delicious...
                    </p>
                    <div className="mt-6 flex justify-center space-x-1">
                        <div className="w-2 h-2 bg-brand-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-brand-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-brand-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !recipe) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-8">
                <div className="glass-card p-12 max-w-lg mx-auto text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-error-100 dark:bg-error-950 flex items-center justify-center">
                        <AlertCircle className="h-10 w-10 text-error-600 dark:text-error-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-3">
                        Recipe Not Found
                    </h3>
                    <p className="text-surface-600 dark:text-surface-400 mb-8 leading-relaxed">
                        The recipe you're looking for doesn't exist or has been removed from our kitchen.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/recipes"
                            className="btn btn-primary flex items-center justify-center gap-2"
                        >
                            <ChefHat className="h-4 w-4" />
                            Browse Recipes
                        </Link>
                        <Link
                            to="/"
                            className="btn btn-ghost flex items-center justify-center gap-2"
                        >
                            <Home className="h-4 w-4" />
                            Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-50/30 to-accent-50/30 dark:from-surface-900 dark:to-surface-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-fade-in" data-testid="recipe-detail-root">
                    <RecipeDetailHeader
                        recipe={recipe}
                        user={user}
                        isLiked={isLiked}
                        onLikeToggle={handleLikeToggle}
                        onDelete={handleDelete}
                    />

                    <RecipeDetailImage recipe={recipe} />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        <div className="lg:col-span-2 space-y-8">
                            <RecipeDetailInstructions recipe={recipe} />
                        </div>
                        <div className="space-y-6">
                            <RecipeDetailInfo recipe={recipe} />
                            <RecipeDetailIngredients recipe={recipe} />
                            <RecipeDetailTags recipe={recipe} />
                        </div>
                    </div>

                    <RecipeDetailRelated />
                </div>
            </div>
        </div>
    );
}; 