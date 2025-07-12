import React from 'react';
import { ChefHat, Heart, Eye, Award } from 'lucide-react';

interface UserProfileStatsProps {
    stats: {
        totalRecipes: number;
        totalLikes: number;
        totalViews: number;
        averageRating: number;
    };
}

export const UserProfileStats: React.FC<UserProfileStatsProps> = ({ stats }) => {
    const statCards = [
        {
            title: 'Recipes Created',
            value: stats?.totalRecipes || 0,
            icon: ChefHat,
            color: 'text-brand-600 dark:text-brand-400',
            bgColor: 'bg-brand-100 dark:bg-brand-900/30',
        },
        {
            title: 'Total Likes',
            value: stats?.totalLikes || 0,
            icon: Heart,
            color: 'text-error-600 dark:text-error-400',
            bgColor: 'bg-error-100 dark:bg-error-900/30',
        },
        {
            title: 'Total Views',
            value: stats?.totalViews || 0,
            icon: Eye,
            color: 'text-success-600 dark:text-success-400',
            bgColor: 'bg-success-100 dark:bg-success-900/30',
        },
        {
            title: 'Average Rating',
            value: stats?.averageRating ? stats.averageRating.toFixed(1) : 'N/A',
            icon: Award,
            color: 'text-warning-600 dark:text-warning-400',
            bgColor: 'bg-warning-100 dark:bg-warning-900/30',
        },
    ];

    return (
        <div className="bg-surface-50 dark:bg-surface-800 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-surface-900 dark:text-surface-50 mb-4">User Statistics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.title}
                            className="bg-white dark:bg-surface-700 p-4 rounded-lg flex items-center space-x-4 transition-transform duration-300 hover:scale-105"
                        >
                            <div className={`w-12 h-12 ${card.bgColor} rounded-full flex items-center justify-center`}>
                                <Icon className={`h-6 w-6 ${card.color}`} />
                            </div>
                            <div>
                                <p className="text-sm text-surface-600 dark:text-surface-400">{card.title}</p>
                                <p className="text-2xl font-bold text-surface-900 dark:text-surface-50">{card.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}; 