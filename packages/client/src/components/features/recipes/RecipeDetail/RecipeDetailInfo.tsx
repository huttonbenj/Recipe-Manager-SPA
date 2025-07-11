import React from 'react';
import { Clock, Users, Star, Trophy, Calendar, ChefHat, Flame, Award, Bookmark } from 'lucide-react';
import { Card, CardContent, CardHeader, Badge } from '../../../ui';
import { Recipe } from '@recipe-manager/shared';
import { cn } from '../../../../utils/cn';

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
                return <Flame className="h-4 w-4" />;
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

    // Calculate time since creation
    const getTimeSince = (dateString: string | Date) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 1) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    };

    return (
        <Card className="modern-card rounded-xl hover:shadow-xl transition-all duration-300 animate-fade-in-up animation-delay-600">
            <CardHeader className="pb-4 border-b border-surface-200/50 dark:border-surface-700/50">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
                        <div className="p-2 rounded-full bg-brand-100/80 dark:bg-brand-900/80 backdrop-blur-sm shadow-sm">
                            <Award className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                        </div>
                        Recipe Details
                    </h3>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/60 dark:to-amber-900/60 shadow-sm">
                        <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400 fill-current" />
                        <span className="text-sm font-bold text-yellow-800 dark:text-yellow-200">4.8</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                {/* Main Stats - Enhanced with better visual hierarchy */}
                <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-surface-50/80 dark:bg-surface-800/50 hover:bg-surface-100/80 dark:hover:bg-surface-800/80 transition-colors backdrop-blur-sm shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-900/80 dark:to-brand-800/80 shadow-sm">
                                <Clock className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-surface-500 dark:text-surface-400 font-medium">Cook Time</p>
                                <p className="font-semibold text-surface-900 dark:text-surface-100">
                                    {recipe.cook_time ? `${recipe.cook_time} minutes` : 'Not specified'}
                                </p>
                            </div>
                        </div>
                        <div className="bg-brand-50 dark:bg-brand-900/30 px-2.5 py-1 rounded-md text-xs font-medium text-brand-700 dark:text-brand-300">
                            {recipe.cook_time && recipe.cook_time < 30 ? 'Quick' : 'Standard'}
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-surface-50/80 dark:bg-surface-800/50 hover:bg-surface-100/80 dark:hover:bg-surface-800/80 transition-colors backdrop-blur-sm shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-full bg-gradient-to-br from-accent-100 to-accent-200 dark:from-accent-900/80 dark:to-accent-800/80 shadow-sm">
                                <Users className="h-5 w-5 text-accent-600 dark:text-accent-400" />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-surface-500 dark:text-surface-400 font-medium">Servings</p>
                                <p className="font-semibold text-surface-900 dark:text-surface-100">
                                    {recipe.servings ? `${recipe.servings} people` : 'Not specified'}
                                </p>
                            </div>
                        </div>
                        <div className="bg-accent-50 dark:bg-accent-900/30 px-2.5 py-1 rounded-md text-xs font-medium text-accent-700 dark:text-accent-300">
                            {recipe.servings && recipe.servings > 4 ? 'Family' : 'Personal'}
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-surface-50/80 dark:bg-surface-800/50 hover:bg-surface-100/80 dark:hover:bg-surface-800/80 transition-colors backdrop-blur-sm shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-full bg-gradient-to-br from-success-100 to-success-200 dark:from-success-900/80 dark:to-success-800/80 shadow-sm">
                                <Calendar className="h-5 w-5 text-success-600 dark:text-success-400" />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-surface-500 dark:text-surface-400 font-medium">Created</p>
                                <p className="font-semibold text-surface-900 dark:text-surface-100">
                                    {formatDate(recipe.created_at)}
                                </p>
                            </div>
                        </div>
                        <div className="bg-success-50 dark:bg-success-900/30 px-2.5 py-1 rounded-md text-xs font-medium text-success-700 dark:text-success-300">
                            {getTimeSince(recipe.created_at)}
                        </div>
                    </div>
                </div>

                {/* Tags Section - Enhanced with better styling */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-surface-900 dark:text-surface-100 uppercase tracking-wider flex items-center gap-1.5">
                            <Bookmark className="h-3.5 w-3.5" />
                            Tags
                        </h4>
                        <span className="text-xs text-surface-500 dark:text-surface-400">
                            {recipe.difficulty && recipe.category ? '2 tags' : '1 tag'}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {recipe.difficulty && (
                            <Badge
                                variant={getDifficultyColor(recipe.difficulty)}
                                className={cn(
                                    "flex items-center gap-1.5 px-3 py-1.5 shadow-sm",
                                    recipe.difficulty === 'Easy' ? "animate-pulse-slow" : ""
                                )}
                            >
                                {getDifficultyIcon(recipe.difficulty)}
                                <span>{recipe.difficulty}</span>
                            </Badge>
                        )}
                        {recipe.category && (
                            <Badge
                                variant="primary"
                                className="flex items-center gap-1.5 px-3 py-1.5 shadow-sm"
                            >
                                <ChefHat className="h-3.5 w-3.5" />
                                <span>{recipe.category}</span>
                            </Badge>
                        )}
                        {!recipe.difficulty && !recipe.category && (
                            <div className="text-sm text-surface-600 dark:text-surface-400 italic bg-surface-100/50 dark:bg-surface-800/50 px-3 py-2 rounded-lg w-full text-center">
                                No tags available
                            </div>
                        )}
                    </div>
                </div>

                {/* Additional Info - Enhanced with better styling */}
                <div className="pt-4 border-t border-surface-200/50 dark:border-surface-700/50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-surface-500 dark:text-surface-400">Last updated</span>
                        <span className="text-surface-900 dark:text-surface-100 font-medium bg-surface-100/70 dark:bg-surface-800/70 px-2 py-0.5 rounded">
                            {formatDate(recipe.updated_at)}
                        </span>
                    </div>
                    <div className="text-xs px-2 py-1 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300">
                        ID: {recipe.id.substring(0, 8)}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}; 