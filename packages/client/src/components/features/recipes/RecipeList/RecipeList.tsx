import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Recipe } from '@recipe-manager/shared';
import { apiClient } from '../../../../services/api';
import { useDebounce } from '../../../../hooks';
import { Button } from '../../../ui';
import { RecipeFilters } from './RecipeFilters';
import { RecipeGrid } from './RecipeGrid';

export const RecipeList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [selectedDifficulty, setSelectedDifficulty] = useState(searchParams.get('difficulty') || '');
    const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>((searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc');
    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));

    // Debounced search term
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // Fetch recipes with filters
    const { data: recipesData, isLoading, error } = useQuery({
        queryKey: ['recipes', {
            search: debouncedSearchTerm,
            category: selectedCategory,
            difficulty: selectedDifficulty,
            sortBy,
            sortOrder,
            page: currentPage
        }],
        queryFn: () => {
            const params: any = {
                page: currentPage,
                limit: 12,
            };

            if (debouncedSearchTerm) params.search = debouncedSearchTerm;
            if (selectedCategory) params.category = selectedCategory;
            if (selectedDifficulty) params.difficulty = selectedDifficulty;
            if (sortBy) params.sortBy = sortBy;
            if (sortOrder) params.sortOrder = sortOrder;

            return apiClient.getRecipes(params);
        },
    });

    const recipes: Recipe[] = recipesData?.data || [];

    // Update URL params when filters change
    const updateSearchParams = (updates: Record<string, string>) => {
        const newParams = new URLSearchParams(searchParams);

        Object.entries(updates).forEach(([key, value]) => {
            if (value) {
                newParams.set(key, value);
            } else {
                newParams.delete(key);
            }
        });

        setSearchParams(newParams);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        updateSearchParams({
            search: searchTerm,
            category: selectedCategory,
            difficulty: selectedDifficulty,
            sortBy,
            sortOrder,
            page: '1',
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setSelectedDifficulty('');
        setSortBy('created_at');
        setSortOrder('desc');
        setCurrentPage(1);
        setSearchParams({});
    };

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Error loading recipes</h2>
                    <p className="text-gray-600">Please try again later.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Recipe Collection</h1>
                    <p className="text-gray-600 mt-2">Discover and share amazing recipes</p>
                </div>
                <Link to="/recipes/new">
                    <Button leftIcon={<Plus className="h-5 w-5" />}>
                        Create Recipe
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <RecipeFilters
                searchTerm={searchTerm}
                selectedCategory={selectedCategory}
                selectedDifficulty={selectedDifficulty}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSearchChange={setSearchTerm}
                onCategoryChange={setSelectedCategory}
                onDifficultyChange={setSelectedDifficulty}
                onSortByChange={setSortBy}
                onSortOrderChange={setSortOrder}
                onClearFilters={clearFilters}
                onSearch={handleSearch}
            />

            {/* Recipe Grid */}
            <RecipeGrid
                recipes={recipes}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                isLoading={isLoading}
            />
        </div>
    );
}; 