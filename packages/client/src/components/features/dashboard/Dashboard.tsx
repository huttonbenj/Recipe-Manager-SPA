import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, User, Heart, Star, ChefHat, Sparkles, TrendingUp, Tag, ArrowRight } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { useDashboard } from '../../../hooks/user/useDashboard';
import { recipeService } from '../../../services';
import { cn } from '../../../utils/cn';
import { parseSearchQuery } from '../../../utils/searchParser';
import { useTheme } from '../../../contexts/ThemeContext';
import { getThemeColors } from '../../../utils/theme';

import { DashboardHeader } from './DashboardHeader';
import { DashboardStats } from './DashboardStats';
import { DashboardQuickActions } from './DashboardQuickActions';
import { DashboardUserRecipes } from './DashboardUserRecipes';
import { DashboardActivity } from './DashboardActivity';
import { DashboardInsights } from './DashboardInsights';

export const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const { theme } = useTheme();
    const themeColors = getThemeColors(theme.color);

    const {
        userRecipes,
        activities,
        isLoading,
        userStats
    } = useDashboard();

    // Fetch trending searches/categories
    const { data: categories } = useQuery({
        queryKey: ['recipe-categories'],
        queryFn: () => recipeService.getRecipeCategories(),
        staleTime: 300000,
    });

    // Use stats from API or fallback to calculated values
    const stats = React.useMemo(() => ({
        totalRecipes: userStats?.totalRecipes || userRecipes.length,
        totalFavorites: userStats?.totalFavorites || 0,
        totalSaved: userStats?.totalSaved || 0,
        totalCategories: userStats?.totalCategories || 0,
    }), [userStats, userRecipes.length]);

    // Trending searches based on categories
    const trendingSearches = categories?.slice(0, 6).map(category => ({
        label: category,
        query: category,
        icon: Tag,
        color: 'blue'
    })) || [];

    // Quick filters for easy access
    const quickFilters = [
        {
            label: 'Quick & Easy',
            query: 'cookTime=30&quickFilter=quick',
            icon: Clock,
            color: 'green',
            description: 'Under 30 minutes'
        },
        {
            label: 'My Recipes',
            query: 'user_id=current',
            icon: User,
            color: 'blue',
            description: 'Your creations'
        },
        {
            label: 'My Favorites',
            query: 'liked=true',
            icon: Heart,
            color: 'red',
            description: 'Your liked recipes'
        },
        {
            label: 'Saved Recipes',
            query: 'saved=true',
            icon: Star,
            color: 'yellow',
            description: 'Your saved recipes'
        },
        {
            label: 'Main Dishes',
            query: 'category=Main Course',
            icon: ChefHat,
            color: 'orange',
            description: 'Hearty main course recipes'
        },
    ];

    // Helper function to get theme-aware filter colors
    const getFilterColor = (color: string) => {
        switch (color) {
            case 'green':
                return `bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400`;
            case 'blue':
                return `bg-${themeColors.primary}-100 dark:bg-${themeColors.primary}-900/30 text-${themeColors.primary}-600 dark:text-${themeColors.primary}-400`;
            case 'purple':
                return `bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400`;
            case 'red':
                return `bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400`;
            case 'yellow':
                return `bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400`;
            case 'orange':
                return `bg-${themeColors.secondary}-100 dark:bg-${themeColors.secondary}-900/30 text-${themeColors.secondary}-600 dark:text-${themeColors.secondary}-400`;
            default:
                return `bg-${themeColors.primary}-100 dark:bg-${themeColors.primary}-900/30 text-${themeColors.primary}-600 dark:text-${themeColors.primary}-400`;
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            const parsed = parseSearchQuery(searchQuery.trim());
            const params = new URLSearchParams();

            if (parsed.searchTerm) params.set('search', parsed.searchTerm);
            if (parsed.category) params.set('category', parsed.category);
            if (parsed.difficulty) params.set('difficulty', parsed.difficulty);
            if (parsed.cookTime) params.set('cookTime', parsed.cookTime);

            navigate(`/recipes?${params.toString()}`);
        }
    };

    const handleQuickFilterClick = (filter: any) => {
        navigate(`/recipes?${filter.query}`);
    };

    const handleTrendingSearchClick = (search: any) => {
        navigate(`/recipes?category=${encodeURIComponent(search.query)}`);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-950">
                <div className="container mx-auto px-4 py-8">
                    <div className="animate-pulse space-y-8">
                        <div className="h-8 bg-surface-200 dark:bg-surface-800 rounded-lg w-1/3"></div>
                        <div className="h-32 bg-surface-200 dark:bg-surface-800 rounded-xl"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-48 bg-surface-200 dark:bg-surface-800 rounded-xl"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-950">
            <div className="container mx-auto px-4 py-8 space-y-8">
                <DashboardHeader user={user} />

                {/* Prominent Search Section */}
                <div className="bg-white dark:bg-surface-900 rounded-2xl shadow-lg border border-surface-200 dark:border-surface-800 p-8">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div
                                className="p-3 rounded-2xl shadow-lg"
                                style={{
                                    background: `linear-gradient(to bottom right, ${themeColors.primary}, ${themeColors.secondary})`
                                }}
                            >
                                <Search className="h-6 w-6 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50 font-display">
                                Find Your Perfect Recipe
                            </h2>
                        </div>
                        <p className="text-surface-600 dark:text-surface-400 text-lg">
                            Search thousands of recipes or try our smart filters
                        </p>
                    </div>

                    {/* Main Search Bar */}
                    <form onSubmit={handleSearchSubmit} className="relative mb-8">
                        <div className="relative">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-surface-400 dark:text-surface-500" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for recipes, ingredients, or try 'easy chicken recipes'..."
                                className="w-full pl-16 pr-32 py-4 bg-surface-50 dark:bg-surface-800 border-2 border-surface-200 dark:border-surface-700 rounded-2xl text-surface-900 dark:text-surface-50 placeholder-surface-500 dark:placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200 text-lg font-medium shadow-sm"
                                autoComplete="off"
                            />
                            <button
                                type="submit"
                                className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2 text-white rounded-xl transition-all duration-200 font-medium hover:scale-105 active:scale-95 shadow-lg"
                                style={{
                                    backgroundColor: themeColors.primary
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = `${themeColors.primary}dd`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = themeColors.primary;
                                }}
                            >
                                Search
                            </button>
                        </div>
                    </form>

                    {/* Quick Filters */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-4 flex items-center gap-2">
                            <Sparkles className="h-5 w-5" style={{ color: themeColors.primary }} />
                            Quick Filters
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                            {quickFilters.map((filter) => {
                                const Icon = filter.icon;
                                return (
                                    <button
                                        key={filter.label}
                                        onClick={() => handleQuickFilterClick(filter)}
                                        className={cn(
                                            "flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-200",
                                            "bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700",
                                            "hover:border-brand-300 dark:hover:border-brand-600 hover:shadow-md",
                                            "hover:scale-105 active:scale-95 group"
                                        )}
                                    >
                                        <div className={cn(
                                            "p-3 rounded-xl transition-all duration-200",
                                            getFilterColor(filter.color)
                                        )}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div className="text-center">
                                            <span className="text-sm font-medium text-surface-900 dark:text-surface-50 block">
                                                {filter.label}
                                            </span>
                                            <span className="text-xs text-surface-500 dark:text-surface-400 mt-1 block">
                                                {filter.description}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Trending Searches */}
                    <div>
                        <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-4 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" style={{ color: themeColors.primary }} />
                            Trending Categories
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {trendingSearches.map((search) => (
                                <button
                                    key={search.label}
                                    onClick={() => handleTrendingSearchClick(search)}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-surface-100 dark:bg-surface-800 hover:bg-brand-100 dark:hover:bg-brand-900/30 text-surface-700 dark:text-surface-300 hover:text-brand-700 dark:hover:text-brand-300 rounded-xl transition-all duration-200 border border-surface-200 dark:border-surface-700 hover:border-brand-300 dark:hover:border-brand-600 hover:scale-105 active:scale-95"
                                >
                                    <Tag className="h-4 w-4" />
                                    <span className="text-sm font-medium">{search.label}</span>
                                    <ArrowRight className="h-3 w-3" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <DashboardStats
                    stats={{
                        totalRecipes: stats.totalRecipes,
                        totalLikes: stats.totalFavorites,
                        averageRating: 4.5, // Mock average rating
                        totalViews: stats.totalSaved * 10, // Mock total views
                    }}
                    statsLoading={isLoading}
                />
                <DashboardQuickActions />
                <DashboardUserRecipes
                    userRecipes={userRecipes}
                    isLoading={isLoading}
                />
                <DashboardActivity
                    activities={activities}
                    isLoading={isLoading}
                />
                <DashboardInsights
                    recipeCount={userRecipes.length}
                    mostUsedCategory={userRecipes.length > 0 ? "Dinner" : undefined}
                />
            </div>
        </div>
    );
}; 