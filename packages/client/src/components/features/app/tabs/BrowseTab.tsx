import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks/useAuth';
import { ThemeGradient } from '../ThemeGradient';
import { ThemeText } from '../ThemeText';
import { Clock, TrendingUp, Heart, Bookmark, ChefHat, Utensils, Star, Users, Search } from 'lucide-react';
import { SimpleFilters } from '../../recipes/SimpleFilters';
import { RecipeGrid } from '../../recipes/RecipeList/RecipeGrid';
import { apiClient } from '../../../../services/api';
import { useDebounce } from '../../../../hooks';
import { parseSearchQuery } from '../../../../utils/searchParser';
import { Recipe } from '@recipe-manager/shared';
import { useTheme } from '../../../../contexts/ThemeContext';
import { getThemeTextColor, getThemeGradient } from '../../../../utils/theme';
import { cn } from '../../../../utils/cn';

export const BrowseTab: React.FC = () => {
    const { user } = useAuth();
    const { theme } = useTheme();
    const [searchParams, setSearchParams] = useSearchParams();

    // Filter state
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [selectedDifficulty, setSelectedDifficulty] = useState(searchParams.get('difficulty') || '');
    const [selectedCookTime, setSelectedCookTime] = useState(searchParams.get('cookTime') || '');
    const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>((searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));

    // Parse URL params on mount and when they change
    useEffect(() => {
        const rawSearch = searchParams.get('search') || '';
        const urlCategory = searchParams.get('category') || '';
        const urlDifficulty = searchParams.get('difficulty') || '';
        const urlCookTime = searchParams.get('cookTime') || '';
        const urlSortBy = searchParams.get('sortBy') || 'created_at';
        const urlSortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc';
        const urlPage = parseInt(searchParams.get('page') || '1', 10);

        // Parse the search query to extract smart filters
        const parsedQuery = parseSearchQuery(rawSearch);

        // Update state with URL params, giving priority to explicit URL params over parsed ones
        setSearchTerm(parsedQuery.searchTerm || rawSearch);
        setSelectedCategory(urlCategory || parsedQuery.category || '');
        setSelectedDifficulty(urlDifficulty || parsedQuery.difficulty || '');
        setSelectedCookTime(urlCookTime || parsedQuery.cookTime || '');
        setSortBy(urlSortBy);
        setSortOrder(urlSortOrder);
        setCurrentPage(urlPage);
    }, [searchParams]);

    // Debounced search term
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // Fetch recipes with filters
    const { data: recipesData, isLoading, error } = useQuery({
        queryKey: ['browse-recipes', {
            search: debouncedSearchTerm,
            category: selectedCategory,
            difficulty: selectedDifficulty,
            cookTime: selectedCookTime,
            sortBy,
            sortOrder,
            page: currentPage,
        }],
        queryFn: () => {
            const params: any = {
                page: currentPage,
                limit: 12,
            };

            if (debouncedSearchTerm) params.search = debouncedSearchTerm;
            if (selectedCategory) params.category = selectedCategory;
            if (selectedDifficulty) params.difficulty = selectedDifficulty;
            if (selectedCookTime) params.cookTime = selectedCookTime;
            if (sortBy) params.sortBy = sortBy;
            if (sortOrder) params.sortOrder = sortOrder;

            return apiClient.getRecipes(params);
        },
    });

    const recipes: Recipe[] = recipesData?.data || [];
    const totalRecipes = recipesData?.pagination?.totalCount || 0;

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    // Get theme-aware text color
    const themeTextColor = getThemeTextColor(theme.color);

    // Get theme-aware gradient for buttons
    const themeGradient = getThemeGradient(theme.color);
    const themeGradientHover = theme.color === 'default'
        ? 'hover:from-emerald-600 hover:to-orange-600'
        : theme.color === 'royal'
            ? 'hover:from-purple-700 hover:to-amber-600'
            : theme.color === 'ocean'
                ? 'hover:from-blue-700 hover:to-cyan-600'
                : theme.color === 'forest'
                    ? 'hover:from-green-700 hover:to-lime-600'
                    : 'hover:from-orange-700 hover:to-pink-600';

    const quickActions = [
        {
            title: 'Quick Recipe',
            description: 'Find something to cook in 30 mins',
            icon: Clock,
            filters: { difficulty: 'Easy', cookingTime: '30' },
            gradient: theme.color === 'default' ? 'from-green-500 to-emerald-600' :
                theme.color === 'royal' ? 'from-purple-500 to-violet-600' :
                    theme.color === 'ocean' ? 'from-blue-500 to-cyan-600' :
                        theme.color === 'forest' ? 'from-green-500 to-lime-600' :
                            'from-orange-500 to-red-600'
        },
        {
            title: 'Trending Now',
            description: 'See what\'s popular today',
            icon: TrendingUp,
            filters: { sortBy: 'popular' },
            gradient: theme.color === 'default' ? 'from-purple-500 to-pink-600' :
                theme.color === 'royal' ? 'from-violet-500 to-amber-500' :
                    theme.color === 'ocean' ? 'from-cyan-500 to-blue-600' :
                        theme.color === 'forest' ? 'from-lime-500 to-green-600' :
                            'from-pink-500 to-orange-600'
        },
        {
            title: 'My Favorites',
            description: 'Your liked recipes',
            icon: Heart,
            filters: { liked: true },
            gradient: theme.color === 'default' ? 'from-red-500 to-rose-600' :
                theme.color === 'royal' ? 'from-amber-500 to-red-500' :
                    theme.color === 'ocean' ? 'from-blue-500 to-indigo-600' :
                        theme.color === 'forest' ? 'from-green-600 to-emerald-700' :
                            'from-red-500 to-pink-600'
        },
        {
            title: 'Saved for Later',
            description: 'Recipes you want to try',
            icon: Bookmark,
            filters: { saved: true },
            gradient: theme.color === 'default' ? 'from-blue-500 to-cyan-600' :
                theme.color === 'royal' ? 'from-purple-600 to-blue-600' :
                    theme.color === 'ocean' ? 'from-cyan-500 to-teal-600' :
                        theme.color === 'forest' ? 'from-emerald-500 to-teal-600' :
                            'from-orange-600 to-amber-600'
        }
    ];

    const cookingInsights = [
        {
            title: 'Recipe Mastery',
            description: 'You\'ve mastered 12 recipes this month',
            icon: ChefHat,
            color: 'text-amber-600 dark:text-amber-400'
        },
        {
            title: 'Cooking Streak',
            description: '5 days of home cooking!',
            icon: Utensils,
            color: 'text-green-600 dark:text-green-400'
        },
        {
            title: 'Top Rated',
            description: 'Your recipes average 4.8 stars',
            icon: Star,
            color: 'text-yellow-600 dark:text-yellow-400'
        },
        {
            title: 'Community',
            description: '23 people saved your recipes',
            icon: Users,
            color: 'text-purple-600 dark:text-purple-400'
        }
    ];

    const handleQuickActionClick = (filters: any) => {
        const newParams = new URLSearchParams(searchParams);

        // Clear existing filters
        newParams.delete('search');
        newParams.delete('category');
        newParams.delete('difficulty');
        newParams.delete('cookTime');
        newParams.delete('liked');
        newParams.delete('saved');
        newParams.delete('sortBy');
        newParams.delete('sortOrder');
        newParams.delete('page');

        // Apply new filters
        if (filters.search) {
            newParams.set('search', filters.search);
        }
        if (filters.difficulty) {
            newParams.set('difficulty', filters.difficulty);
        }
        if (filters.cookingTime) {
            newParams.set('cookTime', filters.cookingTime);
        }
        if (filters.liked) {
            newParams.set('liked', 'true');
        }
        if (filters.saved) {
            newParams.set('saved', 'true');
        }
        if (filters.sortBy === 'popular') {
            newParams.set('sortBy', 'likes');
            newParams.set('sortOrder', 'desc');
        }

        setSearchParams(newParams);
    };

    const updateUrlParams = () => {
        const newParams = new URLSearchParams();

        if (searchTerm) newParams.set('search', searchTerm);
        if (selectedCategory) newParams.set('category', selectedCategory);
        if (selectedDifficulty) newParams.set('difficulty', selectedDifficulty);
        if (selectedCookTime) newParams.set('cookTime', selectedCookTime);
        if (sortBy !== 'created_at') newParams.set('sortBy', sortBy);
        if (sortOrder !== 'desc') newParams.set('sortOrder', sortOrder);
        if (currentPage > 1) newParams.set('page', currentPage.toString());

        setSearchParams(newParams);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        updateUrlParams();
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setSelectedDifficulty('');
        setSelectedCookTime('');
        setSortBy('created_at');
        setSortOrder('desc');
        setCurrentPage(1);
        setSearchParams({});
    };

    // Get theme-aware background gradient for recommendation section
    const recommendationBgClass = theme.color === 'default'
        ? 'from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20'
        : theme.color === 'royal'
            ? 'from-purple-50 to-amber-50 dark:from-purple-900/20 dark:to-amber-900/20'
            : theme.color === 'ocean'
                ? 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20'
                : theme.color === 'forest'
                    ? 'from-green-50 to-lime-50 dark:from-green-900/20 dark:to-lime-900/20'
                    : 'from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20';

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl">
                <ThemeGradient className="absolute inset-0 opacity-10">
                    <div className="w-full h-full"></div>
                </ThemeGradient>
                <div className="relative p-8 text-center">
                    <div className="flex items-center justify-center mb-4">
                        <Search className={cn("w-12 h-12", themeTextColor)} />
                    </div>
                    <h1 className="text-4xl font-bold mb-2">
                        <ThemeText>Browse & Discover Recipes</ThemeText>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                        {getGreeting()}, {user?.name || 'Chef'}! Ready to find something delicious?
                    </p>

                    {/* Quick Recipe Suggestion */}
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto">
                        <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">
                            🍳 Today's Inspiration
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            How about trying a Mediterranean-style pasta? Perfect for a cozy evening!
                        </p>
                        <button
                            onClick={() => handleQuickActionClick({ search: 'mediterranean pasta' })}
                            className={cn(
                                "px-6 py-2 text-white rounded-lg transition-all duration-200 transform hover:scale-105",
                                themeGradient,
                                themeGradientHover
                            )}
                        >
                            Find Recipe
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                        <button
                            key={index}
                            onClick={() => handleQuickActionClick(action.filters)}
                            className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                            <div className="relative">
                                <action.icon className={`w-8 h-8 mb-3 bg-gradient-to-br ${action.gradient} text-transparent bg-clip-text`} />
                                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                    {action.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {action.description}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Cooking Insights */}
            <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                    Your Cooking Journey
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {cookingInsights.map((insight, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
                        >
                            <div className="flex items-start space-x-4">
                                <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                                    <insight.icon className={`w-6 h-6 ${insight.color}`} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                                        {insight.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {insight.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recipe Recommendation Engine */}
            <div className={`bg-gradient-to-r ${recommendationBgClass} rounded-2xl p-8`}>
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                    🤖 Smart Recommendations
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Based on your cooking history and preferences, here are some recipes you might love:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { name: 'Spicy Thai Basil Stir-fry', reason: 'You love Asian flavors', match: '95%' },
                        { name: 'Creamy Mushroom Risotto', reason: 'Perfect for cozy evenings', match: '92%' },
                        { name: 'Honey Garlic Salmon', reason: 'Quick and healthy', match: '88%' }
                    ].map((rec, index) => (
                        <div
                            key={index}
                            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => handleQuickActionClick({ search: rec.name })}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                                    {rec.name}
                                </h4>
                                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-1 rounded-full">
                                    {rec.match}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {rec.reason}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filters and Recipe List */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">
                        All Recipes
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        {totalRecipes} recipes found
                    </p>
                </div>

                <SimpleFilters
                    searchTerm={searchTerm}
                    selectedCategory={selectedCategory}
                    selectedDifficulty={selectedDifficulty}
                    selectedCookTime={selectedCookTime}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    viewMode={viewMode}
                    onSearchChange={setSearchTerm}
                    onCategoryChange={setSelectedCategory}
                    onDifficultyChange={setSelectedDifficulty}
                    onCookTimeChange={setSelectedCookTime}
                    onSortByChange={setSortBy}
                    onSortOrderChange={setSortOrder}
                    onViewModeChange={setViewMode}
                    onClearFilters={clearFilters}
                    onSearch={handleSearch}
                />

                <div className="mt-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className={cn("animate-spin rounded-full h-8 w-8 border-b-2", `border-${theme.color === 'default' ? 'teal' : theme.color === 'royal' ? 'purple' : theme.color === 'ocean' ? 'blue' : theme.color === 'forest' ? 'green' : 'orange'}-600`)}></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-600 dark:text-red-400">Error loading recipes</p>
                        </div>
                    ) : recipes.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400">No recipes found</p>
                        </div>
                    ) : (
                        <RecipeGrid
                            recipes={recipes}
                            viewMode={viewMode}
                            onViewModeChange={setViewMode}
                            onClearFilters={clearFilters}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}; 