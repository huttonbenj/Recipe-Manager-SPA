import React from 'react';
import { Card, CardContent, CardHeader } from '../../../ui/Card';
import { TextArea, FormField } from '../../../ui/Form';

interface RecipeIngredientsProps {
    ingredients: string;
    error?: string;
    onChange: (value: string) => void;
}

export const RecipeIngredients: React.FC<RecipeIngredientsProps> = ({
    ingredients,
    error,
    onChange,
}) => {
    return (
        <Card>
            <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">Ingredients</h2>
            </CardHeader>
            <CardContent>
                <FormField
                    label="Ingredients"
                    required
                    {...(error && { error })}
                >
                    <TextArea
                        value={ingredients}
                        onChange={(e) => onChange(e.target.value)}
                        rows={8}
                        placeholder="Enter each ingredient on a new line, e.g.:&#10;2 cups flour&#10;1 tsp salt&#10;1 cup milk"
                        required
                    />
                </FormField>
            </CardContent>
        </Card>
    );
}; 