import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User as UserType } from '@recipe-manager/shared';
import { User, Settings, LogOut, Palette, Moon } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { ThemeToggle } from '../../ui/ThemeToggle';

interface NavigationUserMenuProps {
    user: UserType | null;
    isUserMenuOpen: boolean;
    onToggleUserMenu: () => void;
    onLogout: () => void;
}

export const NavigationUserMenu: React.FC<NavigationUserMenuProps> = ({
    user,
    isUserMenuOpen,
    onToggleUserMenu,
    onLogout,
}) => {
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node) && isUserMenuOpen) {
                onToggleUserMenu();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isUserMenuOpen, onToggleUserMenu]);

    // Get user initials for avatar
    const getInitials = () => {
        if (!user || !user.name) return 'U';
        return user.name.charAt(0).toUpperCase();
    };

    // Extended user type with optional image_url
    interface ExtendedUser extends UserType {
        image_url?: string;
    }
    const extendedUser = user as ExtendedUser | null;

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={onToggleUserMenu}
                className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                    "bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700",
                    isUserMenuOpen && "ring-2 ring-brand-500 dark:ring-brand-400"
                )}
                aria-expanded={isUserMenuOpen}
                aria-haspopup="true"
                aria-label="User menu"
            >
                {extendedUser?.image_url ? (
                    <img
                        src={extendedUser.image_url}
                        alt={extendedUser.name || 'User'}
                        className="h-8 w-8 rounded-full object-cover"
                    />
                ) : (
                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                        {getInitials()}
                    </span>
                )}
            </button>

            {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-surface-200 focus:outline-none dark:bg-surface-800 dark:ring-surface-700">
                    <div className="border-b border-surface-200 px-4 py-3 dark:border-surface-700">
                        <div className="text-sm font-medium text-surface-900 dark:text-surface-50">
                            {user?.name || 'User'}
                        </div>
                        <div className="truncate text-xs text-surface-500 dark:text-surface-400">
                            {user?.email || 'user@example.com'}
                        </div>
                    </div>

                    <Link
                        to="/profile"
                        className="flex w-full items-center px-4 py-2 text-sm text-surface-700 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-700"
                        onClick={onToggleUserMenu}
                    >
                        <User className="mr-3 h-4 w-4 text-surface-500 dark:text-surface-400" />
                        Profile
                    </Link>

                    <Link
                        to="/settings"
                        className="flex w-full items-center px-4 py-2 text-sm text-surface-700 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-700"
                        onClick={onToggleUserMenu}
                    >
                        <Settings className="mr-3 h-4 w-4 text-surface-500 dark:text-surface-400" />
                        Settings
                    </Link>

                    {/* Theme Toggles */}
                    <div className="px-4 py-2 border-t border-surface-200 dark:border-surface-700">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                                <Moon className="mr-3 h-4 w-4 text-surface-500 dark:text-surface-400" />
                                <span className="text-sm text-surface-700 dark:text-surface-300">Theme Mode</span>
                            </div>
                            <ThemeToggle variant="dropdown" size="sm" position="top" />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Palette className="mr-3 h-4 w-4 text-surface-500 dark:text-surface-400" />
                                <span className="text-sm text-surface-700 dark:text-surface-300">Color Theme</span>
                            </div>
                            <ThemeToggle variant="color" size="sm" position="top" />
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            onLogout();
                            onToggleUserMenu();
                        }}
                        className="flex w-full items-center px-4 py-2 text-sm text-surface-700 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-700"
                    >
                        <LogOut className="mr-3 h-4 w-4 text-surface-500 dark:text-surface-400" />
                        Sign out
                    </button>
                </div>
            )}
        </div>
    );
}; 