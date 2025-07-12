import React from 'react';
import { Textarea } from '../../../ui/Form/Textarea';

interface RecipeInstructionsProps {
    instructions: string;
    onChange: (value: string) => void;
    error?: string;
}

export const RecipeInstructions: React.FC<RecipeInstructionsProps> = ({ instructions, onChange, error }) => {
    return (
        <Textarea
            id="instructions"
            label=""
            placeholder="e.g., Mix ingredients, bake at 350°F for 30 minutes..."
            value={instructions}
            onChange={(e) => onChange(e.target.value)}
            error={error}
            rows={10}
        />
    );
}; 