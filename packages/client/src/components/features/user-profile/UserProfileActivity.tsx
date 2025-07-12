import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChefHat, PlusCircle, ChevronRight } from 'lucide-react';
import { Recipe } from '@recipe-manager/shared';

interface UserProfileActivityProps {
    recipes: Recipe[];
}

export const UserProfileActivity: React.FC<UserProfileActivityProps> = ({
    recipes,
}) => {
    const navigate = useNavigate();

    return (
        <div className="bg-surface-50 dark:bg-surface-800 p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-surface-900 dark:text-surface-50">My Recipes</h2>
                <button
                    onClick={() => navigate('/recipes/new')}
                    className="flex items-center text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    New Recipe
                </button>
            </div>
            <div className="space-y-2">
                {recipes.length > 0 ? (
                    recipes.slice(0, 5).map(recipe => (
                        <Link to={`/recipes/${recipe.id}`} key={recipe.id} className="block group">
                            <div className="p-3 rounded-md flex justify-between items-center bg-white dark:bg-surface-700 group-hover:bg-surface-100 dark:group-hover:bg-surface-600 transition-colors">
                                <div>
                                    <p className="font-semibold text-surface-800 dark:text-surface-100">{recipe.title}</p>
                                    <p className="text-sm text-surface-500 dark:text-surface-400">{recipe.category}</p>
                                </div>
                                <ChevronRight className="h-5 w-5 text-surface-400 dark:text-surface-500 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="text-center py-8">
                        <ChefHat className="h-12 w-12 text-surface-400 dark:text-surface-500 mx-auto mb-4" />
                        <p className="text-surface-600 dark:text-surface-400 mb-4">You haven't created any recipes yet.</p>
                        <button
                            onClick={() => navigate('/recipes/new')}
                            className="btn-primary"
                        >
                            Create Your First Recipe
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}; 