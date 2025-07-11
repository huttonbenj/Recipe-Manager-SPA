import React from 'react';
import { Link } from 'react-router-dom';
import { Recipe } from '@recipe-manager/shared';
import { Sparkles, ChevronRight, Clock, Star, ArrowRight } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface DashboardRecommendationsProps {
    recipes: Recipe[];
    isLoading: boolean;
}

export const DashboardRecommendations: React.FC<DashboardRecommendationsProps> = ({
    recipes,
    isLoading
}) => {
    // If no recipes, we'll show some default recommendations
    const defaultRecommendations = [
        {
            title: 'Quick Weeknight Dinner',
            description: 'Easy recipes ready in under 30 minutes',
            image: 'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            category: 'Quick Meals',
            link: '/recipes?category=quick'
        },
        {
            title: 'Healthy Breakfast Ideas',
            description: 'Start your day with nutritious options',
            image: 'https://images.unsplash.com/photo-1494859802809-d069c3b71a8a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            category: 'Breakfast',
            link: '/recipes?category=breakfast'
        },
        {
            title: 'Weekend Baking Projects',
            description: 'Delicious treats to make when you have time',
            image: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            category: 'Baking',
            link: '/recipes?category=baking'
        }
    ];

    const displayedItems = recipes.length >= 3 ? recipes.slice(0, 3) : defaultRecommendations;

    return (
        <div className="glass-card bg-white/70 dark:bg-surface-900/70 backdrop-blur-sm rounded-xl p-6 border border-surface-200/60 dark:border-surface-800/60">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-accent-600 flex items-center justify-center shadow-md">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-50 font-display">
                        Recommended For You
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
                    <span>See all</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="rounded-xl overflow-hidden animate-pulse">
                            <div className="h-36 bg-surface-200 dark:bg-surface-700"></div>
                            <div className="p-3 space-y-2 bg-surface-100 dark:bg-surface-800">
                                <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-3/4"></div>
                                <div className="h-3 bg-surface-200 dark:bg-surface-700 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {displayedItems.map((item, index) => {
                        // Handle both Recipe objects and default recommendations
                        const isRecipe = 'id' in item;
                        const title = isRecipe ? item.title : item.title;
                        const description = isRecipe
                            ? item.instructions?.substring(0, 60) + '...'
                            : item.description;
                        const imageUrl = isRecipe ? item.image_url : item.image;
                        const link = isRecipe ? `/recipes/${item.id}` : item.link;
                        const category = isRecipe ? item.category : item.category;

                        return (
                            <Link
                                key={isRecipe ? item.id : index}
                                to={link}
                                className="group rounded-xl overflow-hidden border border-surface-200/60 dark:border-surface-700/60 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="relative h-36 overflow-hidden">
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt={title || "Recommendation"}
                                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="h-full w-full bg-gradient-to-br from-purple-500/20 to-accent-500/20 flex items-center justify-center">
                                            <Sparkles className="h-10 w-10 text-accent-400" />
                                        </div>
                                    )}

                                    {/* Overlay gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-surface-950/70 via-surface-950/30 to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-300"></div>

                                    {/* Category badge */}
                                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium bg-accent-500/90 text-white backdrop-blur-sm">
                                        {category || "Recipe"}
                                    </div>

                                    {/* If it's a real recipe, show some stats */}
                                    {isRecipe && (
                                        <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                            <div className="px-2 py-1 rounded-full text-xs font-medium bg-surface-900/70 text-white backdrop-blur-sm flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                <span>{item.cook_time || "30"} min</span>
                                            </div>
                                            <div className="px-2 py-1 rounded-full text-xs font-medium bg-surface-900/70 text-white backdrop-blur-sm flex items-center gap-1">
                                                <Star className="h-3 w-3" />
                                                <span>{(Math.random() * 1 + 4).toFixed(1)}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 bg-white dark:bg-surface-900">
                                    <h3 className="font-bold text-surface-900 dark:text-white mb-1 line-clamp-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                                        {title || "Recommendation"}
                                    </h3>
                                    <p className="text-xs text-surface-600 dark:text-surface-400 line-clamp-2 mb-2 h-8">
                                        {description || "Try something new today!"}
                                    </p>
                                    <div className="flex items-center justify-end">
                                        <span className="text-xs font-medium text-brand-600 dark:text-brand-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                                            View details
                                            <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-200" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}; 