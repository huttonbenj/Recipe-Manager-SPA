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
            <div className="min-h-screen flex items-center justify-center" role="status">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" data-testid="loading-spinner"></div>
            </div>
        );
    }

    if (error || !recipe) {
        return (
            <div className="text-center py-12">
                <div className="text-red-600 mb-4">Recipe not found</div>
                <Link to="/recipes" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Back to Recipes
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto" data-testid="recipe-detail-root">
            <RecipeDetailHeader
                recipe={recipe}
                user={user}
                isLiked={isLiked}
                onLikeToggle={handleLikeToggle}
                onDelete={handleDelete}
            />

            <RecipeDetailImage recipe={recipe} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <RecipeDetailInfo recipe={recipe} />
                <RecipeDetailIngredients recipe={recipe} />
                <RecipeDetailTags recipe={recipe} />
            </div>

            <RecipeDetailInstructions recipe={recipe} />

            <RecipeDetailRelated />
        </div>
    );
}; 