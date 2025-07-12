import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ChefHat, Clock, Heart, MessageSquare, Star, ThumbsUp, Sparkles, ChevronRight } from 'lucide-react';
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
    // Enhanced mock activities with more variety
    const mockActivities: ActivityItem[] = [
        {
            id: '1',
            type: 'create',
            recipeId: '101',
            recipeTitle: 'Homemade Sourdough Pizza',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
        },
        {
            id: '2',
            type: 'like',
            recipeId: '102',
            recipeTitle: 'Triple Chocolate Chip Cookies',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
            userName: 'Sarah Johnson',
            userAvatar: 'SJ'
        },
        {
            id: '3',
            type: 'comment',
            recipeId: '101',
            recipeTitle: 'Homemade Sourdough Pizza',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
            userName: 'Mike Chen',
            userAvatar: 'MC'
        },
        {
            id: '4',
            type: 'rating',
            recipeId: '103',
            recipeTitle: 'Asian Beef Stir Fry',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
            userName: 'Emma Wilson',
            userAvatar: 'EW'
        },
        {
            id: '5',
            type: 'view',
            recipeId: '104',
            recipeTitle: 'Mediterranean Quinoa Bowl',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36), // 1.5 days ago
            userName: 'Alex Rivera',
            userAvatar: 'AR'
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
                return 'bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-lg';
            case 'like':
                return 'bg-gradient-to-br from-error-500 to-pink-600 text-white shadow-lg';
            case 'comment':
                return 'bg-gradient-to-br from-accent-500 to-blue-600 text-white shadow-lg';
            case 'rating':
                return 'bg-gradient-to-br from-warning-500 to-amber-600 text-white shadow-lg';
            case 'view':
                return 'bg-gradient-to-br from-success-500 to-emerald-600 text-white shadow-lg';
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
        <div className="space-y-6">
            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-start gap-4 animate-pulse">
                            <div className="w-10 h-10 rounded-xl bg-surface-200 dark:bg-surface-700"></div>
                            <div className="flex-1 space-y-2">
                                <div className="w-3/4 h-4 bg-surface-200 dark:bg-surface-700 rounded"></div>
                                <div className="w-1/2 h-3 bg-surface-200 dark:bg-surface-700 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : displayActivities.length > 0 ? (
                <div className="space-y-4 relative">
                    {/* Enhanced timeline connector */}
                    <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gradient-to-b from-brand-200 via-accent-200 to-brand-200 dark:from-brand-800 dark:via-accent-800 dark:to-brand-800"></div>

                    {displayActivities.slice(0, 5).map((activity, index) => (
                        <div
                            key={activity.id}
                            className="group relative flex items-start gap-4 hover:bg-surface-50 dark:hover:bg-surface-800/50 rounded-xl p-3 -m-3 transition-all duration-300"
                            style={{
                                animationDelay: `${index * 0.1}s`
                            }}
                        >
                            {/* Enhanced activity icon */}
                            <div className={cn(
                                "relative z-10 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110",
                                getActivityColor(activity.type)
                            )}>
                                {getActivityIcon(activity.type)}
                                {activity.type === 'create' && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-accent-400 to-brand-500 rounded-full flex items-center justify-center">
                                        <Sparkles className="h-2 w-2 text-white" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-surface-900 dark:text-surface-100 leading-relaxed">
                                            {getActivityText(activity)}
                                        </p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="flex items-center gap-1 text-xs text-surface-500 dark:text-surface-400">
                                                <Clock className="h-3 w-3" />
                                                {formatTime(activity.timestamp)}
                                            </span>

                                            {activity.userName && (
                                                <>
                                                    <span className="h-1 w-1 rounded-full bg-surface-300 dark:bg-surface-600"></span>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-surface-200 to-surface-300 dark:from-surface-700 dark:to-surface-600 flex items-center justify-center text-[10px] font-bold text-surface-600 dark:text-surface-300 shadow-sm">
                                                            {activity.userAvatar}
                                                        </div>
                                                        <span className="text-xs font-medium text-surface-600 dark:text-surface-400">
                                                            {activity.userName}
                                                        </span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Recipe link */}
                                    <Link
                                        to={`/recipes/${activity.recipeId}`}
                                        className="flex-shrink-0 px-3 py-1 text-xs font-medium bg-surface-100 dark:bg-surface-700 hover:bg-brand-100 dark:hover:bg-brand-900/30 text-surface-600 dark:text-surface-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg transition-all duration-200 hover:scale-105"
                                    >
                                        View
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Show more activities link */}
                    {displayActivities.length > 5 && (
                        <div className="text-center pt-4">
                            <Link
                                to="/activity"
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-500 dark:hover:text-brand-300 transition-colors duration-200"
                            >
                                <span>View all activity</span>
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-surface-100 to-surface-200 dark:from-surface-800 dark:to-surface-700 rounded-2xl flex items-center justify-center">
                        <Activity className="h-8 w-8 text-surface-400" />
                    </div>
                    <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-2">No activity yet</h3>
                    <p className="text-surface-600 dark:text-surface-400">Start cooking to see your activity here!</p>
                </div>
            )}
        </div>
    );
}; 