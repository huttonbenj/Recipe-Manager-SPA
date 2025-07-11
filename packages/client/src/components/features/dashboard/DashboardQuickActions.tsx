import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, BookOpen, ChefHat } from 'lucide-react';

export const DashboardQuickActions: React.FC = () => {
    const quickActions = [
        {
            title: 'Add New Recipe',
            description: 'Create a new recipe to share with the community',
            icon: PlusCircle,
            to: '/recipes/new',
            color: 'bg-blue-500 hover:bg-blue-600',
        },
        {
            title: 'Browse Recipes',
            description: 'Explore recipes from other users',
            icon: BookOpen,
            to: '/recipes',
            color: 'bg-green-500 hover:bg-green-600',
        },
        {
            title: 'Search Recipes',
            description: 'Find recipes by ingredients or cuisine',
            icon: ChefHat,
            to: '/recipes',
            color: 'bg-purple-500 hover:bg-purple-600',
        },
    ];

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                        <Link
                            key={action.title}
                            to={action.to}
                            className={`p-4 rounded-lg text-white transition-colors ${action.color}`}
                        >
                            <Icon className="h-8 w-8 mb-2" />
                            <h3 className="font-semibold">{action.title}</h3>
                            <p className="text-sm opacity-90">{action.description}</p>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}; 