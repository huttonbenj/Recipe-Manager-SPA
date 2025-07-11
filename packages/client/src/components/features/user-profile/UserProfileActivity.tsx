import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat } from 'lucide-react';

interface UserProfileActivityProps {
    user: {
        name: string;
        created_at: Date;
    };
    totalRecipes: number;
}

export const UserProfileActivity: React.FC<UserProfileActivityProps> = ({
    user,
    totalRecipes
}) => {
    const navigate = useNavigate();

    return (
        <div className="glass-card p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-50 mb-4">Recent Activity</h2>
            <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-surface-200 dark:border-surface-700">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <ChefHat className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-surface-900 dark:text-surface-50">Profile created</p>
                            <p className="text-xs text-surface-500 dark:text-surface-400">{new Date(user.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                {totalRecipes === 0 && (
                    <div className="text-center py-8">
                        <ChefHat className="h-12 w-12 text-surface-400 dark:text-surface-500 mx-auto mb-4" />
                        <p className="text-surface-600 dark:text-surface-400 mb-4">No recipes yet</p>
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