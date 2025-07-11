import React from 'react';
import { RecipeFormHeader } from './RecipeFormHeader';
import { RecipeBasicInfo } from './RecipeBasicInfo';
import { RecipeImageUpload } from './RecipeImageUpload';
import { RecipeIngredients } from './RecipeIngredients';
import { RecipeInstructions } from './RecipeInstructions';
import { RecipeFormActions } from './RecipeFormActions';
import { useRecipeForm } from '../../../../hooks';

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
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <RecipeFormHeader isEditing={isEditing} />

            <form onSubmit={handleSubmit} className="space-y-8">
                <RecipeBasicInfo
                    formData={formData}
                    errors={errors as any}
                    onUpdateField={updateFormData}
                />

                <RecipeImageUpload
                    imagePreview={imagePreview}
                    onImageChange={handleImageChange}
                    onRemoveImage={removeImage}
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

                <RecipeFormActions
                    isEditing={isEditing}
                    isSubmitting={isSubmitting}
                    onCancel={handleCancel}
                    onSubmit={() => { }}
                />
            </form>
        </div>
    );
}; 