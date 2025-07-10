import React, { useState, useEffect, memo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    Search,
    Filter,
    Grid,
    List as ListIcon,
    Plus,
    Heart,
    Clock,
    Star,
    Eye,
    Users,
    ChefHat,
} from 'lucide-react';
import { Recipe } from '@recipe-manager/shared';
import { apiClient } from '../services/api';

// Custom hook for debounced search
const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

// Extract RecipeCard component for better performance
const RecipeCard = memo(({ recipe }: { recipe: Recipe }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative">
            {recipe.image_url ? (
                <img
                    src={recipe.image_url}
                    alt={recipe.title}
                    className="w-full h-48 object-cover"
                />
            ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <ChefHat className="h-12 w-12 text-gray-400" />
                </div>
            )}
            <div className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md">
                <Heart className="h-4 w-4 text-gray-400" />
            </div>
        </div>

        <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                <Link to={`/recipes/${recipe.id}`} className="hover:text-blue-600">
                    {recipe.title}
                </Link>
            </h3>

            <div className="flex items-center text-sm text-gray-500 mb-3">
                <Users className="h-4 w-4 mr-1" />
                <span>By {recipe.user?.name || 'Unknown'}</span>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{recipe.cook_time || 'N/A'} mins</span>
                </div>
                <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    <span>4.5</span>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    {recipe.difficulty && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                            recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                            }`}>
                            {recipe.difficulty}
                        </span>
                    )}
                    {recipe.category && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {recipe.category}
                        </span>
                    )}
                </div>
                <div className="flex items-center text-gray-400">
                    <Eye className="h-4 w-4 mr-1" />
                    <span className="text-xs">125</span>
                </div>
            </div>
        </div>
    </div>
));

// Extract RecipeListItem component for better performance
const RecipeListItem = memo(({ recipe }: { recipe: Recipe }) => (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
                {recipe.image_url ? (
                    <img
                        src={recipe.image_url}
                        alt={recipe.title}
                        className="w-20 h-20 object-cover rounded-lg"
                    />
                ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                        <ChefHat className="h-8 w-8 text-gray-400" />
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    <Link to={`/recipes/${recipe.id}`} className="hover:text-blue-600">
                        {recipe.title}
                    </Link>
                </h3>

                <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Users className="h-4 w-4 mr-1" />
                    <span>By {recipe.user?.name || 'Unknown'}</span>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {recipe.instructions.substring(0, 150)}...
                </p>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{recipe.cook_time || 'N/A'} mins</span>
                        </div>
                        <div className="flex items-center">
                            <Star className="h-4 w-4 mr-1" />
                            <span>4.5</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        {recipe.difficulty && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                {recipe.difficulty}
                            </span>
                        )}
                        {recipe.category && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                {recipe.category}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
));

// Add display names for better debugging
RecipeCard.displayName = 'RecipeCard';
RecipeListItem.displayName = 'RecipeListItem';

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
                sortBy: sortBy as any,
                sortOrder
            };

            if (debouncedSearchTerm) params.search = debouncedSearchTerm;
            if (selectedCategory) params.category = selectedCategory;
            if (selectedDifficulty) params.difficulty = selectedDifficulty as 'Easy' | 'Medium' | 'Hard';

            return apiClient.getRecipes(params);
        },
    });

    // Fetch categories for filter dropdown
    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: apiClient.getRecipeCategories,
    });

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        if (searchTerm) params.set('search', searchTerm);
        if (selectedCategory) params.set('category', selectedCategory);
        if (selectedDifficulty) params.set('difficulty', selectedDifficulty);
        if (sortBy !== 'created_at') params.set('sortBy', sortBy);
        if (sortOrder !== 'desc') params.set('sortOrder', sortOrder);
        if (currentPage !== 1) params.set('page', currentPage.toString());

        setSearchParams(params);
    }, [searchTerm, selectedCategory, selectedDifficulty, sortBy, sortOrder, currentPage, setSearchParams]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setSelectedDifficulty('');
        setSortBy('created_at');
        setSortOrder('desc');
        setCurrentPage(1);
    };

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-red-600 mb-4">Error loading recipes</div>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Recipes</h1>
                    <p className="text-gray-600 mt-1">
                        {recipesData?.pagination.totalCount || 0} recipes found
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                            aria-label="Grid view"
                            aria-pressed={viewMode === 'grid'}
                        >
                            <Grid className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                            aria-label="List view"
                            aria-pressed={viewMode === 'list'}
                        >
                            <ListIcon className="h-5 w-5" />
                        </button>
                    </div>
                    <Link
                        to="/recipes/new"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Recipe
                    </Link>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow p-6">
                <form onSubmit={handleSearch} className="mb-4">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search recipes..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                        >
                            Search
                        </button>
                    </div>
                </form>

                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">Filters:</span>
                    </div>

                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Categories</option>
                        {categories?.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>

                    <select
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Difficulties</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>

                    <select
                        value={`${sortBy}_${sortOrder}`}
                        onChange={(e) => {
                            const [field, order] = e.target.value.split('_');
                            setSortBy(field || 'created_at');
                            setSortOrder(order as 'asc' | 'desc');
                        }}
                        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="created_at_desc">Newest First</option>
                        <option value="created_at_asc">Oldest First</option>
                        <option value="title_asc">Title A-Z</option>
                        <option value="title_desc">Title Z-A</option>
                        <option value="cook_time_asc">Cook Time (Low to High)</option>
                        <option value="cook_time_desc">Cook Time (High to Low)</option>
                    </select>

                    <button
                        onClick={clearFilters}
                        className="text-sm text-gray-600 hover:text-gray-800"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Recipe List */}
            {isLoading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading recipes...</p>
                </div>
            ) : recipesData?.data?.length ? (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                    {recipesData.data.map((recipe) => (
                        viewMode === 'grid' ? (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ) : (
                            <RecipeListItem key={recipe.id} recipe={recipe} />
                        )
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No recipes found</p>
                    <Link
                        to="/recipes/new"
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                    >
                        Create Your First Recipe
                    </Link>
                </div>
            )}

            {/* Pagination */}
            {recipesData?.pagination && recipesData.pagination.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4">
                    <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
                    >
                        Previous
                    </button>

                    <div className="flex space-x-2">
                        {Array.from({ length: Math.min(5, recipesData.pagination.totalPages) }, (_, i) => {
                            const pageNumber = i + 1;
                            return (
                                <button
                                    key={pageNumber}
                                    onClick={() => setCurrentPage(pageNumber)}
                                    className={`px-3 py-1 rounded-md ${currentPage === pageNumber
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    {pageNumber}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => setCurrentPage(Math.min(recipesData.pagination.totalPages, currentPage + 1))}
                        disabled={currentPage === recipesData.pagination.totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}; 