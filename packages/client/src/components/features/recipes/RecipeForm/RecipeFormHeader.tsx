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
    );
}; 