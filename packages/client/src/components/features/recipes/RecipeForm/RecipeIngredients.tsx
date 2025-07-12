import React from 'react';
import { Textarea } from '../../../ui/Form/Textarea';

interface RecipeIngredientsProps {
    ingredients: string;
    onChange: (value: string) => void;
    error?: string;
}

export const RecipeIngredients: React.FC<RecipeIngredientsProps> = ({ ingredients, onChange, error }) => {
    return (
        <Textarea
            id="ingredients"
            label=""
            placeholder="e.g., 1 cup flour, 2 eggs, 1/2 cup milk"
            value={ingredients}
            onChange={(e) => onChange(e.target.value)}
            error={error}
            rows={6}
        />
    );
}; 