import React from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface NavigationMobileButtonProps {
    isMenuOpen: boolean;
    onToggleMenu: () => void;
}

export const NavigationMobileButton: React.FC<NavigationMobileButtonProps> = ({
    isMenuOpen,
    onToggleMenu,
}) => {
    return (
        <button
            onClick={onToggleMenu}
            className={cn(
                "md:hidden flex h-9 w-9 items-center justify-center rounded-md transition-colors",
                "text-surface-600 hover:bg-surface-100 hover:text-surface-900",
                "dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-50"
            )}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
            {isMenuOpen ? (
                <X className="h-5 w-5" />
            ) : (
                <Menu className="h-5 w-5" />
            )}
        </button>
    );
}; 