import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
    tags: string[];
    createdAt: string;
    updatedAt: string;
    userId: string;
}

export const RecipeDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        if (!id) {
            setError('Recipe ID is required');
            setLoading(false);
            return;
        }

        const fetchRecipe = async () => {
            try {
                setLoading(true);
                setError('');
                const response = await apiClient.get<{ message: string; recipe: Recipe }>(`/api/recipes/${id}`);
                setRecipe(response.recipe);
            } catch (err) {
                setError('Failed to load recipe. Please try again.');
                console.error('Error fetching recipe:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id]);

    const handleDelete = async () => {
        if (!recipe || !window.confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
            return;
        }

        try {
            setDeleteLoading(true);
            await apiClient.delete(`/api/recipes/${recipe.id}`);
            navigate('/recipes', {
                state: { message: 'Recipe deleted successfully' }
            });
        } catch (err) {
            setError('Failed to delete recipe. Please try again.');
            console.error('Error deleting recipe:', err);
        } finally {
            setDeleteLoading(false);
        }
    };

    const getDifficultyColor = (difficulty?: string) => {
        switch (difficulty) {
            case 'easy': return 'bg-green-100 text-green-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'hard': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatTime = (minutes: number) => {
        if (minutes < 60) {
            return `${minutes} min`;
        }
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading recipe...</p>
                </div>
            </div>
        );
    }

    if (error || !recipe) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="card p-8 max-w-md mx-auto text-center">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Recipe Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || 'The recipe you are looking for does not exist.'}</p>
                    <div className="space-x-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="btn-secondary"
                        >
                            Go Back
                        </button>
                        <Link to="/recipes" className="btn-primary">
                            Browse Recipes
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const isOwner = user?.id === recipe.userId;
    const totalTime = recipe.prepTime + recipe.cookTime;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <nav className="flex items-center space-x-2 text-sm">
                            <Link to="/recipes" className="text-primary-600 hover:text-primary-700">
                                Recipes
                            </Link>
                            <span className="text-gray-400">/</span>
                            <span className="text-gray-600 truncate max-w-xs">
                                {recipe.title}
                            </span>
                        </nav>
                        {isOwner && (
                            <div className="flex space-x-3">
                                <Link
                                    to={`/recipes/${recipe.id}/edit`}
                                    className="btn-secondary"
                                >
                                    Edit Recipe
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleteLoading}
                                    className="btn-danger disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {deleteLoading ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recipe Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Recipe Header */}
                        <div className="card p-6">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                {recipe.title}
                            </h1>

                            {recipe.description && (
                                <p className="text-gray-600 text-lg mb-6">
                                    {recipe.description}
                                </p>
                            )}

                            {/* Tags */}
                            {recipe.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {recipe.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Recipe Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-primary-600">
                                        {recipe.servings}
                                    </div>
                                    <div className="text-sm text-gray-600">Servings</div>
                                </div>
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-primary-600">
                                        {formatTime(recipe.prepTime)}
                                    </div>
                                    <div className="text-sm text-gray-600">Prep Time</div>
                                </div>
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-primary-600">
                                        {formatTime(recipe.cookTime)}
                                    </div>
                                    <div className="text-sm text-gray-600">Cook Time</div>
                                </div>
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-primary-600">
                                        {formatTime(totalTime)}
                                    </div>
                                    <div className="text-sm text-gray-600">Total Time</div>
                                </div>
                            </div>

                            {/* Difficulty and Cuisine */}
                            <div className="flex flex-wrap gap-4">
                                {recipe.difficulty && (
                                    <div className="flex items-center">
                                        <span className="text-sm text-gray-600 mr-2">Difficulty:</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                                            {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
                                        </span>
                                    </div>
                                )}
                                {recipe.cuisineType && (
                                    <div className="flex items-center">
                                        <span className="text-sm text-gray-600 mr-2">Cuisine:</span>
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                            {recipe.cuisineType}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="card p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Instructions</h2>
                            <div className="space-y-4">
                                {recipe.steps
                                    .sort((a, b) => a.stepNumber - b.stepNumber)
                                    .map((step, index) => (
                                        <div key={step.id || index} className="flex">
                                            <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-4">
                                                {step.stepNumber}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-gray-700 mb-2">{step.instruction}</p>
                                                {(step.timeMinutes || step.temperature) && (
                                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                                        {step.timeMinutes && (
                                                            <span>⏱️ {formatTime(step.timeMinutes)}</span>
                                                        )}
                                                        {step.temperature && (
                                                            <span>🌡️ {step.temperature}</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Ingredients */}
                        <div className="card p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Ingredients</h2>
                            <div className="space-y-3">
                                {recipe.ingredients
                                    .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
                                    .map((ingredient, index) => (
                                        <div key={ingredient.id || index} className="flex items-start">
                                            <div className="flex-shrink-0 w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3"></div>
                                            <div className="flex-1">
                                                <div className="flex items-baseline">
                                                    {ingredient.amount && (
                                                        <span className="font-medium text-primary-600 mr-2">
                                                            {ingredient.amount}
                                                        </span>
                                                    )}
                                                    {ingredient.unit && (
                                                        <span className="text-sm text-gray-500 mr-2">
                                                            {ingredient.unit}
                                                        </span>
                                                    )}
                                                    <span className="text-gray-700">
                                                        {ingredient.name}
                                                    </span>
                                                </div>
                                                {ingredient.notes && (
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {ingredient.notes}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        {/* Recipe Info */}
                        <div className="card p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recipe Info</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Created:</span>
                                    <span className="text-gray-900">
                                        {new Date(recipe.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Updated:</span>
                                    <span className="text-gray-900">
                                        {new Date(recipe.updatedAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Recipe ID:</span>
                                    <span className="text-gray-400 font-mono text-xs">
                                        {recipe.id.slice(0, 8)}...
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 