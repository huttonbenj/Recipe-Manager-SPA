import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat } from 'lucide-react';

export const NavigationLogo: React.FC = () => {
    return (
        <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-400 text-white shadow-md">
                <ChefHat className="h-5 w-5" />
            </div>
            <div className="hidden md:block">
                <span className="font-display text-xl font-semibold text-surface-900 dark:text-surface-50">
                    Culinary<span className="text-brand-600 dark:text-brand-400">Canvas</span>
                </span>
            </div>
        </Link>
    );
}; 