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
            color: 'text-teal-600 dark:text-teal-400',
            bgColor: 'bg-teal-500/10',
            accentColor: 'bg-teal-500',
            gradient: 'from-teal-500 to-emerald-500'
        },
        {
            title: 'Browse Recipes',
            description: 'Explore recipes from other users',
            icon: BookOpen,
            to: '/recipes',
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-500/10',
            accentColor: 'bg-blue-500',
            gradient: 'from-blue-500 to-indigo-500'
        },
        {
            title: 'Search Recipes',
            description: 'Find recipes by ingredients or cuisine',
            icon: Search,
            to: '/recipes?view=search',
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-500/10',
            accentColor: 'bg-purple-500',
            gradient: 'from-purple-500 to-violet-500'
        },
        {
            title: 'Filter Favorites',
            description: 'View your favorite recipes',
            icon: Filter,
            to: '/recipes?filter=favorites',
            color: 'text-rose-600 dark:text-rose-400',
            bgColor: 'bg-rose-500/10',
            accentColor: 'bg-rose-500',
            gradient: 'from-rose-500 to-pink-500'
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                    <Link
                        key={action.title}
                        to={action.to}
                        className={cn(
                            "group relative p-6 rounded-2xl transition-all duration-300 overflow-hidden",
                            "bg-white/90 dark:bg-surface-900/80 backdrop-blur-md",
                            "border border-surface-200/60 dark:border-surface-700/60",
                            "hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02]",
                            "focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                        )}
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        {/* Enhanced background gradient effect */}
                        <div
                            className={`absolute -right-10 -top-10 w-20 h-20 rounded-full opacity-10 dark:opacity-20 group-hover:scale-150 group-hover:opacity-20 dark:group-hover:opacity-30 transition-all duration-500 ease-out bg-gradient-to-br ${action.gradient}`}
                        ></div>

                        {/* Floating orb decoration */}
                        <div className={`absolute top-2 right-2 w-3 h-3 rounded-full opacity-30 group-hover:opacity-60 transition-opacity duration-300 bg-gradient-to-br ${action.gradient}`}></div>

                        {/* Enhanced Icon */}
                        <div className="relative z-10 mb-5">
                            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${action.gradient} text-white shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                                <Icon className="h-6 w-6" />
                            </div>
                        </div>

                        {/* Enhanced Content */}
                        <div className="relative z-10">
                            <h3 className="font-bold text-lg text-surface-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors flex items-center mb-2">
                                {action.title}
                                <ArrowRight className="h-4 w-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                            </h3>
                            <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed line-clamp-2">
                                {action.description}
                            </p>
                        </div>

                        {/* Subtle hover glow */}
                        <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/5 to-transparent dark:via-white/5`}></div>
                    </Link>
                );
            })}
        </div>
    );
}; 