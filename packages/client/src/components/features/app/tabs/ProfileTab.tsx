import React from 'react';
import { UserProfile } from '../../user-profile/UserProfile';
import { User } from 'lucide-react';
import { ThemeGradient } from '../ThemeGradient';

export const ProfileTab: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <ThemeGradient className="rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/20 rounded-xl">
                        <User className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold mb-1">
                            Profile Settings
                        </h1>
                        <p className="text-white/90">
                            Manage your account and preferences
                        </p>
                    </div>
                </div>
            </ThemeGradient>

            {/* User Profile with enhanced styling */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                <UserProfile />
            </div>
        </div>
    );
}; 