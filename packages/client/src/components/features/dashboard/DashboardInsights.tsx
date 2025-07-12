import React from 'react';
import { Sparkles, TrendingUp, Lightbulb, ChefHat, Target, Award, Zap } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { getThemeColors } from '../../../utils/theme';
import { cn } from '../../../utils/cn';

interface DashboardInsightsProps {
    recipeCount: number;
    mostUsedCategory?: string | undefined;
}

export const DashboardInsights: React.FC<DashboardInsightsProps> = ({
    recipeCount,
    mostUsedCategory
}) => {
    const { theme } = useTheme();
    const themeColors = getThemeColors(theme.color);

    // Enhanced cooking tips with categories
    const cookingTips = [
        { tip: "Always read the entire recipe before you start cooking.", category: "Preparation" },
        { tip: "Taste as you go. Your palate is the most important tool.", category: "Technique" },
        { tip: "Rest meat after cooking to retain its juices.", category: "Protein" },
        { tip: "Keep your knives sharp. Dull knives are dangerous knives.", category: "Safety" },
        { tip: "Mise en place (prep all ingredients) before cooking.", category: "Organization" },
        { tip: "Season in layers throughout the cooking process.", category: "Seasoning" },
        { tip: "Don't overcrowd the pan when searing or sautéing.", category: "Technique" },
        { tip: "Let your oven fully preheat before baking.", category: "Baking" }
    ];

    const randomTipData = cookingTips[Math.floor(Math.random() * cookingTips.length)] || cookingTips[0];

    // Get achievement level based on recipe count
    const getAchievementLevel = (count: number) => {
        if (count === 0) return { level: "Beginner", icon: ChefHat, color: "from-surface-500 to-surface-600" };
        if (count < 5) return { level: "Home Cook", icon: ChefHat, color: `${themeColors.primary} ${themeColors.primaryHover}` };
        if (count < 10) return { level: "Recipe Creator", icon: Sparkles, color: `${themeColors.secondary} ${themeColors.secondary.replace('600', '600')}` };
        if (count < 20) return { level: "Culinary Artist", icon: Award, color: "from-warning-500 to-amber-600" };
        return { level: "Master Chef", icon: Target, color: "from-error-500 to-pink-600" };
    };

    const achievement = getAchievementLevel(recipeCount);
    const AchievementIcon = achievement.icon;

    return (
        <div className="space-y-6">
            {/* Today's Cooking Tip */}
            <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-warning-50 to-amber-50 dark:from-warning-950/20 dark:to-amber-950/20 border border-warning-200/50 dark:border-warning-800/50">
                <div className="absolute top-0 right-0 w-32 h-32 bg-warning-500/10 rounded-full blur-2xl"></div>
                <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-warning-500 to-amber-600 shadow-lg">
                            <Lightbulb className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-warning-900 dark:text-warning-100">Chef's Tip</h3>
                            <span className="text-xs font-medium px-2 py-1 bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300 rounded-full">
                                {randomTipData?.category || 'General'}
                            </span>
                        </div>
                    </div>
                    <blockquote className="text-warning-800 dark:text-warning-200 leading-relaxed font-medium">
                        "{randomTipData?.tip || 'Always read the entire recipe before you start cooking.'}"
                    </blockquote>
                </div>
            </div>

            {/* Achievement Level */}
            <div className="relative overflow-hidden rounded-2xl p-6 bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-800/50 shadow-lg">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "p-3 rounded-2xl shadow-lg",
                        `bg-gradient-to-br ${achievement.color}`
                    )}>
                        <AchievementIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-surface-900 dark:text-white">
                                {achievement.level}
                            </h3>
                            <Sparkles className={cn(
                                "h-4 w-4",
                                `${themeColors.secondary.replace('600', '500')}`
                            )} />
                        </div>
                        <p className="text-sm text-surface-600 dark:text-surface-400">
                            {recipeCount} recipe{recipeCount !== 1 ? 's' : ''} created
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-surface-900 dark:text-white">
                            {recipeCount}
                        </div>
                        <div className="text-xs text-surface-500 dark:text-surface-400">
                            recipes
                        </div>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                    <div className="flex justify-between text-xs text-surface-500 dark:text-surface-400 mb-2">
                        <span>Progress to next level</span>
                        <span>{Math.min(recipeCount % 5, 5)}/5</span>
                    </div>
                    <div className="h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                        <div
                            className={cn(
                                "h-full rounded-full transition-all duration-500",
                                `bg-gradient-to-r ${achievement.color}`
                            )}
                            style={{ width: `${Math.min((recipeCount % 5) * 20, 100)}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Personal Insights */}
            <div className="space-y-4">
                {recipeCount > 0 ? (
                    <>
                        <div className={cn(
                            "relative overflow-hidden rounded-2xl p-6 border",
                            `bg-gradient-to-br ${themeColors.primary.replace('600', '50')} ${themeColors.secondary.replace('600', '50')} dark:${themeColors.primary.replace('600', '950/20')} dark:${themeColors.secondary.replace('600', '950/20')} border-${themeColors.primary.split('-')[1]}-200/50 dark:border-${themeColors.primary.split('-')[1]}-800/50`
                        )}>
                            <div className="flex items-start gap-4">
                                <div className={cn(
                                    "p-2 rounded-xl shadow-lg",
                                    `bg-gradient-to-br ${themeColors.primary} ${themeColors.secondary}`
                                )}>
                                    <TrendingUp className="h-5 w-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h4 className={cn(
                                        "font-bold mb-2",
                                        `${themeColors.primary.replace('600', '900')} dark:${themeColors.primary.replace('600', '100')}`
                                    )}>
                                        Your Cooking Journey
                                    </h4>
                                    <p className={cn(
                                        "leading-relaxed",
                                        `${themeColors.primary.replace('600', '800')} dark:${themeColors.primary.replace('600', '200')}`
                                    )}>
                                        {recipeCount < 3
                                            ? "You're just getting started! Create more recipes to unlock personalized insights and track your culinary progress."
                                            : `Amazing! You've created ${recipeCount} recipes. ${mostUsedCategory ? `Your favorite category is ${mostUsedCategory}, showing your passion for these flavors.` : 'Keep exploring different cuisines and techniques!'}`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {recipeCount >= 3 && (
                            <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-success-50 to-emerald-50 dark:from-success-950/20 dark:to-emerald-950/20 border border-success-200/50 dark:border-success-800/50">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 rounded-xl bg-gradient-to-br from-success-500 to-emerald-600 shadow-lg">
                                        <Zap className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-success-900 dark:text-success-100 mb-2">
                                            Personalized Recommendation
                                        </h4>
                                        <p className="text-success-800 dark:text-success-200 leading-relaxed">
                                            {mostUsedCategory
                                                ? `Since you love ${mostUsedCategory.toLowerCase()} recipes, try experimenting with fusion cuisine or seasonal variations of your favorites!`
                                                : 'Try exploring a new cuisine this week! Mediterranean or Asian fusion could be great starting points.'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {recipeCount >= 10 && (
                            <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border border-purple-200/50 dark:border-purple-800/50">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
                                        <Award className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-purple-900 dark:text-purple-100 mb-2">
                                            Expert Challenge
                                        </h4>
                                        <p className="text-purple-800 dark:text-purple-200 leading-relaxed">
                                            You're becoming a true culinary artist! Consider creating a signature dish or starting a themed recipe collection.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-800 dark:to-surface-900 border border-surface-200/50 dark:border-surface-700/50 text-center">
                        <div className={cn(
                            "absolute inset-0",
                            `bg-gradient-to-br ${themeColors.primary.replace('600', '500/5')} ${themeColors.secondary.replace('600', '500/5')}`
                        )}></div>
                        <div className="relative">
                            <div className={cn(
                                "w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center",
                                `bg-gradient-to-br ${themeColors.primary.replace('600', '100')} ${themeColors.secondary.replace('600', '100')} dark:${themeColors.primary.replace('600', '900/30')} dark:${themeColors.secondary.replace('600', '900/30')}`
                            )}>
                                <ChefHat className={cn(
                                    "h-8 w-8",
                                    `${themeColors.primary} dark:${themeColors.primary.replace('600', '400')}`
                                )} />
                            </div>
                            <h4 className="font-bold text-surface-900 dark:text-white mb-2">
                                Start Your Culinary Journey
                            </h4>
                            <p className="text-surface-600 dark:text-surface-400 leading-relaxed">
                                Create your first recipe to unlock personalized insights, track your progress, and get tailored recommendations for your cooking adventure.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}; 