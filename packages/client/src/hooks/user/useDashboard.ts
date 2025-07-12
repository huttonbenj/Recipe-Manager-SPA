import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Recipe, UserStats } from '@recipe-manager/shared';
import { useAuth } from '../useAuth';
import { recipeService } from '../../services/recipes';
import { authService } from '../../services/auth';

export interface ActivityItem {
    id: string;
    type: 'create' | 'like' | 'comment' | 'rating' | 'view';
    recipeId: string;
    recipeTitle: string;
    timestamp: Date;
    userName?: string;
    userAvatar?: string;
}

export const useDashboard = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
    const [communityRecipes, setCommunityRecipes] = useState<Recipe[]>([]);
    const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    
    // Fetch user stats using React Query
    const { data: userStats, isLoading: statsLoading } = useQuery<UserStats>({
        queryKey: ['userStats', user?.id],
        queryFn: () => authService.getUserStats(),
        enabled: !!user,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
    
    // Load actual data from API
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            
            try {
                // Fetch user's recipes (use authenticated endpoint)
                const userRecipesResponse = await recipeService.getUserRecipes();
                setUserRecipes(userRecipesResponse.data || []);
                
                // Fetch community recipes (all recipes)
                const communityResponse = await recipeService.getRecipes({ page: 1, limit: 10 });
                setCommunityRecipes(communityResponse.data || []);
                
                // Initialize favorites based on liked status from API
                const initialFavorites = new Set<string>();
                communityResponse.data?.forEach(recipe => {
                    if ((recipe as any).liked) {
                        initialFavorites.add(recipe.id);
                    }
                });
                setFavorites(initialFavorites);
                
                // Mock activities (would be replaced with actual API)
                const mockActivities: ActivityItem[] = [
                    {
                        id: '1',
                        type: 'create',
                        recipeId: userRecipesResponse.data?.[0]?.id || '1',
                        recipeTitle: userRecipesResponse.data?.[0]?.title || 'Recent Recipe',
                        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2)
                    },
                    {
                        id: '2',
                        type: 'like',
                        recipeId: communityResponse.data?.[0]?.id || '2',
                        recipeTitle: communityResponse.data?.[0]?.title || 'Popular Recipe',
                        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
                        userName: 'Sarah Johnson',
                        userAvatar: 'SJ'
                    }
                ];
                
                setActivities(mockActivities);
                setIsLoading(false);
            } catch (error) {

                console.error('Error loading dashboard data:', error);
                setIsLoading(false);
            }
        };
        
        if (user) {
            loadData();
        }
    }, [user]);
    
    const toggleFavorite = async (id: string) => {
        if (!user) {
            console.error('Dashboard: User not authenticated');
            return;
        }
        
        const wasLiked = favorites.has(id);
        
        try {
            if (wasLiked) {
                await recipeService.unlikeRecipe(id);
                setFavorites(prev => {
                    const newFavorites = new Set(prev);
                    newFavorites.delete(id);
                    return newFavorites;
                });
                setFavoriteRecipes(prev => prev.filter(recipe => recipe.id !== id));
            } else {
                await recipeService.likeRecipe(id);
                setFavorites(prev => {
                    const newFavorites = new Set(prev);
                    newFavorites.add(id);
                    return newFavorites;
                });
                const recipe = [...userRecipes, ...communityRecipes].find(r => r.id === id);
                if (recipe) {
                    setFavoriteRecipes(prev => [...prev, recipe]);
                }
            }
            
            // Invalidate stats cache to refresh the like count
            queryClient.invalidateQueries({ queryKey: ['userStats', user.id] });
        } catch (error) {
            console.error('Dashboard: Error toggling favorite:', error);
            // Optionally show a toast notification here
        }
    };
    
    const isFavorite = (id: string) => favorites.has(id);
    
    return {
        userRecipes,
        communityRecipes,
        favoriteRecipes,
        activities,
        isLoading,
        userStats,
        statsLoading,
        toggleFavorite,
        isFavorite
    };
}; 