import React from 'react';
import { useAuth } from '../hooks/useAuth';

export const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-900">Recipe Manager</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700">Welcome, {user?.name}</span>
                            <button
                                onClick={handleLogout}
                                className="btn-secondary text-sm"
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Welcome to Recipe Manager!
                            </h2>
                            <p className="text-gray-600 mb-6">
                                You're successfully logged in. Recipe management features coming soon!
                            </p>
                            <div className="space-y-2 text-sm text-gray-500">
                                <p><strong>User ID:</strong> {user?.id}</p>
                                <p><strong>Email:</strong> {user?.email}</p>
                                <p><strong>Name:</strong> {user?.name}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}; 