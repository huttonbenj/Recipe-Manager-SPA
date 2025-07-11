import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ChefHat, PlusCircle, Bookmark } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface NavigationDesktopProps {
    isActive: (path: string) => boolean;
}

export const NavigationDesktop: React.FC<NavigationDesktopProps> = ({ isActive }) => {
    const navItems = [
        { to: '/dashboard', label: 'Home', icon: Home },
        { to: '/recipes', label: 'Recipes', icon: ChefHat },
        { to: '/recipes/new', label: 'Create', icon: PlusCircle },
        { to: '/favorites', label: 'Favorites', icon: Bookmark },
    ];

    return (
        <div className="hidden md:ml-8 md:flex md:space-x-1">
            {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.to);

                return (
                    <Link
                        key={item.to}
                        to={item.to}
                        className={cn(
                            "group relative flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                            "hover:scale-105 active:scale-95",
                            active
                                ? "text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 shadow-sm"
                                : "text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-50 hover:bg-surface-100 dark:hover:bg-surface-800"
                        )}
                    >
                        <Icon className={cn(
                            "h-4 w-4 mr-2 transition-all duration-200",
                            active
                                ? "text-brand-600 dark:text-brand-400 scale-110"
                                : "text-surface-500 dark:text-surface-400 group-hover:scale-110"
                        )} />
                        {item.label}

                        {/* Active indicator with animation */}
                        {active && (
                            <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 animate-pulse" />
                        )}

                        {/* Hover effect overlay */}
                        {!active && (
                            <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-500/0 to-accent-500/0 group-hover:from-brand-500/5 group-hover:to-accent-500/5 transition-all duration-300" />
                        )}
                    </Link>
                );
            })}
        </div>
    );
}; 