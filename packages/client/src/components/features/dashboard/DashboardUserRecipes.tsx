import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChefHat, Clock, Star } from 'lucide-react';
import { Recipe } from '@recipe-manager/shared';

interface DashboardUserRecipesProps {
    userRecipes: Recipe[];
    isLoading: boolean;
}

export const DashboardUserRecipes: React.FC<DashboardUserRecipesProps> = ({ userRecipes, isLoading }) => {
    return (
        <section className="bg-white/90 dark:bg-surface-900/90 backdrop-blur-md rounded-2xl border border-surface-200/50 dark:border-surface-800/50 p-6 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-up animation-delay-300">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                        <ChefHat className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-surface-900 dark:text-white">
                        Your Recipes
                    </h2>
                </div>
                <Link
                    to="/recipes?user_id=current"
                    className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400 transition-colors duration-200 hover:underline"
                    aria-label="View all your recipes"
                >
                    View All
                    <ChevronRight className="h-4 w-4" />
                </Link>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-48 bg-surface-200/50 dark:bg-surface-800/50 rounded-xl"></div>
                    ))}
                </div>
            ) : userRecipes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userRecipes.slice(0, 3).map((recipe, index) => (
                        <Link
                            key={recipe.id}
                            to={`/recipes/${recipe.id}`}
                            className="group relative overflow-hidden rounded-xl aspect-[4/3] shadow-sm hover:shadow-lg transition-all duration-300"
                            style={{ animationDelay: `${index * 150}ms` }}
                            aria-label={`View recipe: ${recipe.title}`}
                        >
                            <img
                                src={recipe.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop&crop=center'}
                                alt={recipe.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                                <h3 className="text-white font-semibold line-clamp-1 group-hover:text-brand-300 transition-colors duration-300">{recipe.title}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-white/80 flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {recipe.cook_time} min
                                    </span>
                                    <span className="text-xs text-white/80 flex items-center gap-1">
                                        <Star className="h-3 w-3 text-amber-400" />
                                        {/* Assuming rating is available, replace with actual data */}
                                        {(recipe as any).rating?.toFixed(1) || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-surface-600 dark:text-surface-400">You haven't created any recipes yet.</p>
                    <Link to="/recipes/new" className="text-brand-600 dark:text-brand-400 font-medium hover:underline mt-2 inline-block">
                        Create your first recipe
                    </Link>
                </div>
            )}
        </section>
    );
}; 