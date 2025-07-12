import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search as SearchIcon, Filter, Sparkles, ChefHat, Heart, Clock } from 'lucide-react';
import { Recipe } from '@recipe-manager/shared';
import { apiClient } from '../../../../services/api';
import { useDebounce } from '../../../../hooks';
import { parseSearchQuery } from '../../../../utils/searchParser';
import { Button, Card, CardContent } from '../../../ui';
import { RecipeFilters } from './RecipeFilters';
import { RecipeGrid } from './RecipeGrid';
import { PageTransitionScale } from '../../../ui/PageTransition';
import { useAuth } from '../../../../hooks';

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
    const { user } = useAuth();

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
            page: currentPage,
            user_id: (isFavorites || isSaved) && user ? user.id : undefined,
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
            if ((isFavorites || isSaved) && user) params.user_id = user.id;
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

    // Handle quick filter change
    const handleQuickFilterChange = (value: string) => {
        setQuickFilter(value);
        setCurrentPage(1);
        // Update URL immediately
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set('quickFilter', value);
        } else {
            newParams.delete('quickFilter');
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
            <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-surface-100 dark:from-surface-950 dark:via-surface-900 dark:to-surface-800">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
                    {/* Enhanced Header */}
                    <div className="relative">
                        {/* Background decoration */}
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 via-accent-500/5 to-brand-500/5 rounded-3xl blur-3xl"></div>

                        <div className="relative bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm rounded-3xl border border-surface-200/50 dark:border-surface-700/50 shadow-xl p-8">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-accent-500 rounded-2xl blur-lg opacity-20"></div>
                                            <div className="relative p-4 bg-gradient-to-br from-brand-500 to-accent-500 rounded-2xl shadow-lg">
                                                <SearchIcon className="h-8 w-8 text-white" />
                                            </div>
                                        </div>
                                        <div>
                                            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-surface-900 via-surface-700 to-surface-900 dark:from-white dark:via-surface-200 dark:to-white bg-clip-text text-transparent">
                                                Recipe Collection
                                            </h1>
                                            <p className="text-lg text-surface-600 dark:text-surface-300 mt-2">
                                                {hasActiveFilters ? (
                                                    <span className="flex items-center gap-2">
                                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-sm font-medium">
                                                            <Filter className="h-3 w-3" />
                                                            Filtered
                                                        </span>
                                                        Showing <span className="font-bold text-brand-600 dark:text-brand-400">{totalRecipes}</span> results
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-2">
                                                        <Sparkles className="h-4 w-4 text-accent-500" />
                                                        Discover amazing recipes from our community • <span className="font-semibold text-accent-600 dark:text-accent-400">{totalRecipes}</span> recipes
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Recipe stats */}
                                    <div className="flex flex-wrap gap-4">
                                        <div className="flex items-center gap-2 px-4 py-2 bg-surface-100 dark:bg-surface-800 rounded-full">
                                            <ChefHat className="h-4 w-4 text-surface-600 dark:text-surface-400" />
                                            <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                                                {totalRecipes} Recipes
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 px-4 py-2 bg-surface-100 dark:bg-surface-800 rounded-full">
                                            <Heart className="h-4 w-4 text-error-500" />
                                            <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                                                Community Favorites
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 px-4 py-2 bg-surface-100 dark:bg-surface-800 rounded-full">
                                            <Clock className="h-4 w-4 text-accent-500" />
                                            <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                                                Quick & Easy
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link to="/recipes/new" className="group">
                                        <Button
                                            variant="gradient"
                                            size="lg"
                                            leftIcon={<Plus className="h-5 w-5" />}
                                            className="w-full sm:w-auto px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 group-hover:shadow-brand-500/25"
                                        >
                                            Create Recipe
                                            <Sparkles className="h-4 w-4 ml-2 group-hover:animate-pulse" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Filters Card */}
                    <div className="relative">
                        {/* Background decoration */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-purple-500/5 rounded-3xl blur-3xl"></div>

                        <Card className="relative border-2 border-dashed border-surface-300/50 dark:border-surface-600/50 hover:border-brand-300/50 dark:hover:border-brand-600/50 transition-all duration-300 hover:shadow-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm rounded-3xl overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 via-accent-500 to-purple-500"></div>
                            <CardContent className="p-8">
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
                                    onQuickFilterChange={handleQuickFilterChange}
                                    onClearFilters={clearFilters}
                                    onSearch={handleSearch}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Enhanced Recipe Grid */}
                    <div className="relative">
                        <RecipeGrid
                            recipes={recipes}
                            viewMode={viewMode}
                            onViewModeChange={setViewMode}
                            isLoading={isLoading}
                            onClearFilters={clearFilters}
                        />
                    </div>
                </div>
            </div>
        </PageTransitionScale>
    );
}; 