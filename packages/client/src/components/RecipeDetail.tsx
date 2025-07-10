import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Clock,
    Users,
    ChefHat,
    ArrowLeft,
    Edit,
    Trash2,
    Heart,
    Star,
    Share2
} from 'lucide-react';
import { apiClient } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export const RecipeDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [isLiked, setIsLiked] = useState(false);

    // Fetch recipe details
    const { data: recipe, isLoading, error } = useQuery({
        queryKey: ['recipe', id],
        queryFn: () => apiClient.getRecipe(id!),
        enabled: !!id,
    });

    // Delete recipe mutation
    const deleteMutation = useMutation({
        mutationFn: (recipeId: string) => apiClient.deleteRecipe(recipeId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
            navigate('/recipes');
        },
    });

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this recipe?')) {
            deleteMutation.mutate(id!);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" role="status">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" data-testid="loading-spinner"></div>
            </div>
        );
    }

    if (error || !recipe) {
        return (
            <div className="text-center py-12">
                <div className="text-red-600 mb-4">Recipe not found</div>
                <Link to="/recipes" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Back to Recipes
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={() => navigate('/recipes')}
                    className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to Recipes
                </button>

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{recipe.title}</h1>
                        <p className="text-gray-600">By {recipe.user?.name || 'Unknown'}</p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setIsLiked(!isLiked)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-md ${isLiked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                                }`}
                            aria-label={isLiked ? 'Unlike recipe' : 'Like recipe'}
                        >
                            <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                            <span>Like</span>
                        </button>

                        <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200">
                            <Share2 className="h-5 w-5" />
                            <span>Share</span>
                        </button>

                        {user && user.id === recipe.user_id && (
                            <div className="flex space-x-2">
                                <Link
                                    to={`/recipes/${recipe.id}/edit`}
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    <Edit className="h-4 w-4" />
                                    <span>Edit Recipe</span>
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span>Delete Recipe</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recipe Image */}
            <div className="mb-8">
                {recipe.image_url ? (
                    <img
                        src={recipe.image_url}
                        alt={recipe.title}
                        className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                    />
                ) : (
                    <div className="w-full h-64 md:h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                        <ChefHat className="h-16 w-16 text-gray-400" />
                    </div>
                )}
            </div>

            {/* Recipe Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Recipe Info</h3>
                        <div className="flex items-center text-yellow-500">
                            <Star className="h-5 w-5 fill-current" />
                            <span className="ml-1 text-sm font-medium">4.5</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center text-gray-600">
                                <Clock className="h-4 w-4 mr-2" />
                                <span className="text-sm">Cook Time</span>
                            </div>
                            <span className="text-sm font-medium">{recipe.cook_time || 'N/A'} {recipe.cook_time ? 'minutes' : ''}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center text-gray-600">
                                <Users className="h-4 w-4 mr-2" />
                                <span className="text-sm">Servings</span>
                            </div>
                            <span className="text-sm font-medium">{recipe.servings || 'N/A'} {recipe.servings ? 'servings' : ''}</span>
                        </div>

                        {recipe.difficulty && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Difficulty</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                    recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                    {recipe.difficulty}
                                </span>
                            </div>
                        )}

                        {recipe.category && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Category</span>
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                    {recipe.category}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Ingredients */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingredients</h3>
                    <div className="space-y-2">
                        {recipe.ingredients?.split('\n').map((ingredient, index) => (
                            <div key={index} className="flex items-start">
                                <span className="text-blue-600 mr-2">•</span>
                                <span className="text-sm text-gray-700">{ingredient}</span>
                            </div>
                        )) || <p className="text-gray-500 text-sm">No ingredients listed</p>}
                    </div>
                </div>

                {/* Tags */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                        {recipe.tags?.split(',').map((tag, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                            >
                                {tag.trim()}
                            </span>
                        )) || <p className="text-gray-500 text-sm">No tags</p>}
                    </div>
                </div>
            </div>

            {/* Instructions */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructions</h3>
                <div className="prose max-w-none">
                    {recipe.instructions?.split('\n').map((step, index) => (
                        <div key={index} className="mb-4">
                            <div className="flex items-start">
                                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-4">
                                    {index + 1}
                                </span>
                                <p className="text-gray-700">{step}</p>
                            </div>
                        </div>
                    )) || <p className="text-gray-500">No instructions provided</p>}
                </div>
            </div>

            {/* Related Recipes */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">You might also like</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Placeholder for related recipes */}
                    <div className="bg-gray-100 rounded-lg p-4 text-center">
                        <ChefHat className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">More recipes coming soon!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}; 