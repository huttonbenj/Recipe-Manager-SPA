import React from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';

interface NavigationUserMenuProps {
    user: {
        name: string;
        email: string;
    } | null;
    isUserMenuOpen: boolean;
    onToggleUserMenu: () => void;
    onLogout: () => void;
}

export const NavigationUserMenu: React.FC<NavigationUserMenuProps> = ({
    user,
    isUserMenuOpen,
    onToggleUserMenu,
    onLogout
}) => {
    return (
        <div className="hidden md:ml-6 md:flex md:items-center">
            <div className="ml-3 relative">
                <button
                    onClick={onToggleUserMenu}
                    className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                    </div>
                </button>

                {isUserMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                            <div className="px-4 py-2 text-sm text-gray-700 border-b">
                                {user?.name}
                                <br />
                                <span className="text-gray-500">{user?.email}</span>
                            </div>
                            <Link
                                to="/profile"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={onToggleUserMenu}
                            >
                                <User className="h-4 w-4 inline mr-2" />
                                Profile
                            </Link>
                            <button
                                onClick={onLogout}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <LogOut className="h-4 w-4 inline mr-2" />
                                Sign out
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}; 