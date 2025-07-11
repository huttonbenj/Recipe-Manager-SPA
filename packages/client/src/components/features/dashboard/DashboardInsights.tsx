import React from 'react';
import { Sparkles, TrendingUp, Lightbulb, ChefHat } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface DashboardInsightsProps {
    recipeCount: number;
    mostUsedCategory?: string | undefined;
}

export const DashboardInsights: React.FC<DashboardInsightsProps> = ({
    recipeCount,
    mostUsedCategory
}) => {
    // Get a random cooking tip
    const cookingTips = [
        "Always read the entire recipe before you start cooking.",
        "Taste as you go. Your palate is the most important tool.",
        "Rest meat after cooking to retain its juices.",
        "Keep your knives sharp. Dull knives are dangerous knives.",
        "Mise en place (prep all ingredients) before cooking."
    ];

    const randomTip = cookingTips[Math.floor(Math.random() * cookingTips.length)];

    return (
        <div className="glass-card rounded-2xl p-6 border border-surface-200/50 dark:border-surface-700/50">
            <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-lg text-surface-900 dark:text-white">
                    Insights & Recommendations
                </h3>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/10 to-accent-500/10 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-accent-500" />
                </div>
            </div>

            {/* Cooking Tip */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    <h4 className="text-sm font-medium text-surface-700 dark:text-surface-300">Today's Tip</h4>
                </div>
                <blockquote className="text-surface-700 dark:text-surface-300 italic leading-relaxed text-sm pl-3 border-l-2 border-accent-500/30">
                    "{randomTip}"
                </blockquote>
            </div>

            {/* Personal Insights */}
            <div className="space-y-4">
                {recipeCount > 0 ? (
                    <>
                        <div className="p-4 rounded-xl bg-surface-100/70 dark:bg-surface-800/70">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white shadow-md">
                                    <TrendingUp className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-surface-900 dark:text-white">
                                        Your Recipe Activity
                                    </h4>
                                    <p className="text-sm text-surface-600 dark:text-surface-400">
                                        {recipeCount < 3
                                            ? "You're just getting started! Create more recipes to see insights."
                                            : `You've created ${recipeCount} recipes. ${mostUsedCategory ? `Your favorite category is ${mostUsedCategory}.` : ''}`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {recipeCount >= 3 && (
                            <div className={cn(
                                "p-4 rounded-xl bg-gradient-to-br",
                                "from-brand-500/10 to-accent-500/10",
                                "dark:from-brand-500/20 dark:to-accent-500/20"
                            )}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-500 to-purple-500 flex items-center justify-center text-white shadow-md">
                                        <Sparkles className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-surface-900 dark:text-white">
                                            Personalized Recommendation
                                        </h4>
                                        <p className="text-sm text-surface-600 dark:text-surface-400">
                                            Try creating a {mostUsedCategory ? `${mostUsedCategory.toLowerCase()} recipe` : 'new recipe'} with seasonal ingredients this week.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="p-5 rounded-xl bg-surface-100/70 dark:bg-surface-800/70 text-center">
                        <div className="inline-flex h-14 w-14 rounded-full bg-gradient-to-br from-brand-500/20 to-accent-500/20 items-center justify-center mb-3">
                            <ChefHat className="h-7 w-7 text-brand-500 dark:text-brand-400" />
                        </div>
                        <h4 className="font-medium text-surface-900 dark:text-white mb-1">
                            Start Your Culinary Journey
                        </h4>
                        <p className="text-sm text-surface-600 dark:text-surface-400">
                            Create your first recipe to unlock personalized insights and recommendations.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}; 