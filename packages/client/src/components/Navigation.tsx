import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Navigation: React.FC = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/dashboard" className="flex-shrink-0 flex items-center">
                            <h1 className="text-xl font-bold text-gray-900">Recipe Manager</h1>
                        </Link>

                        <div className="hidden md:ml-8 md:flex md:space-x-8">
                            <Link
                                to="/dashboard"
                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/dashboard')
                                        ? 'border-blue-500 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/recipes"
                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/recipes')
                                        ? 'border-blue-500 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Recipes
                            </Link>
                            <Link
                                to="/recipes/new"
                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/recipes/new')
                                        ? 'border-blue-500 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Add Recipe
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="hidden md:flex md:items-center md:space-x-4">
                            <span className="text-sm text-gray-700">
                                Welcome, {user?.name}
                            </span>
                            <Link
                                to="/profile"
                                className={`text-sm font-medium ${isActive('/profile')
                                        ? 'text-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Profile
                            </Link>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="text-sm font-medium text-gray-500 hover:text-gray-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className="md:hidden">
                <div className="pt-2 pb-3 space-y-1">
                    <Link
                        to="/dashboard"
                        className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive('/dashboard')
                                ? 'bg-blue-50 border-blue-500 text-blue-700'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                            }`}
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/recipes"
                        className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive('/recipes')
                                ? 'bg-blue-50 border-blue-500 text-blue-700'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                            }`}
                    >
                        Recipes
                    </Link>
                    <Link
                        to="/recipes/new"
                        className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive('/recipes/new')
                                ? 'bg-blue-50 border-blue-500 text-blue-700'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                            }`}
                    >
                        Add Recipe
                    </Link>
                    <Link
                        to="/profile"
                        className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive('/profile')
                                ? 'bg-blue-50 border-blue-500 text-blue-700'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                            }`}
                    >
                        Profile
                    </Link>
                </div>
            </div>
        </nav>
    );
}; 