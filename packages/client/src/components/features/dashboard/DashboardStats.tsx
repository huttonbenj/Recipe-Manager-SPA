import React from 'react';
import { BookOpen, Heart, Star, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface DashboardStatsProps {
    stats: {
        totalRecipes: number;
        totalLikes: number;
        averageRating: number;
        totalViews: number;
    };
    statsLoading: boolean;
}

interface StatCard {
    title: string;
    value: string | number;
    icon: React.ComponentType<any>;
    color: string;
    bgColor: string;
    accentColor: string;
    trend?: {
        value: number;
        isPositive: boolean;
        label: string;
    };
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, statsLoading }) => {
    // Generate mock trend data for demonstration
    const generateTrend = () => {
        const change = Math.floor(Math.random() * 20) - 10; // -10 to +10
        return {
            value: Math.abs(change),
            isPositive: change >= 0,
            label: change >= 0 ? 'increase' : 'decrease'
        };
    };

    const statCards: StatCard[] = [
        {
            title: 'Your Recipes',
            value: stats.totalRecipes,
            icon: BookOpen,
            color: 'text-teal-600 dark:text-teal-400',
            bgColor: 'bg-teal-500/10',
            accentColor: 'bg-teal-500',
            trend: generateTrend()
        },
        {
            title: 'Total Likes',
            value: stats.totalLikes,
            icon: Heart,
            color: 'text-rose-600 dark:text-rose-400',
            bgColor: 'bg-rose-500/10',
            accentColor: 'bg-rose-500',
            trend: generateTrend()
        },
        {
            title: 'Avg Rating',
            value: stats.averageRating ? stats.averageRating.toFixed(1) : '0.0',
            icon: Star,
            color: 'text-amber-600 dark:text-amber-400',
            bgColor: 'bg-amber-500/10',
            accentColor: 'bg-amber-500',
            trend: generateTrend()
        },
        {
            title: 'Total Views',
            value: stats.totalViews,
            icon: TrendingUp,
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-500/10',
            accentColor: 'bg-blue-500',
            trend: generateTrend()
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card, index) => {
                const Icon = card.icon;
                const TrendIcon = card.trend?.isPositive ? ArrowUp : ArrowDown;

                return (
                    <div
                        key={card.title}
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
                            card.accentColor,
                            "group-hover:h-1"
                        )} />

                        {/* Floating orb decoration */}
                        <div className={cn(
                            "absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-20 transition-all duration-500",
                            card.accentColor,
                            "group-hover:scale-150 group-hover:opacity-30"
                        )} />

                        <div className="relative z-10">
                            {/* Header with icon and trend */}
                            <div className="flex items-center justify-between mb-4">
                                <div className={cn(
                                    "p-2.5 rounded-xl transition-all duration-300",
                                    card.bgColor,
                                    "group-hover:scale-110 group-hover:shadow-md"
                                )}>
                                    <Icon className={cn(
                                        "h-5 w-5 transition-colors duration-300",
                                        card.color
                                    )} />
                                </div>

                                {/* Trend indicator */}
                                {card.trend && !statsLoading && (
                                    <div className={cn(
                                        "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-300",
                                        card.trend.isPositive
                                            ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                            : "bg-red-500/10 text-red-600 dark:text-red-400",
                                        "group-hover:scale-105"
                                    )}>
                                        <TrendIcon className="h-3 w-3" />
                                        <span>{card.trend.value}%</span>
                                    </div>
                                )}
                            </div>

                            {/* Title */}
                            <p className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-2 transition-colors duration-300 group-hover:text-surface-600 dark:group-hover:text-surface-300">
                                {card.title}
                            </p>

                            {/* Value */}
                            {statsLoading ? (
                                <div className="space-y-2">
                                    <div className="w-20 h-8 bg-surface-200 dark:bg-surface-700 rounded-lg animate-pulse"></div>
                                    <div className="w-16 h-3 bg-surface-200 dark:bg-surface-700 rounded animate-pulse"></div>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    <div className="flex items-end gap-1">
                                        <p className={cn(
                                            "text-3xl font-bold transition-all duration-300",
                                            "text-surface-900 dark:text-white",
                                            "group-hover:text-4xl group-hover:scale-105"
                                        )}>
                                            {card.value}
                                        </p>
                                        {card.title === 'Avg Rating' && (
                                            <Star className="h-4 w-4 text-amber-500 mb-1.5 ml-1 transition-all duration-300 group-hover:scale-110" />
                                        )}
                                    </div>

                                    {/* Trend description */}
                                    {card.trend && (
                                        <p className={cn(
                                            "text-xs transition-colors duration-300",
                                            card.trend.isPositive
                                                ? "text-green-600 dark:text-green-400"
                                                : "text-red-600 dark:text-red-400"
                                        )}>
                                            {card.trend.value}% {card.trend.label} this week
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Hover glow effect */}
                        <div className={cn(
                            "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                            "bg-gradient-to-r from-transparent via-white/5 to-transparent dark:via-white/5",
                            "animate-pulse"
                        )} />
                    </div>
                );
            })}
        </div>
    );
};