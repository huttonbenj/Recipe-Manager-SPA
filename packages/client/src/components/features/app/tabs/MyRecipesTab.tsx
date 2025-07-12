import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChefHat, Plus } from 'lucide-react';
import { Recipe } from '@recipe-manager/shared';
import { apiClient } from '../../../../services/api';
import { useDebounce } from '../../../../hooks';
import { parseSearchQuery } from '../../../../utils/searchParser';
import { Button } from '../../../ui';
import { SimpleFilters } from '../../recipes/SimpleFilters';
import { RecipeGrid } from '../../recipes/RecipeList/RecipeGrid';
import { useAuth } from '../../../../hooks';

export const MyRecipesTab: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [selectedDifficulty, setSelectedDifficulty] = useState(searchParams.get('difficulty') || '');
    const [selectedCookTime, setSelectedCookTime] = useState(searchParams.get('cookTime') || '');
    const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>((searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));
    const { user } = useAuth();

    // Always set user_id=current for this tab
    useEffect(() => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('user_id', 'current');
        if (newParams.toString() !== searchParams.toString()) {
            setSearchParams(newParams, { replace: true });
        }
    }, [searchParams, setSearchParams]);

    // Smart search parsing - handle complex queries from global search
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

        // If we parsed filters from search, update URL to reflect them
        if (parsedQuery.category || parsedQuery.difficulty || parsedQuery.cookTime) {
            const newParams = new URLSearchParams(searchParams);
            newParams.set('user_id', 'current'); // Always maintain this

            if (parsedQuery.searchTerm !== rawSearch) {
                newParams.set('search', parsedQuery.searchTerm);
            }
            if (parsedQuery.category && !urlCategory) {
                newParams.set('category', parsedQuery.category);
            }
            if (parsedQuery.difficulty && !urlDifficulty) {
                newParams.set('difficulty', parsedQuery.difficulty);
            }
            if (parsedQuery.cookTime && !urlCookTime) {
                newParams.set('cookTime', parsedQuery.cookTime);
            }

            // Only update URL if changes were made
            if (newParams.toString() !== searchParams.toString()) {
                setSearchParams(newParams, { replace: true });
            }
        }
    }, [searchParams, setSearchParams]);

    // Debounced search term
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // Fetch user's recipes with filters
    const { data: recipesData, isLoading, error } = useQuery({
        queryKey: ['my-recipes', {
            search: debouncedSearchTerm,
            category: selectedCategory,
            difficulty: selectedDifficulty,
            cookTime: selectedCookTime,
            sortBy,
            sortOrder,
            page: currentPage,
            user_id: user?.id,
        }],
        queryFn: () => {
            const params: any = {
                page: currentPage,
                limit: 12,
                user_id: user?.id, // Always filter by current user
            };

            if (debouncedSearchTerm) params.search = debouncedSearchTerm;
            if (selectedCategory) params.category = selectedCategory;
            if (selectedDifficulty) params.difficulty = selectedDifficulty;
            if (selectedCookTime) params.cookTime = selectedCookTime;
            if (sortBy) params.sortBy = sortBy;
            if (sortOrder) params.sortOrder = sortOrder;

            return apiClient.getRecipes(params);
        },
        enabled: !!user?.id,
    });

    const recipes: Recipe[] = recipesData?.data || [];
    const totalRecipes = recipesData?.pagination?.totalCount || 0;

    const updateUrlParams = () => {
        const newParams = new URLSearchParams();
        newParams.set('user_id', 'current'); // Always maintain this

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

    const clearAllFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setSelectedDifficulty('');
        setSelectedCookTime('');
        setSortBy('created_at');
        setSortOrder('desc');
        setCurrentPage(1);
        const newParams = new URLSearchParams();
        newParams.set('user_id', 'current'); // Always maintain this
        setSearchParams(newParams);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 text-white">
                        <ChefHat className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
                            My Recipes
                        </h1>
                        <p className="text-sm text-surface-600 dark:text-surface-400">
                            {totalRecipes} recipes created by you
                        </p>
                    </div>
                </div>

                {/* Create Recipe Button */}
                <Button
                    variant="primary"
                    onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        params.set('tab', 'create');
                        window.location.href = `/app?${params.toString()}`;
                    }}
                    className="flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Create Recipe
                </Button>
            </div>

            {/* Filters and Recipe List */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
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
                    onClearFilters={clearAllFilters}
                    onSearch={handleSearch}
                    showMyRecipesOnly={true}
                />

                <div className="mt-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-600 dark:text-red-400">Error loading your recipes</p>
                        </div>
                    ) : recipes.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="mb-4">
                                <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                    No recipes yet
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">
                                    Start creating your first recipe to share with the community!
                                </p>
                                <Button
                                    variant="primary"
                                    onClick={() => {
                                        const params = new URLSearchParams(searchParams);
                                        params.set('tab', 'create');
                                        window.location.href = `/app?${params.toString()}`;
                                    }}
                                    className="flex items-center gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Create Your First Recipe
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <RecipeGrid
                            recipes={recipes}
                            viewMode={viewMode}
                            onViewModeChange={setViewMode}
                            onClearFilters={clearAllFilters}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}; 
