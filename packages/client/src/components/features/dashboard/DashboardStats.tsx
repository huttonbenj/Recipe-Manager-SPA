import React from 'react';
import { BookOpen, Heart, Star, TrendingUp } from 'lucide-react';

interface DashboardStatsProps {
    stats: {
        totalRecipes: number;
        totalLikes: number;
        averageRating: number;
        totalViews: number;
    };
    statsLoading: boolean;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, statsLoading }) => {
    const statCards = [
        {
            title: 'Your Recipes',
            value: stats.totalRecipes,
            icon: BookOpen,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Total Likes',
            value: stats.totalLikes,
            icon: Heart,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
        },
        {
            title: 'Avg Rating',
            value: stats.averageRating ? stats.averageRating.toFixed(1) : '0.0',
            icon: Star,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
        },
        {
            title: 'Total Views',
            value: stats.totalViews,
            icon: TrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((card) => {
                const Icon = card.icon;
                return (
                    <div key={card.title} className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className={`p-3 rounded-full ${card.bgColor}`}>
                                <Icon className={`h-6 w-6 ${card.color}`} />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                                {statsLoading ? (
                                    <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                                ) : (
                                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}; 