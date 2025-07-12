import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recipeService } from '../../../../services';
import { useAuth } from '../../../../hooks';
import { RecipeDetailHeader } from './RecipeDetailHeader';
import { RecipeDetailImage } from './RecipeDetailImage';
import { RecipeDetailSidebar } from './RecipeDetailSidebar';
import { RecipeDetailInstructions } from './RecipeDetailInstructions';
import { RecipeDetailRelated } from './RecipeDetailRelated';
import { Loader2, ChefHat, AlertCircle, Home } from 'lucide-react';
import { Button } from '../../../ui';
import { PageTransitionScale } from '../../../ui/PageTransition';

export const RecipeDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const likeMutation = useMutation({
        mutationFn: () => recipeService.likeRecipe(id!),
        onSuccess: () => {
            setIsLiked(true);
            // Invalidate stats cache to refresh the like count
            if (user) {
                queryClient.invalidateQueries({ queryKey: ['userStats', user.id] });
            }
        },
        onError: (error) => {
            console.error('Like mutation failed:', error);
        },
    });
    const unlikeMutation = useMutation({
        mutationFn: () => recipeService.unlikeRecipe(id!),
        onSuccess: () => {
            setIsLiked(false);
            // Invalidate stats cache to refresh the like count
            if (user) {
                queryClient.invalidateQueries({ queryKey: ['userStats', user.id] });
            }
        },
        onError: (error) => {
            console.error('Unlike mutation failed:', error);
        },
    });

    // Fetch recipe details
    const { data: recipe, isLoading, error } = useQuery({
        queryKey: ['recipe', id],
        queryFn: () => recipeService.getRecipe(id!),
        enabled: !!id,
    });

    // Sync liked and saved state with API response
    useEffect(() => {
        if (recipe) {
            if ((recipe as any).liked !== undefined) {
                setIsLiked((recipe as any).liked);
            }
            if ((recipe as any).saved !== undefined) {
                setIsSaved((recipe as any).saved);
            }
        }
    }, [recipe]);

    // Save/Unsave mutations
    const saveMutation = useMutation({
        mutationFn: () => recipeService.saveRecipe(id!),
        onSuccess: () => setIsSaved(true),
        onError: (error) => console.error('Save mutation failed:', error),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['recipe', id] });
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
        },
    });
    const unsaveMutation = useMutation({
        mutationFn: () => recipeService.unsaveRecipe(id!),
        onSuccess: () => setIsSaved(false),
        onError: (error) => console.error('Unsave mutation failed:', error),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['recipe', id] });
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
        },
    });
    const handleSaveToggle = () => {
        if (!id) return;
        if (!user) return;
        if (isSaved) {
            unsaveMutation.mutate();
        } else {
            saveMutation.mutate();
        }
    };

    // Delete recipe mutation
    const deleteMutation = useMutation({
        mutationFn: (recipeId: string) => recipeService.deleteRecipe(recipeId),
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
        if (!id) {
            console.error('No recipe ID available');
            return;
        }
        if (!user) {
            console.error('User not authenticated');
            return;
        }

        if (isLiked) {
            unlikeMutation.mutate();
        } else {
            likeMutation.mutate();
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="flex items-center gap-4 text-lg text-surface-500 dark:text-surface-400">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
                    <span>Loading delicious recipe...</span>
                </div>
            </div>
        );
    }

    if (error || !recipe) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center bg-surface-50 dark:bg-surface-900">
                <div className="text-center p-8 bg-white dark:bg-surface-800 rounded-lg shadow-xl max-w-md mx-auto">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-error-100 dark:bg-error-900/50">
                        <AlertCircle className="h-6 w-6 text-error-600 dark:text-error-400" />
                    </div>
                    <h3 className="mt-5 text-2xl font-bold text-surface-900 dark:text-white">
                        Oops! Recipe Not Found
                    </h3>
                    <p className="mt-2 text-base text-surface-600 dark:text-surface-400">
                        The recipe you're looking for seems to have vanished from our kitchen.
                    </p>
                    <div className="mt-6 flex justify-center gap-4">
                        <Link to="/recipes">
                            <Button variant="primary">
                                <ChefHat className="mr-2 h-5 w-5" />
                                Browse Recipes
                            </Button>
                        </Link>
                        <Link to="/">
                            <Button variant="outline">
                                <Home className="mr-2 h-5 w-5" />
                                Go Home
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <PageTransitionScale>
            <div className="bg-surface-900 text-surface-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                    <div className="space-y-8">
                        <RecipeDetailHeader
                            recipe={recipe}
                            user={user}
                            isLiked={isLiked}
                            isSaved={isSaved}
                            onLikeToggle={handleLikeToggle}
                            onSaveToggle={handleSaveToggle}
                            onDelete={handleDelete}
                        />

                        <RecipeDetailImage recipe={recipe} />

                        {/* Main recipe content in a two-column layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
                            <div className="lg:col-span-2 space-y-8">
                                <RecipeDetailInstructions recipe={recipe} />
                                <RecipeDetailRelated />
                            </div>
                            <div className="lg:col-span-1 space-y-8">
                                <RecipeDetailSidebar recipe={recipe} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransitionScale>
    );
}; 