import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ChefHat, PlusCircle } from 'lucide-react';

interface NavigationDesktopProps {
    isActive: (path: string) => boolean;
}

export const NavigationDesktop: React.FC<NavigationDesktopProps> = ({ isActive }) => {
    const navItems = [
        { to: '/dashboard', label: 'Dashboard', icon: Home },
        { to: '/recipes', label: 'Recipes', icon: ChefHat },
        { to: '/recipes/new', label: 'Add Recipe', icon: PlusCircle },
    ];

    return (
        <div className="hidden md:ml-6 md:flex md:space-x-8">
            {navItems.map((item) => {
                const Icon = item.icon;
                return (
                    <Link
                        key={item.to}
                        to={item.to}
                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive(item.to)
                            ? 'border-blue-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                            }`}
                    >
                        <Icon className="h-4 w-4 mr-2" />
                        {item.label}
                    </Link>
                );
            })}
        </div>
    );
}; 