import React from 'react';
import { Clock, Users, Star, Trophy, Calendar, ChefHat } from 'lucide-react';
import { Card, CardContent, CardHeader, Badge } from '../../../ui';
import { Recipe } from '@recipe-manager/shared';

interface RecipeDetailInfoProps {
    recipe: Recipe;
}

export const RecipeDetailInfo: React.FC<RecipeDetailInfoProps> = ({ recipe }) => {
    const getDifficultyColor = (difficulty?: string) => {
        switch (difficulty) {
            case 'Easy':
                return 'success';
            case 'Medium':
                return 'warning';
            case 'Hard':
                return 'error';
            default:
                return 'primary';
        }
    };

    const getDifficultyIcon = (difficulty?: string) => {
        switch (difficulty) {
            case 'Easy':
                return <ChefHat className="h-4 w-4" />;
            case 'Medium':
                return <Star className="h-4 w-4" />;
            case 'Hard':
                return <Trophy className="h-4 w-4" />;
            default:
                return <ChefHat className="h-4 w-4" />;
        }
    };

    const formatDate = (dateString: string | Date) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <Card className="glass-card hover:shadow-glass-lg transition-all duration-300">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
                        <div className="p-2 rounded-full bg-brand-100 dark:bg-brand-900">
                            <Star className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                        </div>
                        Recipe Details
                    </h3>
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900">
                        <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400 fill-current" />
                        <span className="text-sm font-bold text-yellow-800 dark:text-yellow-200">4.8</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Main Stats */}
                <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-surface-50 dark:bg-surface-800/50 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-brand-100 dark:bg-brand-900">
                                <Clock className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                            </div>
                            <div>
                                <p className="text-sm text-surface-600 dark:text-surface-400">Cook Time</p>
                                <p className="font-semibold text-surface-900 dark:text-surface-100">
                                    {recipe.cook_time ? `${recipe.cook_time} minutes` : 'Not specified'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-surface-50 dark:bg-surface-800/50 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-accent-100 dark:bg-accent-900">
                                <Users className="h-5 w-5 text-accent-600 dark:text-accent-400" />
                            </div>
                            <div>
                                <p className="text-sm text-surface-600 dark:text-surface-400">Servings</p>
                                <p className="font-semibold text-surface-900 dark:text-surface-100">
                                    {recipe.servings ? `${recipe.servings} people` : 'Not specified'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-surface-50 dark:bg-surface-800/50 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-success-100 dark:bg-success-900">
                                <Calendar className="h-5 w-5 text-success-600 dark:text-success-400" />
                            </div>
                            <div>
                                <p className="text-sm text-surface-600 dark:text-surface-400">Created</p>
                                <p className="font-semibold text-surface-900 dark:text-surface-100">
                                    {formatDate(recipe.created_at)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tags Section */}
                <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-surface-900 dark:text-surface-100 uppercase tracking-wider">
                        Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {recipe.difficulty && (
                            <Badge
                                variant={getDifficultyColor(recipe.difficulty)}
                                className="flex items-center gap-1"
                            >
                                {getDifficultyIcon(recipe.difficulty)}
                                <span>{recipe.difficulty}</span>
                            </Badge>
                        )}
                        {recipe.category && (
                            <Badge variant="primary" className="flex items-center gap-1">
                                <ChefHat className="h-3 w-3" />
                                <span>{recipe.category}</span>
                            </Badge>
                        )}
                        {!recipe.difficulty && !recipe.category && (
                            <div className="text-sm text-surface-600 dark:text-surface-400 italic">
                                No tags available
                            </div>
                        )}
                    </div>
                </div>

                {/* Additional Info */}
                <div className="pt-4 border-t border-surface-200 dark:border-surface-700">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-surface-600 dark:text-surface-400">Last updated</span>
                        <span className="text-surface-900 dark:text-surface-100 font-medium">
                            {formatDate(recipe.updated_at)}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}; 