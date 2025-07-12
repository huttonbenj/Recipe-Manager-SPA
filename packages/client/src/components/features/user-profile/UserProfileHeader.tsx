import React from 'react';
import { User, Calendar, Edit } from 'lucide-react';
import { Button } from '../../ui/Button';

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
        <div className="relative rounded-lg overflow-hidden shadow-lg">
            {/* Background Image */}
            <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
                alt="Profile background"
                className="w-full h-48 object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="flex items-end justify-between">
                    <div className="flex items-end space-x-4">
                        <div className="w-24 h-24 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center shadow-lg border-4 border-surface-50 dark:border-surface-800">
                            <User className="h-12 w-12 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white shadow-md">{user.name}</h1>
                            <p className="text-surface-200 shadow-sm">{user.email}</p>
                            <div className="flex items-center text-sm text-surface-300 mt-1">
                                <Calendar className="h-4 w-4 mr-1.5" />
                                <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    <Button
                        onClick={onEditClick}
                        variant="secondary"
                        size="sm"
                        className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                    >
                        <Edit className="h-4 w-4" />
                        <span>Edit Profile</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}; 