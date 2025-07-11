import React from 'react';
import { Card, CardContent, CardHeader } from '../../../ui/Card';
import { TextArea, FormField } from '../../../ui/Form';

interface RecipeInstructionsProps {
    instructions: string;
    error?: string;
    onChange: (value: string) => void;
}

export const RecipeInstructions: React.FC<RecipeInstructionsProps> = ({
    instructions,
    error,
    onChange,
}) => {
    return (
        <Card>
            <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">Instructions</h2>
            </CardHeader>
            <CardContent>
                <FormField
                    label="Instructions"
                    required
                    {...(error && { error })}
                >
                    <TextArea
                        value={instructions}
                        onChange={(e) => onChange(e.target.value)}
                        rows={10}
                        placeholder="Enter cooking instructions step by step, e.g.:&#10;1. Preheat oven to 350°F&#10;2. Mix dry ingredients in a bowl&#10;3. Add wet ingredients and stir until combined"
                        required
                    />
                </FormField>
            </CardContent>
        </Card>
    );
}; 