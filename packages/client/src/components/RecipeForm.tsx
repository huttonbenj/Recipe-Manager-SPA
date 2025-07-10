import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    ArrowLeft,
    ImageIcon,
    X,
    Clock,
    Users
} from 'lucide-react';
import { RecipeFormData } from '@recipe-manager/shared';
import { apiClient } from '../services/api';
import toast from 'react-hot-toast';

export const RecipeForm = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Partial<RecipeFormData>>({});

    const [formData, setFormData] = useState<RecipeFormData>({
        title: '',
        ingredients: '',
        instructions: '',
        cook_time: 30,
        servings: 4,
        difficulty: 'Medium',
        category: '',
        tags: '',
    });

    const isEditing = Boolean(id);

    // Fetch existing recipe if editing
    const { data: existingRecipe, isLoading } = useQuery({
        queryKey: ['recipe', id],
        queryFn: () => apiClient.getRecipe(id!),
        enabled: isEditing,
    });

    // Update form when editing existing recipe
    useEffect(() => {
        if (existingRecipe && isEditing) {
            setFormData({
                title: existingRecipe.title,
                ingredients: existingRecipe.ingredients,
                instructions: existingRecipe.instructions,
                cook_time: existingRecipe.cook_time || 30,
                servings: existingRecipe.servings || 4,
                difficulty: existingRecipe.difficulty || 'Medium',
                category: existingRecipe.category || '',
                tags: existingRecipe.tags || '',
            });

            if (existingRecipe.image_url) {
                setImagePreview(existingRecipe.image_url);
            }
        }
    }, [existingRecipe, isEditing]);

    // Simple validation
    const validateForm = () => {
        const newErrors: Partial<RecipeFormData> = {};

        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.ingredients.trim()) newErrors.ingredients = 'Ingredients are required';
        if (!formData.instructions.trim()) newErrors.instructions = 'Instructions are required';
        if (formData.cook_time < 1) newErrors.cook_time = 1;
        if (formData.servings < 1) newErrors.servings = 1;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Create/Update recipe mutation
    const saveRecipeMutation = useMutation({
        mutationFn: async (data: RecipeFormData) => {
            const recipeData = {
                title: data.title,
                ingredients: data.ingredients,
                instructions: data.instructions,
                cook_time: data.cook_time,
                servings: data.servings,
                difficulty: data.difficulty,
                category: data.category,
                tags: data.tags,
            };

            if (isEditing) {
                return apiClient.updateRecipe(id!, recipeData);
            } else {
                return apiClient.createRecipe(recipeData);
            }
        },
        onSuccess: (recipe) => {
            toast.success(isEditing ? 'Recipe updated!' : 'Recipe created!');
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
            navigate(`/recipes/${recipe.id}`);
        },
        onError: (error) => {
            toast.error('Failed to save recipe');
            console.error('Error saving recipe:', error);
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImagePreview(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            await saveRecipeMutation.mutateAsync(formData);
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateFormData = (field: keyof RecipeFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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

                <h1 className="text-3xl font-bold text-gray-900">
                    {isEditing ? 'Edit Recipe' : 'Create New Recipe'}
                </h1>
                <p className="text-gray-600 mt-2">
                    {isEditing ? 'Update your recipe details' : 'Share your culinary creation with the world'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Recipe Title *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => updateFormData('title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter recipe title"
                                required
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Clock className="inline h-4 w-4 mr-1" />
                                Cook Time (minutes) *
                            </label>
                            <input
                                type="number"
                                value={formData.cook_time}
                                onChange={(e) => updateFormData('cook_time', parseInt(e.target.value) || 0)}
                                min="1"
                                max="600"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="30"
                                required
                            />
                            {errors.cook_time && (
                                <p className="mt-1 text-sm text-red-600">Cook time must be at least 1 minute</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Users className="inline h-4 w-4 mr-1" />
                                Servings *
                            </label>
                            <input
                                type="number"
                                value={formData.servings}
                                onChange={(e) => updateFormData('servings', parseInt(e.target.value) || 0)}
                                min="1"
                                max="50"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="4"
                                required
                            />
                            {errors.servings && (
                                <p className="mt-1 text-sm text-red-600">Servings must be at least 1</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Difficulty
                            </label>
                            <select
                                value={formData.difficulty}
                                onChange={(e) => updateFormData('difficulty', e.target.value as 'Easy' | 'Medium' | 'Hard')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>
                            <input
                                type="text"
                                value={formData.category}
                                onChange={(e) => updateFormData('category', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Breakfast, Dinner, Dessert"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tags (comma-separated)
                            </label>
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={(e) => updateFormData('tags', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., healthy, quick, vegetarian"
                            />
                        </div>
                    </div>
                </div>

                {/* Recipe Image */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Recipe Image</h2>

                    <div className="space-y-4">
                        {imagePreview ? (
                            <div className="relative">
                                <img
                                    src={imagePreview}
                                    alt="Recipe preview"
                                    className="w-full h-64 object-cover rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 mb-4">Upload a photo of your recipe</p>
                                <label className="cursor-pointer">
                                    <span className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 inline-flex items-center">
                                        <ImageIcon className="h-4 w-4 mr-2" />
                                        Choose Image
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                {/* Ingredients */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Ingredients *</h2>

                    <div>
                        <textarea
                            value={formData.ingredients}
                            onChange={(e) => updateFormData('ingredients', e.target.value)}
                            rows={8}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter each ingredient on a new line, e.g.:&#10;2 cups flour&#10;1 tsp salt&#10;1 cup milk"
                            required
                        />
                        {errors.ingredients && (
                            <p className="mt-1 text-sm text-red-600">{errors.ingredients}</p>
                        )}
                    </div>
                </div>

                {/* Instructions */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Instructions *</h2>

                    <div>
                        <textarea
                            value={formData.instructions}
                            onChange={(e) => updateFormData('instructions', e.target.value)}
                            rows={10}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter cooking instructions step by step, e.g.:&#10;1. Preheat oven to 350°F&#10;2. Mix dry ingredients in a bowl&#10;3. Add wet ingredients and stir until combined"
                            required
                        />
                        {errors.instructions && (
                            <p className="mt-1 text-sm text-red-600">{errors.instructions}</p>
                        )}
                    </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate('/recipes')}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Saving...
                            </>
                        ) : (
                            <>
                                <ImageIcon className="h-4 w-4 mr-2" />
                                {isEditing ? 'Update Recipe' : 'Create Recipe'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}; 