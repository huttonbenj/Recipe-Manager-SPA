import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button, Input, Select, FormField } from '../../../ui';

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

const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'Appetizers', label: 'Appetizers' },
    { value: 'Main Course', label: 'Main Course' },
    { value: 'Desserts', label: 'Desserts' },
    { value: 'Beverages', label: 'Beverages' },
    { value: 'Snacks', label: 'Snacks' },
];

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

    return (
        <div className="glass-card p-6 rounded-2xl mb-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-50 flex items-center">
                    <Filter className="h-5 w-5 mr-2" />
                    Filters
                </h2>
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearFilters}
                        leftIcon={<X className="h-4 w-4" />}
                    >
                        Clear Filters
                    </Button>
                )}
            </div>

            <form onSubmit={onSearch} className="space-y-4">
                {/* Search */}
                <FormField label={<label htmlFor="search-recipes-input">Search recipes</label>}>
                    <Input
                        id="search-recipes-input"
                        type="text"
                        placeholder="Search by title, ingredients, or instructions..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        leftIcon={<Search className="h-4 w-4" />}
                    />
                </FormField>

                {/* Filter Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FormField label={<label htmlFor="category-select">Category</label>}>
                        <Select
                            id="category-select"
                            value={selectedCategory}
                            onChange={(e) => onCategoryChange(e.target.value)}
                            options={categoryOptions}
                        />
                    </FormField>

                    <FormField label={<label htmlFor="difficulty-select">Difficulty</label>}>
                        <Select
                            id="difficulty-select"
                            value={selectedDifficulty}
                            onChange={(e) => onDifficultyChange(e.target.value)}
                            options={difficultyOptions}
                        />
                    </FormField>

                    <FormField label={<label htmlFor="sortby-select">Sort by</label>}>
                        <Select
                            id="sortby-select"
                            value={sortBy}
                            onChange={(e) => onSortByChange(e.target.value)}
                            options={sortOptions}
                        />
                    </FormField>

                    <FormField label={<label htmlFor="order-select">Order</label>}>
                        <Select
                            id="order-select"
                            value={sortOrder}
                            onChange={(e) => onSortOrderChange(e.target.value as 'asc' | 'desc')}
                            options={sortOrderOptions}
                        />
                    </FormField>
                </div>

                {/* Search Button */}
                <div className="flex justify-end">
                    <Button type="submit" leftIcon={<Search className="h-4 w-4" />}>
                        Search Recipes
                    </Button>
                </div>
            </form>
        </div>
    );
}; 