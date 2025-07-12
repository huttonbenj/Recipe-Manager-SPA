import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, X } from 'lucide-react';
import { Button, Input, Select, FormField } from '../../../ui';
import { recipeService } from '../../../../services';

interface RecipeFiltersProps {
    searchTerm: string;
    selectedCategory: string;
    selectedDifficulty: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    onSearchChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
    onDifficultyChange: (value: string) => void;
    onSortByChange: (value: string) => void;
    onSortOrderChange: (value: 'asc' | 'desc') => void;
    onClearFilters: () => void;
    onSearch: (e: React.FormEvent) => void;
}

const difficultyOptions = [
    { value: '', label: 'All Difficulties' },
    { value: 'Easy', label: 'Easy' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Hard', label: 'Hard' },
];

const sortOptions = [
    { value: 'created_at', label: 'Date Created' },
    { value: 'title', label: 'Title' },
    { value: 'cook_time', label: 'Cook Time' },
    { value: 'difficulty', label: 'Difficulty' },
];

const sortOrderOptions = [
    { value: 'desc', label: 'Descending' },
    { value: 'asc', label: 'Ascending' },
];

export const RecipeFilters: React.FC<RecipeFiltersProps> = ({
    searchTerm,
    selectedCategory,
    selectedDifficulty,
    sortBy,
    sortOrder,
    onSearchChange,
    onCategoryChange,
    onDifficultyChange,
    onSortByChange,
    onSortOrderChange,
    onClearFilters,
    onSearch,
}) => {
    const hasActiveFilters = searchTerm || selectedCategory || selectedDifficulty;

    // Fetch categories from backend
    const { data: categories = [] } = useQuery({
        queryKey: ['recipe-categories'],
        queryFn: () => recipeService.getRecipeCategories(),
        staleTime: 300000, // 5 minutes
    });

    // Build category options from backend data
    const categoryOptions = [
        { value: '', label: 'All Categories' },
        ...categories.map(category => ({
            value: category,
            label: category,
        })),
    ];

    return (
        <form onSubmit={onSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Filter Recipes</h3>
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearFilters}
                        className="flex items-center text-sm"
                    >
                        <X className="h-4 w-4 mr-1" />
                        Clear Filters
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="md:col-span-1">
                    <Input
                        id="search-recipes-input"
                        type="text"
                        label="Search"
                        placeholder="Find a recipe..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        rightIcon={<Search className="h-4 w-4" />}
                    />
                </div>

                {/* Category & Difficulty */}
                <div className="grid grid-cols-2 gap-4">
                    <FormField label="Category">
                        <Select
                            id="category-select"
                            value={selectedCategory}
                            onChange={(e) => onCategoryChange(e.target.value)}
                            options={categoryOptions}
                        />
                    </FormField>
                    <FormField label="Difficulty">
                        <Select
                            id="difficulty-select"
                            value={selectedDifficulty}
                            onChange={(e) => onDifficultyChange(e.target.value)}
                            options={difficultyOptions}
                        />
                    </FormField>
                </div>


                {/* Sorting */}
                <div className="grid grid-cols-2 gap-4">
                    <FormField label="Sort by">
                        <Select
                            id="sortby-select"
                            value={sortBy}
                            onChange={(e) => onSortByChange(e.target.value)}
                            options={sortOptions}
                        />
                    </FormField>
                    <FormField label="Order">
                        <Select
                            id="order-select"
                            value={sortOrder}
                            onChange={(e) => onSortOrderChange(e.target.value as 'asc' | 'desc')}
                            options={sortOrderOptions}
                        />
                    </FormField>
                </div>
            </div>
        </form>
    );
}; 