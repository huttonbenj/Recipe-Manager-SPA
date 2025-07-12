import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../useAuth';
import { apiClient } from '../../services/api';
import toast from 'react-hot-toast';
import { Recipe, PaginatedResponse } from '@recipe-manager/shared';

export const useUserProfile = () => {
    const { user, updateProfile } = useAuth();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });

    // Fetch user stats
    const { data: stats } = useQuery({
        queryKey: ['user-stats'],
        queryFn: apiClient.getUserStats,
    });

    // Fetch user recipes
    const { data: recipeResponse } = useQuery<PaginatedResponse<Recipe>, Error>({
        queryKey: ['user-recipes', user?.id],
        queryFn: () => apiClient.getUserRecipes(user?.id),
        enabled: !!user?.id,
    });

    // Update user mutation
    const updateUserMutation = useMutation({
        mutationFn: (data: { name: string; email: string }) =>
            apiClient.updateProfile(data),
        onSuccess: (_updatedUser) => {
            toast.success('Profile updated successfully!');
            updateProfile(formData);
            setIsEditing(false);
            queryClient.invalidateQueries({ queryKey: ['user-stats'] });
        },
        onError: () => {
            toast.error('Failed to update profile');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateUserMutation.mutate(formData);
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
        });
        setIsEditing(false);
    };

    const handleFormDataChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    // Normalize stats data
    const normalizedStats = {
        totalRecipes: stats?.totalRecipes || 0,
        totalLikes: stats?.totalLikes || 0,
        totalViews: stats?.totalViews || 0,
        averageRating: stats?.averageRating || 0,
    };

    return {
        user,
        stats: normalizedStats,
        recipes: recipeResponse?.data || [],
        isEditing,
        formData,
        isLoading: updateUserMutation.isPending,
        handleSubmit,
        handleCancel,
        handleFormDataChange,
        handleEditClick,
    };
}; 