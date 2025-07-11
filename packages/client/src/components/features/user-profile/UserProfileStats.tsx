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
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
        },
        {
            title: 'Likes',
            value: stats?.totalLikes || 0,
            icon: Heart,
            color: 'text-red-600',
            bgColor: 'bg-red-100',
        },
        {
            title: 'Views',
            value: stats?.totalViews || 0,
            icon: Eye,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
        },
        {
            title: 'Avg Rating',
            value: stats?.averageRating ? stats.averageRating.toFixed(1) : 'N/A',
            icon: Award,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {statCards.map((card) => {
                const Icon = card.icon;
                return (
                    <div key={card.title} className="bg-white p-6 rounded-lg shadow text-center">
                        <div className={`w-12 h-12 ${card.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                            <Icon className={`h-6 w-6 ${card.color}`} />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                        <div className="text-sm text-gray-600">{card.title}</div>
                    </div>
                );
            })}
        </div>
    );
}; 