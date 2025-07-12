import React from 'react';
import { Link } from 'react-router-dom';
import {
    Home,
    ChefHat,
    PlusCircle,
    User,
    Settings,
    LogOut,
    Search,
    TrendingUp,
    Clock,
    Heart,
    Star,
    Zap
} from 'lucide-react';
import { cn } from '../../../utils/cn';

interface NavigationMobileProps {
    isMenuOpen: boolean;
    user: any;
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
    ];

    const accountItems = [
        { to: '/profile', label: 'Profile', icon: User },
        { to: '/settings', label: 'Settings', icon: Settings },
    ];

    const quickSearches = [
        { to: '/recipes?difficulty=Easy', label: 'Easy Recipes', icon: Zap },
        { to: '/recipes?cookTime=30', label: 'Quick Meals', icon: Clock },
        { to: '/recipes?liked=true', label: 'Favorites', icon: Heart },
        { to: '/recipes?saved=true', label: 'Saved', icon: Star },
        { to: '/recipes?sortBy=likes&sortOrder=desc', label: 'Popular', icon: TrendingUp },
    ];

    if (!isMenuOpen) return null;

    return (
        <div className="fixed inset-0 z-30 md:hidden">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-surface-900/50 backdrop-blur-sm" onClick={onMenuClose} />

            {/* Menu panel */}
            <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-surface-900 shadow-2xl">
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-surface-200 dark:border-surface-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-medium text-surface-900 dark:text-surface-50">
                                        {user?.name || 'Guest'}
                                    </p>
                                    <p className="text-xs text-surface-500 dark:text-surface-400">
                                        {user?.email}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onMenuClose}
                                className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors"
                            >
                                <div className="h-6 w-6 text-surface-500 dark:text-surface-400">×</div>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Search Section */}
                    <div className="px-6 py-4 border-b border-surface-200 dark:border-surface-800">
                        <div className="space-y-3">
                            <Link
                                to="/recipes"
                                onClick={onMenuClose}
                                className="flex items-center gap-3 p-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl transition-all duration-200 shadow-lg"
                            >
                                <Search className="h-5 w-5" />
                                <span className="font-medium">Search Recipes</span>
                            </Link>

                            <div className="grid grid-cols-2 gap-2">
                                {quickSearches.slice(0, 4).map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.to}
                                            to={item.to}
                                            onClick={onMenuClose}
                                            className="flex flex-col items-center gap-2 p-3 bg-surface-50 dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors text-center"
                                        >
                                            <Icon className="h-4 w-4 text-surface-600 dark:text-surface-400" />
                                            <span className="text-xs font-medium text-surface-700 dark:text-surface-300">
                                                {item.label}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 px-6 py-4 space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.to);

                            return (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    onClick={onMenuClose}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200",
                                        active
                                            ? "bg-brand-500/10 text-brand-600 dark:text-brand-400"
                                            : "text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800"
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Account section */}
                    <div className="px-6 py-4 border-t border-surface-200 dark:border-surface-800 space-y-1">
                        {accountItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.to);

                            return (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    onClick={onMenuClose}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200",
                                        active
                                            ? "bg-brand-500/10 text-brand-600 dark:text-brand-400"
                                            : "text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800"
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                    {item.label}
                                </Link>
                            );
                        })}

                        <button
                            onClick={() => {
                                onLogout();
                                onMenuClose();
                            }}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 transition-all duration-200 w-full"
                        >
                            <LogOut className="h-5 w-5" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}; 