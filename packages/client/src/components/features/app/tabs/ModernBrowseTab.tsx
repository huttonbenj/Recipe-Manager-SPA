import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Clock, TrendingUp, Bookmark, Grid, List, ArrowLeft } from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { useDebounce } from '../../../../hooks';
import { recipeService } from '../../../../services';
import { RecipeGrid } from '../../recipes/RecipeList/RecipeGrid';
import { RecipeDetail } from '../../recipes/RecipeDetail/RecipeDetail';
import { getThemeFormInputClasses, getThemeFilterPillClasses, getThemeViewToggleClasses } from '../../../../utils/theme';

export const ModernBrowseTab: React.FC = () => {
    const { theme } = useTheme();
    const [searchParams, setSearchParams] = useSearchParams();

    // Check if we're viewing a specific recipe
    const selectedRecipeId = searchParams.get('recipe');

    // Filter state
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [selectedDifficulty, setSelectedDifficulty] = useState(searchParams.get('difficulty') || '');
    const [selectedCookTime, setSelectedCookTime] = useState(searchParams.get('cookTime') || '');
    const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>((searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>(
        (localStorage.getItem('recipeViewMode') as 'grid' | 'list') || 'grid'
    );
    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));

    // Debounced search term
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // Fetch recipes (always call the hook, but conditionally enable)
    const { data: recipesData, isLoading: recipesLoading, error } = useQuery({
        queryKey: ['recipes', {
            search: debouncedSearchTerm,
            category: selectedCategory,
            difficulty: selectedDifficulty,
            cookTime: selectedCookTime,
            sortBy,
            sortOrder,
            page: currentPage,
            limit: 12
        }],
        queryFn: () => recipeService.getRecipes({
            search: debouncedSearchTerm || undefined,
            category: selectedCategory || undefined,
            difficulty: (selectedDifficulty as 'Easy' | 'Medium' | 'Hard') || undefined,
            cookTime: selectedCookTime ? parseInt(selectedCookTime) : undefined,
            sortBy: sortBy as 'created_at' | 'updated_at' | 'title' | 'cook_time' | 'likes',
            sortOrder,
            page: currentPage,
            limit: 12
        }),
        staleTime: 30000,
        enabled: !selectedRecipeId, // Only fetch when not viewing a recipe
    });

    // Function to go back to browse view
    const goBackToBrowse = () => {
        const params = new URLSearchParams(searchParams);
        params.delete('recipe');
        setSearchParams(params);
    };

    // Sync URL params with state (only when not viewing a recipe)
    useEffect(() => {
        if (!selectedRecipeId) {
            const params = new URLSearchParams();
            if (debouncedSearchTerm) params.set('search', debouncedSearchTerm);
            if (selectedCategory) params.set('category', selectedCategory);
            if (selectedDifficulty) params.set('difficulty', selectedDifficulty);
            if (selectedCookTime) params.set('cookTime', selectedCookTime);
            if (sortBy !== 'created_at') params.set('sortBy', sortBy);
            if (sortOrder !== 'desc') params.set('sortOrder', sortOrder);
            if (currentPage > 1) params.set('page', currentPage.toString());
            params.set('tab', 'browse');

            setSearchParams(params, { replace: true });
        }
    }, [debouncedSearchTerm, selectedCategory, selectedDifficulty, selectedCookTime, sortBy, sortOrder, currentPage, setSearchParams, selectedRecipeId]);

    // Quick filter actions
    const quickFilters = [
        {
            id: 'easy',
            label: 'Easy',
            icon: Bookmark,
            active: selectedDifficulty === 'Easy',
            onClick: () => setSelectedDifficulty(selectedDifficulty === 'Easy' ? '' : 'Easy')
        },
        {
            id: 'quick',
            label: 'Quick (≤30min)',
            icon: Clock,
            active: selectedCookTime === '30',
            onClick: () => setSelectedCookTime(selectedCookTime === '30' ? '' : '30')
        },
        {
            id: 'popular',
            label: 'Popular',
            icon: TrendingUp,
            active: sortBy === 'likes',
            onClick: () => {
                if (sortBy === 'likes') {
                    setSortBy('created_at');
                    setSortOrder('desc');
                } else {
                    setSortBy('likes');
                    setSortOrder('desc');
                }
            }
        },
        {
            id: 'recent',
            label: 'Recent',
            icon: Bookmark,
            active: sortBy === 'created_at' && sortOrder === 'desc',
            onClick: () => {
                setSortBy('created_at');
                setSortOrder('desc');
            }
        }
    ];

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setSelectedDifficulty('');
        setSelectedCookTime('');
        setSortBy('created_at');
        setSortOrder('desc');
        setCurrentPage(1);
    };

    const hasActiveFilters = searchTerm || selectedCategory || selectedDifficulty || selectedCookTime || sortBy !== 'created_at';

    // Get form input classes based on current theme
    const inputClasses = getThemeFormInputClasses(theme.color);

    // If viewing a specific recipe, render the recipe detail view
    if (selectedRecipeId) {
        return (
            <div className="space-y-6">
                {/* Back button */}
                <button
                    onClick={goBackToBrowse}
                    className="flex items-center gap-2 text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Browse</span>
                </button>

                {/* Recipe detail component */}
                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
                    <RecipeDetail />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Hero Section */}
            <div className="relative rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20 z-10"></div>
                <img
                    src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                    alt="Delicious food"
                    className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        Discover Amazing Recipes
                    </h1>
                    <p className="text-lg text-white/90 max-w-lg">
                        Find the perfect dish for any occasion from our collection of delicious recipes
                    </p>
                </div>
            </div>

            {/* Decorative Background */}
            <div className="relative">
                <div
                    className={`absolute inset-0 -z-10 opacity-30 transform -translate-y-1/2 rounded-full blur-3xl ${theme.color === 'default' ? 'bg-gradient-to-br from-emerald-400/20 to-orange-600/20' :
                        theme.color === 'royal' ? 'bg-gradient-to-br from-purple-400/20 to-amber-600/20' :
                            theme.color === 'ocean' ? 'bg-gradient-to-br from-blue-400/20 to-cyan-600/20' :
                                theme.color === 'forest' ? 'bg-gradient-to-br from-green-400/20 to-lime-600/20' :
                                    theme.color === 'sunset' ? 'bg-gradient-to-br from-red-400/20 to-orange-600/20' :
                                        'bg-gradient-to-br from-blue-400/20 to-purple-600/20'
                        }`}
                    style={{ height: '50%' }}
                ></div>
            </div>

            {/* Contextual Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Search */}
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search recipes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={inputClasses}
                            />
                        </div>
                    </div>

                    {/* Quick Filters */}
                    <div className="flex flex-wrap gap-2">
                        {quickFilters.map((filter) => {
                            const Icon = filter.icon;
                            return (
                                <button
                                    key={filter.id}
                                    onClick={filter.onClick}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${getThemeFilterPillClasses(theme.color, filter.active)}`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{filter.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* View Mode */}
                    <div className="flex bg-surface-100 dark:bg-surface-700 rounded-xl p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${getThemeViewToggleClasses(theme.color, viewMode === 'grid')}`}
                        >
                            <Grid className="h-4 w-4" />
                            <span className="text-sm font-medium hidden sm:block">Grid</span>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${getThemeViewToggleClasses(theme.color, viewMode === 'list')}`}
                        >
                            <List className="h-4 w-4" />
                            <span className="text-sm font-medium hidden sm:block">List</span>
                        </button>
                    </div>
                </div>

                {hasActiveFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {recipesData?.pagination?.totalCount || 0} recipes found
                            </span>
                            <button
                                onClick={clearFilters}
                                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                            >
                                Clear all filters
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Recipe Results */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {recipesLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-red-600 dark:text-red-400">Error loading recipes</p>
                    </div>
                ) : recipesData?.data?.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">🔍</div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No recipes found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                            Try adjusting your search terms or filters.
                        </p>
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <RecipeGrid
                        recipes={recipesData?.data || []}
                        viewMode={viewMode}
                        onViewModeChange={setViewMode}
                        isLoading={recipesLoading}
                        onClearFilters={clearFilters}
                    />
                )}
            </div>
        </div>
    );
}; 