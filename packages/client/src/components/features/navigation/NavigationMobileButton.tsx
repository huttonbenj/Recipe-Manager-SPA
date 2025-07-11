import React from 'react';
import { Menu, X } from 'lucide-react';

interface NavigationMobileButtonProps {
    isMenuOpen: boolean;
    onToggleMenu: () => void;
}

export const NavigationMobileButton: React.FC<NavigationMobileButtonProps> = ({
    isMenuOpen,
    onToggleMenu
}) => {
    return (
        <div className="md:hidden flex items-center">
            <button
                onClick={onToggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                    <X className="block h-6 w-6" />
                ) : (
                    <Menu className="block h-6 w-6" />
                )}
            </button>
        </div>
    );
}; 