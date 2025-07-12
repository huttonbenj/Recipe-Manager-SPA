import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Filter, Grid, List, ChefHat, Clock, Users } from 'lucide-react';
import { useAuth } from '../../../../hooks/useAuth';
import { recipeService } from '../../../../services';
import { Recipe } from '@recipe-manager/shared';
import { cn } from '../../../../utils/cn';
import { useTheme } from '../../../../contexts/ThemeContext';
import { getThemeColors } from '../../../../utils/theme';
import { RecipeGrid } from '../../recipes/RecipeList/RecipeGrid';

export const ModernMyRecipesTab: React.FC = () => {
    const { user } = useAuth();
    const { theme } = useTheme();
    const themeColors = getThemeColors(theme.color);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
    const [showFilters, setShowFilters] = useState(false);

    // Fetch user's recipes
    const { data: recipesData, isLoading } = useQuery({
        queryKey: ['user-recipes', user?.id],
        queryFn: () => recipeService.getUserRecipes(user?.id || ''),
        enabled: !!user?.id,
    });

    const recipes: Recipe[] = recipesData?.data || [];

    // Filter recipes based on search and filters
    const filteredRecipes = recipes.filter(recipe => {
        const matchesSearch = !searchQuery ||
            recipe.title.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = !selectedCategory || recipe.category === selectedCategory;
        const matchesDifficulty = !selectedDifficulty || recipe.difficulty === selectedDifficulty;

        return matchesSearch && matchesCategory && matchesDifficulty;
    });

    // Get unique categories and difficulties from user's recipes
    const categories = [...new Set(recipes.map(recipe => recipe.category))].filter(Boolean);
    const difficulties = [...new Set(recipes.map(recipe => recipe.difficulty))].filter(Boolean);

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('');
        setSelectedDifficulty('');
    };

    const activeFiltersCount = [searchQuery, selectedCategory, selectedDifficulty].filter(Boolean).length;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-950 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-surface-200 dark:bg-surface-800 rounded-lg w-1/3"></div>
                        <div className="h-16 bg-surface-200 dark:bg-surface-800 rounded-xl"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-64 bg-surface-200 dark:bg-surface-800 rounded-xl"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-950 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className={cn(
                            "p-3 rounded-2xl shadow-lg",
                            `bg-${themeColors.primary} dark:bg-${themeColors.primaryDark}`
                        )}>
                            <ChefHat className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-surface-900 dark:text-white">
                            My Recipe Collection
                        </h1>
                    </div>
                    <p className="text-surface-600 dark:text-surface-400 text-lg max-w-2xl mx-auto">
                        Manage and organize your personal recipe collection. Create, edit, and share your culinary masterpieces.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-200 dark:border-surface-700 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-surface-600 dark:text-surface-400 text-sm font-medium">Total Recipes</p>
                                <p className="text-2xl font-bold text-surface-900 dark:text-white">{recipes.length}</p>
                            </div>
                            <div className={cn(
                                "p-3 rounded-xl",
                                `bg-${themeColors.primary}-100 dark:bg-${themeColors.primary}-900/30`
                            )}>
                                <ChefHat className={cn(
                                    "w-6 h-6",
                                    `text-${themeColors.primary}-600 dark:text-${themeColors.primary}-400`
                                )} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-200 dark:border-surface-700 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-surface-600 dark:text-surface-400 text-sm font-medium">Categories</p>
                                <p className="text-2xl font-bold text-surface-900 dark:text-white">{categories.length}</p>
                            </div>
                            <div className={cn(
                                "p-3 rounded-xl",
                                `${themeColors.primary.replace('600', '100')} dark:${themeColors.primary.replace('600', '900/30')}`
                            )}>
                                <Grid className={cn(
                                    "w-6 h-6",
                                    `${themeColors.primary} dark:${themeColors.primary.replace('600', '400')}`
                                )} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-200 dark:border-surface-700 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-surface-600 dark:text-surface-400 text-sm font-medium">Avg. Cook Time</p>
                                <p className="text-2xl font-bold text-surface-900 dark:text-white">
                                    {recipes.length > 0 ? Math.round(recipes.reduce((acc, recipe) => acc + (recipe.cook_time || 0), 0) / recipes.length) : 0}m
                                </p>
                            </div>
                            <div className={cn(
                                "p-3 rounded-xl",
                                `${themeColors.secondary.replace('600', '100')} dark:${themeColors.secondary.replace('600', '900/30')}`
                            )}>
                                <Clock className={cn(
                                    "w-6 h-6",
                                    `${themeColors.secondary} dark:${themeColors.secondary.replace('600', '400')}`
                                )} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-200 dark:border-surface-700 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-surface-600 dark:text-surface-400 text-sm font-medium">Avg. Servings</p>
                                <p className="text-2xl font-bold text-surface-900 dark:text-white">
                                    {recipes.length > 0 ? Math.round(recipes.reduce((acc, recipe) => acc + (recipe.servings || 4), 0) / recipes.length) : 0}
                                </p>
                            </div>
                            <div className={cn(
                                "p-3 rounded-xl",
                                `${themeColors.secondary.replace('600', '100')} dark:${themeColors.secondary.replace('600', '900/30')}`
                            )}>
                                <Users className={cn(
                                    "w-6 h-6",
                                    `${themeColors.secondary} dark:${themeColors.secondary.replace('600', '400')}`
                                )} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-200 dark:border-surface-700 shadow-sm">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-surface-400" />
                                <input
                                    type="text"
                                    placeholder="Search your recipes..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={cn(
                                        "w-full pl-10 pr-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl text-surface-900 dark:text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:border-transparent",
                                        `focus:ring-${themeColors.primary.split('-')[1]}-500`
                                    )}
                                />
                            </div>
                        </div>

                        {/* Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200",
                                showFilters
                                    ? `bg-${themeColors.primary}-100 border-${themeColors.primary}-300 text-${themeColors.primary}-700 dark:bg-${themeColors.primary}-900/30 dark:border-${themeColors.primary}-700 dark:text-${themeColors.primary}-300`
                                    : "bg-surface-50 dark:bg-surface-700 border-surface-200 dark:border-surface-600 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-600"
                            )}
                        >
                            <Filter className="h-5 w-5" />
                            <span className="font-medium">Filters</span>
                            {activeFiltersCount > 0 && (
                                <span className={cn(
                                    "px-2 py-1 rounded-full text-xs font-bold",
                                    `bg-${themeColors.primary}-500 text-white`
                                )}>
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>

                        {/* View Mode Toggle */}
                        <div className="flex bg-surface-100 dark:bg-surface-700 rounded-xl p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200",
                                    viewMode === 'grid'
                                        ? "bg-white dark:bg-surface-600 text-surface-900 dark:text-white shadow-sm"
                                        : "text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
                                )}
                            >
                                <Grid className="h-4 w-4" />
                                <span className="text-sm font-medium">Grid</span>
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200",
                                    viewMode === 'list'
                                        ? "bg-white dark:bg-surface-600 text-surface-900 dark:text-white shadow-sm"
                                        : "text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
                                )}
                            >
                                <List className="h-4 w-4" />
                                <span className="text-sm font-medium">List</span>
                            </button>
                        </div>

                        {/* Create Recipe Button */}
                        <button className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-all duration-200",
                            `bg-${themeColors.primary} hover:bg-${themeColors.primaryHover}`,
                            "hover:scale-105 active:scale-95 shadow-lg"
                        )}>
                            <Plus className="h-5 w-5" />
                            <span>Create Recipe</span>
                        </button>
                    </div>

                    {/* Expandable Filters */}
                    {showFilters && (
                        <div className="mt-6 pt-6 border-t border-surface-200 dark:border-surface-700">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                                        Category
                                    </label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className={cn(
                                            "w-full px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2",
                                            `focus:ring-${themeColors.primary.split('-')[1]}-500`
                                        )}
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                                        Difficulty
                                    </label>
                                    <select
                                        value={selectedDifficulty}
                                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                                        className={cn(
                                            "w-full px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2",
                                            `focus:ring-${themeColors.primary.split('-')[1]}-500`
                                        )}
                                    >
                                        <option value="">All Difficulties</option>
                                        {difficulties.map(difficulty => (
                                            <option key={difficulty} value={difficulty}>{difficulty}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={clearFilters}
                                        className="w-full px-4 py-2 bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Results */}
                {filteredRecipes.length > 0 ? (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-surface-900 dark:text-white">
                                {filteredRecipes.length} Recipe{filteredRecipes.length !== 1 ? 's' : ''} Found
                            </h2>
                        </div>
                        <RecipeGrid
                            recipes={filteredRecipes}
                            viewMode={viewMode}
                            onViewModeChange={setViewMode}
                            isLoading={false}
                            onClearFilters={clearFilters}
                        />
                    </div>
                ) : recipes.length === 0 ? (
                    // Empty state - no recipes at all
                    <div className="text-center py-16">
                        <div className={cn(
                            "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4",
                            `bg-${themeColors.primary}-100 dark:bg-${themeColors.primary}-900/20`
                        )}>
                            <ChefHat className={cn(
                                "w-8 h-8",
                                `text-${themeColors.primary}-500`
                            )} />
                        </div>
                        <h3 className="text-xl font-semibold text-surface-900 dark:text-white mb-2">
                            No recipes yet
                        </h3>
                        <p className="text-surface-600 dark:text-surface-400 mb-6 max-w-md mx-auto">
                            Start building your recipe collection by creating your first recipe. Share your favorite dishes with the community!
                        </p>
                        <button className={cn(
                            "px-4 py-2 rounded-lg text-white transition-colors",
                            `bg-${themeColors.primary} hover:bg-${themeColors.primaryHover}`
                        )}>
                            Create Your First Recipe
                        </button>
                    </div>
                ) : (
                    // Empty state - no results for current filters
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-surface-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-surface-900 dark:text-white mb-2">
                            No recipes found
                        </h3>
                        <p className="text-surface-600 dark:text-surface-400 mb-6">
                            Try adjusting your search terms or filters to find what you're looking for.
                        </p>
                        <button
                            onClick={clearFilters}
                            className={cn(
                                "text-sm font-medium transition-colors",
                                `${themeColors.primary} dark:${themeColors.primary.replace('600', '400')} hover:${themeColors.primary.replace('600', '700')} dark:hover:${themeColors.primary.replace('600', '300')}`
                            )}
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}; 