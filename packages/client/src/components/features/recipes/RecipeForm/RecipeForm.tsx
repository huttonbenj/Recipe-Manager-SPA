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
            <div className="min-h-screen bg-surface-950 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <RecipeFormHeader isEditing={isEditing} />
                    <form onSubmit={handleSubmit} className="space-y-8 mt-8" noValidate>
                        <Card className="p-8 bg-surface-900 border-surface-800">
                            <RecipeImageUpload
                                imagePreview={imagePreview}
                                onImageChange={handleImageChange}
                                onRemoveImage={removeImage}
                                error={(errors as any).image_url}
                            />
                        </Card>

                        <Card className="p-8 bg-surface-900 border-surface-800">
                            <h2 className="text-2xl font-bold mb-6">Recipe Details</h2>
                            <RecipeBasicInfo
                                formData={formData}
                                errors={errors}
                                onUpdateField={updateFormData}
                            />
                        </Card>

                        <Card className="p-8 bg-surface-900 border-surface-800">
                            <h2 className="text-2xl font-bold mb-6">Ingredients</h2>
                            <RecipeIngredients
                                ingredients={formData.ingredients}
                                onChange={(value) => updateFormData('ingredients', value)}
                                error={errors.ingredients || ''}
                            />
                        </Card>

                        <Card className="p-8 bg-surface-900 border-surface-800">
                            <h2 className="text-2xl font-bold mb-6">Instructions</h2>
                            <RecipeInstructions
                                instructions={formData.instructions}
                                onChange={(value) => updateFormData('instructions', value)}
                                error={errors.instructions || ''}
                            />
                        </Card>

                        <RecipeFormActions
                            isEditing={isEditing}
                            isSubmitting={isSubmitting}
                            onCancel={handleCancel}
                        />
                    </form>
                </div>
            </div>
        </PageTransitionScale>
    );
}; 