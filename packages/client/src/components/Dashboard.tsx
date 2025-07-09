import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold text-gray-900">
                                Recipe Manager
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700">
                                Welcome, {user?.name}
                            </span>
                            <button
                                onClick={logout}
                                className="btn-secondary"
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="card p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Dashboard
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Welcome to your Recipe Manager dashboard. Here you can manage your recipes,
                            create new ones, and organize your culinary collection.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="card p-4 text-center">
                                <div className="text-3xl font-bold text-primary-600 mb-2">0</div>
                                <div className="text-sm text-gray-600">Total Recipes</div>
                            </div>

                            <div className="card p-4 text-center">
                                <div className="text-3xl font-bold text-primary-600 mb-2">0</div>
                                <div className="text-sm text-gray-600">Favorites</div>
                            </div>

                            <div className="card p-4 text-center">
                                <div className="text-3xl font-bold text-primary-600 mb-2">0</div>
                                <div className="text-sm text-gray-600">Categories</div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <Link to="/recipes/new" className="btn-primary mr-4">
                                Add New Recipe
                            </Link>
                            <Link to="/recipes" className="btn-secondary">
                                Browse Recipes
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}; 