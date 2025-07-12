import React from 'react';
import { Sparkles } from 'lucide-react';
import { RecipeCard, RecipeCardSkeleton } from '../RecipeCard/RecipeCard';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../../services/api';
import { Recipe } from '@recipe-manager/shared';

export const RecipeDetailRelated: React.FC = () => {
    // In a real app, you might fetch related recipes based on category or tags
    const { data: response, isLoading } = useQuery<{ data: Recipe[] }>({
        queryKey: ['recipes', { limit: 3, sort: 'random' }],
        queryFn: () => apiClient.getRecipes({ limit: 3, sort: 'random' }),
    });
    const relatedRecipes = response?.data || [];

    return (
        <div className="pt-8">
            <div className="flex items-center gap-3 mb-6">
                <Sparkles className="h-6 w-6 text-surface-400" />
                <h3 className="text-2xl font-bold text-surface-100">
                    You might also like
                </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {isLoading
                    ? Array.from({ length: 3 }).map((_, index) => <RecipeCardSkeleton key={index} />)
                    : relatedRecipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
            </div>
        </div>
    );
}; 