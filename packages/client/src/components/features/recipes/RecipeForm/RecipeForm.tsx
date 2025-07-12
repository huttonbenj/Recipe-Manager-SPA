import React from 'react';
import { useRecipeForm } from '../../../../hooks';
import { RecipeFormHeader } from './RecipeFormHeader';
import { RecipeImageUpload } from './RecipeImageUpload';
import { RecipeBasicInfo } from './RecipeBasicInfo';
import { RecipeIngredients } from './RecipeIngredients';
import { RecipeInstructions } from './RecipeInstructions';
import { RecipeFormActions } from './RecipeFormActions';
import { Card } from '../../../ui/Card';
import { RecipeFormSkeleton } from './RecipeFormSkeleton';
import { PageTransitionScale } from '../../../ui/PageTransition';
import { Image, FileText, ShoppingCart, List } from 'lucide-react';

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
        return <RecipeFormSkeleton />;
    }

    return (
        <PageTransitionScale>
            <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-surface-100 dark:from-surface-950 dark:via-surface-900 dark:to-surface-800">
                {/* Background decorative elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-brand-500/10 via-accent-500/10 to-transparent rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-accent-500/10 via-brand-500/10 to-transparent rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <RecipeFormHeader isEditing={isEditing} />

                    <form onSubmit={handleSubmit} className="space-y-8 mt-8" noValidate>
                        {/* Enhanced Image Upload Section */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 via-accent-500/5 to-brand-500/5 rounded-3xl blur-xl"></div>
                            <Card className="relative p-8 bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border-surface-200/50 dark:border-surface-800/50 shadow-xl">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 shadow-lg">
                                        <Image className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold bg-gradient-to-r from-surface-900 to-surface-700 dark:from-white dark:to-surface-300 bg-clip-text text-transparent">
                                            Recipe Image
                                        </h2>
                                        <p className="text-surface-600 dark:text-surface-400 text-sm">
                                            Add a beautiful photo to showcase your recipe
                                        </p>
                                    </div>
                                </div>
                                <RecipeImageUpload
                                    imagePreview={imagePreview}
                                    onImageChange={handleImageChange}
                                    onRemoveImage={removeImage}
                                    error={(errors as any).image_url}
                                />
                            </Card>
                        </div>

                        {/* Enhanced Recipe Details Section */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-accent-500/5 via-brand-500/5 to-accent-500/5 rounded-3xl blur-xl"></div>
                            <Card className="relative p-8 bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border-surface-200/50 dark:border-surface-800/50 shadow-xl">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-2 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 shadow-lg">
                                        <FileText className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold bg-gradient-to-r from-surface-900 to-surface-700 dark:from-white dark:to-surface-300 bg-clip-text text-transparent">
                                            Recipe Details
                                        </h2>
                                        <p className="text-surface-600 dark:text-surface-400 text-sm">
                                            Tell us about your delicious creation
                                        </p>
                                    </div>
                                </div>
                                <RecipeBasicInfo
                                    formData={formData}
                                    errors={errors}
                                    onUpdateField={updateFormData}
                                />
                            </Card>
                        </div>

                        {/* Enhanced Ingredients Section */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-success-500/5 via-emerald-500/5 to-success-500/5 rounded-3xl blur-xl"></div>
                            <Card className="relative p-8 bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border-surface-200/50 dark:border-surface-800/50 shadow-xl">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-2 rounded-xl bg-gradient-to-br from-success-500 to-emerald-600 shadow-lg">
                                        <ShoppingCart className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold bg-gradient-to-r from-surface-900 to-surface-700 dark:from-white dark:to-surface-300 bg-clip-text text-transparent">
                                            Ingredients
                                        </h2>
                                        <p className="text-surface-600 dark:text-surface-400 text-sm">
                                            List all the ingredients needed for your recipe
                                        </p>
                                    </div>
                                </div>
                                <RecipeIngredients
                                    ingredients={formData.ingredients}
                                    onChange={(value) => updateFormData('ingredients', value)}
                                    error={errors.ingredients || ''}
                                />
                            </Card>
                        </div>

                        {/* Enhanced Instructions Section */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-warning-500/5 via-amber-500/5 to-warning-500/5 rounded-3xl blur-xl"></div>
                            <Card className="relative p-8 bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border-surface-200/50 dark:border-surface-800/50 shadow-xl">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-2 rounded-xl bg-gradient-to-br from-warning-500 to-amber-600 shadow-lg">
                                        <List className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold bg-gradient-to-r from-surface-900 to-surface-700 dark:from-white dark:to-surface-300 bg-clip-text text-transparent">
                                            Instructions
                                        </h2>
                                        <p className="text-surface-600 dark:text-surface-400 text-sm">
                                            Step-by-step cooking instructions
                                        </p>
                                    </div>
                                </div>
                                <RecipeInstructions
                                    instructions={formData.instructions}
                                    onChange={(value) => updateFormData('instructions', value)}
                                    error={errors.instructions || ''}
                                />
                            </Card>
                        </div>

                        {/* Enhanced Form Actions */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 via-accent-500/5 to-brand-500/5 rounded-2xl blur-xl"></div>
                            <div className="relative bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm rounded-2xl border border-surface-200/50 dark:border-surface-800/50 shadow-xl p-6">
                                <RecipeFormActions
                                    isEditing={isEditing}
                                    isSubmitting={isSubmitting}
                                    onCancel={handleCancel}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </PageTransitionScale>
    );
}; 