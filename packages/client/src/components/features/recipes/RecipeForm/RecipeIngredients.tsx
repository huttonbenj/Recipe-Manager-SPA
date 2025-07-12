import React from 'react';
import { Plus, Info } from 'lucide-react';
import { Textarea } from '../../../ui/Form/Textarea';

interface RecipeIngredientsProps {
    ingredients: string;
    onChange: (value: string) => void;
    error?: string;
}

export const RecipeIngredients: React.FC<RecipeIngredientsProps> = ({ ingredients, onChange, error }) => {
    const ingredientCount = ingredients.split('\n').filter(line => line.trim()).length;

    return (
        <div className="space-y-4">
            {/* Helpful Tips */}
            <div className="bg-gradient-to-r from-brand-50 to-accent-50 dark:from-brand-950/20 dark:to-accent-950/20 rounded-xl p-4 border border-brand-200/50 dark:border-brand-800/50">
                <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-brand-500 to-accent-600 shadow-sm">
                        <Info className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-brand-900 dark:text-brand-100 mb-1">
                            Pro Tips for Better Ingredients
                        </h4>
                        <ul className="text-sm text-brand-700 dark:text-brand-300 space-y-1">
                            <li>• Include quantities (e.g., "2 cups flour")</li>
                            <li>• Put each ingredient on a new line</li>
                            <li>• Be specific about preparation (e.g., "diced", "chopped")</li>
                            <li>• List ingredients in order of use</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Ingredient Counter */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4 text-success-500" />
                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                        {ingredientCount} ingredient{ingredientCount !== 1 ? 's' : ''} added
                    </span>
                </div>
                <div className="text-xs text-surface-500 dark:text-surface-400">
                    Press Enter for new ingredient
                </div>
            </div>

            {/* Enhanced Textarea */}
            <div className="relative">
                <Textarea
                    id="ingredients"
                    label=""
                    placeholder="2 cups all-purpose flour
1 cup granulated sugar
1/2 cup butter, softened
2 large eggs
1 tsp vanilla extract
1 tsp baking powder
1/2 tsp salt
1 cup chocolate chips"
                    value={ingredients}
                    onChange={(e) => onChange(e.target.value)}
                    error={error}
                    rows={8}
                    className="font-mono text-sm leading-relaxed pl-12"
                />

                {/* Line numbers overlay - only show when there's content */}
                {ingredients.trim() && (
                    <div className="absolute left-3 top-3 pointer-events-none">
                        <div className="text-xs text-surface-300 dark:text-surface-600 font-mono leading-relaxed">
                            {ingredients.split('\n').map((_, i) => (
                                <div key={i} className="h-6 flex items-center">
                                    {i + 1}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 text-xs text-surface-500 dark:text-surface-400">
                <span>Quick actions:</span>
                <button
                    type="button"
                    onClick={() => onChange(ingredients + '\n• ')}
                    className="px-2 py-1 bg-surface-100 dark:bg-surface-800 rounded hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                >
                    Add bullet point
                </button>
                <button
                    type="button"
                    onClick={() => onChange(ingredients.split('\n').map((line, i) => `${i + 1}. ${line}`).join('\n'))}
                    className="px-2 py-1 bg-surface-100 dark:bg-surface-800 rounded hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                >
                    Add numbers
                </button>
            </div>
        </div>
    );
}; 