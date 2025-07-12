import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, BookOpen, Search, Filter, ArrowRight } from 'lucide-react';
import { cn } from '../../../utils/cn';

export const DashboardQuickActions: React.FC = () => {
    const quickActions = [
        {
            title: 'Create Recipe',
            description: 'Add a new recipe to your collection',
            icon: PlusCircle,
            to: '/recipes/new',
            color: 'text-brand-600 dark:text-brand-400',
            bgColor: 'bg-brand-500/10',
            accentColor: 'bg-brand-500',
            gradient: 'from-brand-500 to-brand-600'
        },
        {
            title: 'Browse Recipes',
            description: 'Explore recipes from other users',
            icon: BookOpen,
            to: '/recipes',
            color: 'text-accent-600 dark:text-accent-400',
            bgColor: 'bg-accent-500/10',
            accentColor: 'bg-accent-500',
            gradient: 'from-accent-500 to-accent-600'
        },
        {
            title: 'Search Recipes',
            description: 'Find recipes by ingredients or cuisine',
            icon: Search,
            to: '/recipes?view=search',
            color: 'text-surface-600 dark:text-surface-400',
            bgColor: 'bg-surface-500/10',
            accentColor: 'bg-surface-500',
            gradient: 'from-surface-500 to-surface-600'
        },
        {
            title: 'Filter Favorites',
            description: 'View your favorite recipes',
            icon: Filter,
            to: '/recipes?filter=favorites',
            color: 'text-error-600 dark:text-error-400',
            bgColor: 'bg-error-500/10',
            accentColor: 'bg-error-500',
            gradient: 'from-error-500 to-error-600'
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
                const Icon = action.icon;

                return (
                    <Link
                        key={action.title}
                        to={action.to}
                        className={cn(
                            "group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 h-full",
                            "bg-white/80 dark:bg-surface-900/60 backdrop-blur-sm",
                            "border border-surface-200/50 dark:border-surface-800/50",
                            "hover:shadow-lg hover:shadow-surface-500/10 dark:hover:shadow-surface-900/20",
                            "hover:border-surface-300/60 dark:hover:border-surface-700/60",
                            "hover:-translate-y-1 cursor-pointer"
                        )}
                        style={{
                            animationDelay: `${index * 100}ms`
                        }}
                    >
                        {/* Animated background gradient */}
                        <div className={cn(
                            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                            "bg-gradient-to-br from-transparent via-transparent to-surface-50/50 dark:to-surface-800/50"
                        )} />

                        {/* Top accent line with animation */}
                        <div className={cn(
                            "absolute top-0 left-0 right-0 h-0.5 transition-all duration-300",
                            action.accentColor,
                            "group-hover:h-1"
                        )} />

                        {/* Floating orb decoration */}
                        <div className={cn(
                            "absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-20 transition-all duration-500",
                            action.accentColor,
                            "group-hover:scale-150 group-hover:opacity-30"
                        )} />

                        <div className="relative z-10">
                            {/* Header with icon */}
                            <div className="flex items-center justify-between mb-4">
                                <div className={cn(
                                    "p-2.5 rounded-xl transition-all duration-300",
                                    action.bgColor,
                                    "group-hover:scale-110 group-hover:shadow-md"
                                )}>
                                    <Icon className={cn(
                                        "h-5 w-5 transition-colors duration-300",
                                        action.color
                                    )} />
                                </div>

                                {/* Arrow icon */}
                                <ArrowRight className={cn(
                                    "h-4 w-4 transition-all duration-300",
                                    "text-surface-400 dark:text-surface-500",
                                    "group-hover:text-surface-600 dark:group-hover:text-surface-400",
                                    "group-hover:translate-x-1"
                                )} />
                            </div>

                            {/* Title and description */}
                            <div>
                                <h3 className={cn(
                                    "text-sm font-semibold text-surface-900 dark:text-white mb-1",
                                    "transition-colors duration-300"
                                )}>
                                    {action.title}
                                </h3>
                                <p className="text-xs text-surface-600 dark:text-surface-400">
                                    {action.description}
                                </p>
                            </div>
                        </div>

                        {/* Subtle shine effect on hover */}
                        <div className={cn(
                            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700",
                            "bg-gradient-to-r from-transparent via-white/5 to-transparent",
                            "transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]"
                        )} />
                    </Link>
                );
            })}
        </div>
    );
}; 