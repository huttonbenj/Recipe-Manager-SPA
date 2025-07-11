import React, { useMemo } from 'react';
import { User } from '@recipe-manager/shared';
import { ChefHat, PlusCircle, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../../utils/cn';

interface DashboardHeaderProps {
    user: User | null;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => {
    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    }, []);

    const userName = user?.name || 'Chef';

    // Format current day
    const formattedDate = useMemo(() => {
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        }).format(new Date());
    }, []);

    return (
        <div className="relative">
            <div className="p-6 bg-white/60 dark:bg-surface-900/60 backdrop-blur-sm rounded-2xl border border-surface-200/50 dark:border-surface-800/50 h-full">
                {/* Subtle decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 blur-[40px] rounded-full -z-10" />

                <div className="flex items-start gap-4">
                    {/* Chef Icon */}
                    <div className="relative flex-shrink-0">
                        <div className="w-14 h-14 rounded-full bg-surface-100/80 dark:bg-surface-800/80 flex items-center justify-center border border-surface-200/50 dark:border-surface-700/50">
                            <ChefHat className="h-7 w-7 text-brand-500 dark:text-brand-400" />
                        </div>
                        {user && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-accent-500 flex items-center justify-center shadow-md">
                                <span className="text-[10px] font-bold text-white">PRO</span>
                            </div>
                        )}
                    </div>

                    {/* Welcome Text */}
                    <div className="flex-1">
                        <div className="inline-block px-2 py-1 bg-surface-100 dark:bg-surface-800/80 text-surface-600 dark:text-surface-300 text-xs font-medium rounded-full mb-2">
                            {formattedDate}
                        </div>
                        <h2 className="text-xl font-bold mb-1 flex flex-wrap items-center gap-1">
                            <span className="text-surface-900 dark:text-white">{greeting},</span>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-500 to-accent-500">
                                {userName}
                            </span>
                        </h2>
                        <p className="text-surface-600 dark:text-surface-400 text-sm">
                            Ready to cook something amazing?
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 mt-6">
                    <Link
                        to="/recipes/new"
                        className={cn(
                            "flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 font-medium text-sm",
                            "bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-sm",
                            "hover:from-brand-600 hover:to-accent-600 transition-colors"
                        )}
                    >
                        <PlusCircle className="h-3.5 w-3.5" />
                        New Recipe
                    </Link>
                    <Link
                        to="/recipes"
                        className={cn(
                            "flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 font-medium text-sm",
                            "bg-surface-100 dark:bg-surface-800/80 text-surface-700 dark:text-surface-300 border border-surface-200/50 dark:border-surface-700/50",
                            "hover:bg-surface-200/70 dark:hover:bg-surface-700/70 transition-colors"
                        )}
                    >
                        <Search className="h-3.5 w-3.5" />
                        Explore
                    </Link>
                </div>
            </div>
        </div>
    );
}; 