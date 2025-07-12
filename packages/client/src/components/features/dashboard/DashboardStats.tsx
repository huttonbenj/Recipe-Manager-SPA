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
    statsLoading?: boolean;
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
            color: 'text-brand-600 dark:text-brand-400',
            bgColor: 'bg-brand-500/10',
            accentColor: 'bg-brand-500',
            trend: generateTrend()
        },
        {
            title: 'Total Likes',
            value: stats.totalLikes,
            icon: Heart,
            color: 'text-error-600 dark:text-error-400',
            bgColor: 'bg-error-500/10',
            accentColor: 'bg-error-500',
            trend: generateTrend()
        },
        {
            title: 'Avg Rating',
            value: stats.averageRating ? stats.averageRating.toFixed(1) : '0.0',
            icon: Star,
            color: 'text-warning-600 dark:text-warning-400',
            bgColor: 'bg-warning-500/10',
            accentColor: 'bg-warning-500',
            trend: generateTrend()
        },
        {
            title: 'Total Views',
            value: stats.totalViews,
            icon: TrendingUp,
            color: 'text-accent-600 dark:text-accent-400',
            bgColor: 'bg-accent-500/10',
            accentColor: 'bg-accent-500',
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
                                            ? "bg-success-500/10 text-success-600 dark:text-success-400"
                                            : "bg-error-500/10 text-error-600 dark:text-error-400",
                                        "group-hover:scale-105"
                                    )}>
                                        <TrendIcon className="h-3 w-3" />
                                        <span>{card.trend.value}%</span>
                                    </div>
                                )}
                            </div>

                            {/* Value */}
                            <div className="mb-2">
                                {statsLoading ? (
                                    <div className="h-8 bg-surface-200 dark:bg-surface-700 rounded animate-pulse" />
                                ) : (
                                    <div className={cn(
                                        "text-2xl font-bold text-surface-900 dark:text-white transition-all duration-300",
                                        "group-hover:scale-105"
                                    )}>
                                        {card.value}
                                    </div>
                                )}
                            </div>

                            {/* Title and description */}
                            <div>
                                <h3 className="text-sm font-medium text-surface-600 dark:text-surface-400 mb-1">
                                    {card.title}
                                </h3>
                                {card.trend && !statsLoading && (
                                    <p className="text-xs text-surface-500 dark:text-surface-500">
                                        {card.trend.value}% {card.trend.label} from last month
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Subtle shine effect on hover */}
                        <div className={cn(
                            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700",
                            "bg-gradient-to-r from-transparent via-white/5 to-transparent",
                            "transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]"
                        )} />
                    </div>
                );
            })}
        </div>
    );
};