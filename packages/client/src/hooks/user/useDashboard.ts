import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../useAuth';
import { apiClient } from '../../services/api';

export const useDashboard = () => {
    const { user } = useAuth();
    const [greeting, setGreeting] = useState('');

    // Set greeting based on time of day
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) {
            setGreeting('Good morning');
        } else if (hour < 17) {
            setGreeting('Good afternoon');
        } else {
            setGreeting('Good evening');
        }
    }, []);

    // Fetch user stats
    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['user-stats'],
        queryFn: apiClient.getUserStats,
    });

    // Fetch recent recipes
    const { data: recentRecipes, isLoading: recentRecipesLoading } = useQuery({
        queryKey: ['recent-recipes'],
        queryFn: () => apiClient.getRecipes({ page: 1, limit: 3 }),
    });

    // Fetch user's recipes
    const { data: userRecipes, isLoading: userRecipesLoading } = useQuery({
        queryKey: ['user-recipes'],
        queryFn: () => apiClient.getUserRecipes(user?.id, { page: 1, limit: 3 }),
    });

    // Normalize stats data
    const normalizedStats = {
        totalRecipes: stats?.totalRecipes || 0,
        totalLikes: stats?.totalLikes || 0,
        averageRating: stats?.averageRating || 0,
        totalViews: stats?.totalViews || 0,
    };

    return {
        greeting,
        stats: normalizedStats,
        statsLoading,
        recentRecipes: recentRecipes?.data || [],
        recentRecipesLoading,
        userRecipes: userRecipes?.data || [],
        userRecipesLoading,
        user,
    };
}; 