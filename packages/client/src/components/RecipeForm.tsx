import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../services/api';
import { useAuth } from '../hooks/useAuth';

interface RecipeIngredient {
    id?: string;
    name: string;
    amount?: number;
    unit?: string;
    notes?: string;
    orderIndex?: number;
}

interface RecipeStep {
    id?: string;
    stepNumber: number;
    instruction: string;
    timeMinutes?: number;
    temperature?: string;
}

interface RecipeFormData {
    title: string;
    description?: string;
    servings: number;
    prepTime: number;
    cookTime: number;
    difficulty?: 'easy' | 'medium' | 'hard';
    cuisineType?: string;
    ingredients: RecipeIngredient[];
    steps: RecipeStep[];
}

interface Recipe extends RecipeFormData {
    id: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    userId: string;
}

const initialFormData: RecipeFormData = {
    title: '',
    description: '',
    servings: 4,
    prepTime: 15,
    cookTime: 30,
    difficulty: 'medium',
    cuisineType: '',
    ingredients: [{ name: '', unit: '', notes: '' }],
    steps: [{ stepNumber: 1, instruction: '', temperature: '' }]
};

export const RecipeForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const isEditing = !!id;

    const [formData, setFormData] = useState<RecipeFormData>(initialFormData);
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Load recipe data for editing
    useEffect(() => {
        if (isEditing && id) {
            const fetchRecipe = async () => {
                try {
                    setLoading(true);
                    const response = await apiClient.get<{ message: string; recipe: Recipe }>(`/api/recipes/${id}`);
                    const recipe = response.recipe;

                    // Check if user owns this recipe
                    if (recipe.userId !== user?.id) {
                        navigate('/recipes', {
                            state: { error: 'You can only edit your own recipes' }
                        });
                        return;
                    }

                    setFormData({
                        title: recipe.title,
                        description: recipe.description || '',
                        servings: recipe.servings,
                        prepTime: recipe.prepTime,
                        cookTime: recipe.cookTime,
                        difficulty: recipe.difficulty || 'medium',
                        cuisineType: recipe.cuisineType || '',
                        ingredients: recipe.ingredients.length > 0 ? recipe.ingredients : [{ name: '', unit: '', notes: '' }],
                        steps: recipe.steps.length > 0 ? recipe.steps : [{ stepNumber: 1, instruction: '', temperature: '' }]
                    });
                } catch (err) {
                    setError('Failed to load recipe. Please try again.');
                    console.error('Error fetching recipe:', err);
                } finally {
                    setLoading(false);
                }
            };

            fetchRecipe();
        }
    }, [id, isEditing, user?.id, navigate]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Recipe title is required';
        }

        if (formData.servings <= 0) {
            newErrors.servings = 'Servings must be greater than 0';
        }

        if (formData.prepTime <= 0) {
            newErrors.prepTime = 'Prep time must be greater than 0';
        }

        if (formData.cookTime <= 0) {
            newErrors.cookTime = 'Cook time must be greater than 0';
        }

        // Validate ingredients
        const validIngredients = formData.ingredients.filter(ing => ing.name.trim());
        if (validIngredients.length === 0) {
            newErrors.ingredients = 'At least one ingredient is required';
        }

        // Validate steps
        const validSteps = formData.steps.filter(step => step.instruction.trim());
        if (validSteps.length === 0) {
            newErrors.steps = 'At least one instruction step is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setSubmitLoading(true);
            setError('');

            // Filter out empty ingredients and steps
            const cleanedData = {
                ...formData,
                ingredients: formData.ingredients
                    .filter(ing => ing.name.trim())
                    .map((ing, index) => ({
                        ...ing,
                        orderIndex: index
                    })),
                steps: formData.steps
                    .filter(step => step.instruction.trim())
                    .map((step, index) => ({
                        ...step,
                        stepNumber: index + 1
                    }))
            };

            if (isEditing) {
                await apiClient.put(`/api/recipes/${id}`, cleanedData);
                navigate(`/recipes/${id}`, {
                    state: { message: 'Recipe updated successfully' }
                });
            } else {
                const response = await apiClient.post<{ message: string; recipe: Recipe }>('/api/recipes', cleanedData);
                navigate(`/recipes/${response.recipe.id}`, {
                    state: { message: 'Recipe created successfully' }
                });
            }
        } catch (err) {
            setError('Failed to save recipe. Please try again.');
            console.error('Error saving recipe:', err);
        } finally {
            setSubmitLoading(false);
        }
    };

    const updateFormData = (field: keyof RecipeFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const addIngredient = () => {
        setFormData(prev => ({
            ...prev,
            ingredients: [...prev.ingredients, { name: '', unit: '', notes: '' }]
        }));
    };

    const removeIngredient = (index: number) => {
        setFormData(prev => ({
            ...prev,
            ingredients: prev.ingredients.filter((_, i) => i !== index)
        }));
    };

    const updateIngredient = (index: number, field: keyof RecipeIngredient, value: any) => {
        setFormData(prev => ({
            ...prev,
            ingredients: prev.ingredients.map((ing, i) =>
                i === index ? { ...ing, [field]: value } : ing
            )
        }));
    };

    const addStep = () => {
        setFormData(prev => ({
            ...prev,
            steps: [...prev.steps, {
                stepNumber: prev.steps.length + 1,
                instruction: '',
                temperature: ''
            }]
        }));
    };

    const removeStep = (index: number) => {
        setFormData(prev => ({
            ...prev,
            steps: prev.steps.filter((_, i) => i !== index).map((step, i) => ({
                ...step,
                stepNumber: i + 1
            }))
        }));
    };

    const updateStep = (index: number, field: keyof RecipeStep, value: any) => {
        setFormData(prev => ({
            ...prev,
            steps: prev.steps.map((step, i) =>
                i === index ? { ...step, [field]: value } : step
            )
        }));
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
                            <span className="text-gray-600">
                                {isEditing ? 'Edit Recipe' : 'New Recipe'}
                            </span>
                        </nav>
                        <Link to="/recipes" className="btn-secondary">
                            Cancel
                        </Link>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <div className="card p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                    Recipe Title *
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => updateFormData('title', e.target.value)}
                                    className={`input-field ${errors.title ? 'border-red-500' : ''}`}
                                    placeholder="Enter recipe title"
                                />
                                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => updateFormData('description', e.target.value)}
                                    className="input-field"
                                    placeholder="Brief description of the recipe"
                                />
                            </div>

                            <div>
                                <label htmlFor="servings" className="block text-sm font-medium text-gray-700 mb-2">
                                    Servings *
                                </label>
                                <input
                                    id="servings"
                                    type="number"
                                    min="1"
                                    value={formData.servings}
                                    onChange={(e) => updateFormData('servings', parseInt(e.target.value) || 1)}
                                    className={`input-field ${errors.servings ? 'border-red-500' : ''}`}
                                />
                                {errors.servings && <p className="mt-1 text-sm text-red-600">{errors.servings}</p>}
                            </div>

                            <div>
                                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                                    Difficulty
                                </label>
                                <select
                                    id="difficulty"
                                    value={formData.difficulty || ''}
                                    onChange={(e) => updateFormData('difficulty', e.target.value as 'easy' | 'medium' | 'hard')}
                                    className="input-field"
                                >
                                    <option value="">Select difficulty</option>
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="prepTime" className="block text-sm font-medium text-gray-700 mb-2">
                                    Prep Time (minutes) *
                                </label>
                                <input
                                    id="prepTime"
                                    type="number"
                                    min="1"
                                    value={formData.prepTime}
                                    onChange={(e) => updateFormData('prepTime', parseInt(e.target.value) || 1)}
                                    className={`input-field ${errors.prepTime ? 'border-red-500' : ''}`}
                                />
                                {errors.prepTime && <p className="mt-1 text-sm text-red-600">{errors.prepTime}</p>}
                            </div>

                            <div>
                                <label htmlFor="cookTime" className="block text-sm font-medium text-gray-700 mb-2">
                                    Cook Time (minutes) *
                                </label>
                                <input
                                    id="cookTime"
                                    type="number"
                                    min="1"
                                    value={formData.cookTime}
                                    onChange={(e) => updateFormData('cookTime', parseInt(e.target.value) || 1)}
                                    className={`input-field ${errors.cookTime ? 'border-red-500' : ''}`}
                                />
                                {errors.cookTime && <p className="mt-1 text-sm text-red-600">{errors.cookTime}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="cuisineType" className="block text-sm font-medium text-gray-700 mb-2">
                                    Cuisine Type
                                </label>
                                <input
                                    id="cuisineType"
                                    type="text"
                                    value={formData.cuisineType}
                                    onChange={(e) => updateFormData('cuisineType', e.target.value)}
                                    className="input-field"
                                    placeholder="e.g., Italian, Mexican, Asian"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Ingredients */}
                    <div className="card p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Ingredients</h2>
                            <button
                                type="button"
                                onClick={addIngredient}
                                className="btn-primary"
                            >
                                Add Ingredient
                            </button>
                        </div>

                        {errors.ingredients && <p className="mb-4 text-sm text-red-600">{errors.ingredients}</p>}

                        <div className="space-y-4">
                            {formData.ingredients.map((ingredient, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                                    <div className="md:col-span-4">
                                        <input
                                            type="text"
                                            value={ingredient.name}
                                            onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                                            className="input-field"
                                            placeholder="Ingredient name"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={ingredient.amount || ''}
                                            onChange={(e) => updateIngredient(index, 'amount', parseFloat(e.target.value) || undefined)}
                                            className="input-field"
                                            placeholder="Amount"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <input
                                            type="text"
                                            value={ingredient.unit || ''}
                                            onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                                            className="input-field"
                                            placeholder="Unit"
                                        />
                                    </div>
                                    <div className="md:col-span-3">
                                        <input
                                            type="text"
                                            value={ingredient.notes || ''}
                                            onChange={(e) => updateIngredient(index, 'notes', e.target.value)}
                                            className="input-field"
                                            placeholder="Notes (optional)"
                                        />
                                    </div>
                                    <div className="md:col-span-1">
                                        {formData.ingredients.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeIngredient(index)}
                                                className="w-full h-10 text-red-600 hover:text-red-800 font-medium"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="card p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Instructions</h2>
                            <button
                                type="button"
                                onClick={addStep}
                                className="btn-primary"
                            >
                                Add Step
                            </button>
                        </div>

                        {errors.steps && <p className="mb-4 text-sm text-red-600">{errors.steps}</p>}

                        <div className="space-y-6">
                            {formData.steps.map((step, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-medium text-gray-900">Step {index + 1}</h3>
                                        {formData.steps.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeStep(index)}
                                                className="text-red-600 hover:text-red-800 font-medium"
                                            >
                                                Remove Step
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="md:col-span-3">
                                            <textarea
                                                rows={3}
                                                value={step.instruction}
                                                onChange={(e) => updateStep(index, 'instruction', e.target.value)}
                                                className="input-field"
                                                placeholder="Describe this step in detail..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Time (minutes)
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={step.timeMinutes || ''}
                                                onChange={(e) => updateStep(index, 'timeMinutes', parseInt(e.target.value) || undefined)}
                                                className="input-field"
                                                placeholder="Optional"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Temperature
                                            </label>
                                            <input
                                                type="text"
                                                value={step.temperature || ''}
                                                onChange={(e) => updateStep(index, 'temperature', e.target.value)}
                                                className="input-field"
                                                placeholder="e.g., 350°F"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="card p-6">
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        <div className="flex justify-end space-x-4">
                            <Link to="/recipes" className="btn-secondary">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={submitLoading}
                                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitLoading
                                    ? (isEditing ? 'Updating...' : 'Creating...')
                                    : (isEditing ? 'Update Recipe' : 'Create Recipe')
                                }
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}; 