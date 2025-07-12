import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Flame, Clock, Star } from 'lucide-react';
import { Recipe } from '@recipe-manager/shared';
import { Badge } from '../../ui/Badge';

interface DashboardCommunityRecipesProps {
    communityRecipes: Recipe[];
    isLoading: boolean;
}

export const DashboardCommunityRecipes: React.FC<DashboardCommunityRecipesProps> = ({ communityRecipes, isLoading }) => {
    return (
        <section className="bg-white/90 dark:bg-surface-900/90 backdrop-blur-md rounded-2xl border border-surface-200/50 dark:border-surface-800/50 p-6 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-up animation-delay-450">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                        <Flame className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-surface-900 dark:text-white">
                        Popular Community Recipes
                    </h2>
                </div>
                <Link
                    to="/recipes"
                    className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400 transition-colors duration-200 hover:underline"
                    aria-label="View all community recipes"
                >
                    View All
                    <ChevronRight className="h-4 w-4" />
                </Link>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="h-24 bg-surface-200/50 dark:bg-surface-800/50 rounded-xl"></div>
                    ))}
                </div>
            ) : communityRecipes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {communityRecipes.slice(0, 4).map((recipe, index) => (
                        <Link
                            key={recipe.id}
                            to={`/recipes/${recipe.id}`}
                            className="group flex items-center gap-4 bg-surface-50/50 dark:bg-surface-800/50 p-3 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-all duration-300 hover:shadow-md hover:scale-[1.03]"
                            style={{ animationDelay: `${index * 150}ms` }}
                            aria-label={`View recipe: ${recipe.title}`}
                        >
                            <img
                                src={recipe.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&h=150&fit=crop&crop=center'}
                                alt={recipe.title}
                                className="w-20 h-20 object-cover rounded-lg group-hover:ring-2 ring-brand-500/50 transition-all duration-300"
                                loading="lazy"
                            />
                            <div className="flex-1">
                                {recipe.category && (
                                    <Badge variant="outline" size="sm" className="mb-1">{recipe.category}</Badge>
                                )}
                                <h3 className="font-semibold text-surface-800 dark:text-surface-100 line-clamp-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-300">{recipe.title}</h3>
                                <div className="flex items-center gap-2 text-xs text-surface-600 dark:text-surface-400 mt-1">
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {recipe.cook_time} min
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Star className="h-3 w-3 text-amber-400" />
                                        {(recipe as any).rating?.toFixed(1) || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-surface-600 dark:text-surface-400">No community recipes available right now.</p>
                </div>
            )}
        </section>
    );
}; 