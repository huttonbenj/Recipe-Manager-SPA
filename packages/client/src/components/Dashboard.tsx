import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    PlusCircle,
    ChefHat,
    Clock,
    Star,
    TrendingUp,
    BookOpen,
    Heart
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { apiClient } from '../services/api';

export const Dashboard = () => {
    const { user } = useAuth();
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) {
            setGreeting('Good morning');
        } else if (hour < 17) {
            setGreeting('Good afternoon');
        } else {
            setGreeting('Good evening');
        }
    }, []);

    // Fetch user stats
    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['user-stats'],
        queryFn: apiClient.getUserStats,
    });

    // Fetch recent recipes
    const { data: recentRecipes, isLoading: recentRecipesLoading } = useQuery({
        queryKey: ['recent-recipes'],
        queryFn: () => apiClient.getRecipes({ limit: 3 }),
    });

    // Fetch user's recipes
    const { data: userRecipes, isLoading: userRecipesLoading } = useQuery({
        queryKey: ['user-recipes'],
        queryFn: () => apiClient.getUserRecipes(user?.id, { limit: 3 }),
    });

    const quickActions = [
        {
            title: 'Add New Recipe',
            description: 'Create a new recipe to share with the community',
            icon: PlusCircle,
            to: '/recipes/new',
            color: 'bg-blue-500 hover:bg-blue-600',
        },
        {
            title: 'Browse Recipes',
            description: 'Explore recipes from other users',
            icon: BookOpen,
            to: '/recipes',
            color: 'bg-green-500 hover:bg-green-600',
        },
        {
            title: 'Search Recipes',
            description: 'Find recipes by ingredients or cuisine',
            icon: ChefHat,
            to: '/recipes',
            color: 'bg-purple-500 hover:bg-purple-600',
        },
    ];

    const statCards = [
        {
            title: 'Your Recipes',
            value: stats?.totalRecipes || 0,
            icon: BookOpen,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Total Likes',
            value: stats?.totalLikes || 0,
            icon: Heart,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
        },
        {
            title: 'Avg Rating',
            value: stats?.averageRating ? stats.averageRating.toFixed(1) : '0.0',
            icon: Star,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
        },
        {
            title: 'Total Views',
            value: stats?.totalViews || 0,
            icon: TrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {greeting}, {user?.name}! 👋
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Welcome back to your recipe dashboard. Ready to cook something amazing?
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <div className="flex items-center space-x-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {stats?.totalRecipes || 0}
                                </div>
                                <div className="text-sm text-gray-500">Recipes</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-red-600">
                                    {stats?.totalLikes || 0}
                                </div>
                                <div className="text-sm text-gray-500">Likes</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div key={card.title} className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className={`p-3 rounded-full ${card.bgColor}`}>
                                    <Icon className={`h-6 w-6 ${card.color}`} />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">{card.title}</p>
                                    {statsLoading ? (
                                        <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                                    ) : (
                                        <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {quickActions.map((action) => {
                        const Icon = action.icon;
                        return (
                            <Link
                                key={action.title}
                                to={action.to}
                                className={`p-4 rounded-lg text-white transition-colors ${action.color}`}
                            >
                                <Icon className="h-8 w-8 mb-2" />
                                <h3 className="font-semibold">{action.title}</h3>
                                <p className="text-sm opacity-90">{action.description}</p>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Your Recent Recipes */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Your Recent Recipes</h2>
                        <Link
                            to="/recipes?filter=my-recipes"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            View all
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {userRecipesLoading ? (
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
                        ) : userRecipes?.data?.length ? (
                            userRecipes.data.map((recipe) => (
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
                                            <span>{recipe.difficulty}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">No recipes yet</p>
                                <Link
                                    to="/recipes/new"
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                    Create your first recipe
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Community Recipes */}
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
                        ) : recentRecipes?.data?.length ? (
                            recentRecipes.data.map((recipe) => (
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
            </div>
        </div>
    );
}; 