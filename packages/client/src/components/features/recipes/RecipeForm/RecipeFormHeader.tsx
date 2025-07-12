import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChefHat, Sparkles } from 'lucide-react';

interface RecipeFormHeaderProps {
    isEditing: boolean;
}

export const RecipeFormHeader: React.FC<RecipeFormHeaderProps> = ({ isEditing }) => {
    const navigate = useNavigate();

    return (
        <div className="relative">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 via-accent-500/10 to-brand-500/10 rounded-3xl blur-2xl"></div>

            <div className="relative bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm rounded-3xl border border-surface-200/50 dark:border-surface-800/50 shadow-2xl p-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/recipes')}
                    className="group flex items-center text-surface-600 dark:text-surface-400 hover:text-brand-600 dark:hover:text-brand-400 mb-6 transition-all duration-200 hover:scale-105"
                >
                    <div className="p-2 rounded-xl bg-surface-100 dark:bg-surface-800 group-hover:bg-brand-100 dark:group-hover:bg-brand-900/30 transition-colors mr-3">
                        <ArrowLeft className="h-5 w-5" />
                    </div>
                    <span className="font-medium">Back to Recipes</span>
                </button>

                {/* Header Content */}
                <div className="flex items-center gap-6">
                    {/* Icon */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-accent-600 rounded-2xl blur-lg opacity-60"></div>
                        <div className="relative p-4 bg-gradient-to-br from-brand-500 to-accent-600 rounded-2xl shadow-xl">
                            <ChefHat className="h-8 w-8 text-white" />
                        </div>
                        {/* Sparkle decoration */}
                        <div className="absolute -top-2 -right-2 p-1 bg-gradient-to-br from-accent-400 to-brand-500 rounded-full">
                            <Sparkles className="h-4 w-4 text-white" />
                        </div>
                    </div>

                    {/* Title and Description */}
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-surface-900 via-brand-600 to-surface-900 dark:from-white dark:via-brand-400 dark:to-surface-300 bg-clip-text text-transparent mb-2">
                            {isEditing ? 'Edit Recipe' : 'Create New Recipe'}
                        </h1>
                        <p className="text-lg text-surface-600 dark:text-surface-400 leading-relaxed">
                            {isEditing ? 'Update your recipe details and make it even better' : 'Share your culinary masterpiece with the world'}
                        </p>

                        {/* Progress indicator for new recipes */}
                        {!isEditing && (
                            <div className="flex items-center gap-2 mt-4">
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse"></div>
                                    <div className="w-2 h-2 bg-brand-300 rounded-full"></div>
                                    <div className="w-2 h-2 bg-brand-300 rounded-full"></div>
                                    <div className="w-2 h-2 bg-brand-300 rounded-full"></div>
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