import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../services/api';

interface DashboardStats {
    totalRecipes: number;
    totalFavorites: number;
    totalCategories: number;
}

export const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats>({
        totalRecipes: 0,
        totalFavorites: 0,
        totalCategories: 0
    });
    const [loading, setLoading] = useState(true);

    const fetchedOnce = useRef(false);

    const fetchDashboardStats = useCallback(async () => {
        if (fetchedOnce.current) return; // Avoid duplicate calls in React.StrictMode
        fetchedOnce.current = true;

        try {
            setLoading(true);

            const [recipesResponse, allRecipesResponse] = await Promise.all([
                apiClient.get<{
                    recipes: any[];
                    pagination: { total: number };
                }>('/api/recipes?page=1&limit=1'),
                apiClient.get<{
                    recipes: Array<{ cuisineType: string | null }>;
                }>('/api/recipes?page=1&limit=50')
            ]);

            const uniqueCuisines = new Set(
                allRecipesResponse.recipes
                    .map(recipe => recipe.cuisineType)
                    .filter((cuisine): cuisine is string => cuisine !== null)
            );

            setStats({
                totalRecipes: recipesResponse.pagination.total,
                totalFavorites: 0, // TODO: Implement favorites feature
                totalCategories: uniqueCuisines.size
            });
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardStats();
    }, [fetchDashboardStats]);

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <div className="card p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Dashboard
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Welcome to your Recipe Manager dashboard. Here you can manage your recipes,
                        create new ones, and organize your culinary collection.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="card p-4 text-center">
                            <div className="text-3xl font-bold text-primary-600 mb-2">
                                {loading ? '...' : stats.totalRecipes}
                            </div>
                            <div className="text-sm text-gray-600">Total Recipes</div>
                        </div>

                        <div className="card p-4 text-center">
                            <div className="text-3xl font-bold text-primary-600 mb-2">
                                {loading ? '...' : stats.totalFavorites}
                            </div>
                            <div className="text-sm text-gray-600">Favorites</div>
                        </div>

                        <div className="card p-4 text-center">
                            <div className="text-3xl font-bold text-primary-600 mb-2">
                                {loading ? '...' : stats.totalCategories}
                            </div>
                            <div className="text-sm text-gray-600">Categories</div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <Link to="/recipes/new" className="btn-primary mr-4">
                            Add New Recipe
                        </Link>
                        <Link to="/recipes" className="btn-secondary">
                            Browse Recipes
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}; 