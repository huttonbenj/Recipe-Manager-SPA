import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RecipeFormHeaderProps {
    isEditing: boolean;
}

export const RecipeFormHeader: React.FC<RecipeFormHeaderProps> = ({ isEditing }) => {
    const navigate = useNavigate();

    return (
        <div className="mb-6">
            <button
                onClick={() => navigate('/recipes')}
                className="flex items-center text-surface-600 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200 mb-4 transition-colors"
            >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Recipes
            </button>

            <h1 className="text-3xl font-bold text-surface-900 dark:text-surface-50">
                {isEditing ? 'Edit Recipe' : 'Create New Recipe'}
            </h1>
            <p className="text-surface-600 dark:text-surface-400 mt-2">
                {isEditing ? 'Update your recipe details' : 'Share your culinary creation with the world'}
            </p>
        </div>
    );
}; 