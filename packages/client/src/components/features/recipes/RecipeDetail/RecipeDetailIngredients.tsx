import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../../../ui';
import { Recipe } from '@recipe-manager/shared';
import { ShoppingBag, Check, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { cn } from '../../../../utils/cn';

interface RecipeDetailIngredientsProps {
    recipe: Recipe;
}

export const RecipeDetailIngredients: React.FC<RecipeDetailIngredientsProps> = ({ recipe }) => {
    const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isExpanded, setIsExpanded] = useState(true);

    const ingredients = recipe.ingredients?.split('\n').filter(Boolean) || [];

    const filteredIngredients = ingredients.filter(ingredient =>
        ingredient.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleIngredient = (index: number) => {
        if (selectedIngredients.includes(index)) {
            setSelectedIngredients(selectedIngredients.filter(i => i !== index));
        } else {
            setSelectedIngredients([...selectedIngredients, index]);
        }
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <Card className="modern-card rounded-xl hover:shadow-xl transition-all duration-300 animate-fade-in-up animation-delay-600">
            <CardHeader className="pb-4 border-b border-surface-200/50 dark:border-surface-700/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-full bg-accent-100/80 dark:bg-accent-900/80 backdrop-blur-sm shadow-sm">
                            <ShoppingBag className="h-5 w-5 text-accent-600 dark:text-accent-400" />
                        </div>
                        <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100">
                            Ingredients
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300 px-2 py-1 rounded-full">
                            {ingredients.length} items
                        </span>
                        <button
                            onClick={toggleExpand}
                            className="p-1.5 rounded-full bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                            aria-label={isExpanded ? "Collapse ingredients" : "Expand ingredients"}
                        >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                    </div>
                </div>
            </CardHeader>

            {isExpanded && (
                <>
                    {ingredients.length > 5 && (
                        <div className="px-6 pt-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-surface-400" />
                                <input
                                    type="text"
                                    placeholder="Search ingredients..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-100/80 dark:bg-surface-800/80 text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm"
                                />
                            </div>
                        </div>
                    )}

                    <CardContent className="pt-4">
                        <div className="space-y-2">
                            {filteredIngredients.length > 0 ? (
                                filteredIngredients.map((ingredient, index) => (
                                    <div
                                        key={index}
                                        className={cn(
                                            "flex items-center p-2 rounded-lg transition-all duration-200 hover:bg-surface-100/80 dark:hover:bg-surface-800/80 cursor-pointer group",
                                            selectedIngredients.includes(index) && "bg-accent-50 dark:bg-accent-900/30"
                                        )}
                                        onClick={() => toggleIngredient(index)}
                                    >
                                        <div className={cn(
                                            "w-5 h-5 rounded border border-surface-300 dark:border-surface-600 mr-3 flex items-center justify-center transition-all duration-200",
                                            selectedIngredients.includes(index)
                                                ? "bg-accent-500 border-accent-500 dark:bg-accent-600 dark:border-accent-600"
                                                : "group-hover:border-accent-400 dark:group-hover:border-accent-500"
                                        )}>
                                            {selectedIngredients.includes(index) && (
                                                <Check className="h-3 w-3 text-white" />
                                            )}
                                        </div>
                                        <span className={cn(
                                            "text-sm text-surface-800 dark:text-surface-200 transition-all duration-200",
                                            selectedIngredients.includes(index) && "line-through text-surface-500 dark:text-surface-400"
                                        )}>
                                            {ingredient}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6">
                                    <div className="w-12 h-12 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center mx-auto mb-3">
                                        <Search className="h-6 w-6 text-surface-400" />
                                    </div>
                                    <p className="text-surface-600 dark:text-surface-400 text-sm">
                                        {ingredients.length === 0
                                            ? "No ingredients listed"
                                            : "No ingredients match your search"}
                                    </p>
                                </div>
                            )}
                        </div>

                        {selectedIngredients.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-surface-200/50 dark:border-surface-700/50 flex justify-between items-center">
                                <span className="text-xs text-surface-500 dark:text-surface-400">
                                    {selectedIngredients.length} of {ingredients.length} selected
                                </span>
                                <button
                                    onClick={() => setSelectedIngredients([])}
                                    className="text-xs text-accent-600 dark:text-accent-400 hover:underline"
                                >
                                    Clear all
                                </button>
                            </div>
                        )}
                    </CardContent>
                </>
            )}
        </Card>
    );
}; 