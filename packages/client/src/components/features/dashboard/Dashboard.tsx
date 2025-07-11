import React from 'react';
import { useDashboard } from '../../../hooks/useDashboard';
import { DashboardHeader } from './DashboardHeader';
import { DashboardStats } from './DashboardStats';
import { DashboardQuickActions } from './DashboardQuickActions';
import { DashboardUserRecipes } from './DashboardUserRecipes';
import { DashboardCommunityRecipes } from './DashboardCommunityRecipes';

export const Dashboard: React.FC = () => {
    const {
        greeting,
        stats,
        statsLoading,
        recentRecipes,
        recentRecipesLoading,
        userRecipes,
        userRecipesLoading,
        user,
    } = useDashboard();

    return (
        <div className="space-y-8">
            <DashboardHeader
                greeting={greeting}
                userName={user?.name || 'User'}
                stats={stats}
                statsLoading={statsLoading}
            />

            <DashboardStats
                stats={stats}
                statsLoading={statsLoading}
            />

            <DashboardQuickActions />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DashboardUserRecipes
                    userRecipes={userRecipes}
                    userRecipesLoading={userRecipesLoading}
                />

                <DashboardCommunityRecipes
                    recentRecipes={recentRecipes}
                    recentRecipesLoading={recentRecipesLoading}
                />
            </div>
        </div>
    );
}; 