import React from 'react';
import { Link } from 'react-router-dom';
import { User as UserType } from '@recipe-manager/shared';
import { Home, ChefHat, PlusCircle, Bookmark, User, Settings, LogOut } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface NavigationMobileProps {
    isMenuOpen: boolean;
    user: UserType | null;
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
        { to: '/dashboard', label: 'Home', icon: Home },
        { to: '/recipes', label: 'Recipes', icon: ChefHat },
        { to: '/recipes/new', label: 'Create Recipe', icon: PlusCircle },
        { to: '/favorites', label: 'Favorites', icon: Bookmark },
    ];

    const accountItems = [
        { to: '/profile', label: 'Profile', icon: User },
        { to: '/settings', label: 'Settings', icon: Settings },
    ];

    if (!isMenuOpen) return null;

    return (
        <div className="fixed inset-0 z-30 md:hidden">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-surface-900/50 backdrop-blur-sm" onClick={onMenuClose} />

            {/* Menu panel */}
            <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white dark:bg-surface-900 shadow-lg">
                <div className="flex h-full flex-col overflow-y-auto pt-6 pb-4">
                    {/* User info */}
                    {user && (
                        <div className="border-b border-surface-200 px-6 pb-4 dark:border-surface-800">
                            <div className="flex items-center">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300">
                                    {user.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-surface-900 dark:text-surface-50">
                                        {user.name}
                                    </p>
                                    <p className="text-xs text-surface-500 dark:text-surface-400 truncate">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation items */}
                    <div className="mt-6 px-4">
                        <h3 className="px-2 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                            Navigation
                        </h3>
                        <div className="mt-2 space-y-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.to);

                                return (
                                    <Link
                                        key={item.to}
                                        to={item.to}
                                        className={cn(
                                            "flex items-center px-2 py-2 rounded-md text-sm font-medium transition-colors",
                                            active
                                                ? "bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400"
                                                : "text-surface-700 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-300 dark:hover:bg-surface-800 dark:hover:text-surface-50"
                                        )}
                                        onClick={onMenuClose}
                                    >
                                        <Icon className={cn(
                                            "mr-3 h-5 w-5",
                                            active ? "text-brand-600 dark:text-brand-400" : "text-surface-500 dark:text-surface-400"
                                        )} />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Account items */}
                    <div className="mt-6 px-4">
                        <h3 className="px-2 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                            Account
                        </h3>
                        <div className="mt-2 space-y-1">
                            {accountItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.to);

                                return (
                                    <Link
                                        key={item.to}
                                        to={item.to}
                                        className={cn(
                                            "flex items-center px-2 py-2 rounded-md text-sm font-medium transition-colors",
                                            active
                                                ? "bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400"
                                                : "text-surface-700 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-300 dark:hover:bg-surface-800 dark:hover:text-surface-50"
                                        )}
                                        onClick={onMenuClose}
                                    >
                                        <Icon className={cn(
                                            "mr-3 h-5 w-5",
                                            active ? "text-brand-600 dark:text-brand-400" : "text-surface-500 dark:text-surface-400"
                                        )} />
                                        {item.label}
                                    </Link>
                                );
                            })}

                            <button
                                className="flex w-full items-center px-2 py-2 rounded-md text-sm font-medium text-surface-700 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-300 dark:hover:bg-surface-800 dark:hover:text-surface-50"
                                onClick={() => {
                                    onLogout();
                                    onMenuClose();
                                }}
                            >
                                <LogOut className="mr-3 h-5 w-5 text-surface-500 dark:text-surface-400" />
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 