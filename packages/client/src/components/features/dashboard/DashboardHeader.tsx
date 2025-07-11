import React from 'react';

interface DashboardHeaderProps {
    greeting: string;
    userName: string;
    stats: {
        totalRecipes: number;
        totalLikes: number;
    };
    statsLoading: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    greeting,
    userName,
    stats,
    statsLoading
}) => {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {greeting}, {userName}! 👋
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Welcome back to your recipe dashboard. Ready to cook something amazing?
                    </p>
                </div>
                <div className="hidden md:block">
                    <div className="flex items-center space-x-4">
                        <div className="text-center">
                            {statsLoading ? (
                                <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                            ) : (
                                <div className="text-2xl font-bold text-blue-600">
                                    {stats.totalRecipes}
                                </div>
                            )}
                            <div className="text-sm text-gray-500">Recipes</div>
                        </div>
                        <div className="text-center">
                            {statsLoading ? (
                                <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                            ) : (
                                <div className="text-2xl font-bold text-red-600">
                                    {stats.totalLikes}
                                </div>
                            )}
                            <div className="text-sm text-gray-500">Likes</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 