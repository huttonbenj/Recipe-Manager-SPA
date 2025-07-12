import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, X, Heart, Tag, Clock, Zap, Filter, ChefHat, Star } from 'lucide-react';
import { Button, Input, Select, FormField } from '../../../ui';
import { recipeService } from '../../../../services';
import { parseSearchQuery, formatSearchDescription } from '../../../../utils/searchParser';

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

const difficultyOptions = [
    { value: '', label: 'All Difficulties' },
    { value: 'Easy', label: 'Easy' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Hard', label: 'Hard' },
];

const cookTimeOptions = [
    { value: '', label: 'Any Cook Time' },
    { value: '15', label: '≤ 15 min' },
    { value: '30', label: '≤ 30 min' },
    { value: '60', label: '≤ 60 min' },
    { value: '90', label: '≤ 90 min' },
    { value: '120', label: '≤ 2 hours' },
];

const sortOptions = [
    { value: 'created_at', label: 'Date Created' },
    { value: 'title', label: 'Title' },
    { value: 'cook_time', label: 'Cook Time' },
    { value: 'difficulty', label: 'Difficulty' },
    { value: 'likes', label: 'Popularity (Likes)' },
];

const sortOrderOptions = [
    { value: 'desc', label: 'Descending' },
    { value: 'asc', label: 'Ascending' },
];

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
    const [parsedQuery, setParsedQuery] = useState(() => parseSearchQuery(searchTerm));

    // Parse search term when it changes and auto-apply filters
    useEffect(() => {
        if (searchTerm !== localSearchTerm) {
            setLocalSearchTerm(searchTerm);
            const parsed = parseSearchQuery(searchTerm);
            setParsedQuery(parsed);

            // Auto-apply parsed filters if they differ from current state
            if (parsed.category && parsed.category !== selectedCategory) {
                onCategoryChange(parsed.category);
            }
            if (parsed.difficulty && parsed.difficulty !== selectedDifficulty) {
                onDifficultyChange(parsed.difficulty);
            }
            if (parsed.cookTime && parsed.cookTime !== selectedCookTime) {
                onCookTimeChange(parsed.cookTime);
            }

            // Update search term to just the clean search part
            if (parsed.searchTerm !== searchTerm) {
                onSearchChange(parsed.searchTerm);
            }
        }
    }, [searchTerm, localSearchTerm, selectedCategory, selectedDifficulty, selectedCookTime, onCategoryChange, onDifficultyChange, onCookTimeChange, onSearchChange]);

    // Check if sort is explicitly set (not default) or if a quick filter was used
    const hasExplicitSort = quickFilter || sortBy !== 'created_at' || sortOrder !== 'desc';

    const hasActiveFilters = searchTerm || selectedCategory || selectedDifficulty || selectedCookTime || isFavorites || isSaved || hasExplicitSort;
    const hasSmartFilters = parsedQuery.category || parsedQuery.difficulty || parsedQuery.cookTime;

    // Helper function to get sort display name
    const getSortDisplayName = () => {
        // Use quickFilter if available for better display names
        if (quickFilter === 'popular') {
            return 'Popular';
        }
        if (quickFilter === 'recent') {
            return 'Recent';
        }
        if (quickFilter === 'easy') {
            return 'Easy';
        }
        if (quickFilter === 'quick') {
            return 'Quick';
        }
        if (quickFilter === 'favorites') {
            return 'Favorites';
        }
        if (quickFilter === 'saved') {
            return 'Saved';
        }

        // Fallback to sort parameters
        if (sortBy === 'likes' && sortOrder === 'desc') {
            return 'Popular';
        }
        if (sortBy === 'created_at' && sortOrder === 'desc') {
            return 'Recent';
        }
        if (sortBy === 'title' && sortOrder === 'asc') {
            return 'A-Z';
        }
        if (sortBy === 'title' && sortOrder === 'desc') {
            return 'Z-A';
        }
        return `${sortBy} ${sortOrder}`;
    };

    // Fetch categories from backend
    const { data: categories = [] } = useQuery({
        queryKey: ['recipe-categories'],
        queryFn: () => recipeService.getRecipeCategories(),
        staleTime: 300000, // 5 minutes
    });

    // Build category options from backend data
    const categoryOptions = [
        { value: '', label: 'All Categories' },
        ...categories.map((category) => ({
            value: category,
            label: category,
        })),
    ];

    const handleSearchChange = (value: string) => {
        setLocalSearchTerm(value);
        const parsed = parseSearchQuery(value);
        setParsedQuery(parsed);
        onSearchChange(value);
    };

    const getFilterIcon = (type: string) => {
        switch (type) {
            case 'category': return <Tag className="h-3 w-3" />;
            case 'difficulty': return <Zap className="h-3 w-3" />;
            case 'cookTime': return <Clock className="h-3 w-3" />;
            default: return <Filter className="h-3 w-3" />;
        }
    };

    const getFilterColor = (type: string) => {
        switch (type) {
            case 'category': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'difficulty': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'cookTime': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    return (
        <form onSubmit={onSearch} className="space-y-6">
            {/* Header with Smart Filter Description */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                        <ChefHat className="h-5 w-5" />
                        Filter Recipes
                    </h3>
                    {hasSmartFilters && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Smart filters detected: {formatSearchDescription(parsedQuery)}
                        </p>
                    )}
                </div>
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearFilters}
                        className="flex items-center text-sm shrink-0"
                    >
                        <X className="h-4 w-4 mr-1" />
                        Clear All Filters
                    </Button>
                )}
            </div>

            {/* Active Filter Tags */}
            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 self-center">Active Filters:</span>
                    {selectedCategory && (
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getFilterColor('category')}`}>
                            {getFilterIcon('category')}
                            {selectedCategory}
                            <button
                                type="button"
                                onClick={() => onCategoryChange('')}
                                className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    )}
                    {selectedDifficulty && (
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getFilterColor('difficulty')}`}>
                            {getFilterIcon('difficulty')}
                            {selectedDifficulty}
                            <button
                                type="button"
                                onClick={() => onDifficultyChange('')}
                                className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    )}
                    {selectedCookTime && (
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getFilterColor('cookTime')}`}>
                            {getFilterIcon('cookTime')}
                            ≤ {selectedCookTime}min
                            <button
                                type="button"
                                onClick={() => onCookTimeChange('')}
                                className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    )}
                    {isFavorites && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            <Heart className="h-3 w-3" />
                            Favorites
                            <button
                                type="button"
                                onClick={() => onFavoritesToggle(false)}
                                className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    )}
                    {isSaved && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            <Star className="h-3 w-3" />
                            Saved
                            <button
                                type="button"
                                onClick={() => onSavedToggle(false)}
                                className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    )}
                    {hasExplicitSort && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            <Zap className="h-3 w-3" />
                            {getSortDisplayName()}
                            <button
                                type="button"
                                onClick={() => {
                                    onSortByChange('created_at');
                                    onSortOrderChange('desc');
                                    onQuickFilterChange('');
                                }}
                                className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    )}
                </div>
            )}

            {/* Search & Favorites/Saved Row */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                {/* Enhanced Search Input */}
                <div className="md:col-span-3">
                    <Input
                        id="search-recipes-input"
                        type="text"
                        label="Search Recipes"
                        placeholder="Try 'easy chicken' or 'quick dessert recipes'..."
                        value={localSearchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        rightIcon={<Search className="h-4 w-4" />}
                        className={hasSmartFilters ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''}
                    />
                    {hasSmartFilters && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                            🧠 Smart filters applied automatically
                        </p>
                    )}
                </div>

                {/* Favorites Toggle */}
                <div className="flex items-center justify-center space-x-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
                    <input
                        id="favorites-toggle"
                        type="checkbox"
                        checked={isFavorites}
                        onChange={(e) => onFavoritesToggle(e.target.checked)}
                        className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <label htmlFor="favorites-toggle" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center cursor-pointer">
                        <Heart className={`h-4 w-4 mr-1 ${isFavorites ? 'fill-current text-red-500' : ''}`} />
                        Favorites
                    </label>
                </div>

                {/* Saved Toggle */}
                <div className="flex items-center justify-center space-x-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
                    <input
                        id="saved-toggle"
                        type="checkbox"
                        checked={isSaved}
                        onChange={(e) => onSavedToggle(e.target.checked)}
                        className="h-4 w-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                    />
                    <label htmlFor="saved-toggle" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center cursor-pointer">
                        <Star className={`h-4 w-4 mr-1 ${isSaved ? 'fill-current text-yellow-500' : ''}`} />
                        Saved
                    </label>
                </div>
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="Category" htmlFor="category-select">
                    <Select
                        id="category-select"
                        value={selectedCategory}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        options={categoryOptions}
                        className={selectedCategory ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''}
                    />
                </FormField>

                <FormField label="Difficulty" htmlFor="difficulty-select">
                    <Select
                        id="difficulty-select"
                        value={selectedDifficulty}
                        onChange={(e) => onDifficultyChange(e.target.value)}
                        options={difficultyOptions}
                        className={selectedDifficulty ? 'ring-2 ring-green-200 dark:ring-green-800' : ''}
                    />
                </FormField>

                <FormField label="Cook Time" htmlFor="cooktime-select">
                    <Select
                        id="cooktime-select"
                        value={selectedCookTime}
                        onChange={(e) => onCookTimeChange(e.target.value)}
                        options={cookTimeOptions}
                        className={selectedCookTime ? 'ring-2 ring-purple-200 dark:ring-purple-800' : ''}
                    />
                </FormField>
            </div>

            {/* Sorting Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="Sort By" htmlFor="sortby-select">
                    <Select
                        id="sortby-select"
                        value={sortBy}
                        onChange={(e) => onSortByChange(e.target.value)}
                        options={sortOptions}
                    />
                </FormField>

                <FormField label="Sort Order" htmlFor="sortorder-select">
                    <Select
                        id="sortorder-select"
                        value={sortOrder}
                        onChange={(e) => onSortOrderChange(e.target.value as 'asc' | 'desc')}
                        options={sortOrderOptions}
                    />
                </FormField>

                <div className="flex items-end">
                    <Button
                        type="submit"
                        variant="gradient"
                        className="w-full"
                        leftIcon={<Search className="h-4 w-4" />}
                    >
                        Apply Filters
                    </Button>
                </div>
            </div>
        </form>
    );
}; 