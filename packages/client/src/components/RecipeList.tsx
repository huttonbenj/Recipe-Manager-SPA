import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../services/api';

interface Recipe {
    id: string;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    prepTime: number;
    cookTime: number;
    servings: number;
    cuisineType: string;
    imageUrl?: string;
    createdAt: string;
}

interface RecipeListProps {
    showMyRecipes?: boolean;
}

export const RecipeList: React.FC<RecipeListProps> = ({ showMyRecipes = false }) => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState('');
    const [cuisineFilter, setCuisineFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const fetchRecipes = useCallback(async () => {
        try {
            setLoading(true);
            setError('');

            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: '12',
                ...(searchTerm && { search: searchTerm }),
                ...(difficultyFilter && { difficulty: difficultyFilter }),
                ...(cuisineFilter && { cuisineType: cuisineFilter })
            });

            const endpoint = showMyRecipes ? '/api/recipes/my' : '/api/recipes';
            const response = await apiClient.get<{
                recipes: Recipe[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    totalPages: number;
                };
            }>(`${endpoint}?${params}`);

            setRecipes(response.recipes);
            setTotalPages(response.pagination.totalPages);
            setTotalCount(response.pagination.total);
        } catch (err) {
            setError('Failed to load recipes. Please try again.');
            console.error('Error fetching recipes:', err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchTerm, difficultyFilter, cuisineFilter, showMyRecipes]);

    useEffect(() => {
        fetchRecipes();
    }, [fetchRecipes]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchRecipes();
    };

    const clearFilters = () => {
        setSearchTerm('');
        setDifficultyFilter('');
        setCuisineFilter('');
        setCurrentPage(1);
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return 'bg-green-100 text-green-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'hard': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading recipes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {showMyRecipes ? 'My Recipes' : 'All Recipes'}
                            </h1>
                            <p className="mt-1 text-sm text-gray-600">
                                {totalCount} recipe{totalCount !== 1 ? 's' : ''} found
                            </p>
                        </div>
                        <Link
                            to="/recipes/new"
                            className="btn-primary"
                        >
                            Add New Recipe
                        </Link>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="card p-6 mb-6">
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-2">
                                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                                    Search recipes
                                </label>
                                <input
                                    id="search"
                                    type="text"
                                    placeholder="Search by title or ingredients..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                                    Difficulty
                                </label>
                                <select
                                    id="difficulty"
                                    value={difficultyFilter}
                                    onChange={(e) => setDifficultyFilter(e.target.value)}
                                    className="input-field"
                                >
                                    <option value="">All difficulties</option>
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700 mb-2">
                                    Cuisine
                                </label>
                                <select
                                    id="cuisine"
                                    value={cuisineFilter}
                                    onChange={(e) => setCuisineFilter(e.target.value)}
                                    className="input-field"
                                >
                                    <option value="">All cuisines</option>
                                    <option value="Italian">Italian</option>
                                    <option value="Mexican">Mexican</option>
                                    <option value="Asian">Asian</option>
                                    <option value="American">American</option>
                                    <option value="Indian">Indian</option>
                                    <option value="Thai">Thai</option>
                                    <option value="Greek">Greek</option>
                                    <option value="Japanese">Japanese</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button type="submit" className="btn-primary">
                                Search
                            </button>
                            <button type="button" onClick={clearFilters} className="btn-secondary">
                                Clear Filters
                            </button>
                        </div>
                    </form>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="card p-4 mb-6 bg-red-50 border border-red-200">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {/* Recipe Grid */}
                {recipes.length === 0 && !loading ? (
                    <div className="card p-12 text-center">
                        <p className="text-gray-500 text-lg">No recipes found.</p>
                        <p className="text-gray-400 mt-2">Try adjusting your search criteria or add a new recipe.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {recipes.map((recipe) => (
                            <Link
                                key={recipe.id}
                                to={`/recipes/${recipe.id}`}
                                className="card hover:shadow-lg transition-shadow duration-200"
                            >
                                <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-t-lg overflow-hidden">
                                    {recipe.imageUrl ? (
                                        <img
                                            src={recipe.imageUrl}
                                            alt={recipe.title}
                                            className="w-full h-48 object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
                                            <span className="text-gray-500">No image</span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-4">
                                    <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                                        {recipe.title}
                                    </h3>

                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                        {recipe.description}
                                    </p>

                                    <div className="flex items-center justify-between mb-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                                            {recipe.difficulty}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {recipe.cuisineType}
                                        </span>
                                    </div>

                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>⏱️ {recipe.prepTime + recipe.cookTime} min</span>
                                        <span>👥 {recipe.servings} servings</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                        <nav className="flex items-center space-x-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>

                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${currentPage === i + 1
                                        ? 'bg-primary-600 text-white'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
}; 