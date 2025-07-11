import React from 'react';
import { Link } from 'react-router-dom';
import { Recipe } from '@recipe-manager/shared';
import { ChefHat, Heart, Eye, Clock, TrendingUp, Star, ArrowRight } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface DashboardCommunityRecipesProps {
    recipes: Recipe[];
    isLoading: boolean;
    isFavorite: (id: string) => boolean;
    onToggleFavorite: (id: string) => void;
}

export const DashboardCommunityRecipes: React.FC<DashboardCommunityRecipesProps> = ({
    recipes,
    isLoading,
    isFavorite,
    onToggleFavorite
}) => {
    return (
        <div className="glass-card bg-white/70 dark:bg-surface-900/70 backdrop-blur-sm rounded-xl p-6 border border-surface-200/60 dark:border-surface-800/60">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
                        <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-50 font-display">
                        Community Highlights
                    </h2>
                </div>
                <Link
                    to="/recipes/explore"
                    className={cn(
                        "group flex items-center gap-2 text-sm font-medium",
                        "text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300",
                        "transition-all duration-200 hover:scale-105"
                    )}
                >
                    <span>Explore more</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="rounded-xl overflow-hidden animate-pulse">
                            <div className="h-48 bg-surface-200 dark:bg-surface-700"></div>
                            <div className="p-4 space-y-3 bg-surface-100 dark:bg-surface-800">
                                <div className="h-5 bg-surface-200 dark:bg-surface-700 rounded w-3/4"></div>
                                <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-1/2"></div>
                                <div className="flex justify-between">
                                    <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-1/4"></div>
                                    <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-1/4"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : recipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {recipes.map((recipe) => (
                        <div
                            key={recipe.id}
                            className="group rounded-xl overflow-hidden border border-surface-200/60 dark:border-surface-700/60 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="relative h-48 overflow-hidden">
                                {recipe.image_url ? (
                                    <img
                                        src={recipe.image_url}
                                        alt={recipe.title || "Recipe"}
                                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="h-full w-full bg-gradient-to-br from-surface-100 to-surface-200 dark:from-surface-800 dark:to-surface-700 flex items-center justify-center">
                                        <ChefHat className="h-12 w-12 text-surface-400 dark:text-surface-600" />
                                    </div>
                                )}

                                {/* Overlay elements */}
                                <div className="absolute inset-0 bg-gradient-to-t from-surface-950/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                {/* Time badge */}
                                <div className="absolute top-3 left-3 px-2.5 py-1.5 rounded-full text-xs font-medium bg-surface-900/70 text-white backdrop-blur-sm">
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        <span>{recipe.cook_time || "30"} min</span>
                                    </div>
                                </div>

                                {/* Favorite button */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onToggleFavorite(recipe.id);
                                    }}
                                    className="absolute top-3 right-3 p-2 rounded-full bg-surface-900/50 backdrop-blur-sm text-white hover:bg-surface-900/70 transition-colors"
                                >
                                    <Heart
                                        className={cn(
                                            "h-4 w-4 transition-colors",
                                            isFavorite(recipe.id) ? "text-rose-500 fill-rose-500" : "text-white"
                                        )}
                                    />
                                </button>

                                {/* User info on hover */}
                                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center text-xs font-bold text-surface-600 dark:text-surface-300">
                                            {recipe.user?.name?.charAt(0) || 'U'}
                                        </div>
                                        <span className="text-xs font-medium text-white">
                                            {recipe.user?.name || 'Anonymous'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Link to={`/recipes/${recipe.id}`} className="block p-4 bg-white dark:bg-surface-900">
                                <h3 className="font-bold text-surface-900 dark:text-white mb-1 line-clamp-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                                    {recipe.title || "Untitled Recipe"}
                                </h3>
                                <p className="text-sm text-surface-600 dark:text-surface-400 line-clamp-2 mb-3 h-10">
                                    {recipe.instructions?.substring(0, 80) || "No description available."}
                                </p>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-surface-500 dark:text-surface-400">
                                        {recipe.created_at ? new Date(recipe.created_at).toLocaleDateString() : "Recent"}
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-1 text-rose-500">
                                            <Heart className="h-3 w-3" />
                                            {Math.floor(Math.random() * 50) + 5}
                                        </span>
                                        <span className="flex items-center gap-1 text-blue-500">
                                            <Eye className="h-3 w-3" />
                                            {Math.floor(Math.random() * 100) + 10}
                                        </span>
                                        <span className="flex items-center gap-1 text-yellow-500">
                                            <Star className="h-3 w-3" />
                                            {(Math.random() * 1 + 4).toFixed(1)}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="rounded-xl p-8 text-center bg-surface-50/50 dark:bg-surface-800/50">
                    <div className="inline-flex h-16 w-16 rounded-full bg-amber-500/10 items-center justify-center mb-4">
                        <ChefHat className="h-8 w-8 text-amber-500" />
                    </div>
                    <h3 className="text-lg font-medium text-surface-900 dark:text-surface-50 mb-2">
                        No community recipes yet
                    </h3>
                    <p className="text-surface-600 dark:text-surface-400 max-w-md mx-auto">
                        Be the first to share your culinary creations with the community!
                    </p>
                </div>
            )}
        </div>
    );
}; 