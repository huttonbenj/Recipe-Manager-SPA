import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, BookOpen, ArrowRight, Heart, Star, Clock, Zap, ChefHat, User } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { useTheme } from '../../../contexts/ThemeContext';
import { getThemeColors } from '../../../utils/theme';

export const DashboardQuickActions: React.FC = () => {
    const { theme } = useTheme();
    const themeColors = getThemeColors(theme.color);

    const quickActions = [
        {
            title: 'Create Recipe',
            description: 'Add a new recipe to your collection',
            icon: PlusCircle,
            to: '/recipes/new',
            color: `text-${themeColors.primary} dark:text-${themeColors.primaryDark}`,
            bgColor: `bg-${themeColors.primary}/10`,
            accentColor: `bg-${themeColors.primary}`,
            gradient: `from-${themeColors.primary} to-${themeColors.primaryHover}`
        },
        {
            title: 'Browse Recipes',
            description: 'Explore recipes from other users',
            icon: BookOpen,
            to: '/recipes',
            color: `text-${themeColors.secondary} dark:text-${themeColors.secondaryDark}`,
            bgColor: `bg-${themeColors.secondary}/10`,
            accentColor: `bg-${themeColors.secondary}`,
            gradient: `from-${themeColors.secondary} to-${themeColors.secondaryHover}`
        },
        {
            title: 'My Recipes',
            description: 'View and manage your recipes',
            icon: User,
            to: '/recipes?user_id=current',
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-500/10',
            accentColor: 'bg-purple-500',
            gradient: 'from-purple-500 to-purple-600'
        },
        {
            title: 'Favorites',
            description: 'Your liked recipes',
            icon: Heart,
            to: '/recipes?liked=true',
            color: 'text-red-600 dark:text-red-400',
            bgColor: 'bg-red-500/10',
            accentColor: 'bg-red-500',
            gradient: 'from-red-500 to-red-600'
        },
        {
            title: 'Saved Recipes',
            description: 'Recipes you saved for later',
            icon: Star,
            to: '/recipes?saved=true',
            color: 'text-yellow-600 dark:text-yellow-400',
            bgColor: 'bg-yellow-500/10',
            accentColor: 'bg-yellow-500',
            gradient: 'from-yellow-500 to-yellow-600'
        },
        {
            title: 'Quick & Easy',
            description: 'Recipes under 30 minutes',
            icon: Clock,
            to: '/recipes?cookTime=30&quickFilter=quick',
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-500/10',
            accentColor: 'bg-blue-500',
            gradient: 'from-blue-500 to-blue-600'
        },
        {
            title: 'Easy Recipes',
            description: 'Simple recipes for beginners',
            icon: Zap,
            to: '/recipes?difficulty=Easy&quickFilter=easy',
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-500/10',
            accentColor: 'bg-green-500',
            gradient: 'from-green-500 to-green-600'
        },
        {
            title: 'Popular Now',
            description: 'Most liked recipes',
            icon: ChefHat,
            to: '/recipes?sortBy=likes&sortOrder=desc&quickFilter=popular',
            color: `text-${themeColors.secondary} dark:text-${themeColors.secondaryDark}`,
            bgColor: `bg-${themeColors.secondary}/10`,
            accentColor: `bg-${themeColors.secondary}`,
            gradient: `from-${themeColors.secondary} to-${themeColors.secondaryHover}`
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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