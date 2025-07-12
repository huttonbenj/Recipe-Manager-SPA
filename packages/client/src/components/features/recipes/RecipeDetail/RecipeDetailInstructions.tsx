import React from 'react';
import { Card, CardContent, CardHeader } from '../../../ui';
import { Recipe } from '@recipe-manager/shared';
import { ListChecks } from 'lucide-react';

interface RecipeDetailInstructionsProps {
    recipe: Recipe;
}

export const RecipeDetailInstructions: React.FC<RecipeDetailInstructionsProps> = ({ recipe }) => {
    const instructions = recipe.instructions?.split('\n').filter(Boolean) || [];

    return (
        <Card className="bg-surface-800/50 border border-surface-700/50">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <ListChecks className="h-6 w-6 text-surface-400" />
                    <div>
                        <h3 className="text-xl font-bold text-surface-100">
                            Instructions
                        </h3>
                        <p className="text-sm text-surface-400">
                            Follow these steps to create your masterpiece.
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                {instructions.length > 0 ? (
                    <ol className="space-y-4">
                        {instructions.map((step, index) => (
                            <li key={index} className="flex items-start gap-4 p-2 rounded-lg transition-colors hover:bg-surface-700/50">
                                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-surface-700 text-surface-200 rounded-full font-bold">
                                    {index + 1}
                                </div>
                                <p className="text-surface-300 leading-relaxed pt-1">
                                    {step}
                                </p>
                            </li>
                        ))}
                    </ol>
                ) : (
                    <div className="text-center py-10">
                        <ListChecks className="h-12 w-12 text-surface-500 mx-auto mb-4" />
                        <p className="text-surface-400">
                            No instructions provided for this recipe yet.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}; 