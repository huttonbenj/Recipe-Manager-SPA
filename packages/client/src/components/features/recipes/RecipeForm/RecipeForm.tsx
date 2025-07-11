import React from 'react';
import { RecipeFormHeader } from './RecipeFormHeader';
import { RecipeBasicInfo } from './RecipeBasicInfo';
import { RecipeImageUpload } from './RecipeImageUpload';
import { RecipeIngredients } from './RecipeIngredients';
import { RecipeInstructions } from './RecipeInstructions';
import { RecipeFormActions } from './RecipeFormActions';
import { useRecipeForm } from '../../../../hooks';
import { ChefHat, Sparkles } from 'lucide-react';

export const RecipeForm: React.FC = () => {
    const {
        formData,
        errors,
        imagePreview,
        isSubmitting,
        isEditing,
        isLoading,
        updateFormData,
        handleImageChange,
        removeImage,
        handleSubmit,
        handleCancel,
    } = useRecipeForm();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-brand-50/30 to-accent-50/30 dark:from-surface-900 dark:to-surface-950 flex items-center justify-center p-8">
                <div className="glass-card p-12 max-w-md mx-auto text-center">
                    <div className="relative mb-8">
                        <div className="w-24 h-24 mx-auto rounded-full gradient-brand opacity-20 animate-pulse"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <ChefHat className="h-12 w-12 text-brand-600 dark:text-brand-400 animate-bounce" />
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">
                        {isEditing ? 'Loading Recipe' : 'Preparing Form'}
                    </h3>
                    <p className="text-surface-600 dark:text-surface-400 animate-pulse">
                        {isEditing ? 'Getting recipe details...' : 'Setting up your recipe creation...'}
                    </p>
                    <div className="mt-6 flex justify-center space-x-1">
                        <div className="w-2 h-2 bg-brand-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-brand-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-brand-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-50/30 to-accent-50/30 dark:from-surface-900 dark:to-surface-950">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-fade-in">
                    <RecipeFormHeader isEditing={isEditing} />

                    <form onSubmit={handleSubmit} className="space-y-8" role="form">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-8">
                                <RecipeBasicInfo
                                    formData={formData}
                                    errors={errors as any}
                                    onUpdateField={updateFormData}
                                />

                                <RecipeIngredients
                                    ingredients={formData.ingredients}
                                    {...(errors.ingredients && { error: errors.ingredients })}
                                    onChange={(value) => updateFormData('ingredients', value)}
                                />

                                <RecipeInstructions
                                    instructions={formData.instructions}
                                    {...(errors.instructions && { error: errors.instructions })}
                                    onChange={(value) => updateFormData('instructions', value)}
                                />
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-8">
                                <RecipeImageUpload
                                    imagePreview={imagePreview}
                                    onImageChange={handleImageChange}
                                    onRemoveImage={removeImage}
                                />

                                {/* Recipe Tips */}
                                <div className="glass-card p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="p-2 rounded-full bg-brand-100 dark:bg-brand-900">
                                            <Sparkles className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                                            Recipe Tips
                                        </h3>
                                    </div>
                                    <ul className="space-y-3 text-sm text-surface-600 dark:text-surface-400">
                                        <li className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 bg-brand-600 dark:bg-brand-400 rounded-full mt-2 flex-shrink-0"></div>
                                            <span>Use clear, descriptive titles that include key ingredients</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 bg-brand-600 dark:bg-brand-400 rounded-full mt-2 flex-shrink-0"></div>
                                            <span>Add high-quality photos to make your recipe stand out</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 bg-brand-600 dark:bg-brand-400 rounded-full mt-2 flex-shrink-0"></div>
                                            <span>Include precise measurements and cooking times</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 bg-brand-600 dark:bg-brand-400 rounded-full mt-2 flex-shrink-0"></div>
                                            <span>Use relevant tags to help others find your recipe</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <RecipeFormActions
                            isEditing={isEditing}
                            isSubmitting={isSubmitting}
                            onCancel={handleCancel}
                        />
                    </form>
                </div>
            </div>
        </div>
    );
}; 