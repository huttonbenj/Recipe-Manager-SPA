import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../services/api';
import { useAuth } from '../hooks/useAuth';

interface Recipe {
    id: string;
    title: string;
    description?: string;
    servings: number;
    prepTime: number;
    cookTime: number;
    difficulty?: 'easy' | 'medium' | 'hard';
    cuisineType?: string;
    imageUrl?: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    ingredients: Array<{
        id?: string;
        name: string;
        amount?: number;
        unit?: string;
        notes?: string;
        orderIndex?: number;
    }>;
    steps: Array<{
        id?: string;
        stepNumber: number;
        instruction: string;
        timeMinutes?: number;
        temperature?: string;
    }>;
}

interface RecipeListResponse {
    recipes: Recipe[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800'
};

const difficultyLabels = {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard'
};

export const RecipeList: React.FC = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState<string>('');
    const [cuisineFilter, setCuisineFilter] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecipes, setTotalRecipes] = useState(0);
    const [cuisineTypes, setCuisineTypes] = useState<string[]>([]);

    const { user } = useAuth();
    const limit = 12;

    useEffect(() => {
        fetchRecipes();
    }, [currentPage, searchTerm, difficultyFilter, cuisineFilter]);

    const fetchRecipes = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: limit.toString()
            });

            if (searchTerm) params.append('search', searchTerm);
            if (difficultyFilter) params.append('difficulty', difficultyFilter);
            if (cuisineFilter) params.append('cuisineType', cuisineFilter);

            const response = await apiClient.get<RecipeListResponse>(`/recipes?${params}`);

            setRecipes(response.recipes);
            setTotalPages(response.totalPages);
            setTotalRecipes(response.total);

            // Extract unique cuisine types for filter dropdown
            const uniqueCuisines = [...new Set(response.recipes
                .map(recipe => recipe.cuisineType)
                .filter(Boolean)
            )] as string[];
            setCuisineTypes(uniqueCuisines);

        } catch (err) {
            setError('Failed to fetch recipes');
            console.error('Error fetching recipes:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchRecipes();
    };

    const handleFilterChange = (filterType: string, value: string) => {
        setCurrentPage(1);
        if (filterType === 'difficulty') {
            setDifficultyFilter(value);
        } else if (filterType === 'cuisine') {
            setCuisineFilter(value);
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setDifficultyFilter('');
        setCuisineFilter('');
        setCurrentPage(1);
    };

    const handleDeleteRecipe = async (recipeId: string) => {
        if (!window.confirm('Are you sure you want to delete this recipe?')) {
            return;
        }

        try {
            await apiClient.delete(`/recipes/${recipeId}`);
            setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
            setTotalRecipes(prev => prev - 1);
        } catch (err) {
            console.error('Error deleting recipe:', err);
            alert('Failed to delete recipe');
        }
    };

    const formatTime = (minutes: number): string => {
        if (minutes < 60) {
            return `${minutes}m`;
        }
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    };

    const getTotalTime = (prepTime: number, cookTime: number): string => {
        return formatTime(prepTime + cookTime);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading recipes...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="text-red-600 mb-4">
                            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-red-600 text-lg">{error}</p>
                        <button
                            onClick={fetchRecipes}
                            className="mt-4 btn-primary"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Recipe Collection</h1>
                            <p className="mt-2 text-gray-600">
                                {totalRecipes} {totalRecipes === 1 ? 'recipe' : 'recipes'} found
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <Link to="/recipes/new" className="btn-primary">
                                Add New Recipe
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <form onSubmit={handleSearch} className="mb-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Search recipes..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <button type="submit" className="btn-primary">
                                Search
                            </button>
                        </div>
                    </form>

                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <div className="flex flex-col sm:flex-row gap-4 flex-1">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Difficulty
                                </label>
                                <select
                                    value={difficultyFilter}
                                    onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">All Difficulties</option>
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Cuisine Type
                                </label>
                                <select
                                    value={cuisineFilter}
                                    onChange={(e) => handleFilterChange('cuisine', e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">All Cuisines</option>
                                    {cuisineTypes.map(cuisine => (
                                        <option key={cuisine} value={cuisine}>
                                            {cuisine}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {(searchTerm || difficultyFilter || cuisineFilter) && (
                            <button
                                onClick={clearFilters}
                                className="btn-secondary"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>

                {/* Recipe Grid */}
                {recipes.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <p className="text-gray-600 text-lg">No recipes found</p>
                        <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
                        <Link to="/recipes/new" className="btn-primary mt-4 inline-block">
                            Create Your First Recipe
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {recipes.map((recipe) => (
                            <div key={recipe.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                {/* Recipe Image */}
                                <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                                    {recipe.imageUrl ? (
                                        <img
                                            src={recipe.imageUrl}
                                            alt={recipe.title}
                                            className="w-full h-48 object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                            <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {/* Recipe Content */}
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
                                            {recipe.title}
                                        </h3>
                                        {recipe.difficulty && (
                                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[recipe.difficulty]}`}>
                                                {difficultyLabels[recipe.difficulty]}
                                            </span>
                                        )}
                                    </div>

                                    {recipe.description && (
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                            {recipe.description}
                                        </p>
                                    )}

                                    <div className="flex items-center text-sm text-gray-500 mb-3">
                                        <div className="flex items-center mr-4">
                                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {getTotalTime(recipe.prepTime, recipe.cookTime)}
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            {recipe.servings} servings
                                        </div>
                                    </div>

                                    {recipe.cuisineType && (
                                        <div className="mb-3">
                                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                {recipe.cuisineType}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <Link
                                            to={`/recipes/${recipe.id}`}
                                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                        >
                                            View Recipe
                                        </Link>

                                        {user?.id === recipe.userId && (
                                            <div className="flex space-x-2">
                                                <Link
                                                    to={`/recipes/${recipe.id}/edit`}
                                                    className="text-gray-600 hover:text-gray-800 text-sm"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteRecipe(recipe.id)}
                                                    className="text-red-600 hover:text-red-800 text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-center">
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-2 rounded-lg ${currentPage === page
                                        ? 'bg-blue-600 text-white'
                                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}; 