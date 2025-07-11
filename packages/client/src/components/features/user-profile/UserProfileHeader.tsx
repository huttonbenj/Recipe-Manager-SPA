import React from 'react';
import { User, Calendar, Edit } from 'lucide-react';

interface UserProfileHeaderProps {
    user: {
        name: string;
        email: string;
        created_at: Date;
    };
    onEditClick: () => void;
}

export const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
    user,
    onEditClick
}) => {
    return (
        <div className="glass-card p-6 rounded-lg">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center shadow-lg">
                        <User className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">{user.name}</h1>
                        <p className="text-surface-600 dark:text-surface-400">{user.email}</p>
                        <div className="flex items-center text-sm text-surface-500 dark:text-surface-400 mt-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onEditClick}
                    className="btn-primary"
                >
                    <Edit className="h-4 w-4" />
                    <span>Edit Profile</span>
                </button>
            </div>
        </div>
    );
}; 