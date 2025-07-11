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
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                        <p className="text-gray-600">{user.email}</p>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onEditClick}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    <Edit className="h-4 w-4" />
                    <span>Edit Profile</span>
                </button>
            </div>
        </div>
    );
}; 