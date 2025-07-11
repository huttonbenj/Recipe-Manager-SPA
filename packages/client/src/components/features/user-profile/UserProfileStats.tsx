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
            title: 'Recipes',
            value: stats?.totalRecipes || 0,
            icon: ChefHat,
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        },
        {
            title: 'Likes',
            value: stats?.totalLikes || 0,
            icon: Heart,
            color: 'text-red-600 dark:text-red-400',
            bgColor: 'bg-red-100 dark:bg-red-900/30',
        },
        {
            title: 'Views',
            value: stats?.totalViews || 0,
            icon: Eye,
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-100 dark:bg-green-900/30',
        },
        {
            title: 'Avg Rating',
            value: stats?.averageRating ? stats.averageRating.toFixed(1) : 'N/A',
            icon: Award,
            color: 'text-yellow-600 dark:text-yellow-400',
            bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {statCards.map((card) => {
                const Icon = card.icon;
                return (
                    <div
                        key={card.title}
                        className="glass-card p-6 rounded-lg text-center group hover:scale-105 transition-all duration-300"
                    >
                        <div className={`w-12 h-12 ${card.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className={`h-6 w-6 ${card.color}`} />
                        </div>
                        <div className="text-2xl font-bold text-surface-900 dark:text-surface-50">{card.value}</div>
                        <div className="text-sm text-surface-600 dark:text-surface-400">{card.title}</div>
                    </div>
                );
            })}
        </div>
    );
}; 