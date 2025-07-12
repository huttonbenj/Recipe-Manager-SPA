import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search as SearchIcon } from 'lucide-react';
import { Recipe } from '@recipe-manager/shared';
import { apiClient } from '../../../../services/api';
import { useDebounce } from '../../../../hooks';
import { parseSearchQuery } from '../../../../utils/searchParser';
import { Button, Card, CardContent } from '../../../ui';
import { RecipeFilters } from './RecipeFilters';
import { RecipeGrid } from './RecipeGrid';
import { PageTransitionScale } from '../../../ui/PageTransition';

export const RecipeList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [selectedDifficulty, setSelectedDifficulty] = useState(searchParams.get('difficulty') || '');
    const [selectedCookTime, setSelectedCookTime] = useState(searchParams.get('cookTime') || '');
    const [isFavorites, setIsFavorites] = useState(searchParams.get('liked') === 'true');
    const [isSaved, setIsSaved] = useState(searchParams.get('saved') === 'true');
    const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>((searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc');
    const [quickFilter, setQuickFilter] = useState(searchParams.get('quickFilter') || '');
    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));

    // Smart search parsing - handle complex queries from main navigation
    useEffect(() => {
        const rawSearch = searchParams.get('search') || '';
        const urlCategory = searchParams.get('category') || '';
        const urlDifficulty = searchParams.get('difficulty') || '';
        const urlCookTime = searchParams.get('cookTime') || '';
        const urlLiked = searchParams.get('liked') === 'true';
        const urlSaved = searchParams.get('saved') === 'true';
        const urlSortBy = searchParams.get('sortBy') || 'created_at';
        const urlSortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc';
        const urlQuickFilter = searchParams.get('quickFilter') || '';
        const urlPage = parseInt(searchParams.get('page') || '1', 10);

        // Parse the search query to extract smart filters
        const parsedQuery = parseSearchQuery(rawSearch);

        // Update state with URL params, giving priority to explicit URL params over parsed ones
        setSearchTerm(parsedQuery.searchTerm || rawSearch);
        setSelectedCategory(urlCategory || parsedQuery.category || '');
        setSelectedDifficulty(urlDifficulty || parsedQuery.difficulty || '');
        setSelectedCookTime(urlCookTime || parsedQuery.cookTime || '');
        setIsFavorites(urlLiked);
        setIsSaved(urlSaved);
        setSortBy(urlSortBy);
        setSortOrder(urlSortOrder);
        setQuickFilter(urlQuickFilter);
        setCurrentPage(urlPage);

        // If we parsed filters from search, update URL to reflect them
        if (parsedQuery.category || parsedQuery.difficulty || parsedQuery.cookTime) {
            const newParams = new URLSearchParams(searchParams);

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

    // Fetch recipes with filters
    const { data: recipesData, isLoading, error } = useQuery({
        queryKey: ['recipes', {
            search: debouncedSearchTerm,
            category: selectedCategory,
            difficulty: selectedDifficulty,
            cookTime: selectedCookTime,
            liked: isFavorites,
            saved: isSaved,
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
            if (selectedCookTime) params.cookTime = selectedCookTime;
            if (isFavorites) params.liked = true;
            if (isSaved) params.saved = true;
            if (sortBy) params.sortBy = sortBy;
            if (sortOrder) params.sortOrder = sortOrder;

            return apiClient.getRecipes(params);
        },
    });

    const recipes: Recipe[] = recipesData?.data || [];
    const totalRecipes = recipesData?.pagination?.totalCount || 0;
    const hasActiveFilters = searchTerm || selectedCategory || selectedDifficulty || selectedCookTime || isFavorites || isSaved;

    // Update URL params when filters change
    const updateUrlParams = () => {
        const newParams = new URLSearchParams();

        if (searchTerm) newParams.set('search', searchTerm);
        if (selectedCategory) newParams.set('category', selectedCategory);
        if (selectedDifficulty) newParams.set('difficulty', selectedDifficulty);
        if (selectedCookTime) newParams.set('cookTime', selectedCookTime);
        if (isFavorites) newParams.set('liked', 'true');
        if (isSaved) newParams.set('saved', 'true');
        if (sortBy !== 'created_at') newParams.set('sortBy', sortBy);
        if (sortOrder !== 'desc') newParams.set('sortOrder', sortOrder);
        if (quickFilter) newParams.set('quickFilter', quickFilter);
        if (currentPage > 1) newParams.set('page', currentPage.toString());

        setSearchParams(newParams);
    };

    // Handle favorites toggle
    const handleFavoritesToggle = (value: boolean) => {
        setIsFavorites(value);
        setCurrentPage(1);
        // Update URL immediately
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set('liked', 'true');
        } else {
            newParams.delete('liked');
        }
        newParams.delete('page');
        setSearchParams(newParams);
    };

    // Handle saved toggle
    const handleSavedToggle = (value: boolean) => {
        setIsSaved(value);
        setCurrentPage(1);
        // Update URL immediately
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set('saved', 'true');
        } else {
            newParams.delete('saved');
        }
        newParams.delete('page');
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
        setIsFavorites(false);
        setIsSaved(false);
        setSortBy('created_at');
        setSortOrder('desc');
        setQuickFilter('');
        setCurrentPage(1);
        setSearchParams({});
    };

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-50 mb-2">Error loading recipes</h2>
                    <p className="text-surface-600 dark:text-surface-400">Please try again later.</p>
                </div>
            </div>
        );
    }

    return (
        <PageTransitionScale>
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <SearchIcon className="h-8 w-8" />
                            Recipe Collection
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">
                            {hasActiveFilters ? (
                                <>Showing <span className="font-medium">{totalRecipes}</span> filtered results</>
                            ) : (
                                <>Discover and share amazing recipes from our community • <span className="font-medium">{totalRecipes}</span> recipes</>
                            )}
                        </p>
                    </div>
                    <Link to="/recipes/new">
                        <Button variant="gradient" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
                            Create Recipe
                        </Button>
                    </Link>
                </div>

                {/* Enhanced Filters */}
                <Card className="border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                    <CardContent className="p-6">
                        <RecipeFilters
                            searchTerm={searchTerm}
                            selectedCategory={selectedCategory}
                            selectedDifficulty={selectedDifficulty}
                            selectedCookTime={selectedCookTime}
                            isFavorites={isFavorites}
                            isSaved={isSaved}
                            sortBy={sortBy}
                            sortOrder={sortOrder}
                            quickFilter={quickFilter}
                            onSearchChange={setSearchTerm}
                            onCategoryChange={setSelectedCategory}
                            onDifficultyChange={setSelectedDifficulty}
                            onCookTimeChange={setSelectedCookTime}
                            onFavoritesToggle={handleFavoritesToggle}
                            onSavedToggle={handleSavedToggle}
                            onSortByChange={setSortBy}
                            onSortOrderChange={setSortOrder}
                            onQuickFilterChange={setQuickFilter}
                            onClearFilters={clearFilters}
                            onSearch={handleSearch}
                        />
                    </CardContent>
                </Card>

                {/* Recipe Grid */}
                <RecipeGrid
                    recipes={recipes}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    isLoading={isLoading}
                    onClearFilters={clearFilters}
                />
            </div>
        </PageTransitionScale>
    );
}; 