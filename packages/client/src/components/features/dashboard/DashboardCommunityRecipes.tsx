import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Clock } from 'lucide-react';
import { Recipe } from '@recipe-manager/shared';

interface DashboardCommunityRecipesProps {
    recentRecipes: Recipe[];
    recentRecipesLoading: boolean;
}

export const DashboardCommunityRecipes: React.FC<DashboardCommunityRecipesProps> = ({
    recentRecipes,
    recentRecipesLoading
}) => {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Community Recipes</h2>
                <Link
                    to="/recipes"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                    View all
                </Link>
            </div>
            <div className="space-y-4">
                {recentRecipesLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                                <div className="flex-1">
                                    <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                                    <div className="w-1/2 h-3 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : recentRecipes?.length ? (
                    recentRecipes.map((recipe) => (
                        <div key={recipe.id} className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                                {recipe.image_url ? (
                                    <img
                                        className="h-12 w-12 rounded-lg object-cover"
                                        src={recipe.image_url}
                                        alt={recipe.title}
                                    />
                                ) : (
                                    <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                        <ChefHat className="h-6 w-6 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <Link
                                    to={`/recipes/${recipe.id}`}
                                    className="text-sm font-medium text-gray-900 hover:text-blue-600"
                                >
                                    {recipe.title}
                                </Link>
                                <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{recipe.cook_time} mins</span>
                                    <span>•</span>
                                    <span>By {recipe.user?.name}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8">
                        <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No recent recipes</p>
                    </div>
                )}
            </div>
        </div>
    );
}; 