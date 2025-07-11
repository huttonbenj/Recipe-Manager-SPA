import React from 'react';
import { useUserProfile } from '../../../hooks/useUserProfile';
import { UserProfileHeader } from './UserProfileHeader';
import { UserProfileEditModal } from './UserProfileEditModal';
import { UserProfileStats } from './UserProfileStats';
import { UserProfileActivity } from './UserProfileActivity';

export const UserProfile: React.FC = () => {
    const {
        user,
        stats,
        isEditing,
        formData,
        isLoading,
        handleSubmit,
        handleCancel,
        handleFormDataChange,
        handleEditClick,
    } = useUserProfile();

    if (!user) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">Please log in to view your profile</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <UserProfileHeader
                user={user}
                onEditClick={handleEditClick}
            />

            <UserProfileEditModal
                isOpen={isEditing}
                formData={formData}
                isLoading={isLoading}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                onFormDataChange={handleFormDataChange}
            />

            <UserProfileStats stats={stats} />

            <UserProfileActivity
                user={user}
                totalRecipes={stats.totalRecipes}
            />
        </div>
    );
}; 