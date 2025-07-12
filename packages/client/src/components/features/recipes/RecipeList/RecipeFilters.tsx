import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, X, Heart, Tag, Clock, Zap, Filter, ChefHat, Star, ArrowUpDown, Sparkles } from 'lucide-react';
import { Button, Input, Select, FormField } from '../../../ui';
import { recipeService } from '../../../../services';
import { parseSearchQuery, formatSearchDescription } from '../../../../utils/searchParser';
import { cn } from '../../../../utils/cn';

interface RecipeFiltersProps {
    searchTerm: string;
    selectedCategory: string;
    selectedDifficulty: string;
    selectedCookTime: string;
    isFavorites: boolean;
    isSaved: boolean;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    quickFilter: string;
    onSearchChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
    onDifficultyChange: (value: string) => void;
    onCookTimeChange: (value: string) => void;
    onFavoritesToggle: (value: boolean) => void;
    onSavedToggle: (value: boolean) => void;
    onSortByChange: (value: string) => void;
    onSortOrderChange: (value: 'asc' | 'desc') => void;
    onQuickFilterChange: (value: string) => void;
    onClearFilters: () => void;
    onSearch: (e: React.FormEvent) => void;
}

export const RecipeFilters: React.FC<RecipeFiltersProps> = ({
    searchTerm,
    selectedCategory,
    selectedDifficulty,
    selectedCookTime,
    isFavorites,
    isSaved,
    sortBy,
    sortOrder,
    quickFilter,
    onSearchChange,
    onCategoryChange,
    onDifficultyChange,
    onCookTimeChange,
    onFavoritesToggle,
    onSavedToggle,
    onSortByChange,
    onSortOrderChange,
    onQuickFilterChange,
    onClearFilters,
    onSearch,
}) => {
    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

    // Sync local search term with prop
    useEffect(() => {
        setLocalSearchTerm(searchTerm);
    }, [searchTerm]);

    const handleSearchChange = (value: string) => {
        setLocalSearchTerm(value);
        onSearchChange(value);
    };

    // Parse search query for smart filters
    const parsedQuery = parseSearchQuery(searchTerm);
    const hasSmartFilters = parsedQuery.category || parsedQuery.difficulty || parsedQuery.cookTime;

    // Check if any filters are active
    const hasActiveFilters = selectedCategory || selectedDifficulty || selectedCookTime || isFavorites || isSaved || quickFilter;

    // Get filter icons
    const getFilterIcon = (type: string) => {
        switch (type) {
            case 'category':
                return <Tag className="h-3 w-3" />;
            case 'difficulty':
                return <Zap className="h-3 w-3" />;
            case 'cookTime':
                return <Clock className="h-3 w-3" />;
            default:
                return <Filter className="h-3 w-3" />;
        }
    };

    // Get filter colors
    const getFilterColor = (type: string): string => {
        switch (type) {
            case 'category':
                return 'bg-gradient-to-r from-brand-100 to-brand-200 text-brand-800 dark:from-brand-900/30 dark:to-brand-800/30 dark:text-brand-300 border-brand-300 dark:border-brand-700';
            case 'difficulty':
                return 'bg-gradient-to-r from-success-100 to-emerald-200 text-success-800 dark:from-success-900/30 dark:to-emerald-800/30 dark:text-success-300 border-success-300 dark:border-success-700';
            case 'cookTime':
                return 'bg-gradient-to-r from-accent-100 to-blue-200 text-accent-800 dark:from-accent-900/30 dark:to-blue-800/30 dark:text-accent-300 border-accent-300 dark:border-accent-700';
            case 'favorites':
                return 'bg-gradient-to-r from-error-100 to-rose-200 text-error-800 dark:from-error-900/30 dark:to-rose-800/30 dark:text-error-300 border-error-300 dark:border-error-700';
            case 'saved':
                return 'bg-gradient-to-r from-warning-100 to-amber-200 text-warning-800 dark:from-warning-900/30 dark:to-amber-800/30 dark:text-warning-300 border-warning-300 dark:border-warning-700';
            case 'quickFilter':
                return 'bg-gradient-to-r from-purple-100 to-violet-200 text-purple-800 dark:from-purple-900/30 dark:to-violet-800/30 dark:text-purple-300 border-purple-300 dark:border-purple-700';
            default:
                return 'bg-gradient-to-r from-surface-100 to-surface-200 text-surface-800 dark:from-surface-700 dark:to-surface-600 dark:text-surface-300 border-surface-300 dark:border-surface-600';
        }
    };

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

    const sortByOptions = [
        { value: 'created_at', label: 'Date Created' },
        { value: 'updated_at', label: 'Last Updated' },
        { value: 'title', label: 'Title' },
        { value: 'cook_time', label: 'Cook Time' },
        { value: 'likes', label: 'Popularity' },
    ];

    const sortOrderOptions = [
        { value: 'desc', label: 'Descending' },
        { value: 'asc', label: 'Ascending' },
    ];

    const quickFilterOptions = [
        { value: '', label: 'All Recipes', icon: <Filter className="h-3 w-3" /> },
        { value: 'popular', label: 'Popular', icon: <Zap className="h-3 w-3" /> },
        { value: 'recent', label: 'Recent', icon: <Clock className="h-3 w-3" /> },
        { value: 'easy', label: 'Easy', icon: <Zap className="h-3 w-3" /> },
        { value: 'quick', label: 'Quick', icon: <Clock className="h-3 w-3" /> },
        { value: 'favorites', label: 'Favorites', icon: <Heart className="h-3 w-3" /> },
        { value: 'saved', label: 'Saved', icon: <Star className="h-3 w-3" /> },
    ];

    const activeFilters = [
        ...(selectedCategory ? [{ key: 'category', type: 'category', label: selectedCategory, icon: getFilterIcon('category') }] : []),
        ...(selectedDifficulty ? [{ key: 'difficulty', type: 'difficulty', label: selectedDifficulty, icon: getFilterIcon('difficulty') }] : []),
        ...(selectedCookTime ? [{ key: 'cookTime', type: 'cookTime', label: `≤ ${selectedCookTime}min`, icon: getFilterIcon('cookTime') }] : []),
        ...(isFavorites ? [{ key: 'favorites', type: 'favorites', label: 'Favorites', icon: <Heart className="h-3 w-3" /> }] : []),
        ...(isSaved ? [{ key: 'saved', type: 'saved', label: 'Saved', icon: <Star className="h-3 w-3" /> }] : []),
        ...(quickFilter === 'popular' ? [{ key: 'popular', type: 'quickFilter', label: 'Popular', icon: <Zap className="h-3 w-3" /> }] : []),
        ...(quickFilter === 'recent' ? [{ key: 'recent', type: 'quickFilter', label: 'Recent', icon: <Clock className="h-3 w-3" /> }] : []),
        ...(quickFilter === 'easy' && selectedDifficulty === 'Easy' ? [] : quickFilter === 'easy' ? [{ key: 'quickEasy', type: 'quickFilter', label: 'Easy', icon: <Zap className="h-3 w-3" /> }] : []),
        ...(quickFilter === 'quick' && selectedCookTime === '30' ? [] : quickFilter === 'quick' ? [{ key: 'quickTime', type: 'quickFilter', label: 'Quick', icon: <Clock className="h-3 w-3" /> }] : []),
    ];

    const handleQuickFilterClick = (value: string) => {
        onQuickFilterChange(value);

        // Apply the specific quick filter without clearing others
        if (value === 'popular') {
            onSortByChange('likes');
            onSortOrderChange('desc');
        } else if (value === 'recent') {
            onSortByChange('created_at');
            onSortOrderChange('desc');
        } else if (value === 'easy') {
            onDifficultyChange('Easy');
        } else if (value === 'quick') {
            onCookTimeChange('30');
        } else if (value === 'favorites') {
            onFavoritesToggle(true);
        } else if (value === 'saved') {
            onSavedToggle(true);
        }
    };

    // Handler for removing individual filters
    const handleRemoveFilter = (filterKey: string) => {
        switch (filterKey) {
            case 'category':
                onCategoryChange('');
                break;
            case 'difficulty':
                onDifficultyChange('');
                break;
            case 'cookTime':
                onCookTimeChange('');
                break;
            case 'favorites':
                onFavoritesToggle(false);
                break;
            case 'saved':
                onSavedToggle(false);
                break;
            case 'popular':
            case 'recent':
            case 'quickEasy':
            case 'quickTime':
                onQuickFilterChange('');
                // Reset sort to default when removing quick filters
                if (filterKey === 'popular' || filterKey === 'recent') {
                    onSortByChange('created_at');
                    onSortOrderChange('desc');
                }
                if (filterKey === 'quickEasy') {
                    onDifficultyChange('');
                }
                if (filterKey === 'quickTime') {
                    onCookTimeChange('');
                }
                break;
            default:
                break;
        }
    };

    return (
        <div className="space-y-8">
            {/* Header with Enhanced Design */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 shadow-lg">
                            <ChefHat className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-surface-900 dark:text-white">
                                Filter Recipes
                            </h3>
                            <p className="text-sm text-surface-500 dark:text-surface-400">
                                Find your perfect recipe with smart filters
                            </p>
                        </div>
                    </div>
                    {hasSmartFilters && (
                        <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-brand-50 to-accent-50 dark:from-brand-900/20 dark:to-accent-900/20 rounded-lg border border-brand-200 dark:border-brand-800">
                            <div className="flex-shrink-0">
                                <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse"></div>
                            </div>
                            <p className="text-sm text-brand-700 dark:text-brand-300 font-medium">
                                🧠 Smart filters detected: {formatSearchDescription(parsedQuery)}
                            </p>
                        </div>
                    )}
                </div>
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearFilters}
                        className="flex items-center text-sm shrink-0 hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-900/20 dark:hover:text-error-400 transition-all duration-200"
                    >
                        <X className="h-4 w-4 mr-1" />
                        Clear All Filters
                    </Button>
                )}
            </div>

            {/* Active Filter Tags with Enhanced Design */}
            {hasActiveFilters && (
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-surface-50 via-surface-100 to-surface-50 dark:from-surface-800 dark:via-surface-700 dark:to-surface-800 rounded-2xl opacity-60"></div>
                    <div className="relative p-6 bg-white/70 dark:bg-surface-900/70 backdrop-blur-sm rounded-2xl border border-surface-200/50 dark:border-surface-700/50 shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-surface-600 dark:text-surface-400" />
                                <span className="text-sm font-semibold text-surface-700 dark:text-surface-300">Active Filters</span>
                            </div>
                            <div className="h-px flex-1 bg-gradient-to-r from-surface-300 to-transparent dark:from-surface-600"></div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {activeFilters.map((filter, index) => (
                                <button
                                    key={filter.key}
                                    onClick={() => handleRemoveFilter(filter.key)}
                                    className={cn(
                                        'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium',
                                        'hover:scale-105 hover:shadow-md transition-all duration-200 cursor-pointer group',
                                        'border border-opacity-20 backdrop-blur-sm',
                                        getFilterColor(filter.type),
                                        'animate-in slide-in-from-left-2 fade-in-0'
                                    )}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                    title={`Remove ${filter.label} filter`}
                                >
                                    <span className="flex items-center gap-1">
                                        {filter.icon}
                                        {filter.label}
                                    </span>
                                    <X className="h-3 w-3 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Action Buttons with Enhanced Design */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-accent-600 dark:text-accent-400" />
                        <span className="text-sm font-semibold text-surface-700 dark:text-surface-300">Quick Filters</span>
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-accent-300 to-transparent dark:from-accent-600"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {quickFilterOptions.map((option, index) => (
                        <Button
                            key={option.value}
                            variant={quickFilter === option.value ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => handleQuickFilterClick(option.value)}
                            className={cn(
                                'flex items-center justify-center gap-2 h-12 transition-all duration-200',
                                'hover:scale-105 hover:shadow-md',
                                quickFilter === option.value
                                    ? 'bg-gradient-to-r from-brand-500 to-brand-600 shadow-lg shadow-brand-500/25'
                                    : 'hover:bg-gradient-to-r hover:from-surface-50 hover:to-surface-100 dark:hover:from-surface-800 dark:hover:to-surface-700',
                                'animate-in slide-in-from-bottom-2 fade-in-0'
                            )}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {option.icon}
                            <span className="hidden sm:inline">{option.label}</span>
                        </Button>
                    ))}
                </div>
            </div>

            <form onSubmit={onSearch} className="space-y-8">
                {/* Enhanced Search Input */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Search className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                            <span className="text-sm font-semibold text-surface-700 dark:text-surface-300">Search & Discover</span>
                        </div>
                        <div className="h-px flex-1 bg-gradient-to-r from-brand-300 to-transparent dark:from-brand-600"></div>
                    </div>
                    <div className="relative">
                        <Input
                            id="search-recipes-input"
                            type="text"
                            label="Search Recipes"
                            placeholder="Try 'easy chicken' or 'quick dessert recipes'..."
                            value={localSearchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            rightIcon={<Search className="h-5 w-5" />}
                            className={cn(
                                'h-14 text-lg transition-all duration-200',
                                hasSmartFilters
                                    ? 'ring-2 ring-brand-200 dark:ring-brand-800 shadow-lg shadow-brand-500/10'
                                    : 'hover:shadow-md focus:shadow-lg'
                            )}
                        />
                        {hasSmartFilters && (
                            <div className="absolute -bottom-6 left-0 flex items-center gap-1">
                                <div className="w-1 h-1 bg-brand-500 rounded-full animate-pulse"></div>
                                <p className="text-xs text-brand-600 dark:text-brand-400 font-medium">
                                    Smart filters applied automatically
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Filter Controls with Enhanced Design */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            <span className="text-sm font-semibold text-surface-700 dark:text-surface-300">Filter Options</span>
                        </div>
                        <div className="h-px flex-1 bg-gradient-to-r from-purple-300 to-transparent dark:from-purple-600"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <FormField label="Category" htmlFor="category-select">
                                <Select
                                    id="category-select"
                                    value={selectedCategory}
                                    onChange={(e) => onCategoryChange(e.target.value)}
                                    options={categoryOptions}
                                    className={cn(
                                        'h-12 transition-all duration-200',
                                        selectedCategory
                                            ? 'ring-2 ring-brand-200 dark:ring-brand-800 shadow-md'
                                            : 'hover:shadow-sm'
                                    )}
                                />
                            </FormField>
                        </div>

                        <div className="space-y-2">
                            <FormField label="Difficulty" htmlFor="difficulty-select">
                                <Select
                                    id="difficulty-select"
                                    value={selectedDifficulty}
                                    onChange={(e) => onDifficultyChange(e.target.value)}
                                    options={difficultyOptions}
                                    className={cn(
                                        'h-12 transition-all duration-200',
                                        selectedDifficulty
                                            ? 'ring-2 ring-success-200 dark:ring-success-800 shadow-md'
                                            : 'hover:shadow-sm'
                                    )}
                                />
                            </FormField>
                        </div>

                        <div className="space-y-2">
                            <FormField label="Cook Time" htmlFor="cooktime-select">
                                <Select
                                    id="cooktime-select"
                                    value={selectedCookTime}
                                    onChange={(e) => onCookTimeChange(e.target.value)}
                                    options={cookTimeOptions}
                                    className={cn(
                                        'h-12 transition-all duration-200',
                                        selectedCookTime
                                            ? 'ring-2 ring-accent-200 dark:ring-accent-800 shadow-md'
                                            : 'hover:shadow-sm'
                                    )}
                                />
                            </FormField>
                        </div>
                    </div>
                </div>

                {/* Sorting Controls with Enhanced Design */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <ArrowUpDown className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                            <span className="text-sm font-semibold text-surface-700 dark:text-surface-300">Sort Results</span>
                        </div>
                        <div className="h-px flex-1 bg-gradient-to-r from-orange-300 to-transparent dark:from-orange-600"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <FormField label="Sort By" htmlFor="sortby-select">
                                <Select
                                    id="sortby-select"
                                    value={sortBy}
                                    onChange={(e) => onSortByChange(e.target.value)}
                                    options={sortByOptions}
                                    className="h-12 transition-all duration-200 hover:shadow-sm"
                                />
                            </FormField>
                        </div>

                        <div className="space-y-2">
                            <FormField label="Sort Order" htmlFor="sortorder-select">
                                <Select
                                    id="sortorder-select"
                                    value={sortOrder}
                                    onChange={(e) => onSortOrderChange(e.target.value as 'asc' | 'desc')}
                                    options={sortOrderOptions}
                                    className="h-12 transition-all duration-200 hover:shadow-sm"
                                />
                            </FormField>
                        </div>
                    </div>
                </div>

                {/* Enhanced Apply Button */}
                <div className="flex justify-center pt-4">
                    <Button
                        type="submit"
                        variant="gradient"
                        size="lg"
                        className="w-full md:w-auto px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                    >
                        <Search className="h-5 w-5 mr-3" />
                        Apply Filters & Search
                        <Sparkles className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </form>
        </div>
    );
}; 