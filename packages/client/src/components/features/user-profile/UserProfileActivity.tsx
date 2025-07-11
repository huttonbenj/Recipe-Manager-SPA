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
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <ChefHat className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">Profile created</p>
                            <p className="text-xs text-gray-500">{new Date(user.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                {totalRecipes === 0 && (
                    <div className="text-center py-8">
                        <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">No recipes yet</p>
                        <button
                            onClick={() => navigate('/recipes/new')}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                        >
                            Create Your First Recipe
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}; 