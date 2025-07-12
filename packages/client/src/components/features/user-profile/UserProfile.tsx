import React from 'react';
import { useUserProfile } from '../../../hooks';
import { UserProfileHeader } from './UserProfileHeader';
import { UserProfileStats } from './UserProfileStats';
import { UserProfileActivity } from './UserProfileActivity';
import { UserProfileEditModal } from './UserProfileEditModal';
import { PageTransitionScale } from '../../ui/PageTransition';

export const UserProfile: React.FC = () => {
    const {
        user,
        stats,
        recipes,
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
        <PageTransitionScale>
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <UserProfileHeader user={user} onEditClick={handleEditClick} />
                        <UserProfileStats stats={stats} />
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <UserProfileActivity recipes={recipes} />
                    </div>
                </div>

                {isEditing && (
                    <UserProfileEditModal
                        isOpen={isEditing}
                        formData={formData}
                        isLoading={isLoading}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        onFormDataChange={handleFormDataChange}
                    />
                )}
            </div>
        </PageTransitionScale>
    );
}; 