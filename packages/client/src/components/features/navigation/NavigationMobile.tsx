import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ChefHat, PlusCircle, User } from 'lucide-react';

interface NavigationMobileProps {
    isMenuOpen: boolean;
    user: {
        name: string;
        email: string;
    } | null;
    isActive: (path: string) => boolean;
    onMenuClose: () => void;
    onLogout: () => void;
}

export const NavigationMobile: React.FC<NavigationMobileProps> = ({
    isMenuOpen,
    user,
    isActive,
    onMenuClose,
    onLogout
}) => {
    const navItems = [
        { to: '/dashboard', label: 'Dashboard', icon: Home },
        { to: '/recipes', label: 'Recipes', icon: ChefHat },
        { to: '/recipes/new', label: 'Add Recipe', icon: PlusCircle },
    ];

    if (!isMenuOpen) return null;

    return (
        <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive(item.to)
                                ? 'bg-blue-50 border-blue-500 text-blue-700'
                                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                                }`}
                            onClick={onMenuClose}
                        >
                            <Icon className="h-4 w-4 inline mr-2" />
                            {item.label}
                        </Link>
                    );
                })}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                            <User className="h-6 w-6 text-white" />
                        </div>
                    </div>
                    <div className="ml-3">
                        <div className="text-base font-medium text-gray-800">
                            {user?.name}
                        </div>
                        <div className="text-sm font-medium text-gray-500">
                            {user?.email}
                        </div>
                    </div>
                </div>
                <div className="mt-3 space-y-1">
                    <Link
                        to="/profile"
                        className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                        onClick={onMenuClose}
                    >
                        Profile
                    </Link>
                    <button
                        onClick={onLogout}
                        className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    >
                        Sign out
                    </button>
                </div>
            </div>
        </div>
    );
}; 