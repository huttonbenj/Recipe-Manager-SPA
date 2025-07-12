import React from 'react';
import {
    Clock, Users, Star, Trophy, Calendar, ChefHat, ClipboardList, ChevronRight
} from 'lucide-react';
import { Card, CardContent, Badge } from '../../../ui';
import { Recipe } from '@recipe-manager/shared';
import { useTheme } from '../../../../contexts/ThemeContext';
import { getThemeColors } from '../../../../utils/theme';
import { cn } from '../../../../utils/cn';

interface RecipeDetailSidebarProps {
    recipe: Recipe;
}

export const RecipeDetailSidebar: React.FC<RecipeDetailSidebarProps> = ({ recipe }) => {
    const { theme } = useTheme();
    const themeColors = getThemeColors(theme.color);

    const formatDate = (dateString: string | Date) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
        });
    };

    const parseIngredients = (ingredientsStr: string | undefined | null): string[] => {
        if (!ingredientsStr) return [];
        try {
            const parsed = JSON.parse(ingredientsStr);
            if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
        } catch (e) { /* fallback */ }
        return ingredientsStr.split('\n').filter(Boolean);
    };

    const parseTags = (tagsStr: string | undefined | null): string[] => {
        if (!tagsStr) return [];
        try {
            const parsed = JSON.parse(tagsStr);
            if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
        } catch (e) { /* fallback */ }
        return tagsStr.split(',').map(t => t.trim()).filter(Boolean);
    };

    const ingredients = parseIngredients(recipe.ingredients);
    const tags = parseTags(recipe.tags);

    const infoItems = [
        { icon: <Clock className="h-5 w-5" />, label: 'Cook Time', value: recipe.cook_time ? `${recipe.cook_time} min` : 'N/A' },
        { icon: <Users className="h-5 w-5" />, label: 'Servings', value: recipe.servings ? `${recipe.servings} servings` : 'N/A' },
        { icon: <Trophy className="h-5 w-5" />, label: 'Difficulty', value: recipe.difficulty || 'N/A' },
        { icon: <ChefHat className="h-5 w-5" />, label: 'Category', value: recipe.category || 'N/A' },
    ];

    return (
        <Card className="bg-surface-800/50 border border-surface-700/50 sticky top-24">
            <CardContent className="p-6">
                {/* Details Section */}
                <div className="space-y-4">
                    {infoItems.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-surface-300">
                                {item.icon}
                                <span className="font-medium">{item.label}</span>
                            </div>
                            <span className="font-semibold text-surface-100">{item.value}</span>
                        </div>
                    ))}
                </div>

                {/* Rating */}
                <div className="mt-6 pt-4 border-t border-surface-700/50">
                    <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="text-lg font-bold text-surface-100">4.8</span>
                        <span className="text-sm text-surface-400">(25 reviews)</span>
                    </div>
                </div>

                {/* Ingredients Section */}
                <div className="mt-6 pt-6 border-t border-surface-700/50">
                    <div className="flex items-center gap-3 mb-4">
                        <ClipboardList className="h-6 w-6 text-surface-300" />
                        <h3 className="text-xl font-bold text-surface-100">Ingredients</h3>
                    </div>
                    {ingredients.length > 0 ? (
                        <ul className="space-y-1">
                            {ingredients.map((ingredient, index) => (
                                <li key={index} className="flex items-start p-1.5 rounded-md transition-colors hover:bg-surface-700/50">
                                    <ChevronRight className={cn(
                                        "h-5 w-5 flex-shrink-0 mt-0.5",
                                        `${themeColors.primary.replace('600', '400')}`
                                    )} />
                                    <span className="ml-2 text-surface-300">{ingredient}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-surface-400 py-4">No ingredients listed.</p>
                    )}
                </div>

                {/* Tags Section */}
                {tags.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-surface-700/50">
                        <h4 className="text-base font-semibold text-surface-200 mb-3">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag, index) => (
                                <Badge key={index} variant="glass">{tag}</Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Dates Section */}
                <div className="mt-6 pt-4 border-t border-surface-700/50">
                    <div className="flex items-center gap-3 text-surface-400">
                        <Calendar className="h-5 w-5" />
                        <div>
                            <p className="text-sm font-medium">Created on {formatDate(recipe.created_at)}</p>
                            <p className="text-xs">Last updated on {formatDate(recipe.updated_at)}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}; 