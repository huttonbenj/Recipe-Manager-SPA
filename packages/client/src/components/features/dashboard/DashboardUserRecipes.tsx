import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Clock, ArrowRight, PlusCircle, Utensils, Calendar } from 'lucide-react';
import { Recipe } from '@recipe-manager/shared';
import { cn } from '../../../utils/cn';

interface DashboardUserRecipesProps {
    userRecipes: Recipe[];
    userRecipesLoading: boolean;
}

export const DashboardUserRecipes: React.FC<DashboardUserRecipesProps> = ({
    userRecipes,
    userRecipesLoading
}) => {
    return (
        <div className="glass-card bg-white/70 dark:bg-surface-900/70 backdrop-blur-sm rounded-xl p-6 border border-surface-200/60 dark:border-surface-800/60">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                        <Utensils className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-50 font-display">
                        Your Recent Recipes
                    </h2>
                </div>
                <Link
                    to="/recipes?filter=my-recipes"
                    className={cn(
                        "group flex items-center gap-2 text-sm font-medium",
                        "text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300",
                        "transition-all duration-200 hover:scale-105"
                    )}
                >
                    <span>View all</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
            </div>

            <div className="space-y-4">
                {userRecipesLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center space-x-4 p-3 rounded-lg bg-surface-50/50 dark:bg-surface-800/50 animate-pulse">
                                <div className="w-16 h-16 bg-surface-200 dark:bg-surface-700 rounded-lg"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="w-3/4 h-4 bg-surface-200 dark:bg-surface-700 rounded"></div>
                                    <div className="w-1/2 h-3 bg-surface-200 dark:bg-surface-700 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : userRecipes?.length ? (
                    <div className="space-y-3">
                        {userRecipes.map((recipe, index) => (
                            <Link
                                key={recipe.id}
                                to={`/recipes/${recipe.id}`}
                                className={cn(
                                    "group flex items-center space-x-4 p-3 rounded-lg transition-all duration-200",
                                    "hover:bg-surface-50/80 dark:hover:bg-surface-800/80",
                                    "hover:shadow-sm hover:scale-[1.02]",
                                    "border border-transparent hover:border-surface-200/60 dark:hover:border-surface-700/60"
                                )}
                                style={{
                                    animationDelay: `${index * 0.1}s`
                                }}
                            >
                                <div className="flex-shrink-0 relative">
                                    {recipe.image_url ? (
                                        <img
                                            className="h-16 w-16 rounded-lg object-cover ring-2 ring-transparent group-hover:ring-brand-500/20 transition-all duration-200"
                                            src={recipe.image_url}
                                            alt={recipe.title || "Recipe"}
                                        />
                                    ) : (
                                        <div className="h-16 w-16 bg-gradient-to-br from-surface-100 to-surface-200 dark:from-surface-800 dark:to-surface-700 rounded-lg flex items-center justify-center group-hover:from-brand-50 group-hover:to-brand-100 dark:group-hover:from-brand-900/20 dark:group-hover:to-brand-800/20 transition-all duration-200">
                                            <ChefHat className="h-8 w-8 text-surface-400 dark:text-surface-500 group-hover:text-brand-500 transition-colors duration-200" />
                                        </div>
                                    )}
                                    {/* Decorative dot */}
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-base font-medium text-surface-900 dark:text-surface-50 truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-200">
                                                {recipe.title || "Untitled Recipe"}
                                            </h3>
                                            <div className="flex items-center space-x-3 text-xs text-surface-500 dark:text-surface-400 mt-1">
                                                <span className="flex items-center space-x-1">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{recipe.cook_time || "30"} mins</span>
                                                </span>
                                                <span>•</span>
                                                <span className="capitalize">{recipe.difficulty || "Medium"}</span>
                                                {recipe.created_at && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="flex items-center space-x-1">
                                                            <Calendar className="h-3 w-3" />
                                                            <span>{new Date(recipe.created_at).toLocaleDateString()}</span>
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-surface-400 dark:text-surface-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 blur-sm opacity-20 animate-pulse" />
                            <div className="relative w-16 h-16 bg-gradient-to-br from-surface-100 to-surface-200 dark:from-surface-800 dark:to-surface-700 rounded-full flex items-center justify-center mx-auto">
                                <ChefHat className="h-8 w-8 text-surface-400 dark:text-surface-500" />
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-2">
                            No recipes yet
                        </h3>
                        <p className="text-surface-600 dark:text-surface-400 mb-6">
                            Start your culinary journey by creating your first recipe
                        </p>
                        <Link
                            to="/recipes/new"
                            className={cn(
                                "inline-flex items-center gap-2 px-4 py-2 rounded-lg",
                                "bg-gradient-to-r from-brand-500 to-accent-500 text-white",
                                "hover:from-brand-600 hover:to-accent-600 transition-all duration-200",
                                "hover:scale-105 shadow-lg hover:shadow-xl"
                            )}
                        >
                            <PlusCircle className="h-4 w-4" />
                            <span className="font-medium">Create your first recipe</span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}; 