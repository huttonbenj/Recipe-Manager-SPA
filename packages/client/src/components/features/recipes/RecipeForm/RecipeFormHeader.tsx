import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChefHat, Sparkles } from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { getThemeColors } from '../../../../utils/theme';
import { cn } from '../../../../utils/cn';

interface RecipeFormHeaderProps {
    isEditing: boolean;
}

export const RecipeFormHeader: React.FC<RecipeFormHeaderProps> = ({ isEditing }) => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const themeColors = getThemeColors(theme.color);

    return (
        <div className="relative">
            {/* Background decoration */}
            <div className={cn(
                "absolute inset-0 rounded-3xl blur-2xl",
                `bg-gradient-to-r ${themeColors.primary.replace('600', '500/10')} ${themeColors.secondary.replace('600', '500/10')} ${themeColors.primary.replace('600', '500/10')}`
            )}></div>

            <div className="relative bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm rounded-3xl border border-surface-200/50 dark:border-surface-800/50 shadow-2xl p-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/recipes')}
                    className={cn(
                        "group flex items-center text-surface-600 dark:text-surface-400 mb-6 transition-all duration-200 hover:scale-105",
                        `hover:${themeColors.primary} dark:hover:${themeColors.primary.replace('600', '400')}`
                    )}
                >
                    <div className={cn(
                        "p-2 rounded-xl bg-surface-100 dark:bg-surface-800 transition-colors mr-3",
                        `group-hover:${themeColors.primary.replace('600', '100')} dark:group-hover:${themeColors.primary.replace('600', '900/30')}`
                    )}>
                        <ArrowLeft className="h-5 w-5" />
                    </div>
                    <span className="font-medium">Back to Recipes</span>
                </button>

                {/* Header Content */}
                <div className="flex items-center gap-6">
                    {/* Icon */}
                    <div className="relative">
                        <div className={cn(
                            "absolute inset-0 rounded-2xl blur-lg opacity-60",
                            `bg-gradient-to-br ${themeColors.primary} ${themeColors.secondary}`
                        )}></div>
                        <div className={cn(
                            "relative p-4 rounded-2xl shadow-xl",
                            `bg-gradient-to-br ${themeColors.primary} ${themeColors.secondary}`
                        )}>
                            <ChefHat className="h-8 w-8 text-white" />
                        </div>
                        {/* Sparkle decoration */}
                        <div className={cn(
                            "absolute -top-2 -right-2 p-1 rounded-full",
                            `bg-gradient-to-br ${themeColors.secondary.replace('600', '400')} ${themeColors.primary.replace('600', '500')}`
                        )}>
                            <Sparkles className="h-4 w-4 text-white" />
                        </div>
                    </div>

                    {/* Title and Description */}
                    <div className="flex-1">
                        <h1 className={cn(
                            "text-4xl font-bold bg-clip-text text-transparent mb-2",
                            `bg-gradient-to-r from-surface-900 via-${themeColors.primary.split('-')[1]}-600 to-surface-900 dark:from-white dark:via-${themeColors.primary.split('-')[1]}-400 dark:to-surface-300`
                        )}>
                            {isEditing ? 'Edit Recipe' : 'Create New Recipe'}
                        </h1>
                        <p className="text-lg text-surface-600 dark:text-surface-400 leading-relaxed">
                            {isEditing ? 'Update your recipe details and make it even better' : 'Share your culinary masterpiece with the world'}
                        </p>

                        {/* Progress indicator for new recipes */}
                        {!isEditing && (
                            <div className="flex items-center gap-2 mt-4">
                                <div className="flex items-center gap-1">
                                    <div className={cn(
                                        "w-2 h-2 rounded-full animate-pulse",
                                        `${themeColors.primary.replace('600', '500')}`
                                    )}></div>
                                    <div className={cn(
                                        "w-2 h-2 rounded-full",
                                        `${themeColors.primary.replace('600', '300')}`
                                    )}></div>
                                    <div className={cn(
                                        "w-2 h-2 rounded-full",
                                        `${themeColors.primary.replace('600', '300')}`
                                    )}></div>
                                    <div className={cn(
                                        "w-2 h-2 rounded-full",
                                        `${themeColors.primary.replace('600', '300')}`
                                    )}></div>
                                </div>
                                <span className="text-sm text-surface-500 dark:text-surface-400 font-medium">
                                    Step 1 of 4 - Recipe Details
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}; 