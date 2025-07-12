import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, ChefHat, Star, Save, X, Sparkles, BookOpen, Image } from 'lucide-react';
import { useAuth } from '../../../../hooks/useAuth';
import { recipeService } from '../../../../services';
import { uploadService } from '../../../../services/upload';
import { RecipeImageUpload } from '../../recipes/RecipeForm/RecipeImageUpload';
import { useTheme } from '../../../../contexts/ThemeContext';
import { getThemeColors } from '../../../../utils/theme';
import { cn } from '../../../../utils/cn';

export const ModernCreateTab: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const themeColors = getThemeColors(theme.color);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        ingredients: '',
        instructions: '',
        category: '',
        difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
        cook_time: '',
        servings: '',
        image: null as File | null,
        tags: ''
    });

    // Image preview state
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Fetch categories for dropdown
    const { data: categories = [] } = useQuery({
        queryKey: ['recipe-categories'],
        queryFn: () => recipeService.getRecipeCategories(),
        staleTime: 5 * 60 * 1000,
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                setFormData(prev => ({ ...prev, image: file }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        setFormData(prev => ({ ...prev, image: null }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsSubmitting(true);
        try {
            // Upload image first if present
            let imageUrl: string | undefined;
            if (formData.image) {
                setIsUploadingImage(true);
                try {
                    const uploadResponse = await uploadService.uploadImage(formData.image);
                    imageUrl = uploadResponse.data?.url;
                } catch (error) {
                    console.error('Image upload error:', error);
                    throw new Error('Failed to upload image. Please try again.');
                } finally {
                    setIsUploadingImage(false);
                }
            }

            const recipeData = {
                title: formData.title,
                ingredients: formData.ingredients,
                instructions: formData.instructions,
                category: formData.category,
                difficulty: formData.difficulty,
                cook_time: formData.cook_time ? parseInt(formData.cook_time) : undefined,
                servings: formData.servings ? parseInt(formData.servings) : undefined,
                tags: formData.tags,
                image_url: imageUrl
            };

            const response = await recipeService.createRecipe(recipeData);
            navigate(`/recipes/${response.id}`);
        } catch (error) {
            console.error('Error creating recipe:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const clearForm = () => {
        setFormData({
            title: '',
            ingredients: '',
            instructions: '',
            category: '',
            difficulty: 'Easy',
            cook_time: '',
            servings: '',
            image: null,
            tags: ''
        });
        setImagePreview(null);
    };

    const isFormValid = formData.title.trim() && formData.ingredients.trim() && formData.instructions.trim();

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-2xl p-8 overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Plus className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Create Recipe
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300">
                                Share your culinary masterpiece with the world
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
                            <ChefHat className={cn(
                                "w-5 h-5",
                                `${themeColors.primary} dark:${themeColors.primary.replace('600', '400')}`
                            )} />
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    Easy Creation
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Simple form process</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
                            <BookOpen className={cn(
                                "w-5 h-5",
                                `${themeColors.secondary} dark:${themeColors.secondary.replace('600', '400')}`
                            )} />
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    Rich Details
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Photos, tags, and more</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
                            <Sparkles className={cn(
                                "w-5 h-5",
                                `${themeColors.secondary} dark:${themeColors.secondary.replace('600', '400')}`
                            )} />
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    Instant Sharing
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Share immediately</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className={cn(
                    "absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl",
                    `bg-gradient-to-br ${themeColors.primary.replace('600', '400/20')} ${themeColors.secondary.replace('600', '600/20')}`
                )}></div>
                <div className={cn(
                    "absolute bottom-0 left-0 w-24 h-24 rounded-full blur-2xl",
                    `bg-gradient-to-br ${themeColors.secondary.replace('600', '400/20')} ${themeColors.primary.replace('600', '600/20')}`
                )}></div>
            </div>

            {/* Recipe Form */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                            <ChefHat className={cn(
                                "w-5 h-5",
                                `${themeColors.primary} dark:${themeColors.primary.replace('600', '400')}`
                            )} />
                            <span>Basic Information</span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Recipe Title *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    placeholder="Enter your recipe title..."
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Category
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => handleInputChange('category', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category: string) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Difficulty
                                </label>
                                <select
                                    value={formData.difficulty}
                                    onChange={(e) => handleInputChange('difficulty', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent"
                                >
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Cook Time (minutes)
                                </label>
                                <input
                                    type="number"
                                    value={formData.cook_time}
                                    onChange={(e) => handleInputChange('cook_time', e.target.value)}
                                    placeholder="30"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Servings
                                </label>
                                <input
                                    type="number"
                                    value={formData.servings}
                                    onChange={(e) => handleInputChange('servings', e.target.value)}
                                    placeholder="4"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent"
                                />
                            </div>

                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Tags (comma-separated)
                            </label>
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={(e) => handleInputChange('tags', e.target.value)}
                                placeholder="vegetarian, healthy, quick"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Image Upload Section */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center",
                                `bg-gradient-to-br ${themeColors.primary} ${themeColors.secondary}`
                            )}>
                                <Image className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Recipe Image
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Add a beautiful photo to showcase your recipe
                                </p>
                            </div>
                        </div>
                        <RecipeImageUpload
                            imagePreview={imagePreview}
                            onImageChange={handleImageChange}
                            onRemoveImage={removeImage}
                        />
                    </div>

                    {/* Ingredients */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                            <Star className={cn(
                                "w-5 h-5",
                                `${themeColors.primary} dark:${themeColors.primary.replace('600', '400')}`
                            )} />
                            <span>Ingredients</span>
                        </h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Ingredients List *
                            </label>
                            <textarea
                                value={formData.ingredients}
                                onChange={(e) => handleInputChange('ingredients', e.target.value)}
                                placeholder="1 cup flour&#10;2 eggs&#10;1/2 cup milk&#10;..."
                                rows={8}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent"
                                required
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Enter each ingredient on a new line
                            </p>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                            <BookOpen className={cn(
                                "w-5 h-5",
                                `${themeColors.primary} dark:${themeColors.primary.replace('600', '400')}`
                            )} />
                            <span>Instructions</span>
                        </h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Cooking Instructions *
                            </label>
                            <textarea
                                value={formData.instructions}
                                onChange={(e) => handleInputChange('instructions', e.target.value)}
                                placeholder="1. Preheat oven to 350°F&#10;2. Mix dry ingredients in a bowl&#10;3. Add wet ingredients and stir&#10;..."
                                rows={10}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent"
                                required
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Enter each step on a new line
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={clearForm}
                            className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                        >
                            <X className="w-4 h-4" />
                            <span>Clear Form</span>
                        </button>

                        <div className="flex items-center space-x-3">
                            <button
                                type="button"
                                onClick={() => navigate('/app?tab=my-recipes')}
                                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!isFormValid || isSubmitting || isUploadingImage}
                                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
                            >
                                {isSubmitting || isUploadingImage ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>{isUploadingImage ? 'Uploading...' : 'Creating...'}</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        <span>Create Recipe</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}; 