import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks/useAuth';
import { recipeService } from '../../../../services';
import { ChefHat, Heart, Star, Trophy, Settings, Edit, Save, X, TrendingUp, Calendar } from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { getThemeFormInputClasses } from '../../../../utils/theme';

export const ModernProfileTab: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || ''
    });

    // Get form input classes based on current theme
    const inputClasses = getThemeFormInputClasses(theme.color);

    // Fetch user's recipe stats
    const { data: userStats } = useQuery({
        queryKey: ['user-stats', user?.id],
        queryFn: () => recipeService.getRecipes({
            page: 1,
            user_id: user?.id,
            limit: 1000 // Get all to count
        }),
        enabled: !!user?.id,
        staleTime: 5 * 60 * 1000,
    });

    // Fetch user's recent recipes
    const { data: recentRecipes } = useQuery({
        queryKey: ['user-recent-recipes', user?.id],
        queryFn: () => recipeService.getRecipes({
            page: 1,
            user_id: user?.id,
            limit: 3,
            sortBy: 'created_at',
            sortOrder: 'desc'
        }),
        enabled: !!user?.id,
        staleTime: 30000,
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        try {
            // Here you would call the user update API
            // await userService.updateProfile(formData);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            email: user?.email || ''
        });
        setIsEditing(false);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/auth/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const totalRecipes = userStats?.pagination?.totalCount || 0;
    const memberSince = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
    }) : 'Unknown';

    return (
        <div className="space-y-8 pb-12">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-8 overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-white text-xl font-bold">
                                    {user?.name?.charAt(0) || 'U'}
                                </span>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {user?.name || 'User'}
                                </h1>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {user?.email || 'No email provided'}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Member since {memberSince}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center space-x-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg hover:bg-white/70 dark:hover:bg-gray-800/70 transition-colors border border-gray-200 dark:border-gray-600"
                        >
                            <Edit className="w-4 h-4" />
                            <span>Edit Profile</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                        <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
                            <ChefHat className="w-5 h-5 text-indigo-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {totalRecipes} Recipes
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Created</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
                            <Heart className="w-5 h-5 text-red-500" />
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    0 Likes
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Received</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
                            <Star className="w-5 h-5 text-yellow-500" />
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    0 Favorites
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Saved</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
                            <Trophy className="w-5 h-5 text-yellow-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    Novice Chef
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Level</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-indigo-600/20 rounded-full blur-2xl"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Profile Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                            <Settings className="w-5 h-5 text-indigo-600" />
                            <span>Profile Settings</span>
                        </h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Full Name
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className={inputClasses}
                                />
                            ) : (
                                <p className="text-gray-900 dark:text-white py-2.5 px-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    {user?.name || 'Not provided'}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email Address
                            </label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className={inputClasses}
                                />
                            ) : (
                                <p className="text-gray-900 dark:text-white py-2.5 px-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    {user?.email || 'Not provided'}
                                </p>
                            )}
                        </div>

                        {isEditing && (
                            <div className="flex items-center space-x-3 pt-4">
                                <button
                                    onClick={handleSave}
                                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>Save Changes</span>
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                    <span>Cancel</span>
                                </button>
                            </div>
                        )}

                        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={handleLogout}
                                className="w-full px-4 py-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors font-medium"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2 mb-6">
                        <TrendingUp className="w-5 h-5 text-indigo-600" />
                        <span>Recent Activity</span>
                    </h2>

                    <div className="space-y-4">
                        {recentRecipes?.data && recentRecipes.data.length > 0 ? (
                            recentRecipes.data.map((recipe) => (
                                <div key={recipe.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                                        <ChefHat className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            Created "{recipe.title}"
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {new Date(recipe.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Calendar className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    No Recent Activity
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    Start creating recipes to see your activity here.
                                </p>
                                <button
                                    onClick={() => navigate('/app?tab=create')}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Create Recipe
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}; 