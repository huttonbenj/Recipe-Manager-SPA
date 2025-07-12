import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, X, Filter, Clock, Zap, Heart, Star, Grid, List } from 'lucide-react';
import { Button, Select } from '../../ui';
import { recipeService } from '../../../services';
import { useTheme } from '../../../contexts/ThemeContext';
import { getThemeFormInputClasses, getThemeBackgroundColor } from '../../../utils/theme';

interface SimpleFiltersProps {
    searchTerm: string;
    selectedCategory: string;
    selectedDifficulty: string;
    selectedCookTime: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    viewMode: 'grid' | 'list';
    onSearchChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
    onDifficultyChange: (value: string) => void;
    onCookTimeChange: (value: string) => void;
    onSortByChange: (value: string) => void;
    onSortOrderChange: (value: 'asc' | 'desc') => void;
    onViewModeChange: (value: 'grid' | 'list') => void;
    onClearFilters: () => void;
    onSearch: (e: React.FormEvent) => void;
    showMyRecipesOnly?: boolean;
}

export const SimpleFilters: React.FC<SimpleFiltersProps> = ({
    searchTerm,
    selectedCategory,
    selectedDifficulty,
    selectedCookTime,
    sortBy,
    sortOrder: _sortOrder,
    viewMode,
    onSearchChange,
    onCategoryChange,
    onDifficultyChange,
    onCookTimeChange,
    onSortByChange,
    onSortOrderChange,
    onViewModeChange,
    onClearFilters,
    onSearch,
    showMyRecipesOnly = false,
}) => {
    const { theme } = useTheme();
    const inputClasses = getThemeFormInputClasses(theme.color);

    // Fetch categories for dropdown
    const { data: categories = [] } = useQuery({
        queryKey: ['recipe-categories'],
        queryFn: () => recipeService.getRecipeCategories(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Filter options
    const categoryOptions = [
        { value: '', label: 'All Categories' },
        ...categories.map((category: string) => ({ value: category, label: category }))
    ];

    const difficultyOptions = [
        { value: '', label: 'All Difficulties' },
        { value: 'Easy', label: 'Easy' },
        { value: 'Medium', label: 'Medium' },
        { value: 'Hard', label: 'Hard' },
    ];

    const cookTimeOptions = [
        { value: '', label: 'Any Time' },
        { value: '15', label: '15 min or less' },
        { value: '30', label: '30 min or less' },
        { value: '60', label: '1 hour or less' },
        { value: '120', label: '2 hours or less' },
    ];

    const hasActiveFilters = searchTerm || selectedCategory || selectedDifficulty || selectedCookTime;

    // Get theme-aware background color for active filters notification
    const filtersBgColor = getThemeBackgroundColor(theme.color, 'light');

    return (
        <div className="space-y-6">
            {/* Search and Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <form onSubmit={onSearch} className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={showMyRecipesOnly ? "Search your recipes..." : "Search recipes..."}
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className={inputClasses}
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={() => onSearchChange('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </form>

                {/* View Mode Toggle */}
                <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                    <Button
                        variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => onViewModeChange('grid')}
                        className="px-3"
                    >
                        <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => onViewModeChange('list')}
                        className="px-3"
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Quick Filter Pills */}
            <div className="flex flex-wrap gap-2">
                <Button
                    variant={selectedDifficulty === 'Easy' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => onDifficultyChange(selectedDifficulty === 'Easy' ? '' : 'Easy')}
                    className="flex items-center gap-1"
                >
                    <Zap className="h-3 w-3" />
                    Easy
                </Button>
                <Button
                    variant={selectedCookTime === '30' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => onCookTimeChange(selectedCookTime === '30' ? '' : '30')}
                    className="flex items-center gap-1"
                >
                    <Clock className="h-3 w-3" />
                    Quick (≤30min)
                </Button>
                {!showMyRecipesOnly && (
                    <>
                        <Button
                            variant={sortBy === 'likes' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => {
                                if (sortBy === 'likes') {
                                    onSortByChange('created_at');
                                } else {
                                    onSortByChange('likes');
                                    onSortOrderChange('desc');
                                }
                            }}
                            className="flex items-center gap-1"
                        >
                            <Heart className="h-3 w-3" />
                            Popular
                        </Button>
                    </>
                )}
                {showMyRecipesOnly && (
                    <Button
                        variant={sortBy === 'updated_at' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => {
                            if (sortBy === 'updated_at') {
                                onSortByChange('created_at');
                            } else {
                                onSortByChange('updated_at');
                                onSortOrderChange('desc');
                            }
                        }}
                        className="flex items-center gap-1"
                    >
                        <Star className="h-3 w-3" />
                        Recently Updated
                    </Button>
                )}
            </div>

            {/* Advanced Filters - Collapsible */}
            <details className="group">
                <summary className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
                    <Filter className="h-4 w-4" />
                    Advanced Filters
                    <span className="ml-auto text-xs text-gray-500 group-open:hidden">Click to expand</span>
                    <span className="ml-auto text-xs text-gray-500 hidden group-open:inline">Click to collapse</span>
                </summary>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Category
                        </label>
                        <Select
                            value={selectedCategory}
                            onChange={(e) => onCategoryChange(e.target.value)}
                            options={categoryOptions}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Difficulty
                        </label>
                        <Select
                            value={selectedDifficulty}
                            onChange={(e) => onDifficultyChange(e.target.value)}
                            options={difficultyOptions}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Cook Time
                        </label>
                        <Select
                            value={selectedCookTime}
                            onChange={(e) => onCookTimeChange(e.target.value)}
                            options={cookTimeOptions}
                        />
                    </div>
                </div>
            </details>

            {/* Active Filters & Clear */}
            {hasActiveFilters && (
                <div className={`flex items-center justify-between p-3 ${filtersBgColor} rounded-lg`}>
                    <div className="flex items-center gap-2">
                        <Filter className={`h-4 w-4 text-${theme.color === 'default' ? 'emerald' : theme.color}-600 dark:text-${theme.color === 'default' ? 'emerald' : theme.color}-400`} />
                        <span className={`text-sm font-medium text-${theme.color === 'default' ? 'emerald' : theme.color}-800 dark:text-${theme.color === 'default' ? 'emerald' : theme.color}-200`}>
                            Filters active
                        </span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearFilters}
                        className={`text-${theme.color === 'default' ? 'emerald' : theme.color}-600 dark:text-${theme.color === 'default' ? 'emerald' : theme.color}-400 hover:text-${theme.color === 'default' ? 'emerald' : theme.color}-800 dark:hover:text-${theme.color === 'default' ? 'emerald' : theme.color}-200`}
                    >
                        Clear all
                    </Button>
                </div>
            )}
        </div>
    );
}; 