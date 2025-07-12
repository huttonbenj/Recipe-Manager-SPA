import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ChefHat, Clock, Heart, MessageSquare, Star, ThumbsUp } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface ActivityItem {
    id: string;
    type: 'create' | 'like' | 'comment' | 'rating' | 'view';
    recipeId: string;
    recipeTitle: string;
    timestamp: Date;
    userName?: string;
    userAvatar?: string;
}

interface DashboardActivityProps {
    activities: ActivityItem[];
    isLoading: boolean;
}

export const DashboardActivity: React.FC<DashboardActivityProps> = ({
    activities = [],
    isLoading = false
}) => {
    // Mock activities if none provided
    const mockActivities: ActivityItem[] = [
        {
            id: '1',
            type: 'create',
            recipeId: '101',
            recipeTitle: 'Homemade Pizza',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
        },
        {
            id: '2',
            type: 'like',
            recipeId: '102',
            recipeTitle: 'Chocolate Chip Cookies',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
            userName: 'Sarah Johnson',
            userAvatar: 'SJ'
        },
        {
            id: '3',
            type: 'comment',
            recipeId: '101',
            recipeTitle: 'Homemade Pizza',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
            userName: 'Mike Smith',
            userAvatar: 'MS'
        },
        {
            id: '4',
            type: 'rating',
            recipeId: '103',
            recipeTitle: 'Beef Stir Fry',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
            userName: 'Emma Wilson',
            userAvatar: 'EW'
        }
    ];

    const displayActivities = activities.length > 0 ? activities : mockActivities;

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'create':
                return <ChefHat className="h-4 w-4" />;
            case 'like':
                return <Heart className="h-4 w-4" />;
            case 'comment':
                return <MessageSquare className="h-4 w-4" />;
            case 'rating':
                return <Star className="h-4 w-4" />;
            case 'view':
                return <ThumbsUp className="h-4 w-4" />;
            default:
                return <Activity className="h-4 w-4" />;
        }
    };

    const getActivityColor = (type: string) => {
        switch (type) {
            case 'create':
                return 'bg-brand-500 text-white';
            case 'like':
                return 'bg-error-500 text-white';
            case 'comment':
                return 'bg-accent-500 text-white';
            case 'rating':
                return 'bg-warning-500 text-white';
            case 'view':
                return 'bg-success-500 text-white';
            default:
                return 'bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300';
        }
    };

    const getActivityText = (activity: ActivityItem) => {
        switch (activity.type) {
            case 'create':
                return `You created "${activity.recipeTitle}"`;
            case 'like':
                return `${activity.userName || 'Someone'} liked your "${activity.recipeTitle}"`;
            case 'comment':
                return `${activity.userName || 'Someone'} commented on "${activity.recipeTitle}"`;
            case 'rating':
                return `${activity.userName || 'Someone'} rated "${activity.recipeTitle}"`;
            case 'view':
                return `${activity.userName || 'Someone'} viewed "${activity.recipeTitle}"`;
            default:
                return `Activity on "${activity.recipeTitle}"`;
        }
    };

    const formatTime = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 60) {
            return `${diffMins}m ago`;
        } else if (diffHours < 24) {
            return `${diffHours}h ago`;
        } else if (diffDays < 7) {
            return `${diffDays}d ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    return (
        <div className="glass-card bg-white/70 dark:bg-surface-900/70 backdrop-blur-sm rounded-xl p-6 border border-surface-200/60 dark:border-surface-800/60">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center shadow-md">
                        <Activity className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-50 font-display">
                        Recent Activity
                    </h2>
                </div>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-start gap-3 animate-pulse">
                            <div className="w-8 h-8 rounded-full bg-surface-200 dark:bg-surface-700"></div>
                            <div className="flex-1 space-y-2">
                                <div className="w-3/4 h-4 bg-surface-200 dark:bg-surface-700 rounded"></div>
                                <div className="w-1/2 h-3 bg-surface-200 dark:bg-surface-700 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-5 relative">
                    {/* Timeline connector */}
                    <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-surface-200 dark:bg-surface-700"></div>

                    {displayActivities.map((activity, index) => (
                        <div
                            key={activity.id}
                            className="flex items-start gap-4 relative"
                            style={{
                                animationDelay: `${index * 0.1}s`
                            }}
                        >
                            {/* Activity icon */}
                            <div className={cn(
                                "z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-sm",
                                getActivityColor(activity.type)
                            )}>
                                {getActivityIcon(activity.type)}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-surface-900 dark:text-surface-50">
                                            {getActivityText(activity)}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-surface-500 dark:text-surface-400 flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {formatTime(activity.timestamp)}
                                            </span>

                                            {activity.userName && (
                                                <div className="flex items-center gap-1">
                                                    <span className="h-1 w-1 rounded-full bg-surface-300 dark:bg-surface-600"></span>
                                                    <div className="flex items-center gap-1">
                                                        <div className="w-4 h-4 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center text-[10px] font-medium text-surface-600 dark:text-surface-400">
                                                            {activity.userAvatar}
                                                        </div>
                                                        <span className="text-xs text-surface-600 dark:text-surface-400">
                                                            {activity.userName}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <Link
                                        to={`/recipes/${activity.recipeId}`}
                                        className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline"
                                    >
                                        View
                                    </Link>
                                </div>

                                {/* Divider */}
                                {index < displayActivities.length - 1 && (
                                    <div className="pt-5"></div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}; 